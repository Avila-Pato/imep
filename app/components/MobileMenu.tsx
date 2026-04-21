"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

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
      gsap.fromTo(
        root,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "none" },
      );
      gsap.fromTo(
        panel,
        { scale: 0.92, opacity: 0, y: -16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      );
    } else {
      gsap.to(root, {
        opacity: 0,
        duration: 0.3,
        ease: "none",
        onComplete: () => gsap.set(root, { pointerEvents: "none" }),
      });
      gsap.to(panel, {
        scale: 0.92,
        opacity: 0,
        y: -12,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-99 flex 
      items-center justify-center px-6  pointer-events-none opacity-0"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full  h-[50vh] max-w-sm rounded-2xl
         bg-white/10 backdrop-blur-2xl border   border-white/15 shadow-2xl overflow-hidden "
      >
        {/* Header */}
        <div className="flex justify-center items-center  border-b border-white/15  h-20">
        <Image
          alt="IMEP logo"
          width={100}
          height={100}
          src="/logo5.png"
          className="w-13.5 h-13.5 "
          />
          </div>

        {/* Links */}
        <nav className="flex flex-col px-6  translate-y-1/2 gap-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              onClick={onClose}
              className="w-full text-center font-luxury  text-stone-100 text-xl tracking-[0.2em] uppercase py-4 border-b border-white/10 last:border-none hover:text-white hover:tracking-[0.3em] transition-all duration-300 [text-shadow:0_2px_12px_rgba(255,255,255,0.15)]"
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
