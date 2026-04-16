"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Lenis from "lenis";


gsap.registerPlugin(ScrollTrigger, SplitText);

const SecondSection = () => {
  useEffect(() => {
    const overlay = document.querySelector(".img-overlay") as HTMLElement;

    gsap.set(".cursor", { opacity: 0 });

    const xTo = gsap.quickTo(".cursor", "x", {
      duration: 0.35,
      ease: "power3",
    });
    const yTo = gsap.quickTo(".cursor", "y", {
      duration: 0.35,
      ease: "power3",
    });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      if (overlay) {
        const rect = overlay.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        overlay.style.setProperty("--x", `${x}px`);
        overlay.style.setProperty("--y", `${y}px`);
      }
    };

    const onEnter = () => gsap.to(".cursor", { opacity: 1, duration: 0.3 });
    const onLeave = () => gsap.to(".cursor", { opacity: 0, duration: 0.3 });

    const section = document.querySelector(".img-overlay");
    section?.addEventListener("mouseenter", onEnter);
    section?.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      section?.removeEventListener("mouseenter", onEnter);
      section?.removeEventListener("mouseleave", onLeave);
    };
  }, []);



  useEffect(() => {
    // Scroll + lenis para la animacion del scroll con el texto
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on("scroll", ScrollTrigger.update)

    const tickerCallBack = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(tickerCallBack)
    }
    gsap.ticker.add(tickerCallBack)
    gsap.ticker.lagSmoothing(0)

    // Letras dispersas que convergen → "convocadas desde el caos"
    const split = SplitText.create(".h1_text", { type: "chars" });

    gsap.from(split.chars, {
      x: () => gsap.utils.random(-window.innerWidth * 0.6, window.innerWidth * 0.6),
      y: () => gsap.utils.random(-window.innerHeight * 0.5, window.innerHeight * 0.5),
      rotation: () => gsap.utils.random(-180, 180),
      scale: () => gsap.utils.random(0.2, 2.5),
      opacity: 0,
      filter: "blur(6px)",
      duration: 1.6,
      ease: "expo.out",
      stagger: { amount: 0.7, from: "random" },
      delay: 0.3,
      scrollTrigger: {
        trigger: ".h1_text",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Animación oval con scrub:
    // scroll abajo → imágenes caen en arco a su posición
    // scroll arriba → imágenes suben de vuelta
    const galleryItems = [
      { selector: ".g-img1", xFrom:  180 },
      { selector: ".g-img2", xFrom:  220 },
      { selector: ".g-img3", xFrom:   40 },
      { selector: ".g-img4", xFrom: -160 },
      { selector: ".g-img5", xFrom:  100 },
      { selector: ".g-img6", xFrom: -230 },
      { selector: ".g-img7", xFrom: -240 },
    ];

    // Estado inicial: arriba e invisible
    galleryItems.forEach(({ selector, xFrom }) => {
      gsap.set(selector, { y: -420, x: xFrom, opacity: 0 });
    });

    // Timeline con 3 keyframes por imagen → define la curva oval
    const galleryTl = gsap.timeline({ paused: true });
    galleryItems.forEach(({ selector, xFrom }, idx) => {
      galleryTl.to(selector, {
        keyframes: [
          { y: -420, x: xFrom,        opacity: 0   },
          { y:  -80, x: xFrom * 0.28, opacity: 0.6 },
          { y:    0, x: 0,            opacity: 1   },
        ],
        duration: 1,
        ease: "none",
      }, idx * 0.12);
    });

    // pinnedContainer indica que el gallery vive dentro del contenedor
    // pinneado → ScrollTrigger calcula los offsets correctamente
    ScrollTrigger.create({
      trigger: ".gallery-grid",
      start: "top bottom",
      end: "top 10%",
      scrub: 0.8,
      animation: galleryTl,
      pinnedContainer: ".img-overlay",
    });

  },[])

  return (
    <>
        <div className="cursor"></div>
      <main
        className='img-overlay w-full min-h-screen bg-[url("/assets/stone-wall.webp")]
    bg-cover bg-center bg-fixed'
      >
        <section className="w-full h-[60vh] flex justify-center  ">
          <div className="text-white  flex flex-col items-center justify-center translate-y-2">
            <h1 className="h1_text font-voyager tracking-wide text-6xl text-center">
              Por tanto, aceptaos los unos a los otros,
              <br />
               como también Cristo nos
              aceptó.
            </h1>
            <span>Romanos 15:7</span>
          </div>
        </section>

        {/* Galería de imágenes */}
        <section className=" mx-auto w-full flex justify-center pb-8">
          <div className="gallery-grid w-[80%] ">
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
    </>
  );
};

export default SecondSection;
