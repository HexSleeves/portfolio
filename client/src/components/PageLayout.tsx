// Terminal Noir — Page Layout Wrapper
// Wraps all pages with Navigation + consistent padding

import Navigation from "./Navigation";
import AvailabilityBanner from "./AvailabilityBanner";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.085 0.012 265)" }}>
      <AvailabilityBanner />
      <Navigation />
      <main className={`pt-16 ${className}`}>
        {children}
      </main>
    </div>
  );
}
