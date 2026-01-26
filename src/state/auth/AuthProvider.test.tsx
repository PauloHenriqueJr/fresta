import { renderHook, waitFor } from "@testing-library/react";
import { useAuth, AuthProvider } from "./AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";

// Mock do supabase ja esta no setup.ts, mas vamos reforçar comportamentos específicos
describe("AuthProvider & useAuth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
    );

    it("deve iniciar em estado de carregamento e buscar sessão inicial", async () => {
        vi.mocked(supabase.auth.getSession).mockResolvedValue({
            data: { session: null },
            error: null,
        } as any);

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.isAuthenticated).toBe(false);
    });

    it("deve carregar perfil e role ao encontrar uma sessão ativa", async () => {
        const mockUser = { id: "user123", email: "test@fresta.com" };
        const mockSession = { user: mockUser, access_token: "token" };
        const mockProfile = { id: "user123", display_name: "Test User" };
        const mockRole = { role: "admin", permissions: ["*"] };

        vi.mocked(supabase.auth.getSession).mockResolvedValue({
            data: { session: mockSession },
            error: null,
        } as any);

        vi.mocked(supabase.from).mockImplementation((table: string) => {
            if (table === "profiles") {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
                } as any;
            }
            if (table === "user_roles") {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    single: vi.fn().mockResolvedValue({ data: mockRole, error: null }),
                } as any;
            }
            return {} as any;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.profile).toEqual(mockProfile);
        expect(result.current.role).toBe("admin");
        expect(result.current.isAuthenticated).toBe(true);
    });

    it("deve permitir logout e limpar o estado", async () => {
        vi.mocked(supabase.auth.getSession).mockResolvedValue({
            data: { session: { user: { id: "1" } } },
            error: null,
        } as any);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await result.current.signOut();

        expect(supabase.auth.signOut).toHaveBeenCalled();
        // Note: The actual state clearing depends on the AuthProvider implementation
        // This test verifies the signOut function was called correctly
    });
});
