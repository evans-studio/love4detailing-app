import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schemas
const createVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  color: z.string().optional(),
  registration: z.string().optional(),
  size: z.enum(['small', 'medium', 'large', 'extraLarge']),
  isDefault: z.boolean().optional(),
})

const updateVehicleSchema = z.object({
  id: z.string(),
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  color: z.string().optional(),
  registration: z.string().optional(),
  size: z.enum(['small', 'medium', 'large', 'extraLarge']).optional(),
  isDefault: z.boolean().optional(),
})

const deleteVehicleSchema = z.object({
  id: z.string(),
})

const _setDefaultVehicleSchema = z.object({
  id: z.string(),
})

// Response types
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Helper function to get user from auth header
async function getUserFromAuth(request: NextRequest): Promise<{ userId: string } | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }
    
    return { userId: user.id }
  } catch (error) {
    console.error('Auth validation error:', error)
    return null
  }
}

// Helper function to format vehicle response
function formatVehicleResponse(vehicle: any) {
  return {
    id: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    registration: vehicle.registration,
    size: vehicle.size,
    isDefault: vehicle.is_default,
    createdAt: vehicle.created_at,
    updatedAt: vehicle.updated_at,
  }
}

// Helper function to generate vehicle ID
function generateVehicleId(): string {
  return `VH${Date.now().toString().slice(-8)}`
}

// POST - Create new vehicle
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createVehicleSchema.parse(body)

    // If this is set as default, unset other defaults first
    if (validatedData.isDefault) {
      await supabase
        .from('vehicles')
        .update({ is_default: false })
        .eq('user_id', auth.userId)
    }

    // If no vehicles exist, make this the default
    const { count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact' })
      .eq('user_id', auth.userId)

    const isFirstVehicle = count === 0
    
    const vehicleData = {
      id: generateVehicleId(),
      user_id: auth.userId,
      make: validatedData.make,
      model: validatedData.model,
      year: validatedData.year,
      color: validatedData.color,
      registration: validatedData.registration?.toUpperCase(),
      size: validatedData.size,
      is_default: validatedData.isDefault || isFirstVehicle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select()
      .single()

    if (error) {
      console.error('Vehicle creation error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create vehicle' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: formatVehicleResponse(vehicle),
      message: 'Vehicle created successfully',
    })

  } catch (error) {
    console.error('Vehicle API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Fetch user vehicles
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', auth.userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Vehicles fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch vehicles' },
        { status: 500 }
      )
    }

    const formattedVehicles = vehicles?.map(formatVehicleResponse) || []

    return NextResponse.json({
      success: true,
      data: {
        vehicles: formattedVehicles,
        total: formattedVehicles.length,
      },
    })

  } catch (error) {
    console.error('Vehicles GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update vehicle
export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateVehicleSchema.parse(body)

    // Verify ownership
    const { data: existingVehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', validatedData.id)
      .eq('user_id', auth.userId)
      .single()

    if (fetchError || !existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // If setting as default, unset other defaults first
    if (validatedData.isDefault) {
      await supabase
        .from('vehicles')
        .update({ is_default: false })
        .eq('user_id', auth.userId)
        .neq('id', validatedData.id)
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (validatedData.make !== undefined) updateData.make = validatedData.make
    if (validatedData.model !== undefined) updateData.model = validatedData.model
    if (validatedData.year !== undefined) updateData.year = validatedData.year
    if (validatedData.color !== undefined) updateData.color = validatedData.color
    if (validatedData.registration !== undefined) updateData.registration = validatedData.registration?.toUpperCase()
    if (validatedData.size !== undefined) updateData.size = validatedData.size
    if (validatedData.isDefault !== undefined) updateData.is_default = validatedData.isDefault

    const { data: updatedVehicle, error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', validatedData.id)
      .eq('user_id', auth.userId)
      .select()
      .single()

    if (error) {
      console.error('Vehicle update error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update vehicle' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: formatVehicleResponse(updatedVehicle),
      message: 'Vehicle updated successfully',
    })

  } catch (error) {
    console.error('Vehicle PATCH error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove vehicle
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await getUserFromAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('id')
    
    if (!vehicleId) {
      return NextResponse.json(
        { success: false, error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    const validatedData = deleteVehicleSchema.parse({ id: vehicleId })

    // Verify ownership
    const { data: existingVehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', validatedData.id)
      .eq('user_id', auth.userId)
      .single()

    if (fetchError || !existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Check if there are active bookings for this vehicle
    const { data: activeBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', auth.userId)
      .eq('vehicle_make', existingVehicle.make)
      .eq('vehicle_model', existingVehicle.model)
      .in('status', ['pending', 'confirmed'])

    if (activeBookings && activeBookings.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete vehicle with active bookings' },
        { status: 409 }
      )
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', validatedData.id)
      .eq('user_id', auth.userId)

    if (error) {
      console.error('Vehicle deletion error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete vehicle' },
        { status: 500 }
      )
    }

    // If deleted vehicle was default, set another as default
    if (existingVehicle.is_default) {
      const { data: remainingVehicles } = await supabase
        .from('vehicles')
        .select('id')
        .eq('user_id', auth.userId)
        .limit(1)

      if (remainingVehicles && remainingVehicles.length > 0) {
        await supabase
          .from('vehicles')
          .update({ is_default: true })
          .eq('id', remainingVehicles[0].id)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
    })

  } catch (error) {
    console.error('Vehicle DELETE error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 