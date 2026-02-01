import React from "react";
import { useMemoria } from "../context/MemoriaContext";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Step8_AuthWall() {
    const { nextStep } = useMemoria();
    const navigate = useNavigate();

    const handleLogin = () => {
        // In a real app, this would redirect to login/register logic.
        // For this flow, we simulate success and go to dashboard/next step.
        nextStep();
    };

    return (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-stone-50 rounded-2xl"
            >
                <Lock className="text-stone-400" size={32} strokeWidth={1.5} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-serif text-stone-800 leading-relaxed">
                    Para guardar essa memória <br />
                    e continuar criando com calma, <br />
                    precisamos salvá-la.
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full space-y-6"
            >
                <button
                    onClick={handleLogin}
                    className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl text-lg font-medium hover:bg-stone-800 transition-all duration-300"
                >
                    Entrar para continuar
                </button>

                <div className="flex items-center justify-center gap-2 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-stone-300 flex items-center justify-center transition-colors group-hover:border-stone-500">
                        {/* Checkbox state would go here */}
                    </div>
                    <span className="text-stone-500 text-sm group-hover:text-stone-700">
                        Você pode receber lembretes e novidades, se quiser.
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
