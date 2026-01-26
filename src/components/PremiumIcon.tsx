import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumIconProps {
    name: string;
    className?: string;
    strokeWidth?: number;
}

export function PremiumIcon({ name, className, strokeWidth = 2 }: PremiumIconProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];

    if (!IconComponent) {
        return <Icons.HelpCircle className={cn("w-5 h-5 opacity-50", className)} />;
    }

    return <IconComponent className={className} strokeWidth={strokeWidth} />;
}
