// Aniversário (Birthday) Theme Decorations
// Festive birthday decorations with balloons, confetti, and party elements

import { motion } from "framer-motion";

// --- Birthday Floating Icons (Balloons, cakes, etc.) ---
export const AniversarioFloatingIcons = () => {
    const items = [
        { emoji: "🎂", left: "8%", delay: 0, size: "text-2xl" },
        { emoji: "🎈", left: "90%", delay: -2, size: "text-3xl" },
        { emoji: "🎁", left: "15%", delay: -4, size: "text-xl" },
        { emoji: "🎉", left: "75%", delay: -1, size: "text-xl" },
        { emoji: "🥳", left: "50%", delay: -3, size: "text-2xl" },
        { emoji: "🕯️", left: "35%", delay: -5, size: "text-xl" },
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

// --- Birthday Confetti (Top decoration) ---
export const AniversarioConfetti = () => {
    const colors = ['#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden h-16">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-3 rounded-sm"
                    style={{
                        left: `${5 + i * 7}%`,
                        backgroundColor: colors[i % colors.length],
                        top: '-10px'
                    }}
                    animate={{
                        y: [0, 80],
                        rotate: [0, 360],
                        opacity: [1, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

// --- Birthday Balloon Border ---
export const AniversarioBalloons = () => {
    const balloons = [
        { color: "#EC4899", x: "5%" },
        { color: "#3B82F6", x: "20%" },
        { color: "#10B981", x: "35%" },
        { color: "#F59E0B", x: "50%" },
        { color: "#8B5CF6", x: "65%" },
        { color: "#EF4444", x: "80%" },
        { color: "#06B6D4", x: "95%" },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden h-20">
            {balloons.map((balloon, i) => (
                <motion.div
                    key={i}
                    className="absolute flex flex-col items-center"
                    style={{ left: balloon.x, top: '-5px' }}
                    animate={{
                        y: [-5, 5, -5],
                        rotate: [-5, 5, -5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                    }}
                >
                    {/* Balloon */}
                    <div
                        className="w-6 h-8 rounded-full shadow-md"
                        style={{ backgroundColor: balloon.color }}
                    >
                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/40" />
                    </div>
                    {/* String */}
                    <div
                        className="w-[1px] h-4 opacity-60"
                        style={{ backgroundColor: balloon.color }}
                    />
                </motion.div>
            ))}
        </div>
    );
};

// --- Combined Aniversário Decorations ---
export const AniversarioDecorations = () => {
    return (
        <>
            <AniversarioBalloons />
            <AniversarioFloatingIcons />
        </>
    );
};

export default AniversarioDecorations;
