// Theme configuration types for the Plus themes system
// This file contains all shared interfaces used across theme modules

import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Configuration interface for Plus (premium) themes.
 * Each theme module exports a config object that implements this interface.
 */
export interface PlusThemeConfig {
  id: string;
  content: {
    capsule: {
      title: string;
      message: string;
      icon: LucideIcon;
    };
    lockedModal: {
      title: string;
      message: string;
    };
    headerBadge?: {
      text: string;
      className: string;
    };
    usageTip?: string;
    tipTitle?: string;
    footerMessage: string;
    subtitle: string;
    editorSubtitle: string;
  };
  styles: {
    background?: {
      backgroundImage?: string;
      backgroundSize?: string;
      backgroundColor?: string;
    };
    card?: {
      locked?: {
        backgroundImage?: string;
        borderColor?: string;
        color?: string;
      };
      lockedIcon?: LucideIcon;
      boxShadow?: string;
    };
    [key: string]: any;
  };
  /** Component to render floating decorations (petals, hearts, snowflakes, etc.) */
  FloatingComponent?: React.ComponentType;
  ui?: ThemeUIConfig;
}

/**
 * UI configuration for theme visual elements
 */
export interface ThemeUIConfig {
  layout: {
    bgClass: string;
    bgSvg?: string;
    containerClass: string;
    headerWrapper: string;
    mainClass: string;
    messageFont?: string;
    titleFont?: string;
    secondaryFont?: string;
  };
  header: {
    container: string;
    title: string;
    subtitle: string;
    badge?: string;
    badgeText: string;
    badgeTextClass: string;
    backButton?: string;
  };
  actions?: {
    like?: {
      color?: string;
      bgColor?: string;
      borderColor?: string;
      likedColor?: string;
      likedBgColor?: string;
    };
    share?: {
      color?: string;
      bgColor?: string;
      borderColor?: string;
    };
  };
  progress: {
    container: string;
    label: string;
    labelText: string;
    barContainer: string;
    barFill: string;
    barShimmer: string;
  };
  cards: {
    envelope: {
      container: string;
      pattern: string;
      seal: string;
      button: string;
      buttonText: string;
      glowClass: string;
      borderClass: string;
      numberClass?: string;
    };
    locked: {
      container: string;
      style: React.CSSProperties;
      overlay: string;
      number: string;
      iconWrapper: string;
      iconClass: string;
      text: string;
      badge: string;
      borderClass: string;
    };
    unlocked: {
      container: string;
      imageOverlay: string;
      placeholderWrapper: string;
      placeholderPattern: React.CSSProperties;
      badge: string;
      iconWrapper: string;
      borderClass: string;
      bgClass: string;
    };
    empty: {
      container: string;
      number: string;
      iconWrapper: string;
      borderClass: string;
      bgClass: string;
    };
  };
  footer: {
    container: string;
    editorContainer: string;
    button: string;
    secondaryButton: string;
    message?: string;
    messageClass?: string;
  };
  editor?: {
    topBar: {
      container: string;
      backButton: string;
      modeText: string;
      badgeText: string;
      previewButtonActive: string;
      previewButtonInactive: string;
      settingsButton: string;
    };
    stats: {
      card: string;
      number: string;
      label: string;
    };
  };
  quote: {
    container: string;
    icon: string;
    title: string;
    text: string;
    fontClass?: string;
  };
  icons: {
    main: LucideIcon;
    locked: LucideIcon;
    open: LucideIcon;
    quote: LucideIcon;
    footer: LucideIcon | null;
    envelopeSeal?: LucideIcon;
  };
}

/**
 * Theme IDs for all available themes
 */
export type ThemeId = 
  | 'namoro' 
  | 'casamento' 
  | 'natal' 
  | 'carnaval' 
  | 'saojoao' 
  | 'pascoa' 
  | 'reveillon' 
  | 'aniversario'
  | 'noivado'
  | 'bodas'
  | 'diadasmaes'
  | 'diadospais'
  | 'metas';

/**
 * List of Plus (premium) theme IDs
 * NOTE: diadasmaes, diadospais, metas are FREE themes and NOT included here
 */
export const PLUS_THEME_IDS: ThemeId[] = [
  'namoro',
  'casamento',
  'natal',
  'carnaval',
  'saojoao',
  'pascoa',
  'reveillon',
  'aniversario'
];
