import type {
  B2BBranding,
  B2BCampaign,
  B2BMember,
  B2BOrganization,
  CalendarEntity,
  PricingPlanEntity,
  Profile,
  Session,
  SubscriptionEntity,
  ThemeDefinition,
  ThemeId,
} from "./types";
import { storageGet, storageSet } from "./storage";
import { BASE_THEMES } from "./themes";

const KEYS = {
  session: "fresta.session.v1",
  profiles: "fresta.profiles.v1",
  calendars: "fresta.calendars.v1",
  b2bOrg: "fresta.b2b.org.v1",
  b2bBranding: "fresta.b2b.branding.v1",
  b2bMembers: "fresta.b2b.members.v1",
  b2bCampaigns: "fresta.b2b.campaigns.v1",

  // admin/catalog
  themeCatalog: "fresta.catalog.themes.v1",
  pricingPlans: "fresta.billing.plans.v1",
  subscriptions: "fresta.billing.subscriptions.v1",
};

const nowIso = () => new Date().toISOString();

export const generateId = () => {
  // browser-safe uuid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cryptoAny: any = globalThis.crypto;
  if (cryptoAny?.randomUUID) return cryptoAny.randomUUID();
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
};

export const db = {
  // session
  getSession(): Session | null {
    return storageGet<Session | null>(KEYS.session, null);
  },
  setSession(session: Session | null) {
    storageSet(KEYS.session, session);
  },

  // profiles
  listProfiles(): Profile[] {
    return storageGet<Profile[]>(KEYS.profiles, []);
  },
  getProfileById(id: string): Profile | null {
    return db.listProfiles().find((p) => p.id === id) ?? null;
  },
  getProfileByEmail(email: string): Profile | null {
    return db.listProfiles().find((p) => p.email.toLowerCase() === email.toLowerCase()) ?? null;
  },
  upsertProfile(profile: Profile) {
    const all = db.listProfiles();
    const idx = all.findIndex((p) => p.id === profile.id);
    if (idx >= 0) all[idx] = profile;
    else all.push(profile);
    storageSet(KEYS.profiles, all);
  },

  // calendars
  listCalendars(): CalendarEntity[] {
    return storageGet<CalendarEntity[]>(KEYS.calendars, []);
  },
  getCalendar(id: string): CalendarEntity | null {
    return db.listCalendars().find((c) => c.id === id) ?? null;
  },
  listCalendarsByOwner(ownerId: string): CalendarEntity[] {
    return db.listCalendars().filter((c) => c.ownerId === ownerId);
  },
  upsertCalendar(calendar: CalendarEntity) {
    const all = db.listCalendars();
    const idx = all.findIndex((c) => c.id === calendar.id);
    if (idx >= 0) all[idx] = calendar;
    else all.push(calendar);
    storageSet(KEYS.calendars, all);
  },
  createCalendar(input: {
    ownerId: string;
    title: string;
    theme: ThemeId;
    duration: number;
    privacy: "public" | "private";
    startDate?: string;
  }): CalendarEntity {
    const id = generateId();
    const createdAt = nowIso();
    const calendar: CalendarEntity = {
      id,
      ownerId: input.ownerId,
      title: input.title,
      theme: input.theme,
      status: "rascunho",
      privacy: input.privacy,
      duration: input.duration,
      startDate: input.startDate || undefined,
      days: Array.from({ length: input.duration }, (_, i) => ({ day: i + 1 })),
      stats: { views: 0, likes: 0, shares: 0, updatedAt: createdAt },
      createdAt,
    };
    db.upsertCalendar(calendar);
    return calendar;
  },
  updateDayContent(calendarId: string, day: number, content: CalendarEntity["days"][number]["content"]) {
    const calendar = db.getCalendar(calendarId);
    if (!calendar) return;
    const days = calendar.days.map((d) => (d.day === day ? { ...d, content } : d));
    db.upsertCalendar({ ...calendar, days, stats: { ...calendar.stats, updatedAt: nowIso() } });
  },
  incrementView(calendarId: string) {
    const calendar = db.getCalendar(calendarId);
    if (!calendar) return;
    db.upsertCalendar({
      ...calendar,
      stats: { ...calendar.stats, views: calendar.stats.views + 1, updatedAt: nowIso() },
    });
  },
  incrementShare(calendarId: string) {
    const calendar = db.getCalendar(calendarId);
    if (!calendar) return;
    db.upsertCalendar({
      ...calendar,
      stats: { ...calendar.stats, shares: calendar.stats.shares + 1, updatedAt: nowIso() },
    });
  },

  // -----------------------
  // B2B (offline MVP)
  // -----------------------
  getB2BOrgByOwner(ownerId: string): B2BOrganization | null {
    return storageGet<B2BOrganization | null>(KEYS.b2bOrg, null)?.ownerId === ownerId
      ? storageGet<B2BOrganization | null>(KEYS.b2bOrg, null)
      : null;
  },
  ensureB2BOrg(ownerId: string, ownerEmail: string): B2BOrganization {
    const existing = storageGet<B2BOrganization | null>(KEYS.b2bOrg, null);
    if (existing && existing.ownerId === ownerId) return existing;
    const createdAt = nowIso();
    const org: B2BOrganization = {
      id: generateId(),
      ownerId,
      name: "Minha Empresa",
      avatar: "🏢",
      createdAt,
    };
    storageSet(KEYS.b2bOrg, org);

    // default branding
    const branding: B2BBranding = {
      orgId: org.id,
      logoEmoji: "🏢",
      primaryHue: 145,
      updatedAt: createdAt,
    };
    storageSet(KEYS.b2bBranding, branding);

    // default member (owner)
    const member: B2BMember = {
      id: generateId(),
      orgId: org.id,
      name: "Owner",
      email: ownerEmail,
      avatar: "🧑‍💼",
      role: "owner",
      status: "active",
      createdAt,
    };
    storageSet(KEYS.b2bMembers, [member]);
    storageSet(KEYS.b2bCampaigns, [] as B2BCampaign[]);
    return org;
  },
  getB2BBranding(orgId: string): B2BBranding {
    const existing = storageGet<B2BBranding | null>(KEYS.b2bBranding, null);
    if (existing && existing.orgId === orgId) return existing;
    return { orgId, logoEmoji: "🏢", primaryHue: 145, updatedAt: nowIso() };
  },
  updateB2BBranding(orgId: string, patch: Partial<Pick<B2BBranding, "logoEmoji" | "primaryHue">>) {
    const current = db.getB2BBranding(orgId);
    const updated: B2BBranding = { ...current, ...patch, updatedAt: nowIso() };
    storageSet(KEYS.b2bBranding, updated);
  },
  listB2BMembers(orgId: string): B2BMember[] {
    return storageGet<B2BMember[]>(KEYS.b2bMembers, []).filter((m) => m.orgId === orgId);
  },
  inviteB2BMember(orgId: string, input: { name: string; email: string; role: B2BMember["role"]; avatar: string }) {
    const all = storageGet<B2BMember[]>(KEYS.b2bMembers, []);
    const member: B2BMember = {
      id: generateId(),
      orgId,
      name: input.name,
      email: input.email,
      role: input.role,
      avatar: input.avatar,
      status: "invited",
      createdAt: nowIso(),
    };
    storageSet(KEYS.b2bMembers, [...all, member]);
    return member;
  },
  listB2BCampaigns(orgId: string): B2BCampaign[] {
    return storageGet<B2BCampaign[]>(KEYS.b2bCampaigns, []).filter((c) => c.orgId === orgId);
  },
  getB2BCampaign(id: string): B2BCampaign | null {
    return storageGet<B2BCampaign[]>(KEYS.b2bCampaigns, []).find((c) => c.id === id) ?? null;
  },
  createB2BCampaign(input: {
    orgId: string;
    title: string;
    theme: ThemeId;
    duration: number;
    startDate?: string;
  }): B2BCampaign {
    const createdAt = nowIso();
    const campaign: B2BCampaign = {
      id: generateId(),
      orgId: input.orgId,
      title: input.title,
      theme: input.theme,
      status: "draft",
      duration: input.duration,
      startDate: input.startDate || undefined,
      createdAt,
      stats: { views: 0, opens: 0, leads: 0, updatedAt: createdAt },
    };
    const all = storageGet<B2BCampaign[]>(KEYS.b2bCampaigns, []);
    storageSet(KEYS.b2bCampaigns, [...all, campaign]);
    return campaign;
  },
  updateB2BCampaign(id: string, patch: Partial<Pick<B2BCampaign, "title" | "status" | "startDate" | "duration" | "theme">>) {
    const all = storageGet<B2BCampaign[]>(KEYS.b2bCampaigns, []);
    const idx = all.findIndex((c) => c.id === id);
    if (idx < 0) return;
    all[idx] = { ...all[idx], ...patch, stats: { ...all[idx].stats, updatedAt: nowIso() } };
    storageSet(KEYS.b2bCampaigns, all);
  },

  // -----------------------
  // Catálogo de temas (offline)
  // -----------------------
  listThemes(): ThemeDefinition[] {
    const overrides = storageGet<Record<string, Partial<ThemeDefinition>>>(KEYS.themeCatalog, {});
    return BASE_THEMES.map((t) => ({ ...t, ...(overrides[t.id] ?? {}) }));
  },
  updateTheme(id: ThemeId, patch: Partial<Pick<ThemeDefinition, "name" | "emoji" | "scope" | "enabledByDefault" | "description">>) {
    const overrides = storageGet<Record<string, Partial<ThemeDefinition>>>(KEYS.themeCatalog, {});
    storageSet(KEYS.themeCatalog, { ...overrides, [id]: { ...(overrides[id] ?? {}), ...patch } });
  },

  // -----------------------
  // Billing (mock/offline)
  // -----------------------
  listPlans(): PricingPlanEntity[] {
    const existing = storageGet<PricingPlanEntity[]>(KEYS.pricingPlans, []);
    if (existing.length > 0) return existing;

    const createdAt = nowIso();
    const seed: PricingPlanEntity[] = [
      {
        id: "plan_basic_month",
        name: "Basic",
        interval: "month",
        priceCents: 1990,
        status: "active",
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: "plan_pro_month",
        name: "Pro",
        interval: "month",
        priceCents: 4990,
        status: "active",
        createdAt,
        updatedAt: createdAt,
      },
    ];
    storageSet(KEYS.pricingPlans, seed);
    return seed;
  },
  upsertPlan(plan: PricingPlanEntity) {
    const all = storageGet<PricingPlanEntity[]>(KEYS.pricingPlans, []);
    const idx = all.findIndex((p) => p.id === plan.id);
    if (idx >= 0) all[idx] = { ...plan, updatedAt: nowIso() };
    else all.push({ ...plan, createdAt: plan.createdAt || nowIso(), updatedAt: nowIso() });
    storageSet(KEYS.pricingPlans, all);
  },
  listSubscriptions(): SubscriptionEntity[] {
    return storageGet<SubscriptionEntity[]>(KEYS.subscriptions, []);
  },
  upsertSubscription(sub: SubscriptionEntity) {
    const all = storageGet<SubscriptionEntity[]>(KEYS.subscriptions, []);
    const idx = all.findIndex((s) => s.id === sub.id);
    if (idx >= 0) all[idx] = { ...sub, updatedAt: nowIso() };
    else all.push({ ...sub, updatedAt: nowIso() });
    storageSet(KEYS.subscriptions, all);
  },
};
