# SYSTEM GUIDE FOR LOVE 4 DETAILING APP (REBUILD)

This document serves as a foundational reference for all future development on the Love 4 Detailing platform. It consolidates core development principles, architectural decisions, and execution rules from both the app-guidelines and role-model philosophies. This app is designed to be licensed, handed over, and then cloned as a reusable template for future clients. Every part of the build must support that intent.

## CORE MINDSET & PHILOSOPHY

- System-Based Thinking: Every feature must be part of a scalable system, not an isolated page or hardcoded UI. Prioritize reusability, abstraction, and client configurability from the ground up.
- Senior Developer Mindset: Think like a lead engineer. Prioritize clean patterns, strict type safety, separation of concerns, and scalable logic — especially with form handling, server interactions, and authentication.
- Ask > Assume: When unsure, ask for context. Don't fill in gaps with assumptions. No silent breaks or patch fixes — clarity comes before code.
- One Source of Truth: All user-editable UI labels, service details, pricing, and configurations must live in a central `constants.ts` or `/lib/config.ts` setup.
- Avoid Memory Drift: Always refer back to this document when unsure about architecture or logic decisions. No cutting corners — this is a long-term asset.


## TECHNICAL GUIDELINES (FROM APP-GUIDELINES.MD)

### Structure
- Monorepo-friendly layout using `/src`, `/components`, `/app`, `/lib`, `/hooks`, `/types`, `/api`, `/data`
- Use Next.js App Router (`/app/`) with server components by default
- Only use `use client` when necessary (`useEffect`, `useState`, handlers)

### API & Backend (Supabase)
- All database reads/writes must go through Supabase functions or API routes
- Role-level access must be enforced via Supabase RLS (Row-Level Security)
- Backend logic should live in `/app/api/*`, organized and modular
- Use Zod for validation on both server and client side — no naked data use
- Use `async/await`, typed responses, and robust error logging

### Frontend / Styling
- All styling is TailwindCSS — do not introduce external UI libs
- Core theme: mobile-first, clean layout, no deviation from visual design
- Do not change the layout, color palette, typography, or spacing
- Use existing brand color tokens (`#8A2B85`, `#141414`, `#F8F4EB`)
- If you touch the UI, confirm with me first

### Form Handling
- Use `react-hook-form` + `zodResolver`
- Every input must have strict types and fallbacks
- Each form should include:
  - Validation schema (`/lib/validation.ts`)
  - Controlled fields (`Controller` if necessary)
  - Central config for labels and logic

### Client Licensing (Scalability)
- Services, pricing, and copy must be adjustable via `/data/services.ts` or `constants.ts`
- No logic or UI text should be hardcoded inside components
- Default copy should be set per-client, with overrides possible
- All repeated structures (add-ons, time slots, reward points, etc) must be built as systems


## BUILD PROCESS: CLEAN REWRITE

You are rebuilding the app backend + logic layer, while preserving the current frontend design exactly as is. Your goals are:

- Recreate the booking system with complete clarity, logic separation, and dynamic pricing
- Clean form structure with no broken types or prop errors
- All pricing and service logic lives in `constants.ts`
- Use Zod and proper validation across all form flows
- Strip away unused code, fix naming, imports, and exports


## CRITICAL RULES (DO NOT IGNORE)

1. Never leave assumptions unverified — ASK before committing partial fixes
2. Any request to “quick fix” or “patch” must be challenged — we build for scale
3. Do not install libraries unless they match existing tooling standards
4. No direct string usage — centralize config
5. Follow the structure: `lib` = logic, `components` = UI, `hooks` = logic reuse, `data` = client-editable content
6. All external requests must be secured with `.env` values and never exposed
7. No UI redesigns — match all current Tailwind styles unless explicitly told otherwise


