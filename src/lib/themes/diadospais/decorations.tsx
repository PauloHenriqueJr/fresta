// Dia dos Pais (Father's Day) Theme Decorations
// Floating ties, crowns, and elegant masculine elements

import { motion } from "framer-motion";

// --- Floating Father's Day Icons ---
export const DiadospaisFloatingIcons = () => {
    const items = [
        { emoji: "👔", left: "8%", delay: 0, size: "text-2xl" },
        { emoji: "👑", left: "90%", delay: -2, size: "text-xl" },
        { emoji: "🏆", left: "15%", delay: -4, size: "text-xl" },
        { emoji: "💙", left: "75%", delay: -1, size: "text-xl" },
        { emoji: "⭐", left: "50%", delay: -3, size: "text-2xl" },
        { emoji: "🧔", left: "35%", delay: -5, size: "text-xl" },
    ];

    return (
        <div className="fixed top-0 left-0 w-full h-[60vh] pointer-events-none z-[-1] overflow-hidden">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    className={`absolute top-24 ${item.size}`}
                    style={{ left: item.left }}
                    animate={{
                        y: ["0vh", "80vh"],
                        rotate: [-5, 5, -5],
                        x: [-10, 10, -10]
                    }}
                    transition={{
                        duration: 22 + Math.random() * 10,
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

// --- Elegant Stripes Decoration ---
export const DiadospaisStripes = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden h-12">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-8 opacity-40"
                    style={{
                        left: `${10 + i * 12}%`,
                        background: i % 2 === 0 ? '#1e3a5f' : '#475569',
                        top: '-5px'
                    }}
                    animate={{
                        y: [-5, 5, -5],
                        rotate: [-2, 2, -2]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// --- Combined Dia dos Pais Decorations ---
export const DiadospaisDecorations = () => {
    return (
        <>
            <DiadospaisStripes />
            <DiadospaisFloatingIcons />
        </>
    );
};

export default DiadospaisDecorations;
