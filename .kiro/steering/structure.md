# Project Structure & Organization

## Application Architecture

The Fresta platform follows a **multi-tenant architecture** with three distinct product areas, each with its own layout, routing, and component organization:

### Layout Hierarchy

**B2C Layout** (`src/layouts/B2CLayout.tsx`)
- Mobile/tablet: Full-screen app-like experience
- Desktop: Application shell with sidebar navigation
- Routes: `/meus-calendarios`, `/criar`, `/calendario/:id`, `/perfil`

**B2B Layout** (`src/layouts/B2BLayout.tsx`)
- Desktop: Sidebar navigation with company branding
- Mobile/tablet: Horizontal navigation bar
- Routes: `/b2b/*` (dashboard, campaigns, analytics, team)

**Admin Layout** (`src/layouts/AdminLayout.tsx`)
- Desktop-focused interface for platform management
- Routes: `/admin/*` (dashboard, themes, plans, users)

## Component Organization

### UI Components (`src/components/`)

**Base UI** (`ui/`)
- shadcn/ui components (Button, Card, Dialog, etc.)
- Consistent design system across all areas
- Accessible Radix UI primitives

**Domain-Specific Components**:
- `auth/` - Authentication flows and protected routes
- `b2b/` - Business dashboard components
- `b2c/` - Consumer calendar creation and management
- `calendar/` - Calendar display and interaction components
- `common/` - Shared components across domains

### Page Organization (`src/pages/`)

**Root Level**: Public and B2C pages
**Nested Folders**:
- `admin/` - Platform administration pages
- `b2b/` - Business area pages

### Data Layer (`src/lib/`)

**Offline Data** (`offline/`)
- `db.ts` - localStorage-based database operations
- `types.ts` - TypeScript interfaces for all entities
- `themes.ts` - Theme definitions and configurations
- `storage.ts` - localStorage utilities

**Supabase Integration** (`supabase/`)
- Prepared for backend migration
- Client configuration and type definitions

**Data Access** (`data/`)
- Repository pattern for data operations
- Abstraction layer for offline/online switching

## Routing Structure

### Public Routes
```
/ - Landing page
/entrar - Authentication
/premium - Pricing information
/c/:id - Public calendar viewing
```

### Protected B2C Routes
```
/meus-calendarios - Calendar management dashboard
/criar - Calendar creation wizard
/calendario/:id - Calendar detail hub
/calendario/:id/configuracoes - Calendar settings
/calendario/:id/estatisticas - Calendar analytics
/editar-dia/:calendarId/:dia - Day content editor
/perfil - User profile
/conta/configuracoes - Account settings
```

### B2B Routes
```
/b2b - Business dashboard
/b2b/campanhas - Campaign management
/b2b/campanhas/nova - Create new campaign
/b2b/campanhas/:id - Campaign details
/b2b/analytics - Business analytics
/b2b/branding - Brand customization
/b2b/equipe - Team management
```

### Admin Routes
```
/admin - Platform overview
/admin/temas - Theme catalog management
/admin/planos - Subscription plan management
/admin/usuarios - User and organization management
```

## State Management

**Global State** (`src/state/`)
- `auth/AuthProvider.tsx` - Authentication context
- User session and profile management
- Supabase integration ready

**Local State**
- Component-level state with React hooks
- Form state with react-hook-form
- Server state with TanStack Query

## Asset Organization

**Static Assets** (`src/assets/`)
- Mascot images for different themes
- Organized by theme/event type
- Optimized for web delivery

**Public Assets** (`public/`)
- Favicon and meta images
- robots.txt for SEO
- Placeholder graphics

## File Naming Conventions

**Components**: PascalCase (e.g., `CalendarCard.tsx`)
**Pages**: PascalCase (e.g., `MeusCalendarios.tsx`)
**Utilities**: camelCase (e.g., `utils.ts`)
**Types**: PascalCase interfaces (e.g., `CalendarEntity`)
**Constants**: UPPER_SNAKE_CASE (e.g., `BASE_THEMES`)

## Import Patterns

**Path Aliases**: Use `@/` for all internal imports
```typescript
import { Button } from "@/components/ui/button"
import { db } from "@/lib/offline/db"
import { useAuth } from "@/state/auth/AuthProvider"
```

**Barrel Exports**: Avoid deep imports where possible
**Type Imports**: Use `import type` for TypeScript types

## Development Workflow

**Feature Development**:
1. Create components in appropriate domain folder
2. Add types to `src/lib/offline/types.ts`
3. Implement data operations in `src/lib/offline/db.ts`
4. Create pages and wire up routing
5. Add tests in `src/test/`

**Responsive Design**:
- Mobile-first approach
- Desktop enhancements without breaking mobile UX
- Consistent component behavior across breakpoints

## Migration Readiness

The project structure is designed for smooth migration to Supabase:
- Data layer abstraction allows backend switching
- Type definitions compatible with database schemas
- Authentication context ready for real auth
- Component organization supports both offline and online modes