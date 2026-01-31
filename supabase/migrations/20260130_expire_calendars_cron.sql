-- Migration: Cron Job for Calendar Expiration
-- Marca calendários Free expirados como 'expired'
-- Date: 2026-01-30

-- 1. Criar função que marca calendários expirados
CREATE OR REPLACE FUNCTION expire_free_calendars()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  -- Marca calendários free que passaram da data de expiração
  UPDATE calendars 
  SET status = 'expired'
  WHERE 
    (is_premium = false OR is_premium IS NULL)
    AND expires_at IS NOT NULL
    AND expires_at < NOW()
    AND status != 'expired';
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Log para auditoria (opcional)
  INSERT INTO audit_logs (action, details, created_at)
  VALUES (
    'expire_calendars',
    jsonb_build_object('expired_count', expired_count),
    NOW()
  )
  ON CONFLICT DO NOTHING;
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar extensão pg_cron se não existir (requer superuser)
-- Nota: No Supabase, pg_cron já está disponível
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3. Agendar job diário às 3:00 AM (horário UTC)
-- Nota: Execute isso manualmente no Supabase Dashboard > SQL Editor
-- SELECT cron.schedule(
--   'expire-free-calendars',
--   '0 3 * * *',
--   'SELECT expire_free_calendars()'
-- );

-- 4. Para verificar jobs agendados:
-- SELECT * FROM cron.job;

-- 5. Para remover um job:
-- SELECT cron.unschedule('expire-free-calendars');

-- Teste manual da função:
-- SELECT expire_free_calendars();
