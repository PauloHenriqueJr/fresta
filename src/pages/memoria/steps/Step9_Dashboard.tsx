import React from "react";
import { useMemoria } from "../context/MemoriaContext";
import { motion } from "framer-motion";
import { Gift, Calendar, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Step9_Dashboard() {
    const { state } = useMemoria();
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex justify-between items-center mb-12"
            >
                <h1 className="text-xl font-serif text-stone-800">Memória</h1>
                <div className="w-8 h-8 rounded-full bg-stone-200"></div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-serif text-stone-800 mb-4">
                    Sua memória está pronta <br /> para ser cuidada.
                </h2>
                <p className="text-stone-500 text-lg">
                    Tudo preparado com base no que você sentiu.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid md:grid-cols-3 gap-6"
            >
                {/* Card 1: Main Gift */}
                <div className="col-span-2 bg-white rounded-3xl p-8 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-stone-400 text-sm uppercase tracking-wider font-medium mb-2">Destino</p>
                            <h3 className="text-2xl font-serif text-stone-800">{state.recipient || "Alguém especial"}</h3>
                        </div>
                        <div className="p-3 bg-stone-50 rounded-full">
                            <Gift className="text-stone-800" size={24} strokeWidth={1} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-stone-50 rounded-xl">
                            <p className="text-stone-500 text-sm mb-1">Vínculo</p>
                            <p className="text-stone-800 font-medium">{state.relationship || "Especial"}</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-xl">
                            <p className="text-stone-500 text-sm mb-1">Ocasião</p>
                            <p className="text-stone-800 font-medium">{state.occasion || "Momento único"}</p>
                        </div>
                    </div>
                </div>

                {/* Card 2: Details */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm h-full flex flex-col justify-between">
                        <div>
                            <Calendar className="text-stone-400 mb-4" size={24} />
                            <p className="text-stone-800 font-medium text-lg">{state.duration || "Duração indefinida"}</p>
                            <p className="text-stone-400 text-sm">Tempo de revelação</p>
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between text-white">
                        <div>
                            <Music className="text-stone-400 mb-4" size={24} />
                            <p className="font-medium text-lg capitalize">{state.soundVibe || "Silêncio"}</p>
                            <p className="text-stone-400 text-sm">Atmosfera escolhida</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-center"
            >
                <button
                    onClick={() => navigate('/meus-calendarios')}
                    className="text-stone-400 hover:text-stone-800 transition-colors text-sm font-medium"
                >
                    Ir para todos os calendários →
                </button>
            </motion.div>
        </div>
    );
}
