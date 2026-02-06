/**
 * WebView Detection and Exit Utility
 * Detects in-app browsers and provides methods to open URLs in external browsers
 */

// Known WebView user agent patterns
const WEBVIEW_PATTERNS = [
  /\bFB[\w_]+\/(Messenger|SUSPENDED|FB4A|FBIOS)/i, // Facebook
  /\bInstagram/i, // Instagram
  /\bTwitter/i, // Twitter/X
  /\bLine\//i, // Line
  /\bSnapchat/i, // Snapchat
  /\bPinterest/i, // Pinterest
  /\bLinkedIn/i, // LinkedIn
  /\bTikTok/i, // TikTok (Android)
  /\bmusical_ly/i, // TikTok (iOS legacy)
  /\bBytedanceWebview/i, // TikTok/Bytedance WebView
  /\bTTWebView/i, // TikTok internal WebView
  /\bAweme/i, // TikTok/Douyin internal name
  /\bWhatsApp/i, // WhatsApp
  /\bTelegram/i, // Telegram
  /\bWeChat/i, // WeChat
  /\bMicroMessenger/i, // WeChat (internal name)
];

// Specific app name detection
const APP_PATTERNS: { pattern: RegExp; name: string }[] = [
  { pattern: /TikTok|BytedanceWebview|musical_ly|TTWebView|Aweme/i, name: "TikTok" },
  { pattern: /Instagram/i, name: "Instagram" },
  { pattern: /FBAN|FBAV|FB_IAB|FBIOS|FB4A/i, name: "Facebook" },
  { pattern: /Twitter/i, name: "Twitter" },
  { pattern: /LinkedIn/i, name: "LinkedIn" },
  { pattern: /Pinterest/i, name: "Pinterest" },
  { pattern: /Snapchat/i, name: "Snapchat" },
  { pattern: /WhatsApp/i, name: "WhatsApp" },
  { pattern: /Telegram/i, name: "Telegram" },
];

/**
 * Check if the current browser is a WebView
 */
export function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  
  const ua = navigator.userAgent || "";
  
  // Check known WebView patterns
  for (const pattern of WEBVIEW_PATTERNS) {
    if (pattern.test(ua)) {
      return true;
    }
  }
  
  // Additional checks for iOS WebViews
  if (/iPhone|iPad|iPod/.test(ua)) {
    // Check for non-Safari browsers on iOS (likely WebViews)
    if (!/Safari/.test(ua) && /AppleWebKit/.test(ua)) {
      return true;
    }
    // Check for Safari but with specific WebView markers
    if (/Safari/.test(ua) && (/FBAN|FBAV|Instagram|Twitter/i.test(ua))) {
      return true;
    }
  }
  
  // Additional checks for Android WebViews
  if (/Android/.test(ua)) {
    // Many Android WebViews include "wv" in the UA
    if (/\bwv\b/.test(ua)) {
      return true;
    }
    // Check for Chrome, but not Chrome browser
    if (/Chrome\/[\d.]+ Mobile/.test(ua) && !/Version\/[\d.]+/.test(ua)) {
      // This could be Chrome Custom Tab, which is actually fine
      // But social app WebViews typically don't include version
    }
  }
  
  return false;
}

/**
 * Get the name of the in-app browser (if detected)
 */
export function getInAppBrowserName(): string | null {
  if (typeof navigator === "undefined") return null;
  
  const ua = navigator.userAgent || "";
  
  for (const { pattern, name } of APP_PATTERNS) {
    if (pattern.test(ua)) {
      return name;
    }
  }
  
  return null;
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Get the appropriate browser name for the user's device
 */
export function getExternalBrowserName(): string {
  if (isIOS()) return "Safari";
  if (isAndroid()) return "Chrome";
  return "navegador";
}

/**
 * Build external URL with quiz data encoded
 */
export function buildExternalLoginUrl(quizData: {
  theme?: string;
  recipient?: string;
  occasion?: string;
  duration?: string;
}): string {
  const baseUrl = window.location.origin;
  const encodedData = btoa(JSON.stringify({
    ...quizData,
    timestamp: Date.now()
  }));
  
  return `${baseUrl}/#/entrar?quiz=${encodedData}`;
}

/**
 * Get instructions for opening in external browser based on platform
 */
export function getExternalBrowserInstructions(): {
  title: string;
  steps: string[];
  buttonText: string;
} {
  if (isIOS()) {
    return {
      title: "Abra no Safari",
      steps: [
        "Toque no botão abaixo para copiar o link",
        "Abra o Safari no seu iPhone",
        "Cole o link na barra de endereços",
        "Faça login com sua conta Google"
      ],
      buttonText: "Copiar Link"
    };
  }
  
  if (isAndroid()) {
    return {
      title: "Abra no Chrome",
      steps: [
        "Toque nos 3 pontinhos (⋮) no canto superior",
        "Selecione 'Abrir no Chrome'",
        "Ou copie o link e cole no Chrome"
      ],
      buttonText: "Copiar Link"
    };
  }
  
  return {
    title: "Abra no navegador",
    steps: [
      "Copie o link abaixo",
      "Abra seu navegador padrão",
      "Cole o link e acesse"
    ],
    buttonText: "Copiar Link"
  };
}
