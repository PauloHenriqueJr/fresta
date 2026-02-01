---
name: implementation-new-theme
description: Detailed comprehensive guide on how to implement a new premium theme in Fresta following the UniversalTemplate architecture pattern.
---

# New Theme Implementation Protocol

This skill guides the implementation of new Plus themes (e.g., "Casamento", "Bodas", "Halloween") into the Fresta architecture. **All themes must follow the UniversalTemplate pattern** for consistency and maintainability.

## Architecture Overview

**Standard Pattern** (USE THIS):
1. **Registry** (`src/lib/themes/registry.tsx`) - Theme configuration
2. **Dedicated Components File** (`src/lib/themes/{theme}Components.tsx`) - Theme-specific decorations
3. **Demo Page** (`src/pages/Calendario{Theme}.tsx`) - Uses `UniversalTemplate` with `isDemoMode={true}`
4. **Modal** (if needed) - Custom modal in `themeComponents.tsx`

**Examples**: CalendarioNatal.tsx, CalendarioPascoa.tsx, CalendarioCarnaval.tsx

## Step 1: Registry Configuration

**File**: `src/lib/themes/registry.tsx`

**Goal**: Define the theme's identity, UI config, and content defaults.

```tsx
export const halloweenTheme: PlusThemeConfig = {
  id: "halloween",
  content: {
    title: "Calendário de Halloween 🎃",
    capsule: { title: "Halloween Especial", message: "..." },
    locked: { title: "Trancado", message: "Aguarde..." },
  },
  styles: {
    bgColor: "bg-orange-950",
    cardBg: "bg-orange-900/80",
    shadow: "shadow-xl shadow-orange-500/20",
  },
  ui: {
    header: { bgColor: "bg-orange-950", textColor: "text-orange-100" },
    progress: { bgColor: "bg-orange-900", fillColor: "bg-orange-500" },
    envelopes: { closedColor: "bg-orange-800", openColor: "bg-orange-600" },
    actions: {
      share: { bgColor: "bg-orange-500", color: "text-white" },
      like: { bgColor: "bg-orange-600", color: "text-white" },
    },
  },
  icons: { locked: Lock, unlocked: Gift, special: Star },
};
```

**Register it**:
```tsx
export const getThemeConfig = (themeId: string): PlusThemeConfig => {
  // Add to switch/if statement
  if (themeId === "halloween") return halloweenTheme;
  // ...
};
```

## Step 2: Dedicated Components File

**File**: `src/lib/themes/{theme}Components.tsx` (e.g., `halloweenComponents.tsx`)

**Goal**: Create theme-specific floating decorations and visual effects.

**Pattern** (see `natalComponents.tsx`, `pascoaComponents.tsx`):

```tsx
import { motion } from "framer-motion";

// --- Individual decorative components ---
export const HalloweenGhosts = () => {
  const ghosts = [
    { left: "10%", delay: 0, duration: 15 },
    { left: "30%", delay: -3, duration: 12 },
    // ...
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {ghosts.map((ghost, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-30"
          style={{ left: ghost.left }}
          animate={{ y: ["-10vh", "110vh"], x: [-20, 20, -20] }}
          transition={{ duration: ghost.duration, repeat: Infinity, delay: ghost.delay }}
        >
          👻
        </motion.div>
      ))}
    </div>
  );
};

export const HalloweenPumpkins = () => {
  // Top border decorations
  return <div className="fixed top-0 ...">...</div>;
};

// --- Combined component (export this) ---
export const HalloweenDecorations = () => {
  return (
    <>
      <HalloweenPumpkins />
      <HalloweenGhosts />
    </>
  );
};

export default HalloweenDecorations;
```

**Critical Rules**:
- ✅ Use `fixed` positioning with `pointer-events-none`
- ✅ Proper z-index layering (top decorations: `z-[30]`, floating: `z-[5]`)
- ✅ Export individual components AND a combined `{Theme}Decorations` component
- ✅ Keep decorations **subtle and elegant** - avoid overwhelming the UI

## Step 3: Demo Page with UniversalTemplate

**File**: `src/pages/Calendario{Theme}.tsx` (e.g., `CalendarioHalloween.tsx`)

**Goal**: Create a demo page that showcases the theme using `UniversalTemplate`.

**Pattern** (copy from `CalendarioNatal.tsx`):

```tsx
import { UniversalTemplate } from "@/components/themes/UniversalTemplate";
import { getThemeConfig } from "@/lib/themes/registry";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/auth/AuthProvider";
import type { Tables } from "@/lib/supabase/types";

// Demo data matching Supabase structure
const demoDays: Tables<'calendar_days'>[] = [
  { id: "demo-1", calendar_id: "demo", day: 1, content_type: "text", 
    message: "Mensagem demo!", url: null, label: null, opened_count: 1, 
    created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // ... more days
];

const demoCalendar: any = {
  id: "demo",
  theme_id: "halloween",
  title: "Halloween Assustador 🎃",
  duration: 7,
  is_premium: true,
  // ... other required fields
};

export default function CalendarioHalloween() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const themeConfig = getThemeConfig("halloween");

  return (
    <UniversalTemplate
      config={themeConfig}
      calendar={demoCalendar}
      days={demoDays}
      openedDays={[1, 2, 3]}
      isEditor={false}
      isEditorContext={false}
      onNavigateBack={() => navigate("/explorar")}
      onShare={() => toast({ title: "Link copiado!" })}
      onDayClick={(day) => toast({ title: `Dia ${day} aberto!` })}
      onLockedClick={(day) => console.log("Locked:", day)}
      showWatermark={false}
      isDemoMode={true}  // 🔴 CRITICAL for CTA button
    />
  );
}
```

