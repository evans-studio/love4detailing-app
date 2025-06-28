# Love4Detailing App

A Next.js application for managing car detailing bookings and customer rewards.

## Backend Architecture

### Database Schema (Supabase)

Core tables with RLS policies:
- `profiles`: Extends auth.users, stores user details and vehicle info
- `bookings`: Manages service bookings with status tracking
- `rewards`: Points and savings tracking per user
- `rewards_history`: Audit trail for rewards transactions
- `audit_logs`: System-wide audit logging
- `working_hours`: Business availability management

### API Routes

All routes implement:
- Input validation with Zod schemas
- Type-safe Supabase queries
- Proper error handling
- Rate limiting where appropriate
- Response caching for performance
- Audit logging for sensitive operations

#### Vehicle Lookup (`/api/vehicle-lookup`)
- Rate limited: 5 requests/minute
- Cache TTL: 1 hour
- Validates UK registration format
- Returns make, model, year

#### Distance Calculation (`/api/calculate-distance`)
- Rate limited: 10 requests/minute
- Cache TTL: 24 hours
- Validates UK postcodes
- Returns distance and travel fee calculation

#### Rewards Management (`/api/rewards`)
- Authenticated routes only
- Full audit trail
- Atomic updates with history tracking
- Points and savings calculation

### Environment Variables Required

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# External APIs
DVLA_API_KEY=your-dvla-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM_ADDRESS=noreply@love4detailing.com

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
VERCEL_ENV=development

# Admin Configuration
ADMIN_EMAIL=evanspaul87@gmail.com
SUPPORT_EMAIL=support@love4detailing.com
```

### Security Features

1. Row Level Security (RLS)
   - Users can only access their own data
   - Admin-only routes properly secured
   - Soft delete implementation

2. Audit Logging
   - All sensitive operations logged
   - Full history tracking
   - Admin-only access to logs

3. Rate Limiting
   - Prevents API abuse
   - Configurable per endpoint
   - Redis-backed implementation

4. Data Validation
   - All inputs validated with Zod
   - Type-safe database operations
   - Proper error handling

### Caching Strategy

Redis-based caching for:
- Vehicle lookup results (1 hour TTL)
- Distance calculations (24 hours TTL)
- Postcode validations (1 week TTL)

### Error Handling

Consistent error format across all routes:
```typescript
{
  error: string;
  details?: any;
  requiresManualApproval?: boolean;
}
```

### Development Guidelines

1. Database Changes
   - Always create migrations
   - Update RLS policies
   - Consider soft delete

2. New API Routes
   - Implement validation
   - Add rate limiting if public
   - Include proper error handling
   - Add audit logging if sensitive

3. Testing
   - Unit tests for validation
   - Integration tests for API routes
   - E2E tests for critical flows

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Fill in environment variables
4. Install dependencies: `npm install`
5. Run migrations: `npm run supabase:migrate`
6. Start development server: `npm run dev`

## Deployment

The application is deployed on Vercel with:
- Supabase for database
- Upstash for Redis
- Resend for email
- Stripe for payments

Ensure all environment variables are properly set in the Vercel dashboard.
