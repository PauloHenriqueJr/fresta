import React, { useEffect } from "react";
import { useMemoria } from "./context/MemoriaContext";
import { AnimatePresence, motion } from "framer-motion";
import { PersistentAudioPlayer } from "./components/PersistentAudioPlayer.tsx";

// Steps
import Step0_Entrada from "./steps/Step0_Entrada.tsx";
import Step1_Recipient from "./steps/Step1_Recipient.tsx";
import Step2_Relationship from "./steps/Step2_Relationship.tsx";
import Step3_Occasion from "./steps/Step3_Occasion.tsx";
import Step4_Vibe from "./steps/Step4_Vibe.tsx";
import Step5_Duration from "./steps/Step5_Duration.tsx";
import Step6_Processing from "./steps/Step6_Processing.tsx";
import Step7_Result from "./steps/Step7_Result.tsx";
import Step8_AuthWall from "./steps/Step8_AuthWall.tsx";
import Step9_Dashboard from "./steps/Step9_Dashboard.tsx";

const steps = [
    Step0_Entrada,
    Step1_Recipient,
    Step2_Relationship,
    Step3_Occasion,
    Step4_Vibe,
    Step5_Duration,
    Step6_Processing,
    Step7_Result,
    Step8_AuthWall,
    Step9_Dashboard,
];

export default function MemoriaFlow() {
    const { currentStep } = useMemoria();

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    const CurrentComponent = steps[currentStep] || Step0_Entrada;

    return (
        <div className="min-h-screen w-full bg-[#FAFAF9] text-[#1a1a1a] font-sans selection:bg-[#E5E5E5] overflow-hidden relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full h-full min-h-screen flex items-center justify-center p-6"
                >
                    <CurrentComponent />
                </motion.div>
            </AnimatePresence>

            {/* Persistent Audio Player */}
            <PersistentAudioPlayer />
        </div>
    );
}