Key Rules for Reusability:
	1.	All front-end content must be editable from a single location. This includes text, pricing, service options, location details, contact info, etc. There should be zero hardcoded content inside components.
	2.	Visual styling must remain consistent across clones. The design system — including layout, colors, spacing, and typography — should not require adjustment with each new deployment unless explicitly requested.
	3.	Every clone should be quick to spin up. After handover, the original can be duplicated, updated with new content, API keys, and branding assets, then deployed without touching core logic.
	4.	Business logic should remain decoupled from design. Components must render based on passed-in data, not fixed assumptions. No logic should be tied to specific service names, client identities, or brand visuals.
	5.	Authentication, user roles, and database access must be scoped cleanly. A cloned instance must work with its own data and user base. Any setup required (auth config, DB schema, roles) should be clear and repeatable.
	6.	Future updates should require no structural rewrites. The system must be stable enough that adjustments — such as changing services, adding form fields, or tweaking pricing logic — can be made without disrupting other parts of the app.

USER EXPERIENCE & FLOW CONSISTENCY

Every user action — from tapping a button to receiving an email — must trigger the correct backend logic, visual feedback, and expected outcome. This isn’t just about visual polish — it’s about trust, flow, and functionality working as one system.

GENERAL PRINCIPLES
	•	Nothing should break the flow: Every button, form, action, or selection must:
	•	Give instant, clear feedback (e.g. loading states, success toasts)
	•	Update the UI and backend state accurately
	•	Return the user to the right place with zero confusion
	•	Every screen should have a clear purpose: No dead-ends. No ambiguous actions. No empty states without context or options.
	•	Every step must map to a backend process:
	•	If a form is submitted, data must persist to Supabase correctly and be retrievable instantly
	•	If a booking is confirmed, confirmation logic (time slot lockout, reward calculation, email) must follow
	•	If a user earns points, rewards logic must update both UI and Supabase state in sync



FRONTEND–BACKEND ALIGNMENT RULES
	1.	All UI Actions Must Be Backed by Valid Logic
	•	Every clickable action must trigger a defined handler
	•	Handlers must validate, mutate (via Supabase), and return a typed success/error response
	2.	Form Submissions Must Have Three-Stage Validation
	•	Zod schema validates on the client
	•	react-hook-form captures user input and displays inline errors
	•	Server validates again before writing to Supabase
	3.	Button States Must Be Covered Fully
	•	Default: Neutral state
	•	Loading: Spinner or disabled state with visual cue
	•	Success: Clear indication (toast, redirect, or updated view)
	•	Error: Instant feedback with guidance
	4.	Time Slot & Service Selection Must Reflect Real-Time Availability
	•	Prevent double-booking
	•	Disable unavailable times in the UI based on backend checks
	•	Use intelligent fallback or custom messages when no slots are left
	5.	Reward Points, Loyalty, and Repeat Bookings
	•	On booking success: Check reward system and add points
	•	On profile view: Show accurate live reward points
	•	On dashboard: Enable re-booking using last service data pulled from Supabase
	6.	Admin Logic Should Mirror Frontend Visibility
	•	Admin dashboard must allow:
	•	Real-time booking edits
	•	Profile management
	•	Reward overrides
	•	Manual time slot control



ACCESSIBILITY & UX INTEGRITY
	•	All components must meet basic accessibility guidelines (tab index, aria labels, etc.)
	•	Keyboard navigation should be usable across forms and buttons
	•	Mobile interactions (touch areas, feedback, scroll locking) must feel native
	•	No unexpected refreshes or redirects — always guide the user clearly



INTEGRITY MANDATE

This app will be cloned and handed to future clients. That means:
	•	Every flow must just work on any cloned instance
	•	No hardcoded assumptions about users, services, locations, or UI logic
	•	Nothing should feel hacked, rushed, or half-connected



This section locks in the experience layer of the app — ensuring that the front-end never outruns the logic behind it, and that every user touchpoint is fully functional, secure, and intentional.

In summary: treat this like a white-label SaaS product. Every decision should reduce friction when cloning, customizing, and licensing the app again.

This system guide replaces all loose memory and reference material. Stick to it.
