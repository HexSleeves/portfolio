import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BANNER_DISMISSED_KEY,
  DEFAULT_SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_KEY,
  THEME_KEY,
  createInitialUiState,
  useUiStore,
} from "./uiStore";

function createStorage() {
  const data = new Map<string, string>();
  return {
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    removeItem: (key: string) => data.delete(key),
    setItem: (key: string, value: string) => data.set(key, value),
  };
}

function resetStorage() {
  vi.stubGlobal("localStorage", createStorage());
  vi.stubGlobal("sessionStorage", createStorage());
  vi.stubGlobal("document", {
    documentElement: {
      className: "",
      classList: {
        contains: (className: string) =>
          document.documentElement.className.split(" ").includes(className),
        toggle: (className: string, force?: boolean) => {
          const classes = new Set(
            document.documentElement.className.split(" ").filter(Boolean)
          );
          if (force) {
            classes.add(className);
          } else {
            classes.delete(className);
          }
          document.documentElement.className = Array.from(classes).join(" ");
        },
      },
    },
  });
  localStorage.clear();
  sessionStorage.clear();
  document.documentElement.className = "";
}

describe("uiStore", () => {
  beforeEach(() => {
    resetStorage();
    useUiStore.setState({
      ...useUiStore.getInitialState(),
      ...createInitialUiState(),
    });
    vi.useRealTimers();
  });

  it("hydrates persisted theme, banner dismissal, and sidebar width", () => {
    localStorage.setItem(THEME_KEY, "light");
    localStorage.setItem(SIDEBAR_WIDTH_KEY, "360");
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "true");

    expect(createInitialUiState()).toMatchObject({
      theme: "light",
      bannerVisible: false,
      bannerDismissed: true,
      sidebarWidth: 360,
    });
  });

  it("persists theme changes and applies the document class", () => {
    useUiStore.getState().configureTheme("light", true);

    useUiStore.getState().setTheme("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    useUiStore.getState().toggleTheme();
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("dismisses the availability banner once for all consumers", () => {
    useUiStore.setState({ bannerVisible: true, bannerDismissed: false });

    useUiStore.getState().dismissBanner();

    expect(useUiStore.getState().bannerVisible).toBe(false);
    expect(useUiStore.getState().bannerDismissed).toBe(true);
    expect(sessionStorage.getItem(BANNER_DISMISSED_KEY)).toBe("true");
  });

  it("clamps and persists dashboard sidebar width", () => {
    useUiStore.getState().setSidebarWidth(50);
    expect(useUiStore.getState().sidebarWidth).toBe(200);

    useUiStore.getState().setSidebarWidth(999);
    expect(useUiStore.getState().sidebarWidth).toBe(480);

    useUiStore.getState().setSidebarWidth(320);
    expect(useUiStore.getState().sidebarWidth).toBe(320);
    expect(localStorage.getItem(SIDEBAR_WIDTH_KEY)).toBe("320");
  });

  it("resets transient page state without clearing persisted preferences", () => {
    useUiStore.setState({
      mobileNavOpen: true,
      dashboardResizing: true,
      blogCategory: "React",
      projectFilter: "featured",
      adminBlogSearch: "zustand",
      sidebarWidth: 360,
    });

    useUiStore.getState().resetTransientState();

    expect(useUiStore.getState()).toMatchObject({
      mobileNavOpen: false,
      dashboardResizing: false,
      blogCategory: "All",
      projectFilter: "all",
      adminBlogSearch: "",
      sidebarWidth: 360,
    });
  });

  it("uses the default sidebar width when storage is invalid", () => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, "wide");

    expect(createInitialUiState().sidebarWidth).toBe(DEFAULT_SIDEBAR_WIDTH);
  });
});
