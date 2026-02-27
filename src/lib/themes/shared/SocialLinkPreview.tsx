import { ExternalLink, Play } from "lucide-react";

interface SocialLinkPreviewProps {
    url: string;
    className?: string;
}

function detectPlatform(url: string) {
    if (url.includes('tiktok.com'))
        return { name: 'TikTok', label: 'Ver no TikTok', gradient: 'from-[#010101] to-[#25F4EE]/20', icon: '🎵' };
    if (url.includes('instagram.com'))
        return { name: 'Instagram', label: 'Ver no Instagram', gradient: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]', icon: '📸' };
    if (url.includes('youtube.com') || url.includes('youtu.be'))
        return { name: 'YouTube', label: 'Ver no YouTube', gradient: 'from-[#FF0000] to-[#282828]', icon: '▶️' };
    return { name: 'Link', label: 'Abrir link', gradient: 'from-zinc-800 to-zinc-900', icon: '🔗' };
}

export const SocialLinkPreview = ({ url, className = '' }: SocialLinkPreviewProps) => {
    const platform = detectPlatform(url);

    return (
        <div className={`w-full rounded-2xl overflow-hidden ${className}`}>
            <div
                className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${platform.gradient} text-white min-h-[180px]`}
            >
                <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 border border-white/25 shadow-lg">
                    <Play className="w-7 h-7 text-white fill-current translate-x-0.5" />
                </div>
                <p className="text-white font-black text-sm uppercase tracking-widest mb-1">
                    {platform.icon} {platform.name}
                </p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full text-xs font-bold transition-all border border-white/25 active:scale-95"
                >
                    {platform.label}
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
};
