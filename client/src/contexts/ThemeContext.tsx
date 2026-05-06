import { useEffect, type ReactNode } from "react";
import { type Theme, useUiStore } from "@/stores/uiStore";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const configureTheme = useUiStore(state => state.configureTheme);

  useEffect(() => {
    configureTheme(defaultTheme, switchable);
  }, [configureTheme, defaultTheme, switchable]);

  return children;
}

export function useTheme(): ThemeContextType {
  const theme = useUiStore(state => state.theme);
  const toggleTheme = useUiStore(state => state.toggleTheme);
  const switchable = useUiStore(state => state.switchableTheme);

  return {
    theme,
    toggleTheme: switchable ? toggleTheme : undefined,
    switchable,
  };
}
