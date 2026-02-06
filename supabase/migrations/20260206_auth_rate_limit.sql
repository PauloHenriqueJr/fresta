-- Migration: Auth rate limiting (magic link send)
-- Date: 2026-02-06
--
-- Purpose:
-- - Prevent accidental/deliberate email spam from repeated `signInWithOtp` calls.
-- - Supports the client RPC calls used in `src/state/auth/AuthProvider.tsx`:
--   - `check_rate_limit(p_identifier)`
--   - `record_login_attempt(p_identifier, p_success, p_attempt_type)`

-- ==========================
-- 1) LOGIN ATTEMPTS TABLE
-- ==========================

CREATE TABLE IF NOT EXISTS public.login_attempts (
  id bigserial PRIMARY KEY,
  identifier text NOT NULL,
  attempt_type text NOT NULL DEFAULT 'email',
  success boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_identifier_created_at
  ON public.login_attempts(identifier, created_at DESC);

-- Do not expose raw attempts publicly.
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- ==========================
-- 2) RPC: CHECK RATE LIMIT
-- ==========================

-- Returns a JSON object:
-- { allowed: boolean, attempts: int, max_attempts: int, remaining_seconds: int }
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_window_seconds integer DEFAULT 3600, -- 1 hour
  p_max_attempts integer DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  v_attempts integer;
  v_oldest timestamptz;
  v_remaining integer;
BEGIN
  IF p_identifier IS NULL OR length(trim(p_identifier)) = 0 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'attempts', 0,
      'max_attempts', p_max_attempts,
      'remaining_seconds', p_window_seconds
    );
  END IF;

  SELECT count(*), min(created_at)
    INTO v_attempts, v_oldest
  FROM public.login_attempts
  WHERE identifier = lower(trim(p_identifier))
    AND created_at > now() - make_interval(secs => p_window_seconds);

  IF v_attempts >= p_max_attempts THEN
    v_remaining := GREATEST(
      0,
      p_window_seconds - EXTRACT(EPOCH FROM (now() - v_oldest))::int
    );

    RETURN jsonb_build_object(
      'allowed', false,
      'attempts', v_attempts,
      'max_attempts', p_max_attempts,
      'remaining_seconds', v_remaining
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'attempts', v_attempts,
    'max_attempts', p_max_attempts,
    'remaining_seconds', 0
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO authenticated;

-- ==========================
-- 3) RPC: RECORD LOGIN ATTEMPT
-- ==========================

CREATE OR REPLACE FUNCTION public.record_login_attempt(
  p_identifier text,
  p_success boolean,
  p_attempt_type text DEFAULT 'email'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  IF p_identifier IS NULL OR length(trim(p_identifier)) = 0 THEN
    RETURN;
  END IF;

  INSERT INTO public.login_attempts(identifier, attempt_type, success)
  VALUES (lower(trim(p_identifier)), coalesce(p_attempt_type, 'email'), coalesce(p_success, false));
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_login_attempt(text, boolean, text) TO anon;
GRANT EXECUTE ON FUNCTION public.record_login_attempt(text, boolean, text) TO authenticated;
