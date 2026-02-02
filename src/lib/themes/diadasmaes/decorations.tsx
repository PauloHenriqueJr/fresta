// Dia das Mães (Mother's Day) Theme Decorations
// Floating flowers, hearts, and elegant pink elements

import { motion } from "framer-motion";

// --- Floating Hearts and Flowers ---
export const DiadasmaesFloatingIcons = () => {
    const items = [
        { emoji: "🌸", left: "8%", delay: 0, size: "text-2xl" },
        { emoji: "💕", left: "90%", delay: -2, size: "text-2xl" },
        { emoji: "🌷", left: "15%", delay: -4, size: "text-xl" },
        { emoji: "💐", left: "75%", delay: -1, size: "text-xl" },
        { emoji: "🌹", left: "50%", delay: -3, size: "text-2xl" },
        { emoji: "💝", left: "35%", delay: -5, size: "text-xl" },
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
                        rotate: [-10, 10, -10],
                        x: [-15, 15, -15]
                    }}
                    transition={{
                        duration: 20 + Math.random() * 10,
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

// --- Floating Petals ---
export const DiadasmaesPetals = () => {
    const colors = ['#EC4899', '#F472B6', '#FBCFE8', '#FDA4AF', '#FCA5A5'];

    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden h-16">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full opacity-60"
                    style={{
                        left: `${5 + i * 8}%`,
                        backgroundColor: colors[i % colors.length],
                        top: '-10px'
                    }}
                    animate={{
                        y: [0, 100],
                        rotate: [0, 180],
                        opacity: [0.8, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

// --- Combined Dia das Mães Decorations ---
export const DiadasmaesDecorations = () => {
    return (
        <>
            <DiadasmaesPetals />
            <DiadasmaesFloatingIcons />
        </>
    );
};

export default DiadasmaesDecorations;
