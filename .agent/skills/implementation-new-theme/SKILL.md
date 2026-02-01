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
    default: return namoroTheme;
  }
};
```

---

## Verification Checklist

- [ ] **Folder Structure**: Folder contains `config.tsx`, `decorations.tsx`, and `index.tsx`.
- [ ] **Extension**: Entry point is `.tsx` (not `.ts`).
- [ ] **Registry**: Theme is imported and added to `getThemeConfig`.
- [ ] **Colors**: `numberClass` is defined in `config.tsx` to prevent red/rose overrides.
- [ ] **Visuals**: Decorations are subtle and don't block interaction.
- [ ] **Responsive**: Check layout on mobile vs desktop.

## Common Mistakes to Avoid

❌ **Direct Import**: Importing from `theme/config` instead of `theme` in the registry.
❌ **Hardcoded Colors**: Leaving `UniversalEnvelopeCard` components with default red classes (fix them in `config.tsx`).
❌ **Missing Imports**: Forgetting to add the new theme ID to the `isPlusTheme` check in both `CalendarioDetalhe.tsx` and `VisualizarCalendario.tsx`.
❌ **Z-Index**: Setting decorations z-index too high (should be `z-50` max for overlay, but `pointer-events-none` is mandatory).

