"use client";
import React from "react";
import Image from "next/image";

const ThirdSection = () => {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
      style={{ backgroundImage: "url('/w-bg.jpg')" }}
    >
      {/* Star mask centrada en la parte superior */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/star-mask.svg"
          alt="star mask"
          width={220}
          height={220}
        />
      </div>

      <p className="text-white/40 text-sm tracking-widest uppercase">Próxima sección</p>
    </section>
  );
};

export default ThirdSection;
