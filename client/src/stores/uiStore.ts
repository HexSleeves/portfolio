import { create } from "zustand";

export type Theme = "light" | "dark";

export const THEME_KEY = "theme";
export const BANNER_DISMISSED_KEY = "banner-dismissed-v2";
export const SIDEBAR_WIDTH_KEY = "sidebar-width";
export const DEFAULT_SIDEBAR_WIDTH = 280;
export const MIN_SIDEBAR_WIDTH = 200;
export const MAX_SIDEBAR_WIDTH = 480;

type UiStateValues = {
  theme: Theme;
  switchableTheme: boolean;
  bannerVisible: boolean;
  bannerDismissed: boolean;
  mobileNavOpen: boolean;
  scrolled: boolean;
  sidebarWidth: number;
  dashboardResizing: boolean;
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
  setSidebarWidth: (width: number) => void;
  setDashboardResizing: (resizing: boolean) => void;
  setBlogCategory: (category: string) => void;
  setProjectFilter: (filter: string) => void;
  setAdminBlogSearch: (search: string) => void;
  resetTransientState: () => void;
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

function clampSidebarWidth(width: number) {
  if (!Number.isFinite(width)) return DEFAULT_SIDEBAR_WIDTH;
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width));
}

function readSidebarWidth() {
  const stored = readStorage("localStorage", SIDEBAR_WIDTH_KEY);
  if (!stored) return DEFAULT_SIDEBAR_WIDTH;
  const parsed = Number.parseInt(stored, 10);
  return Number.isNaN(parsed)
    ? DEFAULT_SIDEBAR_WIDTH
    : clampSidebarWidth(parsed);
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
    sidebarWidth: readSidebarWidth(),
    dashboardResizing: false,
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
  setSidebarWidth: width => {
    const sidebarWidth = clampSidebarWidth(width);
    writeStorage("localStorage", SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
    set({ sidebarWidth });
  },
  setDashboardResizing: dashboardResizing => set({ dashboardResizing }),
  setBlogCategory: blogCategory => set({ blogCategory }),
  setProjectFilter: projectFilter => set({ projectFilter }),
  setAdminBlogSearch: adminBlogSearch => set({ adminBlogSearch }),
  resetTransientState: () =>
    set({
      mobileNavOpen: false,
      dashboardResizing: false,
      blogCategory: "All",
      projectFilter: "all",
      adminBlogSearch: "",
    }),
}));
