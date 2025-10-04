# NorthLing - Interactive Language Learning Platform

## Overview

NorthLing is a modern, interactive language learning platform built with React, TypeScript, and Supabase. It provides an engaging environment for users to learn new languages through vocabulary quizzes, progress tracking, and community features.

## Features

### 🔐 Authentication & User Management
- Secure email/password authentication
- Role-based access control (User/Admin)
- User profile management
- Customizable avatar support

### 🌍 Language Management
- Multiple language support
- Base language selection
- Target language selection
- Language preference persistence

### 📚 Learning Features
- Interactive vocabulary quizzes
- Progress tracking
- Streak counting system
- Audio pronunciation support
- Achievement system

### 📊 Dashboard & Progress
- Personal progress dashboard
- Learning statistics
- Achievement badges
- Streak tracking
- Language proficiency levels

### 🏆 Leaderboard & Community
- Global leaderboard
- Weekly/Monthly rankings
- Community interaction
- Progress comparison
- Achievements showcase

### 👨‍💼 Admin Features
- User management
- Content management
- Progress monitoring
- Analytics dashboard

## Technology Stack

There are several ways of editing your application.

### Frontend
- React 18+ with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- Shadcn/ui for UI components
- React Router for navigation
- React Query for data fetching
- Framer Motion for animations

### Backend
- Supabase for backend services
- PostgreSQL database
- Real-time subscriptions
- Row Level Security
- Storage for user avatars

### Authentication & Security
- JWT-based authentication
- Role-based access control
- Secure password handling
- Protected routes
- Input validation

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

## Getting Started

### Prerequisites
- Node.js 16+ (18+ recommended)
- npm or yarn or bun package manager
- Supabase account for backend services

### Environment Setup
1. Clone the repository:
```bash
git clone https://github.com/DavidManiIbrahim/northling-path.git
cd northling-path
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

### Database Setup
1. Create a new Supabase project
2. Run the migration scripts in the `supabase/migrations` folder
3. Set up the necessary bucket for avatar storage

## Project Structure
```
northling-path/
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── lib/            # Utility functions
│   ├── integrations/   # External service integrations
│   └── styles/         # Global styles and themes
├── public/             # Static assets
└── supabase/          # Database migrations and types
```

## Contributing
1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ff20290a-62b4-4c3f-831d-c6d0fbd2bace) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
