# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Guide

- Do not change the database wihout my approval
- After testing remove console.log since this code is deploy in Production
- After testing remove unnecessary files and folders since this will be deploy in production.

### Core Commands

- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint linting
- `pnpm format` - Format code with Prettier

### Package Manager

This project uses **pnpm** as the package manager, not npm or yarn.

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL with real-time features)
- **UI**: Shadcn UI components built on Radix UI + TailwindCSS
- **Authentication**: Supabase Auth with session management
- **Forms**: react-hook-form with zod validation
- **State Management**: React Context for global state (Auth, BodyMuscle)
- **Caching**: Custom localStorage-based caching system with expiration

### Key Directories

- `app/` - Next.js app router pages and API routes
- `components/` - Reusable UI components organized by feature
- `contexts/` - React context providers for global state
- `hooks/` - Custom React hooks
- `lib/` - Utilities, types, and configurations

### Authentication Architecture

- **AuthProvider** (`components/auth/auth-provider.tsx`) wraps the entire app
- Automatic redirects: unauthenticated users → `/login`, authenticated users on login → `/`
- Supabase client singleton pattern to prevent multiple instances
- Mock client fallback for development/testing when Supabase config is missing
- Auth state managed via React Context with session persistence

### Database Integration

- **Supabase Integration**: Uses foreign key relationships with automatic relationship syntax
- **API Structure**: RESTful API routes in `app/api/` directory
- **Type Safety**: Generated TypeScript types in `lib/types.ts`
- **Best Practice**: Always use Supabase's relationship syntax instead of manual JOINs (see SUPABASE_BEST_PRACTICES.md)

### Exercise System Architecture

- **4 Main Categories**: warm-up, mobilise, strengthen, recover
- **Group-based Organization**: Exercises grouped by muscle groups/body sections
- **Multi-media Support**: Images, multiple video URLs per exercise
- **User Interactions**: Notes, workout logging, offline sync capability
- **Caching**: 24-hour localStorage cache for exercise data

### State Management Patterns

- **AuthProvider**: Global authentication state
- **BodyMuscleProvider**: Cached body muscle data with smart fetching
- **Local State**: Component-level state for UI interactions
- **Caching Strategy**: Custom `useCache` hook with expiration timestamps

### UI/UX Patterns

- **Responsive Design**: Mobile-first with TailwindCSS
- **Dark Mode**: Built-in theme support via next-themes
- **Loading States**: Skeleton loaders and proper loading indicators
- **Error Handling**: Graceful fallbacks and error boundaries
- **Accessibility**: Skip links, ARIA labels, keyboard navigation

### Important Files

- `lib/supabase.ts` - Supabase client configuration and singleton patterns
- `lib/types.ts` - TypeScript definitions for database and UI types
- `app/actions.ts` - Server actions for data mutations
- `components/auth/auth-provider.tsx` - Authentication wrapper
- `SUPABASE_BEST_PRACTICES.md` - Database relationship patterns

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Key Development Notes

- Always prefer Supabase's automatic relationship syntax over manual queries
- Use proper foreign key constraints for data integrity
- Implement proper error boundaries and fallback states
- Follow the established caching patterns for performance
- Maintain type safety throughout the application
