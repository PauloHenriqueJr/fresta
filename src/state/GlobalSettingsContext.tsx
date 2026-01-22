import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";

interface GlobalSettings {
    activeTheme: string;
}

interface GlobalSettingsContextType {
    settings: GlobalSettings;
    isLoading: boolean;
    updateSetting: (key: string, value: any) => Promise<void>;
}

const defaultSettings: GlobalSettings = {
    activeTheme: "carnaval", // fallback
};

const GlobalSettingsContext = createContext<GlobalSettingsContextType>({
    settings: defaultSettings,
    isLoading: true,
    updateSetting: async () => { },
});

export const useGlobalSettings = () => useContext(GlobalSettingsContext);

export const GlobalSettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from("site_settings")
                .select("key, value");

            if (error) throw error;

            if (data) {
                const newSettings = { ...defaultSettings };
                data.forEach((row) => {
                    if (row.key === "active_theme") newSettings.activeTheme = row.value;
                    // Add mappings for other keys here if needed
                });
                setSettings(newSettings);
            }
        } catch (error) {
            console.error("Error fetching site settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Subscribe to changes
        const channel = supabase
            .channel("site_settings_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "site_settings",
                },
                () => {
                    // On any change, just re-fetch for simplicity
                    fetchSettings();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const updateSetting = async (key: string, value: any) => {
        const { error } = await supabase
            .from("site_settings")
            .upsert({ key, value });

        if (error) throw error;
        // Optimistic update or wait for subscription
        await fetchSettings();
    };

    return (
        <GlobalSettingsContext.Provider value={{ settings, isLoading, updateSetting }}>
            {children}
        </GlobalSettingsContext.Provider>
    );
};
