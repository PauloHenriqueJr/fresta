import { motion } from "framer-motion";

// --- São João Bandeirinhas (Festa Junina Flags) ---
export const SaoJoaoBandeirinhas = () => {
    // Cores das bandeirinhas: vermelho, amarelo, azul
    const colors = ['#EF4444', '#FBBF24', '#3B82F6'];

    // Criar várias bandeirinhas
    const flags = [];
    for (let i = 0; i < 12; i++) {
        flags.push({
            color: colors[i % 3],
            delay: i * 0.05
        });
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden">
            {/* Linha de suporte */}
            <svg
                className="w-full"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                style={{ height: '45px' }}
            >
                {/* Corda */}
                <path
                    d="M-5,4 Q12,7 25,4 T50,4 T75,4 T105,4"
                    fill="none"
                    stroke="#8B7355"
                    strokeWidth="0.3"
                    className="opacity-60"
                />

                {/* Bandeirinhas */}
                {flags.map((flag, i) => {
                    const x = (i * 8.5) + 2;
                    const yOffset = Math.sin(i * 0.8) * 0.5;
                    return (
                        <motion.polygon
                            key={i}
                            points={`${x},${3 + yOffset} ${x + 3},${3 + yOffset} ${x + 1.5},${7 + yOffset}`}
                            fill={flag.color}
                            initial={{ rotate: 0 }}
                            animate={{ rotate: [-2, 2, -2] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: flag.delay
                            }}
                            style={{ transformOrigin: `${x + 1.5}px ${3 + yOffset}px` }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

// --- São João Floating Elements (corn, fire, accordion) ---
export const SaoJoaoFloatingIcons = () => {
    const items = [
        { emoji: "🌽", left: "5%", delay: 0, size: "text-2xl" },
        { emoji: "🔥", left: "85%", delay: -2, size: "text-3xl" },
        { emoji: "🪗", left: "15%", delay: -4, size: "text-xl" },
        { emoji: "🥜", left: "75%", delay: -1, size: "text-xl" },
        { emoji: "🎪", left: "45%", delay: -3, size: "text-2xl" },
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

// --- Combined São João Decorations ---
export const SaoJoaoDecorations = () => {
    return (
        <>
            <SaoJoaoBandeirinhas />
            <SaoJoaoFloatingIcons />
        </>
    );
};
