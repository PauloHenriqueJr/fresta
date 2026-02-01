// Páscoa (Easter) Theme Decorations
// Festive Easter decorations with eggs, bunnies, and springtime elements

import { motion } from "framer-motion";

// --- Páscoa Floating Eggs ---
export const PascoaFloatingEggs = () => {
    const items = [
        { emoji: "🥚", left: "8%", delay: 0, size: "text-2xl" },
        { emoji: "🐰", left: "88%", delay: -2, size: "text-3xl" },
        { emoji: "🌷", left: "18%", delay: -4, size: "text-xl" },
        { emoji: "🐣", left: "72%", delay: -1, size: "text-2xl" },
        { emoji: "🌸", left: "50%", delay: -3, size: "text-xl" },
        { emoji: "🍫", left: "35%", delay: -5, size: "text-2xl" },
    ];

    return (
        <div className="fixed top-0 left-0 w-full h-[60vh] pointer-events-none z-[-1] overflow-hidden">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    className={`absolute top-20 ${item.size}`}
                    style={{ left: item.left }}
                    animate={{
                        y: ["0vh", "80vh"],
                        rotate: [-15, 15, -15],
                        x: [-10, 10, -10]
                    }}
                    transition={{
                        duration: 18 + Math.random() * 8,
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

// --- Páscoa Bunny Ears Header Decoration ---
export const PascoaBunnyEars = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden flex justify-center">
            <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                className="opacity-90"
            >
                {/* Orelha esquerda */}
                <motion.ellipse
                    cx="35"
                    cy="35"
                    rx="12"
                    ry="30"
                    fill="#E9D5FF"
                    stroke="#C084FC"
                    strokeWidth="2"
                    initial={{ rotate: -15 }}
                    animate={{ rotate: [-15, -10, -15] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "35px 55px" }}
                />
                <ellipse cx="35" cy="32" rx="5" ry="18" fill="#F5D0FE" />

                {/* Orelha direita */}
                <motion.ellipse
                    cx="85"
                    cy="35"
                    rx="12"
                    ry="30"
                    fill="#E9D5FF"
                    stroke="#C084FC"
                    strokeWidth="2"
                    initial={{ rotate: 15 }}
                    animate={{ rotate: [15, 10, 15] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    style={{ transformOrigin: "85px 55px" }}
                />
                <ellipse cx="85" cy="32" rx="5" ry="18" fill="#F5D0FE" />
            </svg>
        </div>
    );
};

// --- Páscoa Colorful Eggs Border ---
export const PascoaEggsBorder = () => {
    const eggs = [
        { color: "#C084FC", pattern: "#E9D5FF" }, // purple
        { color: "#F472B6", pattern: "#FBCFE8" }, // pink
        { color: "#A78BFA", pattern: "#DDD6FE" }, // violet
        { color: "#F9A8D4", pattern: "#FDE4E4" }, // rose
        { color: "#C084FC", pattern: "#E9D5FF" }, // purple
        { color: "#F472B6", pattern: "#FBCFE8" }, // pink
        { color: "#A78BFA", pattern: "#DDD6FE" }, // violet
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden">
            <svg
                className="w-full"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                style={{ height: '50px' }}
            >
                {eggs.map((egg, i) => {
                    const x = (i * 14) + 5;
                    return (
                        <g key={i}>
                            {/* Ovo */}
                            <motion.ellipse
                                cx={x}
                                cy="6"
                                rx="4"
                                ry="5"
                                fill={egg.color}
                                initial={{ y: 0 }}
                                animate={{ y: [-1, 1, -1] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.15
                                }}
                            />
                            {/* Padrão decorativo */}
                            <motion.path
                                d={`M${x - 2},5 Q${x},3 ${x + 2},5`}
                                fill="none"
                                stroke={egg.pattern}
                                strokeWidth="0.8"
                                initial={{ y: 0 }}
                                animate={{ y: [-1, 1, -1] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.15
                                }}
                            />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// --- Combined Páscoa Decorations ---
export const PascoaDecorations = () => {
    return (
        <>
            <PascoaEggsBorder />
            <PascoaFloatingEggs />
        </>
    );
};

export default PascoaDecorations;
