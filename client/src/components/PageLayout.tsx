// Terminal Noir — Page Layout Wrapper
// Wraps all pages with AvailabilityBanner + Navigation + consistent padding
// Main content top padding adjusts dynamically when the banner is shown

import Navigation from "./Navigation";
import AvailabilityBanner, { BANNER_HEIGHT } from "./AvailabilityBanner";
import { useUiStore } from "@/stores/uiStore";

const NAV_HEIGHT = 64; // h-16 = 4rem = 64px

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({
  children,
  className = "",
}: PageLayoutProps) {
  const bannerVisible = useUiStore(state => state.bannerVisible);

  const topOffset = NAV_HEIGHT + (bannerVisible ? BANNER_HEIGHT : 0);

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.085 0.012 265)" }}
    >
      <AvailabilityBanner />
      <Navigation />
      <main
        className={className}
        style={{
          paddingTop: `${topOffset}px`,
          transition: "padding-top 0.3s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
}
