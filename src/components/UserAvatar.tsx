import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/state/auth/AuthProvider";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function UserAvatar({ className, size = "md" }: UserAvatarProps) {
    const { user, profile } = useAuth();

    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-32 w-32 lg:h-40 w-40"
    };

    // 1. Profile Avatar (Manual upload or selected)
    const profileAvatar = profile?.avatar;

    // 2. Google Avatar (From user metadata)
    const googleAvatar = user?.user_metadata?.avatar_url;

    // 3. DiceBear Avatar (Generated based on email)
    const diceBearAvatar = `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.email || 'default'}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

    // Initials as last resort
    const initials = (profile?.display_name || user?.email || "U")[0].toUpperCase();

    return (
        <Avatar className={cn(sizeClasses[size], "border border-border/10 shrink-0", className)}>
            {/* Try explicitly set profile avatar first */}
            {profileAvatar && (
                <AvatarImage src={profileAvatar} alt={profile?.display_name || "Avatar"} className="object-cover" />
            )}

            {/* Fallback to Google Avatar if available */}
            {googleAvatar && (
                <AvatarImage src={googleAvatar} alt={profile?.display_name || "Google Avatar"} className="object-cover" />
            )}

            {/* Fallback to DiceBear (always available as a URL) */}
            <AvatarImage src={diceBearAvatar} alt="Default Avatar" className="object-cover" />

            {/* Final resort: Initials */}
            <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
