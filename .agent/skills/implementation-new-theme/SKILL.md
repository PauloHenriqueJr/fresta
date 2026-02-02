# New Theme Implementation Protocol (Modular)

This skill guides the implementation of new Plus themes into the Fresta architecture. **All themes must follow the Modular Folder Pattern** and use the `UniversalTemplate` for consistency.

## Architecture Overview (Modular Pattern)

Each theme has its own folder in `src/lib/themes/`.

**Structure**:
1. **Folder**: `src/lib/themes/{theme_id}/`
2. **Config**: `config.tsx` - Theme identity and color definitions.
3. **Decorations**: `decorations.tsx` - Floating effects (framer-motion).
4. **Entry Point**: `index.tsx` - Re-exports everything for the registry.
5. **Registry**: `src/lib/themes/registry.tsx` - Central distribution (keep it lightweight).
6. **Demo**: `src/lib/offline/themes.ts` - Theme listing for Explorar page (visualization only).

---

## Step 1: Create the Theme Folder

Create a folder: `src/lib/themes/{theme_id}/` (e.g., `halloween/`).

## Step 2: Configuration (`config.tsx`)

Define the theme's colors, fonts, and card styles.

**Key Rule**: Always define `numberClass` in `cards.envelope` to control the day number color and avoid hardcoded red/rose defaults.

```tsx
import { Lock, Sparkles, Star, Quote } from 'lucide-react';
import type { PlusThemeConfig } from '../types';
import { HalloweenDecorations } from './decorations';

export const halloweenTheme: PlusThemeConfig = {
  id: 'halloween',
  content: {
    capsule: { title: "Dia das Bruxas", message: "Boo! 🎃", icon: Sparkles },
    footerMessage: "Feliz Halloween! 👻",
    subtitle: "Contagem regressiva assustadora",
    editorSubtitle: "Configure seu Halloween"
  },
  FloatingComponent: HalloweenDecorations,
  ui: {
    layout: {
      bgClass: "bg-orange-950",
      containerClass: "font-display",
      headerWrapper: "bg-orange-900/90 border-b border-orange-500/20 backdrop-blur-md",
      mainClass: "px-4 py-8",
    },
    header: {
      title: "text-orange-500 font-serif italic",
      subtitle: "text-orange-300",
      badgeText: "HALLOWEEN",
      badgeTextClass: "text-orange-100 bg-orange-600",
    },
    cards: {
      envelope: {
        container: "bg-orange-900 border-orange-500",
        button: "bg-orange-600 text-white",
        buttonText: "ABRIR SURPRESA",
        numberClass: "text-orange-400", // CRITICAL: Define theme-specific number color
        glowClass: "shadow-orange-500/20",
        borderClass: "border-orange-500/30"
      },
      // ... other card types (locked, unlocked, empty)
    },
    icons: { main: Sparkles, locked: Lock, open: Star, quote: Quote }
  }
};
```

## Step 3: Decorations (`decorations.tsx`)

Create the visual effects using `framer-motion`.

```tsx
import { motion } from "framer-motion";

export const HalloweenDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Your flying ghosts, pumpkins, etc. */}
    </div>
  );
};
```

## Step 4: Entry Point (`index.tsx`)

**CRITICAL**: Use `.tsx` extension for the index file to correctly support React components and prevent module resolution errors.

```tsx
// src/lib/themes/{theme_id}/index.tsx
export { halloweenTheme } from './config';
export { HalloweenDecorations } from './decorations';
```

## Step 5: Register the Theme (`registry.tsx`)

Import the theme folder and add it to the `getThemeConfig` logic.

```tsx
// src/lib/themes/registry.tsx
import { halloweenTheme } from "./halloween";

export { halloweenTheme };

export const getThemeConfig = (themeId: string): PlusThemeConfig => {
  switch (themeId) {
    case 'halloween': return halloweenTheme;
    // ...
    default: return aniversarioTheme;
  }
};
```

## Step 5.1: Add Theme ID to Types (`types.ts`)

Add the new theme ID to the `ThemeId` type in `src/lib/themes/types.ts`:

```tsx
export type ThemeId = 
  | 'namoro' 
  | 'casamento' 
  // ... existing themes
  | 'halloween'; // Add new theme
```

