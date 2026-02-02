import React, { useEffect, useState } from "react";
import { useMemoria } from "../context/MemoriaContext";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
    "Transformando intenção em gesto...",
];

export default function Step6_Processing() {
    const { nextStep } = useMemoria();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => {
                if (prev >= messages.length - 1) {
                    clearInterval(interval);
                    setTimeout(nextStep, 1000); // Wait a bit after last message before continuing
                    return prev;
                }
                return prev + 1;
            });
        }, 2000); // 2 seconds per message

        return () => clearInterval(interval);
    }, [nextStep]);

    return (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto w-full min-h-[50vh]">
            <div className="h-20 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={currentMessageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-xl md:text-2xl font-serif text-stone-800 italic"
                    >
                        {messages[currentMessageIndex]}
                    </motion.h2>
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 w-48 h-1 bg-stone-100 rounded-full overflow-hidden"
            >
                <motion.div
                    className="h-full bg-stone-800 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
}
