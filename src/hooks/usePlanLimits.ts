/**
 * Hook to check plan limits for a calendar
 * Determines what features are available based on premium status
 */

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/state/auth/AuthProvider";

export interface PlanLimits {
  // Is this calendar premium?
  isPremium: boolean;
  
  // Max days allowed
  maxDays: number;
  
  // Feature flags
  canUploadPhotos: boolean;
  canEmbedVideos: boolean;
  canUseAllThemes: boolean;
  canEmbedAudio: boolean;
  canSetPassword: boolean;
  
  // Theme change restrictions (anti-abuse)
  canChangeTheme: boolean;
  themeChangesRemaining: number;
  originalThemeId: string | null;
  lastThemeChange: Date | null;
  
  // UI flags
  showAds: boolean;
  showUpgradePrompt: boolean;
  
  // Expiration
  expiresAt: Date | null;
  daysUntilExpiry: number | null;
  isExpired: boolean;
  
  // Loading state
  isLoading: boolean;
}

// Free plan limits
const FREE_PLAN: Omit<PlanLimits, "isLoading" | "expiresAt" | "daysUntilExpiry" | "isExpired" | "originalThemeId" | "lastThemeChange"> = {
  isPremium: false,
  maxDays: 7, // Changed from 5 to 7 days
  canUploadPhotos: false,
  canEmbedVideos: false,
  canUseAllThemes: false,
  canEmbedAudio: false,
  canSetPassword: false,
  canChangeTheme: true, // Free can change anytime
  themeChangesRemaining: -1, // Unlimited for free
  showAds: true,
  showUpgradePrompt: true,
};

// Premium plan limits
const PREMIUM_PLAN: Omit<PlanLimits, "isLoading" | "expiresAt" | "daysUntilExpiry" | "isExpired" | "originalThemeId" | "lastThemeChange"> = {
  isPremium: true,
  maxDays: 365,
  canUploadPhotos: true,
  canEmbedVideos: true,
  canUseAllThemes: true,
  canEmbedAudio: true,
  canSetPassword: true,
  canChangeTheme: true, // Will be calculated based on time
  themeChangesRemaining: 3, // 3 theme changes allowed for premium
  showAds: false,
  showUpgradePrompt: false,
};

// Admin gets all premium features for free
const ADMIN_PLAN = { ...PREMIUM_PLAN, canChangeTheme: true, themeChangesRemaining: -1 };

export function usePlanLimits(calendarId?: string): PlanLimits {
  const { user, profile } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin
  const isAdmin = useMemo(() => {
    return profile?.email === "paulojack2011@gmail.com";
  }, [profile]);

  useEffect(() => {
    async function checkPremiumStatus() {
      if (!calendarId) {
        setIsLoading(false);
        return;
      }

      try {
        // Type assertion needed until migration runs and types are regenerated
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("calendars")
          .select("is_premium, expires_at")
          .eq("id", calendarId)
          .single();

        if (error) {
          console.error("Error checking premium status:", error);
          setIsLoading(false);
          return;
        }

        if (data) {
          setIsPremium(data.is_premium ?? false);
          setExpiresAt(data.expires_at ? new Date(data.expires_at) : null);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkPremiumStatus();
  }, [calendarId]);

  // Calculate days until expiry
  const daysUntilExpiry = useMemo(() => {
    if (!expiresAt) return null;
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [expiresAt]);

  // Check if expired
  const isExpired = useMemo(() => {
    if (!expiresAt) return false;
    return new Date() > expiresAt;
  }, [expiresAt]);

  // Admin bypass
  if (isAdmin) {
    return {
      ...ADMIN_PLAN,
      isLoading: false,
      expiresAt: null,
      daysUntilExpiry: null,
      isExpired: false,
      originalThemeId: null,
      lastThemeChange: null,
    };
  }

  // Return appropriate plan
  if (isLoading) {
    return {
      ...FREE_PLAN,
      isLoading: true,
      expiresAt: null,
      daysUntilExpiry: null,
      isExpired: false,
      originalThemeId: null,
      lastThemeChange: null,
    };
  }

  if (isPremium) {
    return {
      ...PREMIUM_PLAN,
      isLoading: false,
      expiresAt: null,
      daysUntilExpiry: null,
      isExpired: false,
      originalThemeId: null,
      lastThemeChange: null,
    };
  }

  return {
    ...FREE_PLAN,
    isLoading: false,
    expiresAt,
    daysUntilExpiry,
    isExpired,
    originalThemeId: null,
    lastThemeChange: null,
  };
}

/**
 * Hook to check limits without a specific calendar
 * Uses user's admin status from database and calendar count
 */
export function useUserPlanStatus() {
  const { profile, user, role } = useAuth();
  const [freeCalendarCount, setFreeCalendarCount] = useState(0);
  const [premiumCalendarCount, setPremiumCalendarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check admin status from database (user_roles table)
  // SECURITY: Role is fetched from database, not hardcoded
  const isAdmin = useMemo(() => {
    return role === 'admin';
  }, [role]);

  useEffect(() => {
    async function fetchCalendarCount() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("calendars")
          .select("id, is_premium")
          .eq("owner_id", user.id);

        if (error) {
          console.error("Error fetching calendar count:", error);
          setIsLoading(false);
          return;
        }

        const free = data?.filter((c: any) => !c.is_premium).length || 0;
        const premium = data?.filter((c: any) => c.is_premium).length || 0;
        
        setFreeCalendarCount(free);
        setPremiumCalendarCount(premium);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCalendarCount();
  }, [user?.id]);

  // Free users can only create ONE free calendar
  const hasUsedFreeCalendar = freeCalendarCount > 0;
  const canCreateFreeCalendar = isAdmin || !hasUsedFreeCalendar;
  const canCreatePremiumCalendar = true; // Anyone can create premium if they pay

  return {
    isAdmin,
    isLoading,
    freeCalendarCount,
    premiumCalendarCount,
    hasUsedFreeCalendar,
    canCreateFreeCalendar,
    canCreatePremiumCalendar,
    canCreateUnlimitedCalendars: isAdmin,
    canAccessAllFeatures: isAdmin,
  };
}

// Premium themes that require payment
export const PREMIUM_THEMES = ["casamento", "bodas", "noivado", "reveillon"];

