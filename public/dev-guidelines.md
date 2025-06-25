LOVE 4 DETAILING APP DEVELOPMENT SCRIPT

This document is the definitive project implementation plan. It outlines the technical standards, structure, and expectations for the full development of the Love 4 Detailing platform. This file must be referenced throughout the build process to maintain alignment with the project vision, ensure clean and scalable code, and preserve consistent UI/UX across all environments.

⸻

1. OBJECTIVE

Deliver a fully functional, responsive, and modern booking web app for Love 4 Detailing. The platform should:
	•	Offer a seamless UX from QR scan/landing to completed booking.
	•	Use GSAP motion effects throughout (subtle and on-brand).
	•	Ensure all features (booking, account, uploads, email flows) are working.
	•	Maintain clean, modular, and DRY code principles.
	•	Leverage Supabase for database, auth, and media storage.
	•	Be scalable and easily updatable post-launch.

⸻

2. STRUCTURE & ARCHITECTURE

Folder Structure

/public
  |- assets
  |- scripts
  |- prompts
/src
  |- components
  |- pages
  |- layouts
  |- lib
  |- styles
  |- hooks
  |- utils

	•	All visual assets must be compressed SVG or WebP.
	•	Maintain reusable component logic (cards, forms, modals, buttons).
	•	Centralize config and shared styles.
	•	Utility functions and Supabase logic should be isolated.

⸻

3. SUPABASE

Required Tables
	•	users
	•	id, full_name, email, profile_picture, phone, address, created_at
	•	bookings
	•	id, user_id, car_make, car_model, package_type, images[], location, notes, booking_time, status
	•	vehicle_gallery
	•	id, user_id, image, car_make, car_model, uploaded_at

Supabase Setup
	•	Auth enabled with email-based login
	•	RLS (Row Level Security) active for all user data
	•	Signed URLs for image storage
	•	All dashboard queries using Supabase client

⸻

4. CORE FEATURES TO COMPLETE

Home to Booking Flow
	•	Working homepage CTA
	•	Vehicle details form
	•	Date & time selector
	•	Image upload (with Supabase storage)
	•	Conditional pricing based on car size
	•	Location input and service zone logic
	•	Payment method logic (Paypal toggle, Pay on clean, etc.)

Dashboard Features
	•	Responsive sidebar navigation
	•	User data populated via Supabase
	•	Update profile info and upload avatar
	•	Display upcoming/past bookings
	•	Upload/view vehicle gallery

Admin Access (Phase 2)
	•	View all bookings
	•	Filter by date/status
	•	Assign slots and confirm jobs

⸻

5. ANIMATION & INTERACTION

GSAP Integration
	•	Subtle movement on scroll & page load
	•	Button hover and tap animations
	•	Background orbs and gradient shifts (low opacity)
	•	Transition between sections with fluid GSAP easing (e.g., Power2.easeOut)
	•	Ensure animations do not block text readability or clash with branding

Best Practices
	•	Debounce scroll events
	•	Use minimal delay where possible
	•	Match animation tone to detail-oriented brand

⸻

6. STYLING SYSTEM

Brand Colours
	•	Purple (Primary Accent): #8A2B85
	•	True Black (Base): #141414
	•	Canvas/Off-white (Text Contrast): #F8F4EB
	•	Support Accent (Subtle): #DAD7CE (Stone Grey, optional use)

Design Rules
	•	Use black base with purple accent highlights
	•	Glassmorphism (backdrop blur) allowed in modals/cards
	•	Maintain sharp contrast and bold readability
	•	UI elements must be consistent (buttons, inputs, spacing)

⸻

7. RESPONSIVENESS
	•	Mobile-first with tailwind breakpoints
	•	Ensure nav, booking flow, and forms scale correctly
	•	Test all interactions on:
	•	iPhone 14
	•	iPad Mini
	•	Macbook Pro 13”
	•	Samsung S21

⸻

8. TESTING & VALIDATION

UX Flow Testing
	•	New user signs up
	•	Book car valet
	•	Upload vehicle photos
	•	See live dashboard
	•	Update account info
	•	Receive booking confirmation

