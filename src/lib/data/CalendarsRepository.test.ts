import { describe, it, expect, vi, beforeEach } from "vitest";
import { CalendarsRepository } from "./CalendarsRepository";
import { supabase } from "@/lib/supabase/client";

// Mock do Supabase já está no setup.ts, mas podemos customizar por teste
describe("CalendarsRepository", () => {
  describe("listByOwner", () => {
    it("deve retornar uma lista de calendários para um dono específico", async () => {
      const mockData = [{ id: "1", title: "Test Calendar", owner_id: "user123" }];
      
      // Mock do retorno do Supabase
      const mockSelect = vi.fn().mockResolvedValue({ data: mockData, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ select: mockSelect }) });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await CalendarsRepository.listByOwner("user123");

      expect(supabase.from).toHaveBeenCalledWith("calendars");
      expect(result).toEqual(mockData);
      expect(result.length).toBe(1);
    });

    it("deve lançar um erro se a query do Supabase falhar", async () => {
      const mockError = { message: "Database Error" };
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      } as any);

      await expect(CalendarsRepository.listByOwner("user123")).rejects.toThrow("Database Error");
    });
  });

  describe("getById", () => {
    it("deve retornar um calendário pelo ID", async () => {
      const mockData = { id: "cal123", title: "Single Calendar" };
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await CalendarsRepository.getById("cal123");

      expect(supabase.from).toHaveBeenCalledWith("calendars");
      expect(result).toEqual(mockData);
    });

    it("deve retornar null se o calendário não for encontrado", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Not found' } }),
      } as any);

      const result = await CalendarsRepository.getById("invalid-id");
      expect(result).toBeNull();
    });
  });

  describe("getWithDays", () => {
    it("deve retornar o calendário e seus dias", async () => {
      const mockCalendar = { id: "cal123", title: "Cal with Days" };
      const mockDays = [{ id: "day1", day: 1 }, { id: "day2", day: 2 }];

      const mockFrom = vi.mocked(supabase.from);
      
      // Simular múltiplas chamadas ao .from()
      mockFrom.mockImplementation((table: string) => {
        if (table === 'calendars') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockCalendar, error: null }),
          } as any;
        }
        if (table === 'calendar_days') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockDays, error: null }),
          } as any;
        }
        return {} as any;
      });

      const result = await CalendarsRepository.getWithDays("cal123");

      expect(result).toEqual({ calendar: mockCalendar, days: mockDays });
    });
  });
});
