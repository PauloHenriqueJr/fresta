import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import EditarDia from "./EditarDia";
import { CalendarsRepository } from "@/lib/data/CalendarsRepository";
import { render } from "@/test/test-utils";
import React from "react";

// Mock do framer-motion
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
        section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock do react-router-dom para lidar com params
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: () => ({ dia: "1", calendarId: "cal123" }),
        useNavigate: () => vi.fn(),
    };
});

// Mock do CalendarsRepository
vi.mock("@/lib/data/CalendarsRepository", () => ({
    CalendarsRepository: {
        getById: vi.fn(),
        getDay: vi.fn(),
        updateDay: vi.fn(),
        uploadMedia: vi.fn(),
    },
}));

describe("EditarDia", () => {
    const mockCalendar = { id: "cal123", title: "Test Cal", theme_id: "namoro" };
    const mockDay = { id: "d1", day: 1, calendar_id: "cal123", content_type: "text", message: "Hello" };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(CalendarsRepository.getById).mockResolvedValue(mockCalendar as any);
        vi.mocked(CalendarsRepository.getDay).mockResolvedValue(mockDay as any);
    });

    it("deve carregar dados do calendário e do dia ao iniciar", async () => {
        render(<EditarDia />);

        await waitFor(() => {
            expect(CalendarsRepository.getById).toHaveBeenCalledWith("cal123");
            expect(CalendarsRepository.getDay).toHaveBeenCalledWith("cal123", 1);
        });

        // O título aparece em mobile e desktop headers
        expect(screen.getAllByText(/O que tem na Porta 1\?/i).length).toBeGreaterThan(0);
        expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    });

    it("deve permitir trocar o tipo de conteúdo", async () => {
        render(<EditarDia />);

        await waitFor(() => expect(screen.getByText("Foto ou Vídeo")).toBeInTheDocument());

        const photoButton = screen.getByText("Foto ou Vídeo");
        fireEvent.click(photoButton);

        expect(screen.getByText("Mídia da Surpresa")).toBeInTheDocument();
    });

    it("deve chamar updateDay ao clicar em salvar", async () => {
        vi.mocked(CalendarsRepository.updateDay).mockResolvedValue({} as any);

        render(<EditarDia />);

        await waitFor(() => expect(screen.getByText("Salvar Surpresa")).toBeInTheDocument());

        const saveButton = screen.getByText("Salvar Surpresa");
        fireEvent.click(saveButton);

        expect(CalendarsRepository.updateDay).toHaveBeenCalled();
    });
});