> ⚠️ **NOTE**: If the theme is FREE (not Plus), do NOT add it to `PLUS_THEME_IDS` array.

## Step 5.2: Register in Page Renderers (CRITICAL!)

> 🔴 **THIS STEP IS OFTEN MISSED!** Without it, themes render with the fallback/default view.

Add the new theme ID to the `isPremiumTheme` condition in **both files**:

**`src/pages/CalendarioDetalhe.tsx` (Editor View)**:
```tsx
// Around line 182 - find the condition and add your theme
if (premiumTheme.ui && (
  calendar.theme_id === 'namoro' ||
  // ... existing themes
  calendar.theme_id === 'halloween' // ADD THIS
)) {
```

**`src/pages/VisualizarCalendario.tsx` (Public View)**:
There are **TWO** places to update:
1. `isPremiumTheme` constant (around line 624)
2. `premiumConfig.ui &&` condition (around line 988)

```tsx
// Around line 624
const isPremiumTheme = premiumTheme.ui && (
  // ... existing themes
  calendar.theme_id === 'halloween' // ADD THIS
);

// Around line 988
if (premiumConfig.ui && (
  // ... existing themes
  calendar.theme_id === 'halloween' // ADD THIS
)) {
```

## Step 6: Add to Explorar Demo (`src/lib/offline/themes.ts`)

> ⚠️ **IMPORTANT**: This step is for **visualization only** in the Explorar page. 
> The Demo view (`ThemedCalendarDemo.tsx`) shows how a theme looks WITHOUT real data.
> The **shared calendar view** (`VisualizarCalendario.tsx`) is controlled by the `registry.tsx`.

Add the theme definition to `BASE_THEMES` array:

```tsx
// src/lib/offline/themes.ts
{
  id: "halloween",
  name: "Halloween",
  iconName: "Ghost",
  scope: "b2c",           // or "common" for universal themes
  imageKey: "halloween",  // Must have mascot in assets!
  gradientClass: "bg-gradient-festive",
  description: "Surpresas assustadoras!",
  emoji: "🎃",
  enabledByDefault: true,
},
```

Then add the mascot image mapping in `ThemedCalendarDemo.tsx`:

```tsx
// src/pages/ThemedCalendarDemo.tsx
import mascotHalloween from "@/assets/mascot-halloween.jpg";

const imageByKey: Record<...> = {
  // ...existing mappings
  halloween: mascotHalloween,
};
```

**Key Distinction:**
- `BASE_THEMES` → What appears in **Explorar** page (theme selection grid)
- `ThemedCalendarDemo` → How the **demo preview** looks (sample days, no real data)
- `registry.tsx` → What powers **real shared calendars** (with actual user content)

---

## Step 7: Modal Configuration - MODULAR PATTERN (REQUIRED!)

> ⚠️ **MANDATORY**: Every theme needs modal styling configured in its own folder. 

### Architecture Overview

Following SOLID principles (SRP - Single Responsibility), modals are stored in each theme's folder:

```
src/lib/themes/{theme_id}/
├── config.tsx       # Theme identity and colors
├── decorations.tsx  # Floating effects
├── modals.tsx       # [MODALS] Theme-specific modals ← NEW
└── index.tsx        # Re-exports everything
```

Shared types are in `src/lib/themes/shared/types.ts`.

### 7.1: Create Theme Modal (`modals.tsx`)

Create `src/lib/themes/{theme_id}/modals.tsx`:

```tsx
import { motion } from "framer-motion";
import { X, YourIcon } from "lucide-react";
import type { BaseModalProps } from "../shared/types";

export const YourThemeModal = ({ isOpen, onClose, content }: BaseModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-yourcolor/80 backdrop-blur-sm">
      {/* Modal with theme-specific styling */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-[360px] max-h-[85vh] bg-white rounded-3xl"
      >
        {/* Close, Header, Content, Button */}
      </motion.div>
    </div>
  );
};

// Locked Modal Config - used by LoveLockedModal for this theme
export const yourthemeLockedConfig = {
  title: "Calma! 🎯",
  message: "Essa surpresa está guardada para o momento certo!",
  buttonColor: "bg-yourcolor-500 hover:bg-yourcolor-600",
  iconColor: "text-yourcolor-500",
  bgColor: "bg-yourcolor-50 dark:bg-zinc-900",
  borderColor: "border-yourcolor-200 dark:border-yourcolor-900",
  textColor: "text-yourcolor-900 dark:text-yourcolor-100",
  descColor: "text-yourcolor-600/80 dark:text-yourcolor-300/80",
  icon: YourIcon
};
```

