# Love4Detailing App Maintenance Guide

This guide explains how to maintain and update the Love4Detailing app, covering common tasks and best practices.

## 🔄 Regular Updates

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages to their latest version
npm update

# Update a specific package
npm install @package-name@latest

# After updates, run tests to ensure nothing broke
npm run test
```

### Database Migrations

```bash
# Create a new migration
cd supabase
supabase migration new my_migration_name

# Apply migrations
supabase db reset

# Push to production
supabase db push
```

## 🎨 Updating UI Elements

### Adding New Components

1. Place new components in the appropriate directory:
   - `/src/components/ui/` for reusable UI components
   - `/src/components/booking/` for booking-related components
   - `/src/components/admin/` for admin dashboard components

2. Follow the component template:
```typescript
'use client'  // Only if using client-side features

import React from 'react'
import { cn } from '@/lib/utils'

interface MyComponentProps {
  // Define props here
}

export const MyComponent: React.FC<MyComponentProps> = ({
  // Destructure props
}) => {
  return (
    // JSX here
  )
}
```

### Modifying Styles

1. Global styles are in `src/app/globals.css`
2. Component-specific styles use Tailwind classes
3. Theme customization is in `tailwind.config.js`
4. Brand colors are defined in `src/lib/constants.ts`

## 📝 Content Updates

### Service Packages

Update service configurations in `src/lib/constants.ts`:
```typescript
export const SERVICES = {
  packages: {
    basic: {
      name: "Basic Detail",
      price: 49.99,
      // ... other properties
    },
    // Add new packages here
  }
}
```

### Static Content

Update text content in `src/lib/content.ts`:
```typescript
export const content = {
  pages: {
    home: {
      title: "Your Title",
      description: "Your Description"
    }
  }
}
```

## 🔧 System Configuration

### Environment Variables

1. Development: Update `.env.local`
2. Production: Update via Vercel dashboard
3. New variables must be added to:
   - `.env.example`
   - `DEPLOYMENT_CHECKLIST.md`
   - Vercel project settings

### API Endpoints

Add new API routes in `src/app/api/`:
```typescript
// src/app/api/your-endpoint/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // Your logic here
  return NextResponse.json({ data: 'your data' })
}
```

## 📊 Database Schema Updates

### Adding New Tables

1. Create migration:
```sql
-- In supabase/migrations/[timestamp]_my_migration.sql
create table if not exists public.my_table (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  // ... other columns
);

-- Set up RLS policies
alter table public.my_table enable row level security;

create policy "Users can view their own data"
  on public.my_table
  for select
  using (auth.uid() = user_id);
```

2. Update TypeScript types in `src/types/index.ts`

### Modifying Existing Tables

1. Create migration for changes:
```sql
-- Add column
alter table public.my_table
add column if not exists new_column text;

-- Modify column
alter table public.my_table
alter column existing_column set data type integer;
```

2. Update corresponding TypeScript interfaces

## 🚀 Deployment Process

### Testing Before Deploy

```bash
# Run tests
npm run test

# Build locally
npm run build

# Start production server locally
npm run start
```

### Deployment Steps

1. Commit changes:
```bash
git add .
git commit -m "type: description of changes"
git push origin main
```

2. Vercel will automatically deploy main branch
3. Monitor deployment in Vercel dashboard
4. Run post-deploy checklist from `DEPLOYMENT_CHECKLIST.md`

## 🔍 Monitoring & Maintenance

### Error Tracking

1. Check Vercel dashboard for deployment errors
2. Monitor Supabase logs for database issues
3. Check email delivery logs in Resend dashboard

### Performance Monitoring

1. Run Lighthouse audits monthly
2. Check Vercel Analytics for performance metrics
3. Monitor database query performance

### Backup Procedures

1. Supabase database:
```bash
supabase db dump -f backup.sql
```

2. Keep local backups of:
   - Environment variables
   - Custom content
   - Service configurations

## 🆘 Troubleshooting Common Issues

### Database Connection Issues

1. Check Supabase status
2. Verify environment variables
3. Check RLS policies
4. Monitor connection pool

### Image Upload Problems

1. Verify storage bucket permissions
2. Check file size limits
3. Validate mime types
4. Monitor storage usage

### Authentication Issues

1. Check Supabase auth logs
2. Verify email templates
3. Check rate limits
4. Monitor auth providers status

## 📅 Maintenance Schedule

### Daily
- Monitor error logs
- Check failed bookings
- Review auth issues

### Weekly
- Review performance metrics
- Check storage usage
- Update test data

### Monthly
- Run security updates
- Backup database
- Review analytics
- Update dependencies

### Quarterly
- Full system audit
- Performance optimization
- Feature planning
- Documentation review

## 🔐 Security Considerations

### Regular Security Tasks

1. Review RLS policies
2. Check API endpoint permissions
3. Audit user roles
4. Monitor auth logs
5. Update security dependencies

### Data Protection

1. Regular database backups
2. Encrypt sensitive data
3. Monitor access patterns
4. Review data retention

## 📞 Support Contacts

For urgent technical issues:
- Primary: [Your Contact]
- Backup: [Backup Contact]
- Email: support@love4detailing.com

For system access:
- Vercel Dashboard: [Link]
- Supabase Dashboard: [Link]
- Documentation: [Link] 