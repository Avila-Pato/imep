import React from "react";
import Image from "next/image";
import { items } from "../data/items";

const WhellCapsule = ({ rotation = 0, activeIndex = 0 }) => {
  const radius = 160; 
  const dotsRadius = 50; // Radio exacto del anillo de botones
  const ticksRadius = 180; // Radio de las muecas

  const dotsOffsetAngle = 130; // Ángulo de desplazamiento del anillo de botones
  const cardsOffsetAngle = 58; // Ángulo de desplazamiento de las tarjetas
  const ticksOffsetAngle = 40; // Ángulo de desplazamiento de las muecas

  const angleStep = 360 / items.length;
  const baseRotation = 50;
  const currentRotation = baseRotation + rotation;

  //  ÁNGULO Y POSICIÓN ESTÁTICA DEL PUNTO VERDE
  // Se calcula usando baseRotation + dotsOffsetAngle para que coincida exactamente
  // en la posición fija donde "aterrizan" los puntos al girar la rueda.
  const fixedAngle = baseRotation + dotsOffsetAngle;
  const fixedAngleRad = (fixedAngle * Math.PI) / 180;
  const activeDotX = Math.cos(fixedAngleRad) * dotsRadius;
  const activeDotY = Math.sin(fixedAngleRad) * dotsRadius;

  return (
    <main className="flex h-full w-full items-center justify-center">
      <div className="relative flex items-center justify-center">
        
        {/* 1. RUEDA GIRATORIA (Contiene el Dial, Fotos y Aros Grises) */}
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
            className="h-[55vh] max-h-137.5 w-auto max-w-none rounded-full"
            style={{ backdropFilter: "blur(7px)" }}
          >
            <g>
              <circle
              cx="361"
              cy="361"
              r="361"
              fill="#C7C8A3"
              fillOpacity="0.3"
            />
            </g>
          </svg>

          {/* Elementos distribuidos en la rueda */}
          <div className="absolute inset-0 flex items-center justify-center">
            {items.map((item, index) => {
              const baseAngle = index * angleStep;

              // TARJETAS (Imagen + Texto)
              const cardAngle = baseAngle + cardsOffsetAngle;
              const cardAngleInRad = (cardAngle * Math.PI) / 180;
              const x = Math.cos(cardAngleInRad) * radius;
              const y = Math.sin(cardAngleInRad) * radius;

              // PUNTOS APAGADOS QUE GIRAN
              const dotAngle = baseAngle + dotsOffsetAngle;
              const dotAngleInRad = (dotAngle * Math.PI) / 180;
              const dotX = Math.cos(dotAngleInRad) * dotsRadius;
              const dotY = Math.sin(dotAngleInRad) * dotsRadius;

              //MUECAS / RAYIAS NEGRAS
              const tickAngle = baseAngle + ticksOffsetAngle;
              const tickAngleInRad = (tickAngle * Math.PI) / 180;
              const tickX = Math.cos(tickAngleInRad) * ticksRadius;
              const tickY = Math.sin(tickAngleInRad) * ticksRadius;

              return (
                <React.Fragment key={item.id}>
                  {/* ⚡ MUESCAS / RAYITAS NEGRAS DEL BORDE */}
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      transform: `translate(${tickX.toFixed(3)}px, ${tickY.toFixed(3)}px) rotate(${tickAngle.toFixed(3)}deg)`,
                    }}
                  >
                    <div className="h-1 w-4 rounded-full bg-black/40 shadow-xs" />
                  </div>
                  {/* Tarjetas */}
                  <div
                    className="absolute flex items-center font-mono text-white/90"
                    style={{
                      transform: `translate(${x.toFixed(3)}px, ${y.toFixed(3)}px) rotate(${cardAngle.toFixed(3)}deg)`,
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="flex rotate-180 items-center">
                      <div className="relative h-8 w-12 shrink-0 overflow-hidden rounded border border-white/30 shadow-md">
                        <Image
                          src={item.image}
                          alt={item.location}
                          fill
                          className="bg-fixed bg-cover"
                        />
                      </div>

                      <div className="absolute translate-x-12.5 flex flex-col text-right text-[10px] leading-tight drop-shadow-md w-full">
                        <span className="font-semibold tracking-wider text-white">
                          {item.location}
                        </span>
                        <span className="text-[4px] text-slate-300">
                          {item.status}
                        </span>
                        <span className="text-[6px] text-slate-400">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Círculos base (Todos grises/apagados porque van rotando) */}
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      transform: `translate(${dotX.toFixed(3)}px, ${dotY.toFixed(3)}px)`,
                    }}
                  >
                    <div className="flex h-3 w-3 items-center justify-center rounded-full border-[2.5px] border-black/40 bg-black/20 backdrop-blur-xs">
                      <span className="h-2 w-2 rounded-full bg-white/70" />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 2. 🟢 PUNTO VERDE FIJO (ESTÁTICO) */}
        {/* Queda afuera del div con "rotate", por ende NUNCA se esconderá ni se moverá de su lugar */}
        <div
          className="pointer-events-none absolute flex items-center justify-center z-20"
          style={{
            transform: `translate(${activeDotX.toFixed(3)}px, ${activeDotY.toFixed(3)}px)`,
          }}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-500/20 shadow-[0_0_15px_#a3e635] ring-1 ring-lime-400/60">
            <span className="h-4 w-4 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
          </div>
        </div>

      </div>
    </main>
  );
};

export default WhellCapsule;