// Namoro Theme Decorations
// Floating hearts for the romantic theme

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

/**
 * HangingHearts - Animated hearts hanging from the top of the screen
 * Used as floating decoration for the Namoro (Dating) theme
 */
export const HangingHearts = () => {
    const hearts = [
        { height: "h-10", color: "text-love-red", delay: 0 },
        { height: "h-16", color: "text-love-rose", delay: -0.5 },
        { height: "h-12", color: "text-love-red", delay: -1.2 },
        { height: "h-20", color: "text-rose-300", delay: -0.8 },
        { height: "h-14", color: "text-love-red", delay: -1.5 },
        { height: "h-18", color: "text-rose-400", delay: -0.3 },
        { height: "h-12", color: "text-love-red", delay: -1.0 },
    ];

    return (
        <div className="fixed top-0 left-0 w-full flex justify-around items-start z-40 pointer-events-none h-24 overflow-hidden px-2">
            {hearts.map((item, i) => (
                <motion.div
                    key={i}
                    className="hanging-heart flex flex-col items-center origin-top relative"
                    style={{
                        animationDelay: `${item.delay}s`
                    }}
                    animate={{
                        rotate: [-5, 5],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: Math.random() * 2
                    }}
                >
                    {/* Ribbon */}
                    <div className={`w-[2px] ${item.height} bg-gradient-to-b from-love-rose to-rose-300`} />

                    {/* Heart Icon */}
                    <div className={`-mt-1 ${item.color}`}>
                        <Heart className="w-6 h-6 fill-current drop-shadow-sm" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
