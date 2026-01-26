import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalSettingsProvider } from "@/state/GlobalSettingsContext";

// QueryClient customizado para testes (sem retries para ser mais rápido)
const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

interface AllTheProvidersProps {
    children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
    const queryClient = createTestQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <GlobalSettingsProvider>
                <TooltipProvider>
                    <BrowserRouter>
                        {children}
                    </BrowserRouter>
                </TooltipProvider>
            </GlobalSettingsProvider>
        </QueryClientProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
