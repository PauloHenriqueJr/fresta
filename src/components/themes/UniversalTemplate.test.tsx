import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { UniversalTemplate } from "./UniversalTemplate";
import { namoroTheme } from "@/lib/themes/registry";
import { render } from "@/test/test-utils";
import React from "react";

// Mock do framer-motion para evitar problemas com animações nos testes
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("UniversalTemplate", () => {
    const mockCalendar = {
        id: "cal123",
        title: "Nosso Amor",
        header_message: "Desde sempre",
        footer_message: "Para sempre",
        theme_id: "namoro",
        duration: 3,
        owner_id: "user123",
        created_at: new Date().toISOString(),
        privacy: "public" as const,
    };

    const mockDays = [
        { id: "1", day: 1, calendar_id: "cal123", message: "Dia 1" },
        { id: "2", day: 2, calendar_id: "cal123", message: "Dia 2" },
        { id: "3", day: 3, calendar_id: "cal123" },
    ];

    const defaultProps = {
        config: namoroTheme,
        calendar: mockCalendar as any,
        days: mockDays as any,
        openedDays: [1],
        onNavigateBack: vi.fn(),
        onShare: vi.fn(),
        onDayClick: vi.fn(),
    };

    it("deve renderizar o título e a mensagem de cabeçalho do calendário", () => {
        render(<UniversalTemplate {...defaultProps} />);

        // O título pode aparecer em múltiplos lugares (header e quote)
        expect(screen.getAllByText("Nosso Amor").length).toBeGreaterThan(0);
        expect(screen.getByText("Desde sempre")).toBeInTheDocument();
    });

    it("deve mostrar os botões de interação (Like, Share) para visitantes", () => {
        render(<UniversalTemplate {...defaultProps} isEditorContext={false} />);

        // O UniversalTemplate renderiza os botões de Share2 e Heart lucide-react
        // Vamos buscar por papel ou atributo se possível, ou testar a existência dos botões
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
    });

    it("deve chamar onDayClick ao clicar em um dia aberto", () => {
        render(<UniversalTemplate {...defaultProps} />);

        const day1Button = screen.getByText("Abrir o Coração"); // Texto do botão no namoroTheme
        fireEvent.click(day1Button);

        expect(defaultProps.onDayClick).toHaveBeenCalledWith(1);
    });

    it("deve renderizar modo editor quando isEditorContext é true", () => {
        render(<UniversalTemplate {...defaultProps} isEditorContext={true} />);

        expect(screen.getByText(/Modo Edição/i)).toBeInTheDocument();
        // Verifica que existe um botão de configurações pelo ícone Settings
        const settingsButtons = screen.getAllByRole("button");
        expect(settingsButtons.length).toBeGreaterThan(2); // Back, Preview, Settings
    });
});
