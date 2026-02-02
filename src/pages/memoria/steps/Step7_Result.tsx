import React from "react";
import { useMemoria } from "../context/MemoriaContext";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Step7_Result() {
    const { nextStep } = useMemoria();

    return (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-800 mb-4"
            >
                <Sparkles strokeWidth={1} size={48} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
            >
                <h2 className="text-3xl md:text-4xl font-serif text-stone-800">
                    Sua memória ganhou forma.
                </h2>
                <p className="text-stone-500 text-lg leading-relaxed max-w-xs mx-auto">
                    Não é sobre o que foi escolhido.<br />
                    É sobre o cuidado por trás de cada escolha.
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                onClick={nextStep}
                className="bg-[#1a1a1a] text-white px-10 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-stone-800 transition-all duration-300 transform hover:scale-105"
            >
                Ver a experiência
            </motion.button>
        </div>
    );
}
