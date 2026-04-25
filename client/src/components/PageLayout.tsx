// Terminal Noir — Page Layout Wrapper
// Wraps all pages with AvailabilityBanner + Navigation + consistent padding
// Main content top padding adjusts dynamically when the banner is shown

import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import AvailabilityBanner, { BANNER_HEIGHT } from "./AvailabilityBanner";

const STORAGE_KEY = "banner-dismissed-v2";
const NAV_HEIGHT = 64; // h-16 = 4rem = 64px

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setBannerVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  // Poll for banner dismissal
  useEffect(() => {
    if (!bannerVisible) return;
    const interval = setInterval(() => {
      if (sessionStorage.getItem(STORAGE_KEY)) setBannerVisible(false);
    }, 200);
    return () => clearInterval(interval);
  }, [bannerVisible]);

  const topOffset = NAV_HEIGHT + (bannerVisible ? BANNER_HEIGHT : 0);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.085 0.012 265)" }}>
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
