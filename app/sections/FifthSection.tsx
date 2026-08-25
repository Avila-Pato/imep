"use client";

import React from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-white/40" />,
});

const HORARIOS = [
  { dia: "Martes", hora: "7:30 PM" },
  { dia: "Jueves", hora: "7:30 PM" },
  { dia: "Domingo", hora: "6:30 PM" },
];

const FifthSection = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#FFF1D0] to-[#FAEBD7] grid grid-cols-2">
      {/* Secttion 1 */}
      <section className="flex flex-col justify-center items-center text-center">
        <div className="w-3/4 flex flex-col gap-8">
          <div>
            <p className="text-sm font-semibold tracking-[0.4em] text-red-500 uppercase mb-2">
              Te esperamos
            </p>
            <h2 className="text-4xl font-bold text-neutral-800">
              Horarios de Culto
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              Pje. Volcán Tronador 859, El Bosque
            </p>
          </div>

          <div className="relative pl-10 text-left">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-red-300/60 rounded-full" />
            <div className="flex flex-col gap-6">
              {HORARIOS.map(({ dia, hora }, i) => (
                <div key={dia} className="relative">
                  <span className="absolute -left-7 top-4 h-3 w-3 rounded-full bg-red-500 ring-4 ring-[#FFF1D0]" />
                  <div
                    className="bg-white/70 backdrop-blur-sm text-center rounded-2xl px-6 py-4 shadow-md border border-white/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <h3 className="text-xl font-bold text-neutral-800">
                      {dia}
                    </h3>
                    <p className="text-[11px] font-semibold tracking-[0.25em] text-red-400 uppercase mt-1">
                      Culto
                    </p>
                    <p className="text-lg font-bold text-red-600 mt-2 tabular-nums">
                      {hora}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secttion 2 */}
      <section className="h-full w-full z-40">
        <MapView />
      </section>
    </div>
  );
};

export default FifthSection;
