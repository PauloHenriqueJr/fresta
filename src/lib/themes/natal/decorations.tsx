// Natal (Christmas) Theme Decorations
// Festive Christmas decorations with garlands, snowflakes, and lights

import { motion } from "framer-motion";

// --- Guirlanda de Natal ---
export const NatalGuirlanda = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden">
            <svg
                className="w-full"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                style={{ height: '60px' }}
            >
                {/* Corda vermelha e verde entrelaçada */}
                <path
                    d="M-5,6 Q15,3 30,6 T55,6 T80,6 T105,6"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="0.8"
                    className="opacity-80"
                />
                <path
                    d="M-5,6 Q20,9 35,6 T60,6 T85,6 T105,6"
                    fill="none"
                    stroke="#166534"
                    strokeWidth="0.8"
                    className="opacity-60"
                />

                {/* Enfeites da guirlanda */}
                {[10, 25, 40, 55, 70, 85].map((x, i) => (
                    <motion.g key={i}>
                        {/* Bola vermelha */}
                        <motion.circle
                            cx={x}
                            cy={6 + Math.sin(i) * 2}
                            r="2.5"
                            fill="#DC2626"
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut"
                            }}
                        />
                        {/* Brilho na bola */}
                        <circle
                            cx={x - 0.8}
                            cy={5 + Math.sin(i) * 2}
                            r="0.6"
                            fill="white"
                            opacity="0.6"
                        />
                    </motion.g>
                ))}

                {/* Estrelas douradas */}
                {[17.5, 47.5, 77.5].map((x, i) => (
                    <motion.polygon
                        key={`star-${i}`}
                        points={`${x},3 ${x + 1},5.5 ${x + 3.5},5.5 ${x + 1.5},7 ${x + 2.5},9.5 ${x},8 ${x - 2.5},9.5 ${x - 1.5},7 ${x - 3.5},5.5 ${x - 1},5.5`}
                        fill="#F59E0B"
                        initial={{ rotate: 0, scale: 0 }}
                        animate={{ rotate: [0, 360], scale: 1 }}
                        transition={{
                            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                            scale: { duration: 0.5, delay: i * 0.2 }
                        }}
                        style={{ transformOrigin: `${x}px 6px` }}
                    />
                ))}
            </svg>
        </div>
    );
};

// --- Flocos de Neve Animados ---
export const NatalNeve = () => {
    const snowflakes = [
        { left: "5%", size: "text-xl", delay: 0, duration: 15 },
        { left: "15%", size: "text-lg", delay: -2, duration: 12 },
        { left: "25%", size: "text-2xl", delay: -4, duration: 18 },
        { left: "35%", size: "text-sm", delay: -1, duration: 10 },
        { left: "45%", size: "text-xl", delay: -3, duration: 14 },
        { left: "55%", size: "text-lg", delay: -5, duration: 16 },
        { left: "65%", size: "text-2xl", delay: -2, duration: 13 },
        { left: "75%", size: "text-sm", delay: -4, duration: 17 },
        { left: "85%", size: "text-xl", delay: -1, duration: 11 },
        { left: "95%", size: "text-lg", delay: -3, duration: 15 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            {snowflakes.map((flake, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${flake.size} text-white opacity-60`}
                    style={{ left: flake.left }}
                    initial={{ y: "-10vh", x: 0 }}
                    animate={{
                        y: ["-10vh", "110vh"],
                        x: [-20, 20, -20, 20, -20],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        y: { duration: flake.duration, repeat: Infinity, ease: "linear", delay: flake.delay },
                        x: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: flake.delay },
                        rotate: { duration: flake.duration, repeat: Infinity, ease: "linear", delay: flake.delay }
                    }}
                >
                    ❄️
                </motion.div>
            ))}
        </div>
    );
};

// --- Elementos Flutuantes de Natal ---
export const NatalFloatingIcons = () => {
    const items = [
        { emoji: "🎅", left: "8%", delay: 0, size: "text-3xl" },
        { emoji: "🎁", left: "92%", delay: -3, size: "text-2xl" },
        { emoji: "🎄", left: "20%", delay: -6, size: "text-3xl" },
        { emoji: "🔔", left: "80%", delay: -2, size: "text-2xl" },
        { emoji: "🕯️", left: "35%", delay: -8, size: "text-xl" },
        { emoji: "🦌", left: "65%", delay: -4, size: "text-3xl" },
        { emoji: "🧦", left: "50%", delay: -10, size: "text-xl" },
    ];

    return (
        <div className="fixed top-0 left-0 w-full h-[70vh] pointer-events-none z-[1] overflow-hidden">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    className={`absolute top-24 ${item.size} opacity-40`}
                    style={{ left: item.left }}
                    animate={{
                        y: ["0vh", "75vh"],
                        x: [-10, 10, -10],
                        rotate: [-5, 5, -5]
                    }}
                    transition={{
                        y: { duration: 25 + Math.random() * 8, repeat: Infinity, ease: "linear", delay: item.delay },
                        x: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: item.delay }
                    }}
                >
                    {item.emoji}
                </motion.div>
            ))}
        </div>
    );
};

// --- Luzes de Natal Piscantes ---
export const NatalLuzes = () => {
    const lights = [
        { color: "#EF4444", left: "5%", delay: 0 },
        { color: "#22C55E", left: "15%", delay: 0.2 },
        { color: "#F59E0B", left: "25%", delay: 0.4 },
        { color: "#3B82F6", left: "35%", delay: 0.6 },
        { color: "#EF4444", left: "45%", delay: 0.8 },
        { color: "#22C55E", left: "55%", delay: 1.0 },
        { color: "#F59E0B", left: "65%", delay: 1.2 },
        { color: "#3B82F6", left: "75%", delay: 1.4 },
        { color: "#EF4444", left: "85%", delay: 1.6 },
        { color: "#22C55E", left: "95%", delay: 1.8 },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 pointer-events-none z-30 overflow-hidden">
            <div className="absolute bottom-4 left-0 right-0 flex justify-around px-4">
                {lights.map((light, i) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{ backgroundColor: light.color }}
                        animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.9, 1.1, 0.9]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: light.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
            {/* Fio das luzes */}
            <svg className="absolute bottom-8 left-0 right-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ height: '20px' }}>
                <path
                    d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5 T100,5"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="0.3"
                    className="opacity-30"
                />
            </svg>
        </div>
    );
};

// --- Componente combinado de decorações de Natal ---
export const NatalDecorationsFull = () => {
    return (
        <>
            <NatalGuirlanda />
            <NatalNeve />
            <NatalFloatingIcons />
            <NatalLuzes />
        </>
    );
};

export default NatalDecorationsFull;
