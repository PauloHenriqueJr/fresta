import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/state/auth/AuthProvider';

export type SubscriptionStatus = 'trialing' | 'active' | 'canceled' | 'none';

interface SubscriptionInfo {
  status: SubscriptionStatus;
  planId: string | null;
  isPremium: boolean;
  isLoading: boolean;
}

/**
 * Hook to check user's subscription status.
 * Returns isPremium = true if user has active or trialing subscription.
 */
export function useSubscription(): SubscriptionInfo {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    status: 'none',
    planId: null,
    isPremium: false,
    isLoading: true,
  });

  useEffect(() => {
    if (!user?.id) {
      setSubscription({
        status: 'none',
        planId: null,
        isPremium: false,
        isLoading: false,
      });
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('status, plan_id')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
          setSubscription({
            status: 'none',
            planId: null,
            isPremium: false,
            isLoading: false,
          });
          return;
        }

        // Type guard for subscription data
        const subData = data as { status: string; plan_id: string } | null;
        if (subData) {
          setSubscription({
            status: subData.status as SubscriptionStatus,
            planId: subData.plan_id,
            isPremium: subData.status === 'active' || subData.status === 'trialing',
            isLoading: false,
          });
        } else {
          setSubscription({
            status: 'none',
            planId: null,
            isPremium: false,
            isLoading: false,
          });
        }
      } catch (err) {
        console.error('Error in useSubscription:', err);
        setSubscription({
          status: 'none',
          planId: null,
          isPremium: false,
          isLoading: false,
        });
      }
    };

    fetchSubscription();
  }, [user?.id]);

  return subscription;
}
