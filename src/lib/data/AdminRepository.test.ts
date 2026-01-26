import { describe, it, expect, vi } from "vitest";
import { AdminRepository } from "./AdminRepository";
import { supabase } from "@/lib/supabase/client";

describe("AdminRepository", () => {
  describe("getTransactions", () => {
    it("deve buscar transações ordenadas por data", async () => {
      const mockData = [{ id: "t1", amount: 100 }];
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await AdminRepository.getTransactions();

      expect(supabase.from).toHaveBeenCalledWith("transactions");
      expect(result).toEqual(mockData);
    });
  });

  describe("getFeedbacks", () => {
    it("deve buscar feedbacks ordenados por data", async () => {
      const mockData = [{ id: "f1", message: "Great!" }];
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await AdminRepository.getFeedbacks();

      expect(supabase.from).toHaveBeenCalledWith("feedbacks");
      expect(result).toEqual(mockData);
    });
  });

  describe("updateFeedbackStatus", () => {
    it("deve atualizar o status de um feedback", async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ error: null });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      } as any);

      await AdminRepository.updateFeedbackStatus("f123", "resolved");

      expect(supabase.from).toHaveBeenCalledWith("feedbacks");
      expect(mockUpdate).toHaveBeenCalledWith({ status: "resolved" });
      expect(mockEq).toHaveBeenCalledWith("id", "f123");
    });
  });

  describe("getCoupons", () => {
    it("deve buscar todos os cupons", async () => {
      const mockData = [{ code: "PROMO10" }];
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await AdminRepository.getCoupons();

      expect(supabase.from).toHaveBeenCalledWith("coupons");
      expect(result).toEqual(mockData);
    });
  });

  describe("createCoupon", () => {
    it("deve inserir um novo cupom", async () => {
      const mockCoupon = { code: "NEW10", discount: 10 };
      const mockInsert = vi.fn().mockResolvedValue({ error: null });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      await AdminRepository.createCoupon(mockCoupon);

      expect(supabase.from).toHaveBeenCalledWith("coupons");
      expect(mockInsert).toHaveBeenCalledWith(mockCoupon);
    });
  });

  describe("getPlans", () => {
    it("deve buscar planos ordenados por preço", async () => {
      const mockData = [{ name: "Basic", price_cents: 1000 }];
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await AdminRepository.getPlans();

      expect(supabase.from).toHaveBeenCalledWith("pricing_plans");
      expect(result).toEqual(mockData);
    });
  });

  describe("getUsers", () => {
    it("deve buscar perfis de usuários", async () => {
      const mockData = [{ email: "user@test.com" }];
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await AdminRepository.getUsers();

      expect(supabase.from).toHaveBeenCalledWith("profiles");
      expect(result).toEqual(mockData);
    });
  });

  describe("getSystemHealth", () => {
    it("deve chamar a RPC get_system_stats", async () => {
      const mockStats = { cpu: "low", db: "healthy" };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockStats, error: null } as any);

      const result = await AdminRepository.getSystemHealth();

      expect(supabase.rpc).toHaveBeenCalledWith("get_system_stats");
      expect(result).toEqual(mockStats);
    });
  });
});
