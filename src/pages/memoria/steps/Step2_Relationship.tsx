import React from "react";
import { useMemoria } from "../context/MemoriaContext";
import { motion } from "framer-motion";

const options = [
    "Presença segura",
    "Leve e divertida",
    "Intensa e profunda",
    "Afetiva e cuidadosa",
    "Companheira de tudo",
];

export default function Step2_Relationship() {
    const { updateState, nextStep } = useMemoria();

    const handleSelect = (option: string) => {
        updateState("relationship", option);
        nextStep();
    };

    return (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-10 space-y-2"
            >
                <p className="text-sm text-stone-400 font-medium uppercase tracking-widest">
                    Nomeando o vínculo
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-stone-800">
                    Toda relação tem um jeito próprio. <br />
                    Como você descreveria essa pessoa?
                </h2>
            </motion.div>

            <div className="w-full space-y-3">
                {options.map((option, index) => (
                    <motion.button
                        key={option}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSelect(option)}
                        className="w-full text-left p-5 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm transition-all duration-300 text-stone-700 font-medium text-lg"
                    >
                        {option}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
