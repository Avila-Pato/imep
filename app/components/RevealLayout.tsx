"use client";

import { useState } from "react";
import LandingRevealAnimation from "./Loader";

export default function RevealLayout({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <LandingRevealAnimation
        onExitStart={() => setRevealed(true)}
        onReveal={() => setRevealed(true)}
      />
      <div
        className={`transition-opacity duration-700 ${
          revealed 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none h-screen overflow-hidden"
        }`}
      >
        {children}
      </div>
    </>
  );
}