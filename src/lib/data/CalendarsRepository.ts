// @ts-nocheck
import { supabase } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/types";

export type Calendar = Tables<'calendars'>;
export type CalendarDay = Tables<'calendar_days'>;
type InsertCalendar = InsertTables<'calendars'>;
type UpdateCalendar = UpdateTables<'calendars'>;

export const CalendarsRepository = {
  // List calendars for current user
  async listByOwner(ownerId: string): Promise<Calendar[]> {
    console.log('CalendarsRepository.listByOwner: Request started for', ownerId);
    
    try {
      const { data, error } = await (supabase
        .from('calendars') as any)
        .select('*, primary_color, secondary_color, background_url, header_message, footer_message, capsule_title, capsule_message, locked_title, locked_message')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('CalendarsRepository.listByOwner: Erro ao buscar calendários', error.message);
        throw error;
      }
      console.log('CalendarsRepository.listByOwner: Request finished, found', data?.length ?? 0, 'calendars');
      return data ?? [];
    } catch (err) {
      console.error('CalendarsRepository.listByOwner: Fatal error', err);
      throw err;
    }
  },

  // Get single calendar by ID
  async getById(id: string): Promise<Calendar | null> {
    console.log('CalendarsRepository.getById:', id);
    const { data, error } = await supabase
      .from('calendars')
      .select('*, primary_color, secondary_color, background_url, header_message, footer_message, capsule_title, capsule_message, locked_title, locked_message')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('CalendarsRepository.getById: Erro', error.message);
      throw error;
    }
    return data;
  },

  // Get calendar with days
  async getWithDays(id: string): Promise<{ calendar: Calendar; days: CalendarDay[] } | null> {
    console.log('CalendarsRepository.getWithDays:', id);
    const { data: calendar, error: calError } = await supabase
      .from('calendars')
      .select('*, primary_color, secondary_color, background_url, header_message, footer_message, capsule_title, capsule_message, locked_title, locked_message')
      .eq('id', id)
      .single();
    
    if (calError) {
      if (calError.code === 'PGRST116') return null;
      console.error('CalendarsRepository.getWithDays: Erro no calendário', calError.message);
      throw calError;
    }

    const { data: days, error: daysError } = await supabase
      .from('calendar_days')
      .select('*')
      .eq('calendar_id', id)
      .order('day', { ascending: true });
    
    if (daysError) {
      console.error('CalendarsRepository.getWithDays: Erro nos dias', daysError.message);
      throw daysError;
    }

    return { calendar, days: days ?? [] };
  },

  // Get public calendar (for /c/:id)
  async getPublic(id: string): Promise<{ calendar: Calendar; days: CalendarDay[] } | null> {
    console.log('CalendarsRepository.getPublic:', id);
    
    // 1. Fetch the calendar record first
    const { data: calendars, error: calError } = await supabase
      .from('calendars')
      .select('*')
      .eq('id', id)
      .limit(1);
    
    const calendar = calendars?.[0];

    if (calError || !calendar) {
      if (calError?.code === 'PGRST116' || !calendar) return null;
      console.error('CalendarsRepository.getPublic: Calendar error', calError);
      throw calError;
    }

    // 2. Fetch owner's profile separately
    const { data: profiles } = await supabase
      .from('profiles')
      .select('display_name, avatar')
      .eq('id', calendar.owner_id)
      .limit(1);

    const profile = profiles?.[0];

    // 3. Fetch owner's subscription separately
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', calendar.owner_id);

    // 4. Fetch owner's role to check if admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', calendar.owner_id)
      .limit(1);
    
    const ownerRole = userRoles?.[0]?.role || 'user';

    // Merge into the expected structure for the UI
    const calendarWithData = {
      ...calendar,
      profiles: profile ? {
        ...profile,
        subscriptions: subscriptions ?? [],
        role: ownerRole
      } : null
    };

    const { data: days, error: daysError } = await supabase
      .from('calendar_days')
      .select('*')
      .eq('calendar_id', id)
      .order('day', { ascending: true });
    
    if (daysError) {
      console.error('CalendarsRepository.getPublic: Days error', daysError);
      throw daysError;
    }

    return { calendar: calendarWithData as any, days: days ?? [] };
  },

  // Increment view count
  async incrementViews(calendarId: string): Promise<void> {
    console.log('CalendarsRepository.incrementViews:', calendarId);
    await supabase.rpc('increment_calendar_views', { _calendar_id: calendarId });
  },

  // List public calendars (for /explorar)
  async listPublic(limit = 20): Promise<any[]> {
    console.log('CalendarsRepository.listPublic: Fetching public calendars');
    const { data, error } = await supabase
      .from('calendars')
      .select('*, profiles:owner_id(display_name, avatar)')
      .eq('privacy', 'public')
      .eq('status', 'ativo')
      .order('views', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('CalendarsRepository.listPublic: Error', error);
      throw error;
    }
    console.log('CalendarsRepository.listPublic: Found', data?.length ?? 0, 'calendars');
    return data ?? [];
  },

  // Create calendar with days - NO TIMEOUT, Supabase handles it
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
    status?: 'ativo' | 'aguardando_pagamento' | 'cancelado';
    isPremium?: boolean;
  }): Promise<Calendar> {
    console.log('CalendarsRepository.create: Fetching theme defaults for', input.themeId);
    
    const { data: themeDefaults, error: defaultsError } = await supabase
      .from('theme_defaults')
      .select('*')
      .eq('theme_id', input.themeId)
      .single();

    if (defaultsError) {
      console.warn('CalendarsRepository.create: Could not fetch theme defaults, using fallback', defaultsError);
    }

    // Create calendar
    const { data: calendar, error: calError } = await supabase
      .from('calendars')
      .insert({
        owner_id: input.ownerId,
        title: input.title || themeDefaults?.default_title || 'Cápsula do Tempo',
        theme_id: input.themeId,
        duration: input.duration,
        privacy: input.privacy,
        password: input.password,
        start_date: input.startDate,
        status: input.status || 'ativo',
        primary_color: input.primary_color,
        secondary_color: input.secondary_color,
        background_url: input.background_url,
        header_message: themeDefaults?.default_header_message,
        footer_message: themeDefaults?.default_footer_message,
        capsule_title: themeDefaults?.default_capsule_title,
        capsule_message: themeDefaults?.default_capsule_message,
        locked_title: themeDefaults?.default_locked_title,
        locked_message: themeDefaults?.default_locked_message,
        is_premium: input.isPremium || false,
      })
      .select()
      .single();

    console.log('CalendarsRepository.create: Calendar insert result', { calendar, calError });
    
    if (calError) {
      console.error('CalendarsRepository.create: Falha ao inserir calendário', calError.message);
      throw calError;
    }

    // Create days
    const days = Array.from({ length: input.duration }, (_, i) => ({
      calendar_id: calendar.id,
      day: i + 1,
    }));

    console.log('CalendarsRepository.create: Inserting', days.length, 'days');

    const { error: daysError } = await supabase
      .from('calendar_days')
      .insert(days);
    
    if (daysError) {
      console.error('CalendarsRepository.create: Days insert failed, rolling back', daysError);
      // Rollback - delete the calendar we just created
      await supabase.from('calendars').delete().eq('id', calendar.id);
      throw daysError;
    }

    console.log('CalendarsRepository.create: Success!', calendar.id);
    return calendar;
  },

  // Update calendar
  async update(id: string, patch: UpdateCalendar): Promise<Calendar> {
    console.log('CalendarsRepository.update:', id, patch);
    const { data, error } = await supabase
      .from('calendars')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('CalendarsRepository.update: Error', error);
      throw error;
    }
    return data;
  },

  // Delete calendar
  async delete(id: string): Promise<void> {
    console.log('CalendarsRepository.delete:', id);
    const { error } = await supabase
      .from('calendars')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('CalendarsRepository.delete: Error', error);
      throw error;
    }
    console.log('CalendarsRepository.delete: Success');
  },

  // Update day content
  async updateDay(calendarId: string, day: number, content: {
    contentType?: 'text' | 'photo' | 'gif' | 'link' | 'music' | null;
    message?: string | null;
    url?: string | null;
    label?: string | null;
  }): Promise<CalendarDay> {
    console.log('CalendarsRepository.updateDay:', calendarId, 'day', day, content);
    const { url } = content;
    let contentTypeToSave = content.contentType;

    if (url) {
      const isVideo = url.includes('tiktok.com') || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com');
      const isMusic = url.includes('spotify.com');

      if (isVideo) {
        contentTypeToSave = 'video';
      } else if (isMusic || content.contentType === 'music') {
        // Use 'link' for database to avoid enum errors, UI will still detect spotify
        contentTypeToSave = 'link';
      }
    } else if (content.contentType === 'music') {
      contentTypeToSave = 'text';
    }

    const { data, error } = await supabase
      .from('calendar_days')
      .update({
        content_type: contentTypeToSave as any,
        message: content.message,
        url: content.url,
        label: content.label,
      })
      .eq('calendar_id', calendarId)
      .eq('day', day)
      .select()
      .single();
    
    if (error) {
      console.error('CalendarsRepository.updateDay: Error', error);
      throw error;
    }
    return data;
  },

  // Get day by calendar and day number
  async getDay(calendarId: string, day: number): Promise<CalendarDay | null> {
    console.log('CalendarsRepository.getDay:', calendarId, 'day', day);
    const { data, error } = await supabase
      .from('calendar_days')
      .select('*')
      .eq('calendar_id', calendarId)
      .eq('day', day)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('CalendarsRepository.getDay: Error', error);
      throw error;
    }
    return data;
  },

  // Increment share count
  async incrementShares(calendarId: string): Promise<void> {
    console.log('CalendarsRepository.incrementShares:', calendarId);
    await supabase.rpc('increment_calendar_shares', { _calendar_id: calendarId });
  },

  // Increment day opened count
  async incrementDayOpened(dayId: string): Promise<void> {
    console.log('CalendarsRepository.incrementDayOpened:', dayId);
    const { error } = await supabase.rpc('increment_day_opened', { _day_id: dayId });
    if (error) {
      console.error('CalendarsRepository.incrementDayOpened ERROR:', error);
    } else {
      console.log('CalendarsRepository.incrementDayOpened SUCCESS');
    }
  },

  // Get user-wide stats
  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('calendars')
      .select('views, likes, shares, status')
      .eq('owner_id', userId);
    
    if (error) throw error;

    const calendars = data || [];
    const activeCalendars = calendars.filter((c: any) => c.status === 'ativo').length;
    
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

    if (error) {
      console.error('CalendarsRepository.uploadMedia: Error', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('calendar-media')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async deleteMedia(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('calendar-media')
      .remove([path]);

    if (error) {
      console.error('CalendarsRepository.deleteMedia: Error', error);
      throw error;
    }
  }
};
