# Love 4 Detailing App – Development Guidelines

This document outlines the technical standards, architecture, and implementation strategy for building and maintaining the Love 4 Detailing booking platform.

---

## 🔧 Tech Stack Overview

### Frontend
- **Framework:** Next.js (App Router + RSC)
- **Styling:** TailwindCSS
- **UI Components:** Radix UI (primitives) + Shadcn
- **State Management:** Zustand or React Context (scoped only)
- **Form Handling:** React Hook Form + Zod validation

### Backend
- **Database:** Supabase (PostgreSQL + RLS)
- **Storage:** Supabase Storage (signed URLs for images)
- **Auth:** Supabase Auth (email/pass + session management)
- **APIs:** Next.js API routes or Supabase Edge Functions

### Payments
- Stripe (primary) + PayPal (optional)

---

## 🔐 Authentication & Security

- Use Supabase Auth for both customer and admin login
- Protect routes via `middleware.ts`:

```ts
export const middleware = async (req) => {
  const session = await getSession(req);
  if (!session) return NextResponse.redirect("/signin");

  const role = session.user.role;
  if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect("/unauthorized");
  }

  return NextResponse.next();
};
```

- Enable CSRF protection, route guards, and enforce Supabase RLS policies.
- Enforce email verification before granting dashboard access.
- Implement token refresh handling using Supabase helpers.
- Include error boundaries for key routes.

---

## 🧱 Database Tables (Supabase)

- `users`
- `bookings`
- `vehicles`
- `rewards`
- `working_hours`
- `admin_settings`
- `vehicle_gallery`
- `sessions`
- `audit_logs`

---

## 🧩 Component Architecture (DRY Principles)

Use atomic and modular design:

```
/components
  /form
    Input.tsx
    DatePicker.tsx
    VehicleSizeSelector.tsx
  /layout
    Sidebar.tsx
    Header.tsx
  /booking
    BookingForm.tsx
    BookingSummary.tsx
  /shared
    Button.tsx
    Modal.tsx
    Toast.tsx
  /legal
    Terms.tsx
    Privacy.tsx
```

---

## 📦 Features by Module

### Booking Engine
- Vehicle size detection (auto + fallback)
- Guest form + payment
- Service add-ons + photo upload
- Total price calculation + travel fee logic
- Confirmed bookings trigger email notifications
- If user signs up after booking, prefill their profile from existing data

### Customer Dashboard
- View/edit bookings
- Upload vehicle gallery photos
- Manage profile & rewards
- Autofill booking form from profile data

### Admin Panel
- View all bookings
- Assign time slots
- Manage customer profiles
- View analytics
- Monitor login sessions and booking history logs

### Rewards
- Point accumulation per booking
- Redemption system
- Discount application

---

## ⚖️ Legal Compliance

- Include and link:
  - `/terms` – Terms & Conditions
  - `/privacy` – Privacy Policy
  - `/refund` – Refund Policy
- Implement a cookie consent banner using a third-party library
- Include a Data Retention policy in the Privacy Policy

---

## 📈 Monitoring & Stability

- Use error boundaries throughout main flows
- Enable rate limiting on booking API endpoints
- Add server-side and client-side logging via a `logger.ts`
- Configure Supabase backup retention
- Use Vercel Analytics and Supabase logs

---

## 🧪 Testing & QA

- Set up unit tests with Jest + Testing Library
- Add integration tests for:
  - Booking form
  - Auth redirects
  - Rewards redemption
  - Dashboard edit flow
- Mock Supabase during tests

---

## ✅ Deployment Best Practices

- Use Vercel for frontend deployment
- Connect Supabase via environment variables
- Set up `.env.local` with:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
  - `NEXT_PUBLIC_SITE_URL`

---

## ✍️ To-Do Before Launch
- [ ] Final booking confirmation modal
- [ ] Admin time slot assignment logic
- [ ] Stripe/PayPal webhook integration
- [ ] RLS checks for each table
- [ ] Automated tests for booking logic
- [ ] Finalise legal content (privacy, refund, terms)
- [ ] Add cookie consent and Sentry logging

---

## Brand Colors

Primary colors:
- Primary Purple: #9747FF
- Black Base: #141414
- Off-white: #F8F4EB

Secondary colors:
- Support Accent (Stone Grey): #DAD7CE
- Surface Light: #262626
- Text Muted: #C7C7C7

State colors:
- Error: #BA0C2F
- Success: #28C76F
- Warning: #FFA726
- Info: #29B6F6

Purple variations:
- 50: rgba(151, 71, 255, 0.05)
- 100: rgba(151, 71, 255, 0.1)
- 200: rgba(151, 71, 255, 0.2)
- 300: rgba(151, 71, 255, 0.3)
- 400: rgba(151, 71, 255, 0.4)
- 500: #9747FF
- 600: #8532FF
- 700: #721DFF
- 800: #5F08FF
- 900: #4C00F2

---

This document is a living guide. Update it as you scale the platform or introduce new services like subscriptions, loyalty programs, or business partnerships.