### 7.2: Update Theme Index (`index.tsx`)

Add the modal exports:

```tsx
// src/lib/themes/{theme_id}/index.tsx
export { yourthemeTheme } from './config';
export { YourthemeDecorations } from './decorations';
export { YourThemeModal, yourthemeLockedConfig } from './modals';  // ADD THIS
```

### 7.3: Route Modal in DaySurpriseModal

Update `src/components/calendar/DaySurpriseModal.tsx`:

```tsx
// Add import from theme folder
import { YourThemeModal } from "@/lib/themes/yourtheme/modals";

// Add condition in component
if (theme === "yourtheme") {
  return (
    <YourThemeModal
      isOpen={isOpen}
      onClose={onClose}
      content={{
        type: content?.type === "text" ? "text" : "image",
        title: `Dia ${day}`,
        message: content?.message || "",
        mediaUrl: content?.url,
      }}
    />
  )
}
```

### 7.4: Register Locked Config in LoveLockedModal

In `src/lib/themes/themeComponents.tsx`, import and add to `themeConfig`:

```tsx
import { yourthemeLockedConfig } from './yourtheme/modals';

// In LoveLockedModal's themeConfig object
const themeConfig = {
  // ... existing themes
  yourtheme: yourthemeLockedConfig,  // ADD THIS
};
```

### Modal Files Reference

| File | Location | Purpose |
|------|----------|---------|
| `modals.tsx` | `themes/{theme}/` | Theme-specific surprise modal |
| `shared/types.ts` | `themes/shared/` | Shared modal interfaces |
| `DaySurpriseModal.tsx` | `components/calendar/` | Routes to theme modals |
| `themeComponents.tsx` | `themes/` | Contains `LoveLockedModal` + legacy modals |

---

## Verification Checklist

- [ ] **Folder Structure**: Folder contains `config.tsx`, `decorations.tsx`, and `index.tsx`.
- [ ] **Extension**: Entry point is `.tsx` (not `.ts`).
- [ ] **Types**: Theme ID added to `ThemeId` type in `types.ts`.
- [ ] **Registry**: Theme is imported and added to `getThemeConfig`.
- [ ] **Page Renderers**: Theme ID added to `isPremiumTheme` in BOTH:
  - [ ] `CalendarioDetalhe.tsx` (line ~182)
  - [ ] `VisualizarCalendario.tsx` (lines ~624 AND ~988)
- [ ] **Colors**: `numberClass` is defined in `config.tsx` to prevent red/rose overrides.
- [ ] **Visuals**: Decorations are subtle and don't block interaction.
- [ ] **Responsive**: Check layout on mobile vs desktop.
- [ ] **Modals**: Verify day content and locked modals work correctly.
- [ ] **Explorar**: Theme added to `BASE_THEMES` in `src/lib/offline/themes.ts`.
- [ ] **Mascot**: Image exists in `src/assets/` and mapped in `ThemedCalendarDemo.tsx`.

## Common Mistakes to Avoid

❌ **Direct Import**: Importing from `theme/config` instead of `theme` in the registry.
❌ **Hardcoded Colors**: Leaving `UniversalEnvelopeCard` components with default red classes (fix them in `config.tsx`).
❌ **Missing Page Registrations**: Forgetting to add the new theme ID to the `isPremiumTheme` check in both `CalendarioDetalhe.tsx` and `VisualizarCalendario.tsx`. **This causes the theme to render with fallback/default styling!**
❌ **Missing Types**: Forgetting to add theme ID to `ThemeId` in `types.ts`.
❌ **Z-Index**: Setting decorations z-index too high (should be `z-50` max for overlay, but `pointer-events-none` is mandatory).
❌ **Demo vs Shared Confusion**: Adding theme to `BASE_THEMES` but forgetting to add to `registry.tsx` (or vice versa).
❌ **Missing Mascot**: Theme appears in Explorar but demo crashes because mascot image isn't imported.
❌ **Modal Broken**: Theme renders but modals don't show or show wrong styling - verify modal conditions include new theme.
