-- Migration: Admin RPC for real-time system stats
-- Date: 2026-02-06
--
-- Used by: src/lib/data/AdminRepository.ts (getSystemHealth)
-- Expected shape (frontend):
-- - active_connections: number
-- - db_size: string
-- - cache_hit_ratio: number

CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  v_is_admin boolean := false;
  v_active_connections integer := 0;
  v_db_size_bytes bigint := 0;
  v_cache_hit_ratio numeric := 0;
BEGIN
  -- Fail-closed: only admin users can read system stats
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT count(*)::int
    INTO v_active_connections
  FROM pg_stat_activity
  WHERE datname = current_database();

  SELECT pg_database_size(current_database())
    INTO v_db_size_bytes;

  -- Cache hit ratio (best-effort; avoid division by zero)
  SELECT
    CASE
      WHEN (sum(blks_hit) + sum(blks_read)) = 0 THEN 100
      ELSE round((sum(blks_hit)::numeric / (sum(blks_hit) + sum(blks_read))::numeric) * 100, 2)
    END
  INTO v_cache_hit_ratio
  FROM pg_stat_database
  WHERE datname = current_database();

  RETURN jsonb_build_object(
    'active_connections', v_active_connections,
    'db_size', pg_size_pretty(v_db_size_bytes),
    'cache_hit_ratio', v_cache_hit_ratio
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_system_stats() TO authenticated;

