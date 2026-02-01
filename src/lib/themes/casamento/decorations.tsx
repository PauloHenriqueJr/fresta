// Casamento (Wedding) Theme Decorations
// Falling petals and flowers for the wedding theme

import { motion } from "framer-motion";

/**
 * WeddingTopDecorations - Distributed flowers at the top
 */
export const WeddingTopDecorations = () => {
    const flowers = [
        { left: "8%", emoji: "✿", size: "text-2xl", opacity: "opacity-30", delay: 0 },
        { left: "22%", emoji: "✿", size: "text-xl", opacity: "opacity-20", delay: 0.3 },
        { left: "38%", emoji: "✿", size: "text-2xl", opacity: "opacity-25", delay: 0.6 },
        { left: "62%", emoji: "✿", size: "text-xl", opacity: "opacity-30", delay: 0.9 },
        { left: "78%", emoji: "✿", size: "text-2xl", opacity: "opacity-20", delay: 1.2 },
        { left: "92%", emoji: "✿", size: "text-xl", opacity: "opacity-25", delay: 1.5 },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 h-16 pointer-events-none z-[60] overflow-hidden">
            <div className="absolute top-3 left-0 right-0 flex justify-between px-4">
                {flowers.map((flower, i) => (
                    <motion.div
                        key={i}
                        className={`absolute ${flower.size} text-[#D4AF37] ${flower.opacity} select-none font-serif`}
                        style={{ left: flower.left }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, parseFloat(flower.opacity.replace('opacity-', '')) / 100, 0],
                            scale: [0, 1, 0],
                            y: [0, -5, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: flower.delay,
                            ease: "easeInOut"
                        }}
                    >
                        {flower.emoji}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/**
 * WeddingShower - Falling petals animation
 */
export const WeddingShower = () => {
    const petals = [
        { left: "10%", delay: 0, duration: 12, emoji: "🌸" },
        { left: "25%", delay: -2, duration: 15, emoji: "💐" },
        { left: "40%", delay: -4, duration: 10, emoji: "🌺" },
        { left: "55%", delay: -6, duration: 14, emoji: "🌸" },
        { left: "70%", delay: -3, duration: 11, emoji: "💐" },
        { left: "85%", delay: -8, duration: 13, emoji: "🌺" },
        { left: "15%", delay: -10, duration: 16, emoji: "🌸" },
        { left: "90%", delay: -5, duration: 12, emoji: "💐" },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            {petals.map((petal, i) => (
                <motion.div
                    key={i}
                    className="absolute text-2xl opacity-30"
                    style={{ left: petal.left }}
                    initial={{ y: "-10vh", x: 0, rotate: 0 }}
                    animate={{
                        y: ["10vh", "110vh"],
                        x: [-15, 15, -15, 15],
                        rotate: [0, 360, 720],
                    }}
                    transition={{
                        y: { duration: petal.duration, repeat: Infinity, ease: "linear", delay: petal.delay },
                        x: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: petal.delay },
                        rotate: { duration: petal.duration, repeat: Infinity, ease: "linear", delay: petal.delay },
                    }}
                >
                    {petal.emoji}
                </motion.div>
            ))}
        </div>
    );
};

/**
 * WeddingDecorations - Combined decorations (FloatingComponent)
 * Use this as the FloatingComponent in the theme config
 */
export const WeddingDecorations = () => {
    return (
        <>
            <WeddingTopDecorations />
            <WeddingShower />
        </>
    );
};

export default WeddingDecorations;
