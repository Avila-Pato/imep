"use client";

import Image from "next/image";
import gsap from "gsap";
import { useEffect } from "react";
import { SplitText } from "gsap/all";
import Navbar from "./components/navbar";
import SecondSection from "./sections/SecondSection";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowDecorative from "./components/ArrowDecorative";
import ThirdSection from "./sections/ThirdSection";
import FourthSection from "./sections/FourthSection";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);


export default function Home() {
  // Efecto para las imagenes
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".shape",
      { y: 200, opacity: 0, scale: 1.2 },
      { y: 0, opacity: 1, scale: 1, duration: 1.8, ease: "back.inOut(0.7)" },
      "-=0.7",
    ).fromTo(
      ".bee",
      { y: 250, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "back.inOut(0.7)" },
      "-=0.7",
    );
  }, []);

  // Efecto para el texto
  useEffect(() => {
    const animProps = (delay: number) => ({
      type: "chars" as const,
      autoSplit: true,
      onSplit: (self: { chars: Element[] }) => {
        gsap.from(self.chars, {
          opacity: 0,
          scale: 0,
          y: 20,
          rotationX: 90,
          transformOrigin: "0% 50% -50",
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.03,
          delay,
        });
      },
    });
    SplitText.create(".p_text_1", animProps(0));
    SplitText.create(".p_text_2", animProps(0.9));
  }, []);

  //Efecto para scroll

  useEffect(() => {
    //isntanacia a lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      smoothWheel: true,
  })

  //actalizar scrolltriger cuando Lenis haga scroll
  lenis.on("scroll", ScrollTrigger.update)

  // funcion que se ejecuta en cada frame
  const update = (timer: number) => {
    lenis.raf(timer * 1000)
  }

  //GSAP controla el render de lenis
  gsap.ticker.add(update)
  //Evita que GSAP  intente retrasos
  gsap.ticker.lagSmoothing(0)

  //Limpiar lenis
  return () => {
    gsap.ticker.remove(update)
    lenis.destroy()
  }

    }, [])

  return (
    <>
    <main className="scene  w-full relative  h-[90vh] md:h-screen overflow-hidden bg-[url('/assets/landscape2.png')] bg-no-repeat bg-cover">
      {/* Gradiente inferior que fusiona con la sección siguiente */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-30" style={{ background: "linear-gradient(to bottom, transparent, black)" }} />
      <Navbar />

      <section className="w-full h-full  flex justify-center items-center text-center
       md:translate-y-32 
      sm:-translate-y-20 xl:translate-y-0 xl:-translate-x-2 md:-translate-x-12 ">
      <div className="p_text_1 absolute lg:top-[55%] lg:left-[20%]
       xl:left-[12%] xl:top-[75%] sm:left-[10%] sm:top-[70%]
        md:top-[60%] md:left-[10%]  top-[65%] left-[2%] xl:translate-x-48 
        2xl:translate-x-56 md:translate-x-20
       xl:-translate-y-60 md:-translate-y-45  
       z-30  text-stone-200 tracking-wide [text-shadow:2px_4px_12px_rgba(0,0,0,0.5)]">
        <h2 className="xl:text-8xl lg:text-7xl md:text-6xl text-[1.5rem] text-center font-luxury">
          A
          <br />
          quién
        </h2>
        <div className="flex justify-center">
        <p className=" font-serif italic text-md">Juan 6:67,68</p>
        </div>
      </div>

      <div className=" p_text_2 absolute lg:top-[-10%] 
       xl:top-[3%] md:top-[-5%] 
       top-[50%] left-[24%] sm:left-[30%] sm:top-[50%]
       xl:left-[37%] 2xl:left-[40%] 
       z-5
       text-stone-200 xl:text-[9rem] lg:text-[8rem] 
       md:text-[6rem] sm:text-[3rem] text-[2.3rem]
        font-luxury leading-none
       transform scale-x-[1.2]
       origin-left tracking-wide
        [text-shadow:2px_4px_12px_rgba(0,0,0,0.5)]   ">
        <h1>
          Iremos
          <br />
          Nosotros 
          <strong className="font-pinyon">
            ?
          </strong>
        </h1>
      </div>
      </section>

      {/* imagen de cesped con obeja */}

      <div className="shape absolute bottom-0 right-0 z-20  
      
      ">
        <div className="relative  ">
          <Image
            alt="img"
            src="/assets/shapeDown3.png"
            width={1100}
            height={1100}
            loading="eager"
          />
          <div className="bee absolute xl:top-[56%]  lg:top-[23%] 
          md:top-[20%] md:left-[40%] left-[-5%] top-[-10%] lg:left-[43%] 
           xl:-translate-x-1/2 md:-translate-x-[35%]  xl:-translate-y-1/2     
           xl:scale-[1.6] lg:scale-[1.8] md:scale-[2.2] sm:scale-125   z-[-1] ">
            <Image
              alt="img"
              src="/assets/Bee.png"
              width={900}
              height={900}
              priority
              className="scale-110 md:scale-120"
            />
          </div>
        </div>
      </div>
    </main>
    {/* ── Segunda sección ───────────────────────────────────────────── */}
    <SecondSection />
    {/* ──── Flecha decorativa ───────────────────────────────────────── */}
      <ArrowDecorative />
      {/* ── Tercera sección ──────────────────────────────────────────── */}
      <ThirdSection />
      {/* ──── Cuarta sección ───────────────────────────────────────── */}
      <FourthSection />
      {/* Seccion del MAPA */}
    </>
  );
}
