-- Migration: Pay-Per-Calendar Model
-- Description: Adds fields for pay-per-calendar model with free/premium tiers
-- Date: 2026-01-29

-- =====================
-- 1. ADD CALENDAR FIELDS
-- =====================

-- is_premium: true if user paid for this calendar
ALTER TABLE calendars ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

-- addons: JSON array of purchased addons ['password_protection', 'ai_generator', 'pdf_kit']
ALTER TABLE calendars ADD COLUMN IF NOT EXISTS addons jsonb DEFAULT '[]'::jsonb;

-- expires_at: when free calendars expire (30 days from creation)
ALTER TABLE calendars ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- =====================
-- 2. ORDERS TABLE
-- =====================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  calendar_id uuid REFERENCES calendars(id) ON DELETE SET NULL,
  
  -- Payment info
  amount_cents integer NOT NULL,
  currency text DEFAULT 'BRL',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Gateway info (AbacatePay)
  gateway text DEFAULT 'abacatepay',
  gateway_payment_id text,
  gateway_checkout_url text,
  
  -- Items purchased
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [{"type": "premium", "price": 1490}, {"type": "addon_password", "price": 290}]
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Index for user order history
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Index for calendar orders
CREATE INDEX IF NOT EXISTS idx_orders_calendar_id ON orders(calendar_id);

-- Index for pending orders (for cleanup jobs)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status) WHERE status = 'pending';

-- =====================
-- 3. AUTO-EXPIRATION TRIGGER
-- =====================

-- Function to set expiration for free calendars
CREATE OR REPLACE FUNCTION set_calendar_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- If not premium, set expiration to 30 days from now
  IF NEW.is_premium = false OR NEW.is_premium IS NULL THEN
    NEW.expires_at := COALESCE(NEW.created_at, now()) + interval '30 days';
  ELSE
    -- Premium calendars never expire
    NEW.expires_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists (for idempotency)
DROP TRIGGER IF EXISTS calendar_expiration_trigger ON calendars;

-- Create trigger
CREATE TRIGGER calendar_expiration_trigger
  BEFORE INSERT OR UPDATE OF is_premium ON calendars
  FOR EACH ROW EXECUTE FUNCTION set_calendar_expiration();

-- =====================
-- 4. ADMIN USER SETUP
-- =====================

-- Ensure paulojack2011@gmail.com is admin
-- This assumes the user already exists in profiles
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get user ID from profiles by email
  SELECT id INTO admin_user_id FROM profiles WHERE email = 'paulojack2011@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Upsert admin role
    INSERT INTO user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  END IF;
END $$;

-- =====================
-- 5. RLS POLICIES FOR ORDERS
-- =====================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders for themselves
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only service role can update orders (via webhooks)
-- No policy needed - service role bypasses RLS

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =====================
-- 6. UPDATE EXISTING CALENDARS
-- =====================

-- Set expiration for all existing free calendars
UPDATE calendars 
SET expires_at = created_at + interval '30 days'
WHERE is_premium = false OR is_premium IS NULL;

-- =====================
-- 7. HELPER FUNCTIONS
-- =====================

-- Function to mark calendar as premium after payment
CREATE OR REPLACE FUNCTION mark_calendar_premium(
  _calendar_id uuid,
  _addons jsonb DEFAULT '[]'::jsonb
)
RETURNS void AS $$
BEGIN
  UPDATE calendars 
  SET 
    is_premium = true,
    addons = _addons,
    expires_at = NULL,
    updated_at = now()
  WHERE id = _calendar_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (will be called by edge function)
GRANT EXECUTE ON FUNCTION mark_calendar_premium TO authenticated;
