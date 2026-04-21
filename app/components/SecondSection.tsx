"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Lenis from "lenis";
import { useGSAP } from "@gsap/react";
import ThirdSection from "./ThirdSection";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

gsap.registerPlugin(ScrollTrigger, SplitText);

//IMG TRANSITION CAMBIOS
const IMGS = [
  "/assets/img/1.jpg",
  "/assets/img/2.jpg",
  "/assets/img/3.jpg",
  "/assets/img/4.jpg",
  "/assets/img/5.jpg",
  "/assets/img/6.jpg",
  "/assets/img/7.jpg",
];

const SecondSection = () => {
  // ── Scroll Parallaz with img ─────────────────────────────────────────────────────────────────
  const activeIdxRef = useRef(4);
  const stickyContainer = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    // Estado inicial para que GSAP pueda interpolar el clipPath
    gsap.set(".g-img3", { clipPath: "inset(0% 0% 0% 0% round 4px)" });

    const isMobile = window.innerWidth < 768; // Ajusta el zoom para móviles

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stickyContainer.current,
        start: isMobile ? "-=50%" : "top top",
        end: isMobile ? "+=50%" : "+=300%", // la animacion en lo que dura el scroll de 3 pantallas
        scrub: 2, // hace que la aniamcion haga un scroll suave
        pin: true, // fija el elemento en pantalla mientras dura la animacion
        pinSpacing: true, // agrega espacio debajo del elemento fijado para evitar saltos de contenido
      },
    });

    // Fase 1 — zoom + dispersión de las otras imgs
    tl.to(".g-img3", {
      scale: isMobile ? 1.15 : 1.8,
      ease: "none",
      duration: 1,
      transformOrigin: isMobile ? "center center" : "center 15%",
    })
      // Se dispersan mientras img3 crece — cada una se aleja en su dirección natural
      .to(".g-img1", { x: -160, y: -40, ease: "none", duration: 1 }, 0)
      .to(".g-img2", { x: -180, y: 80, ease: "none", duration: 1 }, 0)
      .to(".g-img4", { x: 140, y: -80, ease: "none", duration: 1 }, 0)
      .to(".g-img5", { x: -120, y: 100, ease: "none", duration: 1 }, 0)
      .to(".g-img6", { x: 160, y: 80, ease: "none", duration: 1 }, 0)
      .to(".g-img7", { x: 150, y: -60, ease: "none", duration: 1 }, 0)

      // Fase 2 — se convierte en puerta/arco
      .to(".g-img3", {
        clipPath: isMobile
          ? "inset(50% 20% -30% 20% round 999px 999px 42px 42px)" // sin cambio en móviles
          : "inset(50% 40% -30% 40% round 999px 999px 12px 12px)", // recortada horizontalmente en desktop
        ease: "none",
        duration: 2,
      })
      // Botones se mueven hacia adentro siguiendo el borde del arco
      .to(
        ".g-btn-prev",
        isMobile
          ? {
              marginLeft: "12%",
              ease: "none",
              duration: 1,
              marginTop: "15%",
              width: "19px",
              height: "19px",
              scale: 1.5,
            }
          : { marginLeft: "42%", ease: "none", duration: 2, marginTop: "15%" },
        "<",
      )

      .to(
        ".g-btn-next",
        isMobile
          ? {
              marginRight: "12%",
              ease: "none",
              duration: 1,
              marginTop: "15%",
              width: "19px",
              height: "19px",
              scale: 1.5,
            }
          : { marginRight: "42%", ease: "none", duration: 2, marginTop: "15%" },
        "<",
      )

      // Fase 3 -- Las otras imgs se desvanecen mientras aparece el arco
      .to(
        [".g-img1", ".g-img2", ".g-img4", ".g-img5", ".g-img6", ".g-img7"],
        { opacity: 0, ease: "none", duration: 0.7 },
        "<0.2",
      );
  });

  // ── Cursor ──────────────────────────────────────────────────────────
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
      duration: 0.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(tick);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Texto (solo desktop)
    if (window.innerWidth >= 768) {
      const split = SplitText.create(".h1_text", { type: "chars" });
      gsap.from(split.chars, {
        x: () => gsap.utils.random(-40, 40),
        y: () => gsap.utils.random(-20, 20),
        rotation: () => gsap.utils.random(-15, 15),
        scale: () => gsap.utils.random(0.8, 1.2),
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.5,
        ease: "power3.out",
        stagger: { amount: 0.9, from: "random" },
        delay: 0.2,
        scrollTrigger: {
          trigger: ".h1_text",
          start: "top 60%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }

    // ── Galería: entrada oval para las imgs (solo desktop) ─────────────────────────────────────────
    if (window.innerWidth >= 768) {
      const galleryItems = [
        { selector: ".g-img1", xFrom: 180 },
        { selector: ".g-img2", xFrom: 220 },
        { selector: ".g-img3", xFrom: 40 },
        { selector: ".g-img4", xFrom: -160 },
        { selector: ".g-img5", xFrom: 100 },
        { selector: ".g-img6", xFrom: -230 },
        { selector: ".g-img7", xFrom: -240 },
      ];
      galleryItems.forEach(({ selector, xFrom }) =>
        gsap.set(selector, { y: -420, x: xFrom, opacity: 0 }),
      );
      const galleryTl = gsap.timeline({ paused: true });
      galleryItems.forEach(({ selector, xFrom }, idx) => {
        galleryTl.to(
          selector,
          {
            keyframes: [
              { y: -420, x: xFrom, opacity: 0 },
              { y: -80, x: xFrom * 0.28, opacity: 0.6 },
              { y: 0, x: 0, opacity: 1 },
            ],
            duration: 1,
            ease: "none",
          },
          idx * 0.12,
        );
      });
      ScrollTrigger.create({
        trigger: ".gallery-grid",
        start: "top 65%",
        once: true,
        onEnter: () => galleryTl.play(),
      });
    }
  }, []);

  return (
    <>
      <div className="cursor" />

      {/* ── Sección principal ─────────────────────────────────────────── */}
      <main className='img-overlay w-full min-h-screen bg-[url("/assets/stone-wall.webp")] bg-cover bg-center bg-fixed'>
        {/* Texto */}
        <section className="w-full h-[30vh] items-center flex justify-center flex-col overflow-hidden">
          <h1 className="h1_text font-voyager tracking-wide  text-stone-200   lg:text-6xl text-xl text-center ">
            Por tanto, aceptaos los unos a los otros,
            <br />
            como también Cristo nos aceptó.
          </h1>
          <span className="mt-2 text-stone-200 text-sm tracking-widest">
            Romanos 15:7
          </span>
        </section>

        {/* Galería */}
        <section
          className="gallery-section mx-auto w-full flex justify-center pb-8 overflow-visible"
          ref={stickyContainer}
        >
          <div className="gallery-grid w-[80%]">
            <div className="g-img1">
              <Image
                src="/assets/img/1.jpg"
                alt="Imagen 1"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <div className="g-img2">
              <Image
                src="/assets/img/2.jpg"
                alt="Imagen 2"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            {/* img3 — todas las imgs apiladas para el slide */}
            <div className="g-img3">
              {IMGS.map((src, i) => (
                <div
                  key={i}
                  className="gallery-slide absolute inset-0"
                  style={{ transform: `translateX(${(i - 4) * 100}%)` }}
                >
                  <Image
                    src={src}
                    alt={`Imagen ${i + 1}`}
                    fill
                    sizes="60vw"
                    className="object-cover"
                  />
                </div>
              ))}
              <div
                className="absolute inset-0 flex items-center top-1/2  justify-center
               z-20 pointer-events-none"
                style={{ padding: "0px 0px", gap: "26px" }}
              >
                <button
                  className="g-btn-prev pointer-events-auto w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
                  onClick={() => {
                    const prev = activeIdxRef.current;
                    const next = (prev - 1 + IMGS.length) % IMGS.length;
                    const slides =
                      document.querySelectorAll<HTMLElement>(".gallery-slide");
                    gsap.killTweensOf([slides[prev], slides[next]]);
                    gsap.set(slides[next], {
                      x: "100%",
                      opacity: 1,
                      clipPath: "none",
                      scale: 1,
                    });
                    gsap.to(slides[prev], {
                      x: "-100%",
                      duration: 0.55,
                      ease: "power2.inOut",
                    });
                    gsap.to(slides[next], {
                      x: "0%",
                      duration: 0.55,
                      ease: "power2.inOut",
                    });
                    activeIdxRef.current = next;
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className="g-btn-next pointer-events-auto
                   w-9 h-9 rounded-full 
                    bg-black/60 backdrop-blur-sm border
                     border-white/20 flex items-center 
                      justify-center hover:bg-black/90 transition-colors cursor-pointer"
                  onClick={() => {
                    const prev = activeIdxRef.current;
                    const next = (prev + 1) % IMGS.length;
                    const slides =
                      document.querySelectorAll<HTMLElement>(".gallery-slide");
                    gsap.killTweensOf([slides[prev], slides[next]]);
                    gsap.set(slides[next], {
                      x: "-100%",
                      opacity: 1,
                      clipPath: "none",
                      scale: 1,
                    });
                    gsap.to(slides[prev], {
                      x: "100%",
                      duration: 0.55,
                      ease: "power2.inOut",
                    });
                    gsap.to(slides[next], {
                      x: "0%",
                      duration: 0.55,
                      ease: "power2.inOut",
                    });
                    activeIdxRef.current = next;
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="g-img4">
              <Image
                src="/assets/img/4.jpg"
                alt="Imagen 4"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <div className="g-img5">
              <Image
                src="/assets/img/3.jpg"
                alt="Imagen 5"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <div className="g-img6">
              <Image
                src="/assets/img/6.jpg"
                alt="Imagen 6"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <div className="g-img7">
              <Image
                src="/assets/img/7.jpg"
                alt="Imagen 7"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── Tercera sección ──────────────────────────────────────────── */}
      <ThirdSection />
    </>
  );
};

export default SecondSection;
