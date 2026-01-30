/**
 * Video Utility Functions
 * Extracts video IDs and thumbnails from various platforms
 * Supports: YouTube, TikTok, Vimeo, Spotify
 */

export type VideoPlatform = "youtube" | "tiktok" | "vimeo" | "spotify" | "unknown";

export interface VideoInfo {
  platform: VideoPlatform;
  id: string;
  url: string;
  thumbnailUrl: string;
  embedUrl: string;
}

// Regex patterns for video platforms
const PATTERNS = {
  youtube: [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ],
  tiktok: [
    /tiktok\.com\/@[^/]+\/video\/(\d+)/,
    /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
  ],
  vimeo: [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ],
  spotify: [
    /open\.spotify\.com\/(?:[a-zA-Z-]+\/)?(track|playlist|album)\/([a-zA-Z0-9]+)/,
  ],
};

/**
 * Extract video ID and platform from URL
 */
export function extractVideoInfo(url: string): VideoInfo | null {
  if (!url) return null;

  // Normalize URL
  const normalizedUrl = url.trim();

  // Check YouTube
  for (const pattern of PATTERNS.youtube) {
    const match = normalizedUrl.match(pattern);
    if (match) {
      const id = match[1];
      return {
        platform: "youtube",
        id,
        url: normalizedUrl,
        thumbnailUrl: getYouTubeThumbnail(id),
        embedUrl: `https://www.youtube.com/embed/${id}`,
      };
    }
  }

  // Check TikTok
  for (const pattern of PATTERNS.tiktok) {
    const match = normalizedUrl.match(pattern);
    if (match) {
      const id = match[1];
      return {
        platform: "tiktok",
        id,
        url: normalizedUrl,
        thumbnailUrl: "", // TikTok requires oEmbed
        embedUrl: `https://www.tiktok.com/embed/${id}`,
      };
    }
  }

  // Check Vimeo
  for (const pattern of PATTERNS.vimeo) {
    const match = normalizedUrl.match(pattern);
    if (match) {
      const id = match[1];
      return {
        platform: "vimeo",
        id,
        url: normalizedUrl,
        thumbnailUrl: "", // Vimeo requires API
        embedUrl: `https://player.vimeo.com/video/${id}`,
      };
    }
  }

  // Check Spotify
  for (const pattern of PATTERNS.spotify) {
    const match = normalizedUrl.match(pattern);
    if (match) {
      const type = match[1];
      const id = match[2];
      return {
        platform: "spotify",
        id,
        url: normalizedUrl,
        thumbnailUrl: "", // Spotify uses embed preview
        embedUrl: `https://open.spotify.com/embed/${type}/${id}`,
      };
    }
  }

  return null;
}

/**
 * Get YouTube thumbnail URL
 * Tries high quality first, falls back to default
 */
export function getYouTubeThumbnail(videoId: string): string {
  // maxresdefault is the highest quality, but not always available
  // Falls back to hqdefault (480x360) which is always available
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Get high-quality YouTube thumbnail
 */
export function getYouTubeMaxThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Fetch TikTok thumbnail via oEmbed
 * Note: This requires CORS proxy in production
 */
export async function fetchTikTokThumbnail(url: string): Promise<string> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      console.warn("Failed to fetch TikTok oEmbed");
      return "";
    }
    
    const data = await response.json();
    return data.thumbnail_url || "";
  } catch (error) {
    console.error("TikTok thumbnail error:", error);
    return "";
  }
}

/**
 * Fetch Vimeo thumbnail via oEmbed
 */
export async function fetchVimeoThumbnail(videoId: string): Promise<string> {
  try {
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      console.warn("Failed to fetch Vimeo oEmbed");
      return "";
    }
    
    const data = await response.json();
    return data.thumbnail_url || "";
  } catch (error) {
    console.error("Vimeo thumbnail error:", error);
    return "";
  }
}

/**
 * Check if URL is a valid video URL
 */
export function isVideoUrl(url: string): boolean {
  return extractVideoInfo(url) !== null;
}

/**
 * Get embed HTML for a video
 */
export function getVideoEmbedHtml(info: VideoInfo, options?: {
  width?: number;
  height?: number;
  autoplay?: boolean;
}): string {
  const { width = 560, height = 315, autoplay = false } = options || {};

  switch (info.platform) {
    case "youtube":
      return `<iframe 
        width="${width}" 
        height="${height}" 
        src="${info.embedUrl}${autoplay ? "?autoplay=1" : ""}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>`;

    case "vimeo":
      return `<iframe 
        src="${info.embedUrl}${autoplay ? "?autoplay=1" : ""}" 
        width="${width}" 
        height="${height}" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen>
      </iframe>`;

    case "tiktok":
      return `<blockquote 
        class="tiktok-embed" 
        cite="${info.url}" 
        data-video-id="${info.id}" 
        style="max-width: ${width}px;min-width: 325px;">
        <script async src="https://www.tiktok.com/embed.js"></script>
      </blockquote>`;

    case "spotify":
      return `<iframe 
        src="${info.embedUrl}" 
        width="${width}" 
        height="80" 
        frameborder="0" 
        allowtransparency="true" 
        allow="encrypted-media">
      </iframe>`;

    default:
      return "";
  }
}
