import React from "react";
import { useMemoria } from "../context/MemoriaContext";
import { motion } from "framer-motion";

export default function Step0_Entrada() {
    const { nextStep } = useMemoria();

    return (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4 font-serif text-2xl md:text-3xl text-stone-800 leading-snug tracking-tight"
            >
                <p>Algumas coisas não precisam ser explicadas.</p>
                <p className="text-stone-500">Apenas cuidadas.</p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                onClick={nextStep}
                className="bg-[#1a1a1a] text-white px-10 py-3 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-stone-800 transition-all duration-300 transform hover:scale-105"
            >
                Continuar
            </motion.button>
        </div>
    );
}
