import { supabase } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/types";

export type Calendar = Tables<'calendars'>;
export type CalendarDay = Tables<'calendar_days'>;
type UpdateCalendar = UpdateTables<'calendars'>;

export const CalendarsRepository = {
  // List calendars for current user
  async listByOwner(ownerId: string): Promise<(Calendar & { orders?: any[] })[]> {
    try {
      const { data, error } = await (supabase
        .from('calendars') as any)
        .select('*, primary_color, secondary_color, background_url, header_message, footer_message, capsule_title, capsule_message, locked_title, locked_message, orders(id, status, expires_at)')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as any) ?? [];
    } catch (err) {
      console.error('CalendarsRepository.listByOwner:', err);
      throw err;
    }
  },

  // Get single calendar by ID
  async getById(id: string): Promise<(Calendar & { orders?: any[] }) | null> {
    const { data, error } = await (supabase
      .from('calendars') as any)
      .select('*, primary_color, secondary_color, background_url, header_message, footer_message, capsule_title, capsule_message, locked_title, locked_message, orders(id, status, expires_at)')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as any;
  },

  // Get calendar with days
  async getWithDays(id: string): Promise<{ calendar: Calendar & { orders?: any[] }; days: CalendarDay[] } | null> {
    const { data: calendar, error: calError } = await (supabase
      .from('calendars') as any)
      .select('*, primary_color, secondary_color, background_url, header_message, footer_message, capsule_title, capsule_message, locked_title, locked_message, orders(id, status, expires_at)')
      .eq('id', id)
      .single();
    
    if (calError) {
      if (calError.code === 'PGRST116') return null;
      throw calError;
    }

    const { data: days, error: daysError } = await (supabase
      .from('calendar_days') as any)
      .select('*')
      .eq('calendar_id', id)
      .order('day', { ascending: true });
    
    if (daysError) throw daysError;

    return { calendar: calendar as any, days: (days as any) ?? [] };
  },

  // Get public calendar (for /c/:id)
  async getPublic(id: string): Promise<{ calendar: Calendar & { orders?: any[] }; days: CalendarDay[] } | null> {
    const { data: calendars, error: calError } = await (supabase
      .from('calendars') as any)
      .select('*, orders(id, status, expires_at)')
      .eq('id', id)
      .limit(1);
    
    const calendar = calendars?.[0];
    if (calError || !calendar) return null;

    // Use RPC function to get owner premium status (bypasses RLS for watermark check)
    const { data: ownerStatus, error: rpcError } = await (supabase.rpc as any)(
      'get_calendar_owner_premium_status',
      { calendar_id: id }
    );
    
    if (rpcError) {
      console.warn('[CalendarsRepository] Error fetching owner premium status:', rpcError);
    }

    const { data: days, error: daysError } = await (supabase
      .from('calendar_days') as any)
      .select('*')
      .eq('calendar_id', id)
      .order('day', { ascending: true });
    
    if (daysError) throw daysError;

    // Build profiles object from RPC result
    const ownerData = ownerStatus?.[0];
    const calendarWithData = {
      ...calendar,
      // Replace actual password with boolean flag (SECURITY: never send password to client)
      password: undefined,
      has_password: !!calendar.password && calendar.password.length > 0,
      profiles: {
        display_name: ownerData?.display_name || null,
        avatar: ownerData?.avatar || null,
        role: ownerData?.role || 'user',
        is_premium: ownerData?.is_premium || false
      }
    };

    return { calendar: calendarWithData as any, days: (days as any) ?? [] };
  },

  // Increment view count
  async incrementViews(calendarId: string): Promise<void> {
    await (supabase.rpc as any)('increment_calendar_views', { _calendar_id: calendarId });
  },

  // List public calendars (for /explorar)
  async listPublic(limit = 20): Promise<any[]> {
    const { data, error } = await (supabase
      .from('calendars') as any)
      .select('*, profiles:owner_id(display_name, avatar)')
      .eq('privacy', 'public')
      .eq('status', 'ativo')
      .order('views', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data as any) ?? [];
  },

  // Create calendar with days
  async create(input: {
    ownerId: string;
    title: string;
    themeId: string;
    duration: number;
    privacy: 'public' | 'private';
    startDate?: string;
    password?: string;
    primary_color?: string;
    secondary_color?: string;
    background_url?: string;
    status?: 'ativo' | 'rascunho' | 'finalizado' | 'aguardando_pagamento' | 'inativo';
    isPremium?: boolean;
  }): Promise<Calendar> {
    const { data: themeDefaults } = await (supabase
      .from('theme_defaults') as any)
      .select('*')
      .eq('theme_id', input.themeId)
      .single();

    // Create calendar
    const { data: calendar, error: calError } = await (supabase
      .from('calendars') as any)
      .insert({
        owner_id: input.ownerId,
        title: input.title || (themeDefaults as any)?.default_title || 'Cápsula do Tempo',
        theme_id: input.themeId,
        duration: input.duration,
        privacy: input.privacy,
        password: input.password,
        start_date: input.startDate,
        status: input.status || 'ativo',
        primary_color: input.primary_color,
        secondary_color: input.secondary_color,
        background_url: input.background_url,
        header_message: (themeDefaults as any)?.default_header_message,
        footer_message: (themeDefaults as any)?.default_footer_message,
        capsule_title: (themeDefaults as any)?.default_capsule_title,
        capsule_message: (themeDefaults as any)?.default_capsule_message,
        locked_title: (themeDefaults as any)?.default_locked_title,
        locked_message: (themeDefaults as any)?.default_locked_message,
        is_premium: input.isPremium || false,
      })
      .select()
      .single();
    
    if (calError || !calendar) throw calError || new Error("Falha ao criar calendário");

    // Create days
    const days = Array.from({ length: input.duration }, (_, i) => ({
      calendar_id: calendar.id,
      day: i + 1,
    }));

    const { error: daysError } = await (supabase
      .from('calendar_days') as any)
      .insert(days);
    
    if (daysError) {
      await (supabase.from('calendars') as any).delete().eq('id', calendar.id);
      throw daysError;
    }

    return calendar as any;
  },

  // Update calendar
  async update(id: string, patch: UpdateCalendar): Promise<Calendar> {
    const { data, error } = await (supabase
      .from('calendars') as any)
      .update(patch as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as any;
  },

  // Delete calendar
  async delete(id: string): Promise<void> {
    const { error } = await (supabase.from('calendars') as any).delete().eq('id', id);
    if (error) throw error;
  },

  // Update day content
  async updateDay(calendarId: string, day: number, content: {
    contentType?: 'text' | 'photo' | 'gif' | 'link' | 'music' | null;
    message?: string | null;
    url?: string | null;
    label?: string | null;
  }): Promise<CalendarDay> {
    const { data, error } = await (supabase
      .from('calendar_days') as any)
      .update({
        content_type: content.contentType as any,
        message: content.message,
        url: content.url,
        label: content.label,
      })
      .eq('calendar_id', calendarId)
      .eq('day', day)
      .select()
      .single();
    
    if (error) throw error;
    return data as any;
  },

  // Get day by calendar and day number
  async getDay(calendarId: string, day: number): Promise<CalendarDay | null> {
    const { data, error } = await (supabase
      .from('calendar_days') as any)
      .select('*')
      .eq('calendar_id', calendarId)
      .eq('day', day)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as any;
  },

  // Increment share count
  async incrementShares(calendarId: string): Promise<void> {
    await (supabase.rpc as any)('increment_calendar_shares', { _calendar_id: calendarId });
  },

  // Increment day opened count
  async incrementDayOpened(dayId: string): Promise<void> {
    await (supabase.rpc as any)('increment_day_opened', { _day_id: dayId });
  },

  // Get user-wide stats
  async getUserStats(userId: string) {
    const { data, error } = await (supabase
      .from('calendars') as any)
      .select('views, likes, shares, status')
      .eq('owner_id', userId);
    
    if (error) throw error;

    const calendars = (data as any[]) || [];
    const activeCalendars = calendars.filter(c => c.status === 'ativo').length;
    
    const totals = calendars.reduce((acc, curr) => ({
      views: acc.views + (curr.views || 0),
      likes: acc.likes + (curr.likes || 0),
      shares: acc.shares + (curr.shares || 0),
    }), { views: 0, likes: 0, shares: 0 });

    return {
      totalCalendars: calendars.length,
      activeCalendars,
      ...totals
    };
  },

  // Storage Methods
  async uploadMedia(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('calendar-media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('calendar-media')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async deleteMedia(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('calendar-media')
      .remove([path]);

    if (error) throw error;
  }
};
