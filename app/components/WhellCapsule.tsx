import React from "react";
import Image from "next/image";
import { items } from "../data/items";

const WhellCapsule = ({ rotation = 0, activeIndex = 0 }) => {
  const radius = 150; 
  const dotsRadius = 70; // Radio exacto del anillo de botones
  const angleStep = 360 / items.length;
  const baseRotation = 50;
  const currentRotation = baseRotation + rotation;

  return (
    <main className="flex h-full w-full items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          className="relative flex items-center justify-center"
        >
          {/* SVG Dial de Fondo */}
          <svg
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 722 722"
            role="presentation"
            aria-hidden="true"
            className="h-[65vh] max-h-[550px] w-auto max-w-none"
          >
            <g>
              <path
                fillOpacity="0.4"
                fill="#C7C8A3"
                d="M361 0c199.375 0 361 161.625 361 361S560.375 722 361 722 0 560.375 0 361 161.625 0 361 0m82.602 675.174-1.414 2.449 3.076 11.481 2.449 1.414 2.95-.79 1.414-2.45-3.076-11.481-2.45-1.414zm-170.603.622-3.076 11.481 1.414 2.45 2.95.79 2.449-1.414 3.076-11.481-1.414-2.449-2.95-.791zm-145.607-86.174-8.405 8.404v2.828l2.159 2.161h2.829l8.404-8.406v-2.829l-2.159-2.158zm462.229 2.159v2.828l8.405 8.405h2.828l2.16-2.16v-2.828l-8.405-8.404h-2.828zM32.898 445.264l-1.415 2.449.791 2.95 2.45 1.414 11.48-3.076 1.414-2.449-.79-2.95-2.45-1.414zm642.275-1.662-.79 2.95 1.414 2.449 11.48 3.076 2.45-1.414.791-2.95-1.414-2.449-11.482-3.076zm-642.9-172.264-.79 2.949 1.414 2.45 11.48 3.076 2.451-1.415.79-2.949L46.202 273l-11.48-3.076zm643.524 1.661-1.414 2.449.79 2.951 2.449 1.414 11.482-3.077 1.414-2.449-.791-2.95-2.45-1.414zM118.986 121.146v2.829l8.405 8.404h2.828l2.16-2.159v-2.828l-8.405-8.406h-2.828zm479.04-2.16-8.405 8.405v2.829l2.16 2.159h2.828l8.405-8.404v-2.829l-2.16-2.16zM271.337 32.273l-1.414 2.45 3.076 11.481 2.45 1.414 2.949-.79 1.414-2.45-3.076-11.48-2.449-1.415zm173.927.624-3.076 11.48 1.414 2.45 2.95.791 2.449-1.414 3.076-11.481-1.414-2.45-2.95-.79z"
              />
            </g>
          </svg>

          {/* Elementos distribuidos en la rueda */}
          <div className="absolute inset-0 flex items-center justify-center">
            {items.map((item, index) => {
              const angle = index * angleStep;
              const angleInRad = (angle * Math.PI) / 180;

              // Posición para las tarjetas (más externas)
              const x = Math.cos(angleInRad) * radius;
              const y = Math.sin(angleInRad) * radius;

              // Posición para los círculos (anillo interior)
              const dotX = Math.cos(angleInRad) * dotsRadius;
              const dotY = Math.sin(angleInRad) * dotsRadius;

              const isSelected = index === activeIndex;

              return (
                <React.Fragment key={item.id}>
                  {/* Tarjetas con Imagen y Texto */}
                  <div
                    className="absolute flex items-center font-mono text-white/90"
                    style={{
                      transform: `translate(${x.toFixed(3)}px, ${y.toFixed(3)}px) rotate(${angle.toFixed(3)}deg)`,
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="flex flex-col rotate-180 items-center gap-2">
                      <div className="relative h-8 w-12 shrink-0 overflow-hidden rounded border border-white/30 shadow-md">
                        <Image
                          src={item.image}
                          alt={item.location}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-col text-right text-[10px] leading-tight drop-shadow-md">
                        <span className="font-semibold tracking-wider text-white">
                          {item.location}
                        </span>
                        <span className="text-[8px] text-slate-300">
                          {item.status}
                        </span>
                        <span className="text-[8px] text-slate-400">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🟢 Círculos integrados en la rueda (se prende el verde cuando es seleccionado) */}
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      transform: `translate(${dotX.toFixed(3)}px, ${dotY.toFixed(3)}px)`,
                    }}
                  >
                    {isSelected ? (
                      /* Círculo encendido en verde */
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-500/20 shadow-[0_0_15px_#a3e635] ring-1 ring-lime-400/60 transition-all duration-300">
                        <span className="h-4 w-4 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
                      </div>
                    ) : (
                      /* Círculo apagado (Aro gris) */
                      <div className="flex h-3 w-3 items-center justify-center rounded-full border-[2.5px] border-black/40 bg-black/20 backdrop-blur-xs transition-all duration-300">
                        <span className="h-2 w-2 rounded-full bg-white/70" />
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default WhellCapsule;