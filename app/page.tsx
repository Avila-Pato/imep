"use client";

import Image from "next/image";
import gsap from "gsap";
import { useEffect } from "react";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);
export default function Home() {
  // Efecto para las imagenes
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".shape",
      { y: 200, opacity: 0, scale: 1.2 },
      { y: 0, opacity: 1, scale: 1, duration: 1.8, ease: "back.inOut(1.7)" },
      "-=0.5",
    ).fromTo(
      ".bee",
      { y: 250, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "back.inOut(0.7)" },
      "-=0.7",
    );
  }, []);

  useEffect(() => {
    SplitText.create(".p_text", {
      type: "chars",
      autoSplit: true,
      onSplit: (self) => {
        gsap.from(self.chars, {
          opacity: 0,
          scale: 0,
          y: 20,
          rotationX: 90,
          transformOrigin: "0% 50% -50",
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.03,
        });
      },
    });
  }, []);

  return (
    <main className="scene w-screen relative h-screen bg-[url('/assets/landscape2.png')] bg-no-repeat bg-cover">
      <div className="bee  absolute top-[47%] left-[50%] -translate-x-1/2 -translate-y-1/2 scale-[1.6] z-10">
        <Image
          alt="img"
          src="/assets/Bee.png"
          width={900}
          height={900}
          priority
        />
      </div>

      <div className="p_text absolute top-[65%] left-[10%] translate-x-56 -translate-y-60 z-30  text-stone-200 tracking-wide [text-shadow:2px_4px_12px_rgba(0,0,0,0.5)]">
        <h2 className="text-8xl text-center font-luxury">
          A
          <br />
          quién
        </h2>
        <div className="flex justify-center">
        <p className=" font-serif italic text-xl  ">Juan 6:67,68</p>
        </div>
      </div>

      <div className=" p_text absolute top-[-0%] left-[40%] z-5  text-stone-200 text-[10rem] font-luxury leading-none scale-x-[1.2] origin-left tracking-wide [text-shadow:2px_4px_12px_rgba(0,0,0,0.5)]">
        <h1>
          Iremos
          <br />
          Nosotros 
          <strong className="font-pinyon">
            ?
          </strong>
        </h1>
      </div>

      <div className="shape absolute bottom-0 right-0 z-20">
        <Image
          alt="img"
          src="/assets/shapeDown3.png"
          width={1500}
          height={1300}
        />
      </div>
    </main>
  );
}