Functional QA
	•	All form validations
	•	GSAP smoothness across pages
	•	Email triggers working
	•	Fallbacks for broken logic

⸻

9. POST-LAUNCH PREP
	•	Ensure meta tags and Open Graph visuals are set
	•	Add performance monitoring (e.g. Vercel Analytics or LogRocket)
	•	Hand off brand toolkit and code reference to client
	•	Create short README with edit instructions

⸻rtainly — here is the section written in the same structured .md format as your existing dev-guidelines.md file. You can paste this directly into your file:

⸻

Git Commit & Push Standards

To maintain clean version control, predictable deployment, and stable development, follow these source control practices:

When to Push
	•	Feature Completion
Push when a functional feature or UI component is completed and does not break the app.
	•	Logical Milestones
Examples: Dashboard section finished, GSAP animation added, Supabase logic complete, responsive layout in place.
	•	Pre-Refactor Safety Save
Before rewriting or deleting sections of code, push the current working version to preserve history.
	•	End-of-Session Backup
Always push stable code before ending a development session or switching tasks.

When Not to Push
	•	Code that is broken, incomplete, or not functional.
	•	Work-in-progress that disrupts existing functionality unless it’s in a separate dev branch.
	•	Messy or unstructured experiments without notes or cleanup.

 Commit Message Format

Use clear and structured commit messages in lowercase with tags:

feat: add customer booking flow
fix: correct mobile nav layout bug
refactor: clean up animation sequence
style: update service card UI
chore: remove unused console logs

Recommended Commit Frequency
	•	Push every 30–90 minutes or after 100–300 lines of clean, functional code.
	•	Push smaller chunks if completing isolated updates or UI changes.
	•	Push more frequently during high-build stages like dashboard, database logic, GSAP, or responsiveness tweaks.

⸻

Design Consistency Requirements (App-Wide)

All interface elements — including sidebars, dashboards, buttons, cards, and landing sections — must adhere to a unified visual system.

Global UI Standards:
	•	Primary Brand Colour: Use #A64AFB (or latest approved purple) as the dominant accent across all pages — including dashboard UI, sidebars, buttons, form highlights, and headings.
	•	Typography: Maintain the same font family, sizes, weights, and spacing rules from the landing page across dashboard and app screens.
	•	Shadows, Radii & Borders: All containers, cards, buttons, and modals must use the same radius values, box shadows, and border styling throughout.
	•	Button Styles: Primary, secondary, and outline buttons must retain identical padding, hover states, animations (GSAP), and color rules across all views — landing and dashboard.
	•	Sidebar Styling: The sidebar must:
	•	Use the same purple gradient or solid fill as the hero/CTA elements.
	•	Include hover/active states consistent with landing page buttons.
	•	Display icons and text styled in line with the design system.

Design Checks Per Commit:

Before committing visual changes:
	•	Run a full app pass (landing, dashboard, and sidebar).
	•	Ensure all updated styles match the core theme variables (defined in /styles/theme.ts or global CSS).
	•	Visually inspect the sidebar and dashboard interactions — especially buttons and links — for design fidelity and functional consistency.
	•	Confirm GSAP animations remain smooth and do not clash with content hierarchy or legibility.

If it doesn’t match the visual tone and UX of the landing page, it doesn’t go in.

⸻

Workspace and Terminal Discipline

To avoid performance issues, confusion, and broken development flows:
	•	Always keep only one terminal session active at a time unless explicitly debugging a concurrent process. 
	•	Close unused terminals to reduce memory load and prevent accidental conflicts (such as duplicate builds or multiple ports).
	•	Keep your editor or file tabs minimal — close irrelevant files once you’re done working on them.
	•	Name open terminals clearly (e.g., dev-server, supabase, storybook) when multiple are temporarily needed.

Streamlined workspace = faster builds, fewer mistakes, and cleaner code.

MAINTAIN CODE QUALITY AT ALL TIMES. DO NOT RUSH, DO NOT DUPLICATE.
Every line of code must contribute toward a thoughtful, clean, and scalable app.