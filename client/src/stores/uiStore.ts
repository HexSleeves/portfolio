import { create } from "zustand";

export type Theme = "light" | "dark";

export const THEME_KEY = "theme";
export const BANNER_DISMISSED_KEY = "banner-dismissed-v2";

type UiStateValues = {
  theme: Theme;
  switchableTheme: boolean;
  bannerVisible: boolean;
  bannerDismissed: boolean;
  mobileNavOpen: boolean;
  scrolled: boolean;
  blogCategory: string;
  projectFilter: string;
  adminBlogSearch: string;
};

type UiStore = UiStateValues & {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  configureTheme: (theme: Theme, switchable: boolean) => void;
  showBanner: () => void;
  dismissBanner: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setScrolled: (scrolled: boolean) => void;
  setBlogCategory: (category: string) => void;
  setProjectFilter: (filter: string) => void;
  setAdminBlogSearch: (search: string) => void;
  resetUiSession: () => void;
};

function getStorage(kind: "localStorage" | "sessionStorage") {
  if (typeof window !== "undefined" && window[kind]) return window[kind];
  return globalThis[kind];
}

function readStorage(kind: "localStorage" | "sessionStorage", key: string) {
  try {
    return getStorage(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeStorage(
  kind: "localStorage" | "sessionStorage",
  key: string,
  value: string
) {
  try {
    getStorage(kind)?.setItem(key, value);
  } catch {
    // Storage can be unavailable in private browsing or server-side tests.
  }
}

function applyThemeClass(theme: Theme) {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  root.classList.toggle("dark", theme === "dark");
}

function parseTheme(value: string | null, fallback: Theme): Theme {
  return value === "light" || value === "dark" ? value : fallback;
}

export function createInitialUiState(
  defaultTheme: Theme = "dark"
): UiStateValues {
  const bannerDismissed =
    readStorage("sessionStorage", BANNER_DISMISSED_KEY) === "true";

  return {
    theme: parseTheme(readStorage("localStorage", THEME_KEY), defaultTheme),
    switchableTheme: false,
    bannerVisible: !bannerDismissed,
    bannerDismissed,
    mobileNavOpen: false,
    scrolled: false,
    blogCategory: "All",
    projectFilter: "all",
    adminBlogSearch: "",
  };
}

export const useUiStore = create<UiStore>((set, get) => ({
  ...createInitialUiState(),
  setTheme: theme => {
    set({ theme });
    applyThemeClass(theme);
    if (get().switchableTheme) {
      writeStorage("localStorage", THEME_KEY, theme);
    }
  },
  toggleTheme: () => {
    get().setTheme(get().theme === "light" ? "dark" : "light");
  },
  configureTheme: (theme, switchable) => {
    const nextTheme = switchable
      ? parseTheme(readStorage("localStorage", THEME_KEY), theme)
      : theme;
    set({ theme: nextTheme, switchableTheme: switchable });
    applyThemeClass(nextTheme);
    if (switchable) {
      writeStorage("localStorage", THEME_KEY, nextTheme);
    }
  },
  showBanner: () => {
    if (!get().bannerDismissed) set({ bannerVisible: true });
  },
  dismissBanner: () => {
    writeStorage("sessionStorage", BANNER_DISMISSED_KEY, "true");
    set({ bannerVisible: false, bannerDismissed: true });
  },
  setMobileNavOpen: mobileNavOpen => set({ mobileNavOpen }),
  setScrolled: scrolled => set({ scrolled }),
  setBlogCategory: blogCategory => set({ blogCategory }),
  setProjectFilter: projectFilter => set({ projectFilter }),
  setAdminBlogSearch: adminBlogSearch => set({ adminBlogSearch }),
  resetUiSession: () =>
    set({
      mobileNavOpen: false,
      scrolled: false,
      blogCategory: "All",
      projectFilter: "all",
      adminBlogSearch: "",
    }),
}));
