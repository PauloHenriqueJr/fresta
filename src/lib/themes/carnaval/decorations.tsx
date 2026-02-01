// Carnaval Theme Decorations
// Festive carnival decorations with streamers, masks, and musical icons

import { motion } from "framer-motion";
import { Sparkles, PartyPopper, Music, Star } from "lucide-react";

// --- Carnaval Floating Icons (Confetti/Masks) ---
export const CarnavalFloatingIcons = () => {
    const icons = [
        { Icon: PartyPopper, color: "text-purple-500", delay: 0, size: "w-6 h-6", left: "10%" },
        { Icon: Music, color: "text-pink-500", delay: -2, size: "w-8 h-8", left: "25%" },
        { Icon: Star, color: "text-yellow-400", delay: -4, size: "w-4 h-4", left: "40%" },
        { Icon: Sparkles, color: "text-purple-400", delay: -1, size: "w-5 h-5", left: "60%" },
        { Icon: PartyPopper, color: "text-pink-400", delay: -3, size: "w-7 h-7", left: "75%" },
        { Icon: Music, color: "text-purple-600", delay: -1.5, size: "w-5 h-5", left: "90%" },
    ];

    return (
        <div className="fixed top-0 left-0 w-full h-[60vh] pointer-events-none z-[-1] overflow-hidden">
            {icons.map((item, i) => (
                <motion.div
                    key={i}
                    className={`absolute -top-10 ${item.color}`}
                    style={{ left: item.left }}
                    animate={{
                        y: ["0vh", "100vh"],
                        rotate: [0, 360],
                        x: [-20, 20, -20]
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: item.delay,
                        y: { ease: "linear" }
                    }}
                >
                    <item.Icon className={item.size} />
                </motion.div>
            ))}
        </div>
    );
};

// --- Carnaval Hanging Decorations (Streamers/Masks) ---
export const CarnavalHangingDecorations = () => {
    const items = [
        { Icon: Music, color: "text-purple-500", height: "h-16", delay: 0 },
        { Icon: PartyPopper, color: "text-pink-500", height: "h-24", delay: -0.5 },
        { Icon: Star, color: "text-yellow-400", height: "h-12", delay: -1.2 },
        { Icon: Music, color: "text-purple-400", height: "h-20", delay: -0.8 },
        { Icon: Sparkles, color: "text-pink-400", height: "h-14", delay: -1.5 },
    ];

    return (
        <div className="fixed top-0 left-0 w-full flex justify-around items-start z-40 pointer-events-none h-32 overflow-hidden px-2">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    className="flex flex-col items-center origin-top relative"
                    animate={{ rotate: [-8, 8] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: Math.random() * 2
                    }}
                >
                    {/* Streamer Line */}
                    <div className={`w-[1px] ${item.height} bg-gradient-to-b from-purple-300 to-transparent opacity-60`} />

                    {/* Icon */}
                    <div className={`-mt-1 ${item.color} drop-shadow-sm`}>
                        <item.Icon className="w-5 h-5 fill-current" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// --- Combined Carnaval Decorations ---
export const CarnavalDecorations = () => {
    return (
        <>
            <CarnavalFloatingIcons />
            <CarnavalHangingDecorations />
        </>
    );
};

export default CarnavalDecorations;