**Critical Props**:
- ✅ `isDemoMode={true}` - Shows "Criar meu calendário" CTA button
- ✅ `isEditor={false}` - View mode only
- ✅ `showWatermark={false}` - Clean demo view
- ✅ Navigation handlers for back/share actions

## Step 4: Custom Modal (Optional)

**File**: `src/lib/themes/themeComponents.tsx`

**Only if** the theme needs a completely custom modal (not just styled differently).

```tsx
export const HalloweenGhostModal = ({ isOpen, onClose, content }: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-orange-950 text-orange-100 ...">
        {/* Custom modal UI */}
        {content.type === 'video' && (
          <iframe src={content.url} ... />  // Handle video properly
        )}
      </DialogContent>
    </Dialog>
  );
};
```

**Then connect in** `src/components/calendar/DaySurpriseModal.tsx`:
```tsx
if (theme === "halloween") {
  return <HalloweenGhostModal isOpen={isOpen} onClose={onClose} content={content} />;
}
```

## Step 5: Integration with UniversalTemplate

**File**: `src/components/themes/UniversalTemplate.tsx`

The template **automatically imports decorations** based on theme ID:

```tsx
// Decorations are imported and rendered based on config.id
const DecorationComponent = getDecorationComponent(config.id);
```

**Update the decoration map**:
```tsx
const decorationComponents: Record<string, React.ComponentType> = {
  natal: NatalDecorationsFull,
  pascoa: PascoaDecorations,
  halloween: HalloweenDecorations,  // Add your theme here
  // ...
};
```

## Verification Checklist

**Before considering a theme "complete":**

- [ ] **Registry**: Theme config exported and registered in `getThemeConfig()`
- [ ] **Components File**: `{theme}Components.tsx` created with decorations
- [ ] **Demo Page**: `Calendario{Theme}.tsx` created using `UniversalTemplate`
- [ ] **Demo Mode**: `isDemoMode={true}` set in demo page
- [ ] **Decorations Imported**: Added to `UniversalTemplate` decoration map
- [ ] **Modal** (if custom): Created and wired in `DaySurpriseModal.tsx`
- [ ] **Routing**: Route added to `App.tsx` or router config
- [ ] **Visual Test**: Theme demo page loads with decorations and CTA button
- [ ] **Theme Switcher**: Theme appears in `/explorar` theme selection

## Common Mistakes to Avoid

❌ **Creating custom view logic** in `VisualizarCalendario.tsx` instead of using `UniversalTemplate`
❌ **Putting decorations** in `themeComponents.tsx` instead of dedicated file
❌ **Forgetting `isDemoMode={true}`** - CTA button won't appear
❌ **Not importing decorations** in UniversalTemplate decoration map
❌ **Hardcoding theme logic** instead of using the registry config
❌ **Skipping demo data** - Using null/undefined instead of proper mock data

## 🔴 CRITICAL: Editor/Viewer Synchronization

> [!CAUTION]
> **Plus themes MUST use UniversalTemplate in BOTH files!**
> Inconsistent renderers cause visual mismatches between edit and view modes.

### Required Files for Plus Theme Rendering:

| File | Purpose | Location |
|------|---------|----------|
| **CalendarioDetalhe.tsx** | EDITOR view (creator sees this) | `src/pages/CalendarioDetalhe.tsx` |
| **VisualizarCalendario.tsx** | VIEWER view (recipient sees this) | `src/pages/VisualizarCalendario.tsx` |

### Both files contain:

```tsx
// Plus theme check (MUST be identical in both files)
const isPlusTheme = premiumTheme.ui && (
  calendar.theme_id === 'namoro' || 
  calendar.theme_id === 'carnaval' || 
  calendar.theme_id === 'casamento' || 
  // ... ADD NEW THEMES HERE IN BOTH FILES
);

if (isPlusTheme) {
  return (
    <UniversalTemplate
      config={premiumTheme}
      calendar={calendar}
      days={days}
      // Editor vs Viewer differences:
      isEditorContext={true/false}
      isEditor={true/false}
      // ... rest of props
    />
  );
}
```

### When Adding a New Theme:

1. Add theme ID to `isPremiumTheme` check in **BOTH** files
2. Never create custom `render{Theme}View()` functions (legacy pattern, DO NOT USE)
3. Use `UniversalTemplate` for consistency
4. Test in BOTH editor AND viewer modes

## File Structure Reference

```
src/
├── lib/themes/
│   ├── registry.tsx                    # Theme configs
│   ├── themeComponents.tsx             # Shared/custom modals
│   ├── natalComponents.tsx             # ✅ Example
│   ├── pascoaComponents.tsx            # ✅ Example
│   ├── casamentoComponents.tsx         # ✅ Example
│   └── {newTheme}Components.tsx        # 👈 Create this
├── pages/
│   ├── CalendarioNatal.tsx             # ✅ Example
│   ├── CalendarioPascoa.tsx            # ✅ Example
│   └── Calendario{NewTheme}.tsx        # 👈 Create this
└── components/themes/
    └── UniversalTemplate.tsx           # 👈 Update decoration map
```
