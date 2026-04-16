"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Lenis from "lenis";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SecondSection = () => {

  // ── Scroll Parallaz with img ─────────────────────────────────────────────────────────────────
  const stickyContainer = useRef<HTMLDivElement| null>(null);

  useGSAP(() => {
    // Estado inicial para que GSAP pueda interpolar el clipPath
    gsap.set(".g-img3", { clipPath: "inset(0% 0% 0% 0% round 4px)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stickyContainer.current,
        start: "top top",
        end: "+=300%",
        scrub: 2,
        pin: true,
        pinSpacing: true,
      },
    });

    // Fase 1 — zoom
    tl.to(".g-img3", {
      scale: 1.8,
      ease: "none",
      duration: 1,
      transformOrigin: "center 15%",
    })
    // Fase 2 — se convierte en puerta/arco
    .to(".g-img3", {
      clipPath: "inset(40% 40% -30% 40% round 999px 999px 12px 12px)",
      ease: "none",
      duration: 2,
    })
    // Las otras imgs se van desvaneciendo mientras aparece el arco
    .to(
      [".g-img1",".g-img2",".g-img4",".g-img5",".g-img6",".g-img7"],
      { opacity: 0, ease: "none", duration: 0.7 },
      "<0.2"
    );
  })

  // ── Cursor ──────────────────────────────────────────────────────────
  useEffect(() => {
    const overlay = document.querySelector(".img-overlay") as HTMLElement;
    gsap.set(".cursor", { opacity: 0 });
    const xTo = gsap.quickTo(".cursor", "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(".cursor", "y", { duration: 0.35, ease: "power3" });
    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX); yTo(e.clientY);
      if (overlay) {
        const r = overlay.getBoundingClientRect();
        overlay.style.setProperty("--x", `${e.clientX - r.left}px`);
        overlay.style.setProperty("--y", `${e.clientY - r.top}px`);
      }
    };
    const onEnter = () => gsap.to(".cursor", { opacity: 1, duration: 0.3 });
    const onLeave = () => gsap.to(".cursor", { opacity: 0, duration: 0.3 });
    const sec = document.querySelector(".img-overlay");
    sec?.addEventListener("mouseenter", onEnter);
    sec?.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      sec?.removeEventListener("mouseenter", onEnter);
      sec?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Animaciones principales Para el texto──────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => { lenis.raf(time); requestAnimationFrame(tick); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Texto
    const split = SplitText.create(".h1_text", { type: "chars" });
    gsap.from(split.chars, {
      x: () => gsap.utils.random(-window.innerWidth * 0.6, window.innerWidth * 0.6),
      y: () => gsap.utils.random(-window.innerHeight * 0.5, window.innerHeight * 0.5),
      rotation: () => gsap.utils.random(-180, 180),
      scale: () => gsap.utils.random(0.2, 2.5),
      opacity: 0, filter: "blur(6px)",
      duration: 1.6, ease: "expo.out",
      stagger: { amount: 0.7, from: "random" },
      delay: 0.3,
      scrollTrigger: {
        trigger: ".h1_text", start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // ── Galería: entrada oval para las imgs─────────────────────────────────────────
    const galleryItems = [
      { selector: ".g-img1", xFrom:  180 },
      { selector: ".g-img2", xFrom:  220 },
      { selector: ".g-img3", xFrom:   40 },
      { selector: ".g-img4", xFrom: -160 },
      { selector: ".g-img5", xFrom:  100 },
      { selector: ".g-img6", xFrom: -230 },
      { selector: ".g-img7", xFrom: -240 },
    ];
    galleryItems.forEach(({ selector, xFrom }) =>
      gsap.set(selector, { y: -420, x: xFrom, opacity: 0 })
    );
    const galleryTl = gsap.timeline({ paused: true });
    galleryItems.forEach(({ selector, xFrom }, idx) => {
      galleryTl.to(selector, {
        keyframes: [
          { y: -420, x: xFrom,        opacity: 0   },
          { y:  -80, x: xFrom * 0.28, opacity: 0.6 },
          { y:    0, x: 0,            opacity: 1   },
        ],
        duration: 1, ease: "none",
      }, idx * 0.12);
    });
    ScrollTrigger.create({
      trigger: ".gallery-grid", start: "top 65%",
      once: true, onEnter: () => galleryTl.play(),
    });
  }, []);

  return (
    <>
      <div className="cursor" />

      {/* ── Sección principal ─────────────────────────────────────────── */}
      <main className='img-overlay w-full min-h-screen bg-[url("/assets/stone-wall.webp")] bg-cover bg-center bg-fixed'>

        {/* Texto */}
        <section className="w-full h-[60vh] flex justify-center">
          <div className="text-white flex flex-col items-center justify-center">
            <h1 className="h1_text font-voyager tracking-wide text-6xl text-center">
              Por tanto, aceptaos los unos a los otros,
              <br />
              como también Cristo nos aceptó.
            </h1>
            <span className="mt-2 text-white/60 text-sm tracking-widest">Romanos 15:7</span>
          </div>
        </section>

        {/* Galería */}
        <section className="gallery-section mx-auto w-full flex justify-center pb-8 overflow-visible"  ref={stickyContainer}>
          <div className="gallery-grid w-[80%]">
            <div className="g-img1"><Image src="/assets/img/1.jpg" alt="Imagen 1" fill className="object-cover" /></div>
            <div className="g-img2"><Image src="/assets/img/2.jpg" alt="Imagen 2" fill className="object-cover" /></div>
            <div className="g-img3"><Image src="/assets/img/3.jpg" alt="Imagen 3" fill className="object-cover" /></div>
            <div className="g-img4"><Image src="/assets/img/4.jpg" alt="Imagen 4" fill className="object-cover" /></div>
            <div className="g-img5"><Image src="/assets/img/5.jpg" alt="Imagen 5" fill className="object-cover" /></div>
            <div className="g-img6"><Image src="/assets/img/6.jpg" alt="Imagen 6" fill className="object-cover" /></div>
            <div className="g-img7"><Image src="/assets/img/7.jpg" alt="Imagen 7" fill className="object-cover" /></div>
          </div>
        </section>
      </main>

      {/* ── Tercera sección ──────────────────────────────────────────── */}
      <section className="w-full min-h-screen bg-stone-950 flex items-center justify-center">
        <p className="text-white/40 text-sm tracking-widest uppercase">Próxima sección</p>
      </section>
    </>
  );
};

export default SecondSection;
