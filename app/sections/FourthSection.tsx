import React, { useCallback, useState } from "react";
import WhellCapsule from "../components/WhellCapsule";
import Image from "next/image";
import { items } from "../data/items"; 

const FourthSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const anglePerStep = 360 / items.length;
  const rotation = activeIndex * anglePerStep;

  const playClickSound = useCallback(() => {
    const audio = new Audio("/audio/audio-camara.mp3");
    audio.volume = 0.5;
    audio.currentTime = 0;
    audio.play().catch(() => {
      console.error("Error al reproducir el sonido");
    });
  }, [])

  const handleNext = () => {
    playClickSound();
    setIsImageLoading(true);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    playClickSound();
    setIsImageLoading(true);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const activeItem = items[activeIndex];

  return (
    <div 
      className="relative h-screen w-full overflow-hidden bg-cover bg-center bg-fixed font-mono text-white" 
      style={{ backgroundImage: "url('/w-bg.jpg')" }}
    >
      <div className="absolute inset-4 z-0 overflow-hidden rounded-4xl border-4 bg-slate-900">
        
        {/* Skeleton de carga */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-md animate-pulse z-0" />
        )}

        {/* Imagen de fondo */}
        <Image
          key={activeItem.id + activeIndex}
          src={activeItem.image}
          alt={activeItem.location}
          width={1920}
          height={1080}
          priority
          onLoad={() => setIsImageLoading(false)}
          className={`h-full w-full object-cover transition-all duration-700 ease-out ${
            isImageLoading 
              ? "scale-105 blur-xl opacity-0" 
              : "scale-100 blur-0 opacity-100"
          }`}
        />
        
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* 🟢 TARJETA SUPERIOR IZQUIERDA (Estilo HUD Cyberpunk) */}
        <div className="absolute left-16 top-16 z-50 max-w-sm rounded bg-slate-900/60 p-4 backdrop-blur-md border border-white/10 shadow-lg">
          {/* Encabezado: Badge + Título */}
          <div className="mb-2 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded bg-lime-500/20 px-2 py-0.5 text-[11px] font-semibold text-lime-400 border border-lime-400/30">
              <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
              {activeItem.badge}
            </span>
            <h2 className="text-xs font-bold tracking-widest text-white uppercase">
              {activeItem.title}
            </h2>
          </div>

          {/* Descripción */}
          <p className="text-[11px] leading-relaxed text-slate-300">
            {activeItem.description}
          </p>
        </div>

        {/* CONTROLES Y RUEDA */}
        <div className="absolute -right-62 top-1/2 flex -translate-y-1/2 items-center">
          <div className="mr-6 flex flex-col gap-3 z-10">
            <button
              onClick={handleNext}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#C7C8A3]/60 text-black transition hover:scale-110 hover:bg-[#C7C8A3] active:scale-95"
            >
              <span className="text-2xl">⇮</span>
            </button>
            <button
              onClick={handlePrev} 
              className="flex h-10 w-10 cursor-pointer rotate-180 items-center justify-center rounded-full bg-[#C7C8A3]/60 text-black transition hover:scale-110 hover:bg-[#C7C8A3] active:scale-95"
            >
              <span className="text-2xl">⇯</span>
            </button>
          </div>

          <div className="relative">
            <WhellCapsule 
              rotation={rotation} 
              activeIndex={activeIndex}
            />
          </div>
        </div>

        {/* MENÚ LATERAL IZQUIERDO */}
        <aside className="absolute left-6 top-1/2 flex -translate-y-1/2 flex-col gap-6 rounded-full bg-black/30 p-3 backdrop-blur-md z-10">
          <button className="flex flex-col items-center text-xs tracking-widest text-slate-200 hover:text-white">
            <span>S</span><span>O</span><span>U</span><span>N</span><span>D</span>
          </button>
        </aside>

        {/* FOOTER */}
        <footer className="absolute bottom-6 left-12 text-sm tracking-widest text-slate-200 z-10">
          <p>
            Sede de la organización de investigación aeroespacial de Kioto —{" "}
            <span className="font-bold text-lime-400">{activeItem.location}</span>
          </p>
        </footer>

      </div>
    </div>
  );
};

export default FourthSection;