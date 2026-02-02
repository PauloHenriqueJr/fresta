// Metas (Goals/New Beginnings) Theme Decorations
// Floating stars, rockets, and motivational elements

import { motion } from "framer-motion";

// --- Floating Achievement Icons ---
export const MetasFloatingIcons = () => {
    const items = [
        { emoji: "⭐", left: "8%", delay: 0, size: "text-xl" },
        { emoji: "🚀", left: "88%", delay: -2, size: "text-2xl" },
        { emoji: "✨", left: "15%", delay: -4, size: "text-lg" },
        { emoji: "🎯", left: "75%", delay: -1, size: "text-xl" },
        { emoji: "💫", left: "50%", delay: -3, size: "text-xl" },
        { emoji: "🏆", left: "35%", delay: -5, size: "text-lg" },
    ];

    return (
        <div className="fixed top-0 left-0 w-full h-[60vh] pointer-events-none z-[-1] overflow-hidden">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    className={`absolute top-24 ${item.size}`}
                    style={{ left: item.left }}
                    animate={{
                        y: ["0vh", "60vh"],
                        rotate: [-5, 5, -5],
                        x: [-10, 10, -10],
                        opacity: [0.8, 0.4, 0.8]
                    }}
                    transition={{
                        duration: 25 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: item.delay,
                    }}
                >
                    {item.emoji}
                </motion.div>
            ))}
        </div>
    );
};

// --- Twinkling Stars Background ---
export const MetasStars = () => {
    return (
        <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-amber-300"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// --- Shooting Star Effect ---
export const MetasShootingStar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden h-32">
            <motion.div
                className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                style={{ top: '20%', left: '-10%' }}
                animate={{
                    x: ['0vw', '120vw'],
                    y: ['0vh', '15vh'],
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 8,
                    ease: "easeOut"
                }}
            />
        </div>
    );
};

// --- Combined Metas Decorations ---
export const MetasDecorations = () => {
    return (
        <>
            <MetasStars />
            <MetasShootingStar />
            <MetasFloatingIcons />
        </>
    );
};

export default MetasDecorations;
