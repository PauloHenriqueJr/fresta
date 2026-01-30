-- Migration: Add is_admin to profiles
-- Run this in Supabase SQL Editor

-- 1. Add is_admin column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 2. Set Paulo as admin (owner of the system)
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'paulojack2011@gmail.com';

-- 3. Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- 4. Verify the admin was set
SELECT id, email, is_admin FROM public.profiles WHERE is_admin = true;
