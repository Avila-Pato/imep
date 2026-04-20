"use client";
import { useState } from "react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";

const NAV_ITEMS = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Nosotros", url: "/" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar-gradient fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <Image alt="IMEP logo" width={100} height={100} src="/logo5.png"
          className="w-10 h-10 sm:w-20 sm:h-20 md:w-15.5 md:h-15.5" />

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8 md:gap-10">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={item.url}
                className="font-luxury text-stone-200 text-sm md:text-lg tracking-widest uppercase hover:text-white transition-colors duration-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburguesa / X móvil */}
        <button
          className="md:hidden text-white/80 hover:text-white transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
