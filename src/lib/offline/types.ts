export type ThemeScope = "common" | "b2c" | "b2b";

export type ThemeId =
  | "natal"
  | "reveillon"
  | "pascoa"
  | "carnaval"
  | "saojoao"
  | "independencia"
  | "diadasmaes"
  | "diadospais"
  | "diadascriancas"
  | "aniversario"
  | "viagem"
  | "estudos"
  | "metas"
  | "namoro"
  | "noivado"
  | "casamento"
  | "bodas"
  | "campanha_lancamento"
  | "campanha_promocao"
  | "rh_onboarding"
  | "endomarketing"
  | "comunidade"
  | "encontro_remoto"
  | "custom";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  emoji?: string;
  iconName: string;
  scope: ThemeScope;
  imageKey:
    | "peeking"
    | "noivado"
    | "bodas"
    | "carnaval"
    | "saojoao"
    | "natal"
    | "reveillon"
    | "pascoa"
    | "independencia"
    | "namoro"
    | "casamento"
    | "diadascriancas"
    | "diadasmaes"
    | "diadospais"
    | "viagem"
    | "metas"
    | "estudos"
    | "aniversario";
  gradientClass: "bg-gradient-festive" | "bg-gradient-carnaval" | "bg-gradient-saojoao" | "bg-gradient-romance" | "bg-gradient-wedding";
  description?: string;
  enabledByDefault?: boolean;
}

export type CalendarStatus = "ativo" | "rascunho" | "finalizado";
export type CalendarPrivacy = "public" | "private";

export type DayContentType = "text" | "photo" | "gif" | "link";

export type DayContent =
  | { type: "text"; message: string }
  | { type: "photo"; url: string }
  | { type: "gif"; url: string }
  | { type: "link"; url: string; label?: string };

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  avatar: string; // iconName
  createdAt: string;
}

export interface CalendarDay {
  day: number;
  content?: DayContent;
  openedCount?: number;
}

export interface CalendarEntity {
  id: string;
  ownerId: string;
  title: string;
  theme: ThemeId;
  status: CalendarStatus;
  privacy: CalendarPrivacy;
  duration: number;
  startDate?: string;
  days: CalendarDay[];
  stats: {
    views: number;
    likes: number;
    shares: number;
    updatedAt: string;
  };
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  createdAt: string;
}

// -----------------------
// B2B (offline MVP)
// -----------------------

export type B2BRole = "owner" | "admin" | "editor" | "analyst";

export interface B2BOrganization {
  id: string;
  ownerId: string;
  name: string;
  avatar: string; // iconName
  createdAt: string;
}

export interface B2BBranding {
  orgId: string;
  logoIconName: string;
  primaryHue: number; // 0-360 (documenta para futura migração)
  updatedAt: string;
}

export interface B2BMember {
  id: string;
  orgId: string;
  name: string;
  email: string;
  avatar: string; // iconName
  role: B2BRole;
  status: "active" | "invited";
  createdAt: string;
}

export interface B2BCampaign {
  id: string;
  orgId: string;
  title: string;
  theme: ThemeId;
  status: "draft" | "active" | "archived";
  startDate?: string;
  duration: number;
  createdAt: string;
  stats: {
    views: number;
    opens: number;
    leads: number;
    updatedAt: string;
  };
}

// -----------------------
// Admin (offline MVP)
// -----------------------

export type PlanInterval = "month" | "year";
export type PlanStatus = "active" | "archived";

export interface PricingPlanEntity {
  id: string;
  name: string;
  interval: PlanInterval;
  priceCents: number;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = "trialing" | "active" | "canceled";

export interface SubscriptionEntity {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startedAt: string;
  canceledAt?: string;
  updatedAt: string;
}
