import { PlusThemeConfig } from "./types";
import { namoroTheme } from "./namoro";
import { aniversarioTheme } from "./aniversario";
import { saojoaoTheme } from "./saojoao";
import { pascoaTheme } from "./pascoa";
import { carnavalTheme } from "./carnaval";
import { natalTheme } from "./natal";
import { weddingTheme } from "./casamento";
import { reveillonTheme } from "./reveillon";
import { diadasmaesTheme } from "./diadasmaes";
import { diadospaisTheme } from "./diadospais";
import { metasTheme } from "./metas";

// Interface and ID exports for backward compatibility if needed elsewhere
export { PLUS_THEME_IDS } from "./types";
export type { ThemeId, PlusThemeConfig } from "./types";

// Re-export specific themes for direct access
export {
  namoroTheme,
  aniversarioTheme,
  saojoaoTheme,
  pascoaTheme,
  carnavalTheme,
  natalTheme,
  weddingTheme,
  reveillonTheme,
  diadasmaesTheme,
  diadospaisTheme,
  metasTheme
};

/**
 * Get theme configuration by ID
 * Dynamically switches to the modular theme configurations
 */
export const getThemeConfig = (themeId: string): PlusThemeConfig => {
  switch (themeId) {
    case 'natal': return natalTheme;
    case 'casamento': return weddingTheme;
    case 'namoro': return namoroTheme;
    case 'carnaval': return carnavalTheme;
    case 'saojoao': return saojoaoTheme;
    case 'aniversario': return aniversarioTheme;
    case 'pascoa': return pascoaTheme;
    case 'reveillon': return reveillonTheme;
    case 'diadasmaes': return diadasmaesTheme;
    case 'diadospais': return diadospaisTheme;
    case 'metas': return metasTheme;
    default: return aniversarioTheme; // Changed default to aniversario (free, universal)
  }
};
