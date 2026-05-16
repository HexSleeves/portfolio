import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BANNER_DISMISSED_KEY,
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

  it("hydrates persisted theme and banner dismissal", () => {
    localStorage.setItem(THEME_KEY, "light");
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "true");

    expect(createInitialUiState()).toMatchObject({
      theme: "light",
      bannerVisible: false,
      bannerDismissed: true,
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

  it("centralizes cross-route UI state in Zustand", () => {
    useUiStore.getState().setMobileNavOpen(true);
    useUiStore.getState().setScrolled(true);
    useUiStore.getState().setProjectFilter("professional");
    useUiStore.getState().setBlogCategory("Engineering");
    useUiStore.getState().setAdminBlogSearch("zustand");

    expect(useUiStore.getState()).toMatchObject({
      mobileNavOpen: true,
      scrolled: true,
      projectFilter: "professional",
      blogCategory: "Engineering",
      adminBlogSearch: "zustand",
    });
  });

  it("resets transient UI state without clearing persisted preferences", () => {
    useUiStore.setState({
      mobileNavOpen: true,
      scrolled: true,
      blogCategory: "Engineering",
      projectFilter: "professional",
      adminBlogSearch: "zustand",
      theme: "dark",
      bannerDismissed: true,
    });

    useUiStore.getState().resetUiSession();

    expect(useUiStore.getState()).toMatchObject({
      mobileNavOpen: false,
      scrolled: false,
      blogCategory: "All",
      projectFilter: "all",
      adminBlogSearch: "",
      theme: "dark",
      bannerDismissed: true,
    });
  });
});
