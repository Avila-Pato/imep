import React from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Acerca", url: "/about" },
];

const Navbar = () => {
  return (
    <nav className="navbar-gradient fixed top-0 left-0 right-0 z-50 flex items-center gap-6">
        {/* Logo */}
        <Image
          alt="IMEP logo"
          width={100}
          height={100}
          src="/logo5.png"
          className="w-10 h-10 sm:w-20 sm:h-20 md:w-15.5 md:h-15.5"
        />

        <div className="">
          {/* Nav links */}
          <ul className="flex items-center gap-5 sm:gap-8 md:gap-10 ">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  className="font-luxury  text-stone-200 text-sm sm:text-base md:text-lg tracking-widest uppercase hover:text-white transition-colors duration-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
    </nav>
  );
};

export default Navbar;
