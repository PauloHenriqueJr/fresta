import React, { useState } from "react";
import { useMemoria } from "../context/MemoriaContext";
import { motion } from "framer-motion";

const vibes = [
    "Calmo",
    "Nostálgico",
    "Alegre",
    "Intenso",
];

export default function Step4_Vibe() {
    const { updateState, nextStep } = useMemoria();
    const [showVibes, setShowVibes] = useState(false);

    const handleYes = () => {
        setShowVibes(true);
    };

    const handleNo = () => {
        updateState("soundVibe", "silencio");
        nextStep();
    };

    const handleUndecided = () => {
        updateState("soundVibe", "indeciso");
        nextStep();
    };

    const handleVibeSelect = (vibe: string) => {
        updateState("soundVibe", vibe);
        nextStep();
    };

    if (showVibes) {
        return (
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-10 space-y-2"
                >
                    <p className="text-sm text-stone-400 font-medium uppercase tracking-widest">
                        Estilo musical
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif text-stone-800">
                        Qual estilo combina mais?
                    </h2>
                </motion.div>

                <div className="w-full grid grid-cols-2 gap-3">
                    {vibes.map((vibe, index) => (
                        <motion.button
                            key={vibe}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleVibeSelect(vibe)}
                            className="p-6 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-md transition-all duration-300 text-stone-700 font-medium text-lg aspect-square flex items-center justify-center"
                        >
                            {vibe}
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-10 space-y-2"
            >
                <p className="text-sm text-stone-400 font-medium uppercase tracking-widest">
                    Clima emocional
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-stone-800">
                    Algumas memórias têm som. <br />
                    Quer adicionar uma trilha para acompanhar essa experiência?
                </h2>
            </motion.div>

            <div className="w-full space-y-3">
                <motion.button
                    onClick={handleYes}
                    className="w-full text-left p-5 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm transition-all duration-300 text-stone-700 font-medium text-lg"
                >
                    Sim, uma música importa
                </motion.button>
                <motion.button
                    onClick={handleNo}
                    className="w-full text-left p-5 rounded-xl border border-stone-200 bg-white/50 hover:bg-white hover:border-stone-400 transition-all duration-300 text-stone-600 font-normal text-lg"
                >
                    Prefiro silêncio
                </motion.button>
                <motion.button
                    onClick={handleUndecided}
                    className="w-full text-left p-5 rounded-xl border border-transparent hover:bg-stone-100 transition-all duration-300 text-stone-500 font-normal text-lg"
                >
                    Ainda não sei
                </motion.button>
            </div>
        </div>
    );
}
