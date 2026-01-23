// @ts-nocheck
import { supabase } from "@/lib/supabase/client";

// VAPID public key - Generated for free using web-push
const VAPID_PUBLIC_KEY = 'BAkEi1Ksh2y_xitWQB69UOUVVArQUX4lCEAnpoJWeN0uonKu7YlZkLr8uKmfl35U_aAghRccA4tbKMgiKNDVSr4';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[Push] Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/fresta/sw.js', {
      scope: '/fresta/'
    });
    console.log('[Push] Service Worker registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('[Push] Service Worker registration failed:', error);
    return null;
  }
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.ready;

  if (!('pushManager' in registration)) {
    console.warn('[Push] Push messaging not supported');
    return null;
  }

  try {
    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource
      });
      console.log('[Push] New subscription created');
    }

    // Save subscription to Supabase
    const calendarId = localStorage.getItem('fresta_last_visited_calendar_id');
    await saveSubscriptionToServer(subscription, calendarId || undefined);

    return subscription;
  } catch (error) {
    console.error('[Push] Subscription failed:', error);
    return null;
  }
}

async function saveSubscriptionToServer(subscription: PushSubscription, calendarId?: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const subscriptionJSON = subscription.toJSON();
  
  const { error } = await (supabase
    .from('push_subscriptions') as any)
    .upsert({
      user_id: user?.id || null,
      endpoint: subscription.endpoint,
      p256dh: subscriptionJSON.keys?.p256dh || '',
      auth: subscriptionJSON.keys?.auth || '',
      last_calendar_id: calendarId || null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'endpoint'
    });

  if (error) {
    console.error('[Push] Failed to save subscription:', error);
  } else {
    console.log('[Push] Subscription saved to server' + (calendarId ? ` for calendar ${calendarId}` : ''));
  }
}

export async function scheduleDoorReminder(
  calendarId: string,
  doorNumber: number,
  notifyAt: Date
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await (supabase
    .from('door_reminders') as any)
    .upsert({
      user_id: user?.id || null,
      calendar_id: calendarId,
      door_number: doorNumber,
      notify_at: notifyAt.toISOString(),
      notified: false
    }, {
      onConflict: 'user_id,calendar_id,door_number'
    });

  if (error) {
    console.error('[Push] Failed to schedule reminder:', error);
    return false;
  }

  console.log('[Push] Reminder scheduled for door', doorNumber, 'at', notifyAt);
  return true;
}

export async function checkPushSupport(): Promise<{
  serviceWorker: boolean;
  pushManager: boolean;
  notifications: boolean;
  permission: NotificationPermission;
}> {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    notifications: 'Notification' in window,
    permission: 'Notification' in window ? Notification.permission : 'denied'
  };
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  return await Notification.requestPermission();
}

export function isPWAInstalled(): boolean {
  // Check if running in standalone mode (installed PWA)
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function canInstallPWA(): boolean {
  // Check if the beforeinstallprompt event was fired
  return !!(window as any).deferredPrompt;
}

// Store the install prompt event
let deferredPrompt: any = null;

export function setupInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    (window as any).deferredPrompt = e;
    console.log('[PWA] Install prompt captured');
  });
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('[PWA] No install prompt available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  (window as any).deferredPrompt = null;

  return outcome === 'accepted';
}
