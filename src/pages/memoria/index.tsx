import React from "react";
import { MemoriaProvider } from "./context/MemoriaContext";
import MemoriaFlow from "./MemoriaFlow";

export default function MemoriaPage() {
    return (
        <MemoriaProvider>
            <MemoriaFlow />
        </MemoriaProvider>
    );
}
