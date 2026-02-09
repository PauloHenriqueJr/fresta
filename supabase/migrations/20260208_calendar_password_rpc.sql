-- Migration: Calendar Password Verification RPC
-- Date: 2026-02-08
-- Purpose: Move password verification to server-side to prevent password exposure in client

-- =====================
-- 1. CREATE PASSWORD VERIFICATION FUNCTION
-- =====================

-- Verifies if the provided password matches the calendar's password
-- Returns true if password is correct OR if calendar has no password
CREATE OR REPLACE FUNCTION verify_calendar_password(
  p_calendar_id uuid,
  p_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_calendar_password text;
  v_owner_id uuid;
BEGIN
  -- Get calendar password and owner
  SELECT password, owner_id INTO v_calendar_password, v_owner_id
  FROM calendars
  WHERE id = p_calendar_id;
  
  -- Calendar not found
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Calendar not found');
  END IF;
  
  -- No password set - always allow
  IF v_calendar_password IS NULL OR v_calendar_password = '' THEN
    RETURN jsonb_build_object('success', true, 'authorized', true);
  END IF;
  
  -- Owner always has access
  IF auth.uid() = v_owner_id THEN
    RETURN jsonb_build_object('success', true, 'authorized', true, 'is_owner', true);
  END IF;
  
  -- Check password match
  IF v_calendar_password = p_password THEN
    RETURN jsonb_build_object('success', true, 'authorized', true);
  ELSE
    RETURN jsonb_build_object('success', true, 'authorized', false, 'error', 'Invalid password');
  END IF;
END;
$$;

-- Grant execute to both anon and authenticated users
GRANT EXECUTE ON FUNCTION verify_calendar_password(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION verify_calendar_password(uuid, text) TO authenticated;

-- =====================
-- 2. MODIFY GETPUBLIC TO HIDE PASSWORD
-- =====================

-- Note: The client should NOT receive the actual password value
-- This is handled by modifying the select in CalendarsRepository to exclude password
-- OR by creating a view that masks the password field
-- For now, we rely on the RPC above for verification
