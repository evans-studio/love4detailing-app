import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key to test storage
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Test storage buckets
    const results: {
      storage_connection: boolean
      buckets: Record<string, { exists: boolean; public: boolean; created_at: string | null }>
      public_urls: Record<string, string>
      policies: Record<string, { can_list: boolean; error: string | null }>
    } = {
      storage_connection: false,
      buckets: {},
      public_urls: {},
      policies: {}
    }
    
    // Test storage connection
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to storage',
        details: bucketsError
      }, { status: 500 })
    }
    
    results.storage_connection = true
    
    // Check for required buckets
    const requiredBuckets = ['profile-images', 'vehicle-photos']
    for (const bucketName of requiredBuckets) {
      const bucket = buckets.find(b => b.id === bucketName)
      results.buckets[bucketName] = {
        exists: !!bucket,
        public: bucket?.public || false,
        created_at: bucket?.created_at || null
      }
      
      // Test public URL generation (even if bucket doesn't exist)
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl('test-file.jpg')
      
      results.public_urls[bucketName] = publicUrl
    }
    
    // Test file listing (should work even with empty buckets)
    for (const bucketName of requiredBuckets) {
      try {
        const { data: files, error: listError } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 1 })
        
        results.policies[bucketName] = {
          can_list: !listError,
          error: listError?.message || null
        }
      } catch (error) {
        results.policies[bucketName] = {
          can_list: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: results,
      message: 'Storage test completed'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Storage test failed',
      details: error
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test file upload with a small test file
    const testContent = 'This is a test file for Love4Detailing storage verification'
    const testFile = new File([testContent], 'test-upload.txt', { type: 'text/plain' })
    
    const results: Record<string, {
      upload: boolean
      error?: string
      public_url?: string
      can_access?: boolean
      file_path?: string
    }> = {}
    
    // Test upload to both buckets
    const buckets = ['profile-images', 'vehicle-photos']
    
    for (const bucketName of buckets) {
      try {
        const fileName = `test/${Date.now()}-test.txt`
        
        // Upload test file
        const { error: uploadError, data } = await supabase.storage
          .from(bucketName)
          .upload(fileName, testFile, {
            cacheControl: '3600',
            upsert: true
          })
        
        if (uploadError) {
          results[bucketName] = {
            upload: false,
            error: uploadError.message
          }
          continue
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName)
        
        // Test file access
        const response = await fetch(publicUrl)
        const canAccess = response.ok
        
        // Clean up test file
        await supabase.storage
          .from(bucketName)
          .remove([fileName])
        
        results[bucketName] = {
          upload: true,
          public_url: publicUrl,
          can_access: canAccess,
          file_path: fileName
        }
        
      } catch (error) {
        results[bucketName] = {
          upload: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: results,
      message: 'Storage upload test completed'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Storage upload test failed',
      details: error
    }, { status: 500 })
  }
} 