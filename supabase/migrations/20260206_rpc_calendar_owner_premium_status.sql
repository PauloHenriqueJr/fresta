-- Migration: Public calendar owner premium status RPC
-- Date: 2026-02-06
--
-- Used by: src/lib/data/CalendarsRepository.ts (getPublic)
-- Goal:
-- - Allow public viewers (/c/:id) to retrieve minimal owner info + premium status
--   without exposing private tables directly.

CREATE OR REPLACE FUNCTION public.get_calendar_owner_premium_status(calendar_id uuid)
RETURNS TABLE (
  display_name text,
  avatar text,
  role text,
  is_premium boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT
    p.display_name,
    p.avatar,
    COALESCE(ur.role::text, 'user') AS role,
    COALESCE(c.is_premium, false) AS is_premium
  FROM public.calendars c
  JOIN public.profiles p ON p.id = c.owner_id
  LEFT JOIN public.user_roles ur ON ur.user_id = c.owner_id
  WHERE c.id = calendar_id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_calendar_owner_premium_status(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_calendar_owner_premium_status(uuid) TO authenticated;

