import React, { useEffect, useRef, useState } from 'react';
import { useMemoria } from '../context/MemoriaContext';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mapeamento de vibes para arquivos de áudio (placeholders)
// No futuro, adicionar os arquivos em src/assets/audio/
// e importar aqui.
const playlist: Record<string, string> = {
    "Calmo": "/audio/calmo.mp3",
    "Nostálgico": "/audio/nostalgico.mp3",
    "Alegre": "/audio/alegre.mp3",
    "Intenso": "/audio/intenso.mp3",
    // Fallback/Indeciso
    "indeciso": "/audio/calmo.mp3",
};

export const PersistentAudioPlayer = () => {
    const { state } = useMemoria();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.15); // Começa em 15% como sugerido
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSrc, setCurrentSrc] = useState<string | null>(null);

    // Efeito para iniciar/trocar música baseado na escolha da vibe
    useEffect(() => {
        // Se o usuário escolheu "silencio", paramos tudo
        if (state.soundVibe === 'silencio') {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            return;
        }

        // Se temos uma vibe válida e ela mudou (ou iniciou)
        if (state.soundVibe && playlist[state.soundVibe]) {
            const newSrc = playlist[state.soundVibe];

            // Só troca se for diferente para não reiniciar à toa
            if (newSrc !== currentSrc) {
                setCurrentSrc(newSrc);
                // NOTA: Em produção real, o autoplay aqui pode ser bloqueado
                // pelos browsers se não houver interação prévia.
                // Como o clique em "Sim, uma música importa" ou na Vibe é uma interação,
                // devemos tentar dar play logo em seguida.
                setIsPlaying(true);
            }
        }
    }, [state.soundVibe]);

    // Controle de Play/Pause/Volume no elemento de áudio
    useEffect(() => {
        if (!audioRef.current || !currentSrc) return;

        audioRef.current.src = currentSrc;
        audioRef.current.volume = volume;
        audioRef.current.loop = true;

        if (isPlaying && !isMuted) {
            audioRef.current.play().catch(err => {
                console.warn("Autoplay bloqueado ou falha no áudio:", err);
                setIsPlaying(false); // Reverte estado se falhar
            });
        } else {
            audioRef.current.pause();
        }
    }, [currentSrc, isPlaying, isMuted, volume]);

    // Se não há vibe selecionada ou é silêncio, não renderiza o player (ou renderiza invisível se quiser persistência)
    if (!state.soundVibe || state.soundVibe === 'silencio') return null;

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {/* Elemento de áudio invisível */}
            <audio ref={audioRef} preload="auto" />

            {/* Controle Flutuante Discreto */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-full p-2 pl-4 pr-3 shadow-lg flex items-center gap-3 transition-all hover:bg-white"
            >
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider leading-none">
                        Trilha
                    </span>
                    <span className="text-xs font-serif font-bold text-stone-700 capitalize">
                        {state.soundVibe}
                    </span>
                </div>

                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                    aria-label={isMuted ? "Ativar som" : "Desativar som"}
                >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
            </motion.div>
        </div>
    );
};
