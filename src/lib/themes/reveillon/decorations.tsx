// Reveillon (New Year's Eve) Theme Decorations
// Festive New Year decorations with lights, stars, and fireworks

import { motion } from "framer-motion";

// --- Reveillon Decorations (Top) ---
export const ReveillonDecorations = () => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 pointer-events-none select-none overflow-hidden" style={{ height: '80px' }}>
            {/* String of lights */}
            <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="lightString" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                </defs>
                {/* Curved string */}
                <path
                    d="M -50 20 Q 25% 60, 50% 40 T 105% 20"
                    stroke="url(#lightString)"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-md"
                />
                <path
                    d="M -50 20 Q 25% 60, 50% 40 T 105% 20"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="4"
                    fill="none"
                />
            </svg>

            {/* Colorful light bulbs */}
            {[
                { x: '5%', color: '#EF4444', delay: 0 },
                { x: '15%', color: '#3B82F6', delay: 0.2 },
                { x: '25%', color: '#F59E0B', delay: 0.4 },
                { x: '35%', color: '#10B981', delay: 0.6 },
                { x: '45%', color: '#8B5CF6', delay: 0.8 },
                { x: '55%', color: '#EC4899', delay: 1.0 },
                { x: '65%', color: '#06B6D4', delay: 1.2 },
                { x: '75%', color: '#F97316', delay: 1.4 },
                { x: '85%', color: '#84CC16', delay: 1.6 },
                { x: '95%', color: '#EF4444', delay: 1.8 },
            ].map((light, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full shadow-lg"
                    style={{
                        left: light.x,
                        top: '28px',
                        width: '16px',
                        height: '20px',
                        backgroundColor: light.color,
                        boxShadow: `0 0 15px ${light.color}, 0 0 30px ${light.color}80`,
                    }}
                    animate={{
                        opacity: [0.6, 1, 0.6],
                        scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: light.delay,
                        ease: "easeInOut",
                    }}
                >
                    {/* Bulb cap */}
                    <div
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-t-sm"
                        style={{ backgroundColor: '#475569' }}
                    />
                </motion.div>
            ))}

            {/* Floating stars */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`star-${i}`}
                    className="absolute text-yellow-300 text-xl"
                    style={{
                        left: `${10 + i * 12}%`,
                        top: `${50 + Math.random() * 20}px`,
                    }}
                    animate={{
                        opacity: [0.3, 0.8, 0.3],
                        rotate: [0, 20, -20, 0],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                    }}
                >
                    ✨
                </motion.div>
            ))}
        </div>
    );
};

// --- Reveillon Floating Icons (Champagne, fireworks, etc.) ---
export const ReveillonFloatingIcons = () => {
    const items = [
        { emoji: "🍾", left: "5%", delay: 0, size: "text-2xl" },
        { emoji: "🎆", left: "90%", delay: -2, size: "text-3xl" },
        { emoji: "🎇", left: "15%", delay: -4, size: "text-xl" },
        { emoji: "✨", left: "75%", delay: -1, size: "text-xl" },
        { emoji: "🎊", left: "50%", delay: -3, size: "text-2xl" },
        { emoji: "🥂", left: "35%", delay: -5, size: "text-xl" },
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

// --- Combined Reveillon Decorations ---
export const ReveillonDecorationsFull = () => {
    return (
        <>
            <ReveillonDecorations />
            <ReveillonFloatingIcons />
        </>
    );
};

export default ReveillonDecorations;
