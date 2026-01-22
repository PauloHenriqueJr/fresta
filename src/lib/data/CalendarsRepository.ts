import { supabase } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/types";

type Calendar = Tables<'calendars'>;
type CalendarDay = Tables<'calendar_days'>;
type InsertCalendar = InsertTables<'calendars'>;
type UpdateCalendar = UpdateTables<'calendars'>;

export const CalendarsRepository = {
  // List calendars for current user
  async listByOwner(ownerId: string): Promise<Calendar[]> {
    console.log('CalendarsRepository.listByOwner: Request started for', ownerId);
    
    try {
      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('CalendarsRepository.listByOwner: Supabase error', error);
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
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('CalendarsRepository.getById: Error', error);
      throw error;
    }
    return data;
  },

  // Get calendar with days
  async getWithDays(id: string): Promise<{ calendar: Calendar; days: CalendarDay[] } | null> {
    console.log('CalendarsRepository.getWithDays:', id);
    const { data: calendar, error: calError } = await supabase
      .from('calendars')
      .select('*')
      .eq('id', id)
      .single();
    
    if (calError) {
      if (calError.code === 'PGRST116') return null;
      console.error('CalendarsRepository.getWithDays: Calendar error', calError);
      throw calError;
    }

    const { data: days, error: daysError } = await supabase
      .from('calendar_days')
      .select('*')
      .eq('calendar_id', id)
      .order('day', { ascending: true });
    
    if (daysError) {
      console.error('CalendarsRepository.getWithDays: Days error', daysError);
      throw daysError;
    }

    return { calendar, days: days ?? [] };
  },

  // Get public calendar (for /c/:id)
  async getPublic(id: string): Promise<{ calendar: Calendar; days: CalendarDay[] } | null> {
    console.log('CalendarsRepository.getPublic:', id);
    const { data: calendar, error: calError } = await supabase
      .from('calendars')
      .select('*')
      .eq('id', id)
      .eq('privacy', 'public')
      .single();
    
    if (calError) {
      if (calError.code === 'PGRST116') return null;
      console.error('CalendarsRepository.getPublic: Calendar error', calError);
      throw calError;
    }

    const { data: days, error: daysError } = await supabase
      .from('calendar_days')
      .select('*')
      .eq('calendar_id', id)
      .order('day', { ascending: true });
    
    if (daysError) {
      console.error('CalendarsRepository.getPublic: Days error', daysError);
      throw daysError;
    }

    // Increment views (fire and forget)
    supabase.rpc('increment_calendar_views', { _calendar_id: id });

    return { calendar, days: days ?? [] };
  },

  // List public calendars (for /explorar)
  async listPublic(limit = 20): Promise<Calendar[]> {
    console.log('CalendarsRepository.listPublic: Fetching public calendars');
    const { data, error } = await supabase
      .from('calendars')
      .select('*')
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
  }): Promise<Calendar> {
    console.log('CalendarsRepository.create: Starting insert', input);

    // Create calendar
    const { data: calendar, error: calError } = await supabase
      .from('calendars')
      .insert({
        owner_id: input.ownerId,
        title: input.title,
        theme_id: input.themeId,
        duration: input.duration,
        privacy: input.privacy,
        start_date: input.startDate,
        status: 'rascunho',
      })
      .select()
      .single();

    console.log('CalendarsRepository.create: Calendar insert result', { calendar, calError });
    
    if (calError) {
      console.error('CalendarsRepository.create: Calendar insert failed', calError);
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
    contentType?: 'text' | 'photo' | 'gif' | 'link' | null;
    message?: string | null;
    url?: string | null;
    label?: string | null;
  }): Promise<CalendarDay> {
    console.log('CalendarsRepository.updateDay:', calendarId, 'day', day, content);
    const { data, error } = await supabase
      .from('calendar_days')
      .update({
        content_type: content.contentType,
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
    await supabase.rpc('increment_day_opened', { _day_id: dayId });
  },

  // Get user-wide stats
  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('calendars')
      .select('views, likes, shares')
      .eq('owner_id', userId);
    
    if (error) throw error;

    const totals = (data || []).reduce((acc, curr) => ({
      views: acc.views + (curr.views || 0),
      likes: acc.likes + (curr.likes || 0),
      shares: acc.shares + (curr.shares || 0),
    }), { views: 0, likes: 0, shares: 0 });

    return {
      totalCalendars: data?.length || 0,
      ...totals
    };
  }
};
