import React, { createContext, useContext, useState, ReactNode } from "react";

interface MemoriaState {
    recipient: string; // "Alguém que eu amo", "Meu parceiro", etc.
    relationship: string; // "Presença segura", "Leve e divertida", etc.
    occasion: string; // "Uma data especial", "Nenhuma data", etc.
    soundVibe: string; // "Calmo", "Nostálgico", etc. or null
    duration: string; // "Alguns dias", "Uma semana", etc.
}

interface MemoriaContextType {
    state: MemoriaState;
    updateState: (key: keyof MemoriaState, value: string) => void;
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
}

const MemoriaContext = createContext<MemoriaContextType | undefined>(undefined);

export const MemoriaProvider = ({ children }: { children: ReactNode }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [state, setState] = useState<MemoriaState>({
        recipient: "",
        relationship: "",
        occasion: "",
        soundVibe: "",
        duration: "",
    });

    const updateState = (key: keyof MemoriaState, value: string) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));
    const goToStep = (step: number) => setCurrentStep(step);

    return (
        <MemoriaContext.Provider value={{ state, updateState, currentStep, nextStep, prevStep, goToStep }}>
            {children}
        </MemoriaContext.Provider>
    );
};

export const useMemoria = () => {
    const context = useContext(MemoriaContext);
    if (!context) {
        throw new Error("useMemoria must be used within a MemoriaProvider");
    }
    return context;
};
