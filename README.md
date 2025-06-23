# Love 4 Detailing - Mobile Car Valeting & Detailing

A modern, full-stack web application for booking mobile car valeting and detailing services. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- 🚗 Book professional car valeting and detailing services
- 📍 Location-aware pricing based on postcode radius
- 🎯 Smart scheduling with travel time buffer
- 💰 Rewards system for loyal customers
- 📱 Fully responsive design
- 🔒 Secure user authentication
- 💳 Integrated payment processing

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Storage)
- **Payment**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/love4detailing-app.git
   cd love4detailing-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   BUSINESS_POSTCODE=SW9
   TRAVEL_RADIUS_MILES=10
   TRAVEL_COST_PER_MILE=2
   MAX_DAILY_BOOKINGS=5

   # Points System Configuration
   POINTS_PER_POUND=1
   POINTS_REDEMPTION_RATE=100
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The application uses Supabase as its backend. You'll need to create the following tables:

1. users
2. bookings
3. rewards
4. services

Detailed schema information and SQL setup scripts will be provided in the `/supabase` directory.

## Project Structure

```
love4detailing-app/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable React components
│   │   ├── ui/          # UI components (Button, Card, etc.)
│   │   └── layout/      # Layout components
│   ├── config/          # Configuration files
│   ├── lib/             # Utility functions and helpers
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── supabase/           # Supabase configuration and migrations
```

## Development

### Code Style

- We use ESLint and Prettier for code formatting
- Follow the TypeScript best practices
- Component-specific styles should use Tailwind CSS classes

### Git Workflow

1. Create a new branch for each feature/fix
2. Follow conventional commits for commit messages
3. Submit pull requests for review
4. Squash and merge after approval

## Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy to production

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@love4detailing.com or raise an issue in the GitHub repository.
