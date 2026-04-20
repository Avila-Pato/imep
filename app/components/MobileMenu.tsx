"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const NAV_ITEMS = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Nosotros", url: "/" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    if (open) {
      gsap.set(root, { pointerEvents: "auto" });
      gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" });
      gsap.fromTo(panel,
        { scale: 0.92, opacity: 0, y: -16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(root, { opacity: 0, duration: 0.3, ease: "none",
        onComplete: () => gsap.set(root, { pointerEvents: "none" }) });
      gsap.to(panel, { scale: 0.92, opacity: 0, y: -12, duration: 0.3, ease: "power3.in" });
    }
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-99 flex items-center justify-center px-6 pointer-events-none opacity-0"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-[50vh] max-w-sm rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex  justify-end    border-b border-white/10">
          {/* <span className="font-luxury text-white/60 text-xs tracking-widest uppercase">Menú</span> */}
          <button onClick={onClose} aria-label="Cerrar"
           className="text-white/50  hover:text-white transition-colors ">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col items-center justify-center flex-1 py-8 px-6 gap-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              onClick={onClose}
              className="w-full text-center font-luxury text-stone-100 text-3xl tracking-[0.2em] uppercase py-4 border-b border-white/10 last:border-none hover:text-white hover:tracking-[0.3em] transition-all duration-300 [text-shadow:0_2px_12px_rgba(255,255,255,0.15)]"
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
