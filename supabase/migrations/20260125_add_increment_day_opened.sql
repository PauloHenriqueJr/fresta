-- Migration: Create tracking RPC functions
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- ============================================
-- 0. ENSURE opened_count COLUMN EXISTS
-- ============================================
ALTER TABLE public.calendar_days 
ADD COLUMN IF NOT EXISTS opened_count integer DEFAULT 0;

-- ============================================
-- 1. INCREMENT DAY OPENED COUNT
-- This is called when a visitor opens a door
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_day_opened(_day_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.calendar_days
  SET opened_count = COALESCE(opened_count, 0) + 1
  WHERE id = _day_id;
END;
$$;

-- ============================================
-- 2. INCREMENT CALENDAR VIEWS
-- This is called when someone views a calendar
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_calendar_views(_calendar_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.calendars
  SET views = COALESCE(views, 0) + 1
  WHERE id = _calendar_id;
END;
$$;

-- ============================================
-- 3. INCREMENT CALENDAR SHARES
-- This is called when someone shares a calendar
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_calendar_shares(_calendar_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.calendars
  SET shares = COALESCE(shares, 0) + 1
  WHERE id = _calendar_id;
END;
$$;

-- ============================================
-- GRANT PERMISSIONS
-- Allow anonymous and authenticated users to call these functions
-- ============================================
GRANT EXECUTE ON FUNCTION public.increment_day_opened(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_day_opened(uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.increment_calendar_views(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_calendar_views(uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.increment_calendar_shares(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_calendar_shares(uuid) TO authenticated;
