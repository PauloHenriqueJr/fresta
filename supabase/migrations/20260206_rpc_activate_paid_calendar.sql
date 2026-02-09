-- Migration: RPC to activate a paid calendar
-- Date: 2026-02-06
--
-- Used by: src/lib/services/payment.ts (activatePaidCalendar)
--
-- The frontend expects:
--   { success: boolean, calendarId?: string, error?: string }
--
-- Notes:
-- - This function does NOT mark orders as "paid". That should be done by a verified webhook/service role.
-- - This function only upgrades the calendar AFTER the order is already marked paid.

CREATE OR REPLACE FUNCTION public.activate_paid_calendar(_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  v_order record;
  v_user_id uuid;
  v_calendar_id uuid;
  v_addons jsonb := '[]'::jsonb;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not authenticated');
  END IF;

  SELECT *
    INTO v_order
  FROM public.orders
  WHERE id = _order_id
  LIMIT 1;

  IF v_order IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'order not found');
  END IF;

  -- Only the owner of the order can activate it (defense-in-depth)
  IF v_order.user_id IS DISTINCT FROM v_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'not authorized');
  END IF;

  IF v_order.status IS DISTINCT FROM 'paid' THEN
    RETURN jsonb_build_object('success', false, 'error', 'order not paid');
  END IF;

  v_calendar_id := v_order.calendar_id;
  IF v_calendar_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'order has no calendar');
  END IF;

  -- Build addons list from order items (best-effort).
  -- We keep the whole items payload as addons, since the app model is pay-per-calendar.
  v_addons := COALESCE(v_order.items, '[]'::jsonb);

  -- Upgrade calendar. Prefer existing helper if present; otherwise update directly.
  BEGIN
    PERFORM public.mark_calendar_premium(v_calendar_id, v_addons);
  EXCEPTION
    WHEN undefined_function THEN
      UPDATE public.calendars
      SET
        is_premium = true,
        addons = v_addons,
        expires_at = NULL,
        updated_at = now()
      WHERE id = v_calendar_id;
  END;

  RETURN jsonb_build_object('success', true, 'calendarId', v_calendar_id::text);
END;
$$;

GRANT EXECUTE ON FUNCTION public.activate_paid_calendar(uuid) TO authenticated;

