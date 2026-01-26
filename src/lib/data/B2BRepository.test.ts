import { describe, it, expect, vi } from "vitest";
import { B2BRepository } from "./B2BRepository";
import { supabase } from "@/lib/supabase/client";

describe("B2BRepository", () => {
  describe("getOrgStatus", () => {
    it("deve buscar o status da organização pelo ID", async () => {
      const mockData = { id: "org123", name: "Acme Corp" };
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await B2BRepository.getOrgStatus("org123");

      expect(supabase.from).toHaveBeenCalledWith("b2b_organizations");
      expect(result).toEqual(mockData);
    });

    it("deve lançar erro se a busca falhar", async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Error" } }),
      } as any);

      await expect(B2BRepository.getOrgStatus("org123")).rejects.toThrow("Error");
    });
  });

  describe("updateOrgSecurity", () => {
    it("deve atualizar as configurações de segurança", async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ error: null });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      } as any);

      await B2BRepository.updateOrgSecurity("org123", { auth_method: "saml" } as any);

      expect(supabase.from).toHaveBeenCalledWith("b2b_organizations");
      expect(mockUpdate).toHaveBeenCalledWith({ auth_method: "saml" });
      expect(mockEq).toHaveBeenCalledWith("id", "org123");
    });
  });

  describe("getMembers", () => {
    it("deve listar os membros de uma organização", async () => {
      const mockData = [{ id: "m1", name: "John Doe" }];
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await B2BRepository.getMembers("org123");

      expect(supabase.from).toHaveBeenCalledWith("b2b_members");
      expect(result).toEqual(mockData);
    });
  });

  describe("inviteMember", () => {
    it("deve inserir um novo convite para membro", async () => {
      const mockMember = { name: "Alice", email: "alice@test.com", role: "editor" };
      const mockInsert = vi.fn().mockResolvedValue({ error: null });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      await B2BRepository.inviteMember("org123", mockMember);

      expect(supabase.from).toHaveBeenCalledWith("b2b_members");
      expect(mockInsert).toHaveBeenCalledWith({
        org_id: "org123",
        name: "Alice",
        email: "alice@test.com",
        role: "editor",
        status: "active"
      });
    });
  });

  describe("getOrgByOwner", () => {
    it("deve buscar organização pelo ID do proprietário", async () => {
      const mockData = { id: "org456", owner_id: "user1" };
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await B2BRepository.getOrgByOwner("user1");

      expect(supabase.from).toHaveBeenCalledWith("b2b_organizations");
      expect(result).toEqual(mockData);
    });
  });

  describe("listCampaigns", () => {
    it("deve listar campanhas ordenadas por data", async () => {
      const mockData = [{ id: "c1", title: "Summer Promo" }];
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      } as any);

      const result = await B2BRepository.listCampaigns("org123");

      expect(supabase.from).toHaveBeenCalledWith("b2b_campaigns");
      expect(result).toEqual(mockData);
    });
  });
});
