-- ==========================================
-- FRESTA: MISSING ADMIN & B2B TABLES
-- ==========================================

-- Enum for Audit Log levels
DO $$ BEGIN
    CREATE TYPE public.audit_log_level AS ENUM ('info', 'warning', 'error', 'security');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details JSONB,
    level public.audit_log_level DEFAULT 'info'
);

-- Feedbacks Table
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    module TEXT,
    status TEXT DEFAULT 'pending'
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER CHECK (discount_percent > 0 AND discount_percent <= 100),
    expires_at TIMESTAMPTZ,
    usage_limit INTEGER DEFAULT 100,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Transactions Table (for BI)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'BRL',
    status TEXT DEFAULT 'completed',
    plan_id UUID REFERENCES public.pricing_plans(id),
    metadata JSONB
);

-- B2B Security Settings (Extension to b2b_organizations)
ALTER TABLE public.b2b_organizations 
ADD COLUMN IF NOT EXISTS allowed_domains TEXT[],
ADD COLUMN IF NOT EXISTS sso_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS watermark_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS block_screenshots BOOLEAN DEFAULT false;

-- RLS Policies
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Admins can see everything
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all feedbacks" ON public.feedbacks
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all transactions" ON public.transactions
    FOR SELECT USING (public.is_admin(auth.uid()));

-- Users can see their own feedbacks
CREATE POLICY "Users can view/create their own feedbacks" ON public.feedbacks
    FOR ALL USING (auth.uid() = user_id);
