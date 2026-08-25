"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";

const NAV_ITEMS = [
  { id: 1, title: "Inicio", url: "/" },
  { id: 2, title: "Nosotros", url: "/" },
  { id: 3, title: "Ministerios", url: "/" },
  { id: 4, title: "Contacto", url: "/" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50
        flex items-center justify-between px-6 md:px-10 py-3 md:py-2
        transition-all duration-300
        ${scrolled ? "bg-[#FFFAF0]/95 backdrop-blur-md shadow-md" : "bg-transparent"}`}
      >
        <div className={`flex items-center gap-2 transition-colors duration-300 ${scrolled ? "text-neutral-900" : "text-white"}`}>
          <Image alt="IMEP logo" width={100} height={100} src="/logo3.png"
            className="w-9 h-9 md:w-12.5 md:h-12.5" />
          <h2 className="text-lg md:text-3xl font-bold tracking-widest uppercase leading-none">
            IMEP
          </h2>
        </div>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8 md:gap-10">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={item.url}
                className={`font-sans text-sm md:text-lg tracking-widest uppercase
                transition-colors duration-300
                ${scrolled
                  ? "text-neutral-700 hover:text-red-600"
                  : "text-stone-200 hover:text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]"
                }`}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburguesa / X móvil */}
        <button
          className={`md:hidden transition-colors ${scrolled ? "text-neutral-800/80 hover:text-neutral-900" : "text-white/80 hover:text-white"}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
