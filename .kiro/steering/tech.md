# Technology Stack & Development Guidelines

## Core Technologies

**Frontend Framework**: React 18.3.1 with TypeScript 5.8.3
**Build Tool**: Vite 5.4.19 with SWC plugin for fast compilation
**Styling**: Tailwind CSS 3.4.17 with custom design system
**UI Components**: shadcn/ui with Radix UI primitives
**Routing**: React Router DOM 6.30.1
**State Management**: React Context + TanStack Query 5.83.0
**Testing**: Vitest 3.2.4 with Testing Library

## Key Dependencies

**UI & Styling**:
- `@radix-ui/*` - Accessible component primitives
- `tailwindcss-animate` - Animation utilities
- `framer-motion` - Advanced animations
- `lucide-react` - Icon library
- `next-themes` - Theme switching

**Forms & Validation**:
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form validation
- `zod` - Schema validation

**Data & Backend**:
- `@supabase/supabase-js` - Database client (prepared for migration)
- `@tanstack/react-query` - Server state management

**Utilities**:
- `date-fns` - Date manipulation
- `clsx` + `tailwind-merge` - Conditional styling
- `class-variance-authority` - Component variants

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── b2b/            # B2B-specific components
│   ├── b2c/            # B2C-specific components
│   ├── calendar/       # Calendar-related components
│   └── common/         # Shared components
├── pages/              # Route components
│   ├── admin/          # Admin console pages
│   └── b2b/            # B2B area pages
├── layouts/            # Layout components (B2C, B2B, Admin)
├── lib/                # Utilities and data layer
│   ├── offline/        # localStorage-based data layer
│   ├── supabase/       # Supabase integration (prepared)
│   └── data/           # Data access layer
├── state/              # Global state management
├── hooks/              # Custom React hooks
└── assets/             # Static assets (mascot images)
```

## Development Commands

**Development**: `npm run dev` - Start Vite dev server on port 8080
**Build**: `npm run build` - Production build
**Build (Dev)**: `npm run build:dev` - Development mode build
**Preview**: `npm run preview` - Preview production build
**Lint**: `npm run lint` - ESLint code checking
**Test**: `npm run test` - Run tests once
**Test Watch**: `npm run test:watch` - Run tests in watch mode

## Code Style & Conventions

**TypeScript Configuration**:
- Path aliases: `@/*` maps to `./src/*`
- Relaxed strictness for rapid prototyping (`noImplicitAny: false`)
- Skip lib checks for faster compilation

**Component Patterns**:
- Use functional components with hooks
- Prefer composition over inheritance
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props

**Styling Guidelines**:
- Tailwind-first approach with custom CSS variables
- Responsive design: mobile-first, desktop app-like on larger screens
- Custom color palette for Brazilian themes (festive, carnaval, etc.)
- Consistent spacing and typography scale

**Data Layer**:
- Repository pattern for data access
- Offline-first with localStorage persistence
- Prepared for Supabase migration with compatible interfaces
- Type-safe data models in `src/lib/offline/types.ts`

## Architecture Patterns

**Layout System**: Three distinct layouts (B2C, B2B, Admin) with responsive behavior
**Authentication**: Context-based auth with Supabase integration ready
**Routing**: Protected routes with role-based access
**State Management**: Local state + React Query for server state
**Theme System**: CSS variables + Tailwind for dynamic theming

## Performance Considerations

- Vite for fast development and optimized builds
- SWC for faster TypeScript compilation
- Component lazy loading where appropriate
- Optimized bundle splitting
- Image optimization for mascot assets

## Testing Strategy

- Unit tests with Vitest and Testing Library
- Component testing for UI interactions
- Integration tests for data layer
- E2E testing preparation with Playwright tools available