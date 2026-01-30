/**
 * VideoEmbed Component
 * Renders video embeds with auto-detected platform and thumbnail preview
 * Supports: YouTube, TikTok, Vimeo, Spotify
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, Music, Video } from "lucide-react";
import {
    extractVideoInfo,
    fetchTikTokThumbnail,
    fetchVimeoThumbnail,
    type VideoInfo,
    type VideoPlatform
} from "@/lib/video-utils";
import { cn } from "@/lib/utils";

interface VideoEmbedProps {
    url: string;
    className?: string;
    autoplay?: boolean;
    showControls?: boolean;
    aspectRatio?: "16:9" | "9:16" | "1:1";
}

const PLATFORM_ICONS: Record<VideoPlatform, typeof Video> = {
    youtube: Video,
    tiktok: Video,
    vimeo: Video,
    spotify: Music,
    unknown: Video,
};

const PLATFORM_COLORS: Record<VideoPlatform, string> = {
    youtube: "from-red-500 to-red-600",
    tiktok: "from-pink-500 to-violet-500",
    vimeo: "from-blue-400 to-cyan-400",
    spotify: "from-green-500 to-green-600",
    unknown: "from-slate-500 to-slate-600",
};

export function VideoEmbed({
    url,
    className,
    autoplay = false,
    showControls = true,
    aspectRatio = "16:9",
}: VideoEmbedProps) {
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [thumbnail, setThumbnail] = useState<string>("");
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadVideoInfo() {
            setIsLoading(true);

            const info = extractVideoInfo(url);
            if (!info) {
                setIsLoading(false);
                return;
            }

            setVideoInfo(info);

            // Get thumbnail
            let thumbUrl = info.thumbnailUrl;

            // Fetch remote thumbnails for platforms that need API
            if (!thumbUrl && info.platform === "tiktok") {
                thumbUrl = await fetchTikTokThumbnail(info.url);
            } else if (!thumbUrl && info.platform === "vimeo") {
                thumbUrl = await fetchVimeoThumbnail(info.id);
            }

            setThumbnail(thumbUrl);
            setIsLoading(false);
        }

        loadVideoInfo();
    }, [url]);

    // Aspect ratio classes
    const aspectClass = {
        "16:9": "aspect-video",
        "9:16": "aspect-[9/16]",
        "1:1": "aspect-square",
    }[aspectRatio];

    // Invalid URL state
    if (!videoInfo && !isLoading) {
        return (
            <div className={cn(
                "rounded-xl bg-slate-800/50 border border-slate-700/50",
                "flex items-center justify-center p-6",
                aspectClass,
                className
            )}>
                <div className="text-center text-slate-400">
                    <ExternalLink className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Link de vídeo inválido</p>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className={cn(
                "rounded-xl bg-slate-800/50 border border-slate-700/50",
                "flex items-center justify-center",
                "animate-pulse",
                aspectClass,
                className
            )}>
                <div className="w-12 h-12 rounded-full bg-slate-700/50" />
            </div>
        );
    }

    const PlatformIcon = PLATFORM_ICONS[videoInfo!.platform];
    const gradientColor = PLATFORM_COLORS[videoInfo!.platform];

    // Embedded player
    if (isPlaying) {
        return (
            <div className={cn(
                "rounded-xl overflow-hidden bg-black",
                aspectClass,
                className
            )}>
                {videoInfo!.platform === "spotify" ? (
                    <iframe
                        src={videoInfo!.embedUrl}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allow="encrypted-media"
                        className="w-full"
                    />
                ) : (
                    <iframe
                        src={`${videoInfo!.embedUrl}${autoplay ? "?autoplay=1" : ""}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                )}
            </div>
        );
    }

    // Thumbnail preview with play button
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer",
                "bg-slate-800 border border-slate-700/50",
                "group",
                aspectClass,
                className
            )}
            onClick={() => setIsPlaying(true)}
        >
            {/* Thumbnail */}
            {thumbnail ? (
                <img
                    src={thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className={cn(
                    "w-full h-full bg-gradient-to-br",
                    gradientColor,
                    "opacity-30"
                )} />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "w-16 h-16 rounded-full",
                        "bg-gradient-to-br shadow-lg",
                        gradientColor,
                        "flex items-center justify-center",
                        "group-hover:shadow-xl transition-shadow"
                    )}
                >
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </motion.div>
            </div>

            {/* Platform badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
                <div className={cn(
                    "px-3 py-1 rounded-full",
                    "bg-black/60 backdrop-blur-sm",
                    "flex items-center gap-1.5"
                )}>
                    <PlatformIcon className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-medium text-white capitalize">
                        {videoInfo!.platform}
                    </span>
                </div>
            </div>

            {/* External link */}
            {showControls && (
                <a
                    href={videoInfo!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                        "absolute top-3 right-3",
                        "w-8 h-8 rounded-full",
                        "bg-black/60 backdrop-blur-sm",
                        "flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                        "hover:bg-black/80"
                    )}
                >
                    <ExternalLink className="w-4 h-4 text-white" />
                </a>
            )}
        </motion.div>
    );
}

export default VideoEmbed;
