"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(SplitText, ScrollTrigger);

const ParallexPhoto = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  // CURSOR PERSONALIZADO Y EFFECTO HOVER
  useEffect(() => {
    const overlay = document.querySelector(".img-background") as HTMLElement;
    gsap.set(".cursor-custom", { opacity: 0 });

    const xTo = gsap.quickTo(".cursor-custom", "x", {
      duration: 0.35,
      ease: "power3",
    });
    const yTo = gsap.quickTo(".cursor-custom", "y", {
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

    const onEnter = () =>
      gsap.to(".cursor-custom", { opacity: 1, duration: 0.3 });
    const onLeave = () =>
      gsap.to(".cursor-custom", { opacity: 0, duration: 0.3 });
    const sec = document.querySelector(".img-background");

    sec?.addEventListener("mouseenter", onEnter);
    sec?.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      sec?.removeEventListener("mouseenter", onEnter);
      sec?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // SCROLL & ANIMACIONES GSAP
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Creamos un contexto limpio de GSAP
    const ctx = gsap.context(() => {
      // SplitText dentro de ctx para que .revert() lo limpie automáticamente
      const heroCopySplit = SplitText.create(".hero-copy h3", {
        type: "words",
        wordsClass: "word",
      });

      const titleHeroSplit = SplitText.create(".hero-header h1", {
        type: "words",
        wordsClass: "word",
      });

      const totalWordsForTitle = titleHeroSplit.words.length;
      const totalWords = heroCopySplit.words.length;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 769px)",
          isMobile: "(max-width: 768px)",
        },
        (context) => {
          const { isDesktop, isMobile } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
          };

          // ── DESKTOP ────────────────────────────────────────────────────────
          if (isDesktop) {
            const finalImgW = window.innerWidth * 0.8;
            const finalImgH = window.innerHeight * 0.8;
            const initialH1Scale = 400 / finalImgW;

            const copyStart = { x: 50, y: 40 };
            const copyEnd = { x: 0, y: 0 };

            gsap.set(".hero-img", {
              xPercent: -50,
              yPercent: -50,
              width: 280,
              height: 280,
              borderRadius: 10,
            });

            gsap.set(".hero-header", {
              xPercent: -50,
              yPercent: -50,
              scale: initialH1Scale,
              opacity: 0,
            });

            gsap.set(".hero-copy", {
              x: copyStart.x,
              y: copyStart.y,
              opacity: 0,
            });
            gsap.set(".hero-copy h3", { opacity: 1 });

            heroCopySplit.words.forEach((w) => gsap.set(w, { opacity: 0 }));
            titleHeroSplit.words.forEach((w) => gsap.set(w, { opacity: 0 }));

            const setImgW = gsap.quickSetter(".hero-img", "width", "px");
            const setImgH = gsap.quickSetter(".hero-img", "height", "px");
            const setImgR = gsap.quickSetter(".hero-img", "borderRadius", "px");
            const setH1ContainerOp = gsap.quickSetter(
              ".hero-header",
              "opacity",
            );
            const setH1Scale = gsap.quickSetter(".hero-header", "scale");
            const setCopyX = gsap.quickSetter(".hero-copy", "x", "px");
            const setCopyY = gsap.quickSetter(".hero-copy", "y", "px");
            const setCopyOp = gsap.quickSetter(".hero-copy", "opacity");

            ScrollTrigger.create({
              trigger: ".hero-parallex",
              start: "top top",
              end: `+=${window.innerHeight * 1.5}`,
              pin: true,
              scrub: true,
              pinSpacing: true,
              invalidateOnRefresh: true, // Evita reseteos en resize/scroll back
              onUpdate: ({ progress: p }) => {
                const copyP = Math.max(0, Math.min((p - 0.05) / 0.45, 1));
                setCopyX(gsap.utils.interpolate(copyStart.x, copyEnd.x, copyP));
                setCopyY(gsap.utils.interpolate(copyStart.y, copyEnd.y, copyP));
                setCopyOp(copyP);

                const wordP = Math.max(0, Math.min((p - 0.05) / 0.35, 1));
                heroCopySplit.words.forEach((word, i) => {
                  const wOpacity = Math.max(
                    0,
                    Math.min((wordP - i / totalWords) / (1 / totalWords), 1),
                  );
                  gsap.set(word, { opacity: wOpacity });
                });

                const h1P = Math.max(0, Math.min((p - 0.2) / 0.45, 1));
                setH1ContainerOp(h1P);

                titleHeroSplit.words.forEach((word, i) => {
                  const wOpacity = Math.max(
                    0,
                    Math.min(
                      (h1P - i / totalWordsForTitle) / (1 / totalWordsForTitle),
                      1,
                    ),
                  );
                  gsap.set(word, { opacity: wOpacity });
                });

                const imgP = Math.max(0, Math.min((p - 0.65) / 0.35, 1));
                setImgW(gsap.utils.interpolate(400, finalImgW, imgP));
                setImgH(gsap.utils.interpolate(400, finalImgH, imgP));
                setImgR(gsap.utils.interpolate(0, 10, imgP));
                setH1Scale(gsap.utils.interpolate(initialH1Scale, 1, imgP));
              },
            });
          }

          // ── MOBILE ─────────────────────────────────────────────────────────
          if (isMobile) {
            // 1. Definimos un tamaño final solo UN POCO más grande que el inicial
            const finalImgW = 340; // En lugar de window.innerWidth * 0.95
            const finalImgH = 340; // En lugar de window.innerHeight * 0.6

            gsap.set(".hero-img", {
              xPercent: -50,
              yPercent: -10,
              width: 300,
              height: 300,
              borderRadius: 0,
            });
            gsap.set(".hero-header", { xPercent: -50, yPercent: -220, y: -50 });
            gsap.set(".hero-copy h3", {
              opacity: 1,
              xPercent: -60,
              yPercent: -250,
              y: -50,
            });

            const setImgW = gsap.quickSetter(".hero-img", "width", "px");
            const setImgH = gsap.quickSetter(".hero-img", "height", "px");
            const setHdrOp = gsap.quickSetter(".hero-header", "opacity");

            ScrollTrigger.create({
              trigger: ".hero-parallex",
              start: "top 80%", // Empieza a agrandarse APENAS asoma la sección
              end: "top 10%", // Termina de agrandarse ANTES de salir
              scrub: true, // Para que la escala siga suavemente al dedo,
              pin: false,
              pinSpacing: false,
              invalidateOnRefresh: true,
              onUpdate: ({ progress: p }) => {
                // 1. La imagen se agranda de INMEDIATO (de p = 0 a p = 0.8)
                const imgP = Math.max(0, Math.min(p / 0.8, 1));
                setImgW(gsap.utils.interpolate(280, finalImgW, imgP));
                setImgH(gsap.utils.interpolate(280, finalImgH, imgP));
              },
            });
          }
        },
      );

      // ── ABOUT SECTION PARALLAX ─────────────────────────────────────────────
      const aboutImgCols = [
        { selector: ".about-img-wrapper:nth-child(1)", y: -40 },
        { selector: ".about-img-wrapper:nth-child(2)", y: -20 },
        { selector: ".about-img-wrapper:nth-child(3)", y: -30 },
        { selector: ".about-img-wrapper:nth-child(4)", y: -50 },
      ];

      aboutImgCols.forEach(({ selector, y }) => {
        gsap.to(selector, {
          y,
          scrollTrigger: {
            trigger: ".about-parallex",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    // ── SPOTLIGHT EFFECT ─────────────────────────────────────────────────────
    const aboutSection = document.querySelector(".section-about");
    const spotlight = spotlightRef.current;
    let cleanupSpotlight = () => {};

    if (aboutSection && spotlight) {
      gsap.set(spotlight, {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 1,
      });

      const xTo = gsap.quickTo(spotlight, "x", {
        duration: 0.2,
        ease: "power2.out",
      });
      const yTo = gsap.quickTo(spotlight, "y", {
        duration: 0.2,
        ease: "power2.out",
      });

      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        xTo(mouseEvent.clientX);
        yTo(mouseEvent.clientY);
      };

      const handleMouseEnter = () => {
        gsap.to(spotlight, { opacity: 1, duration: 0.4, ease: "power2.out" });
      };

      const handleMouseLeave = () => {
        gsap.to(spotlight, { opacity: 0, duration: 0.4, ease: "power2.out" });
      };

      aboutSection.addEventListener("mousemove", handleMouseMove);
      aboutSection.addEventListener("mouseenter", handleMouseEnter);
      aboutSection.addEventListener("mouseleave", handleMouseLeave);

      const images = aboutSection.querySelectorAll(".about-img-wrapper");
      const imgHandlers: Array<{
        img: Element;
        enter: () => void;
        leave: () => void;
      }> = [];

      images.forEach((img) => {
        const enter = () => gsap.to(spotlight, { scale: 1.4, duration: 0.3 });
        const leave = () => gsap.to(spotlight, { scale: 1, duration: 0.3 });

        img.addEventListener("mouseenter", enter);
        img.addEventListener("mouseleave", leave);
        imgHandlers.push({ img, enter, leave });
      });

      cleanupSpotlight = () => {
        aboutSection.removeEventListener("mousemove", handleMouseMove);
        aboutSection.removeEventListener("mouseenter", handleMouseEnter);
        aboutSection.removeEventListener("mouseleave", handleMouseLeave);
        imgHandlers.forEach(({ img, enter, leave }) => {
          img.removeEventListener("mouseenter", enter);
          img.removeEventListener("mouseleave", leave);
        });
        gsap.killTweensOf(spotlight);
      };
    }

    // CLEANUP GENERAL
    return () => {
      cleanupSpotlight();
      gsap.ticker.remove(tickerCallback);
      ctx.revert(); // Revierte automáticament SplitText, MatchMedia y ScrollTriggers sin dejar basura
      lenis.destroy();
    };
  }, []);

  return (
    <main
      className="relative w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/w-bg.jpg')" }}
    >
      {/* Ref del Spotlight */}
      <div
        ref={spotlightRef}
        className="spotlight-beam pointer-events-none fixed top-0 left-0"
      />

      {/* Desktop Section */}
      <section className="hero-parallex section-parallex hidden md:block">
        <div className="hero-img">
          <Image
            src="/assets/img/1.jpg"
            alt=""
            fill
            className="object-cover rounded-2xl"
          />
          <div className="hero-header">
            <h1 className="h1-parallex font-luxury">Templo Imep Central</h1>
          </div>
          <div className="hero-copy">
            <h3 className="h3-parallex font-luxury">
              Iglesia misión evangélica pentecostal, fundada con la visión de
              ser un templo de adoración, enseñanza y comunión para la gloria de
              Dios.
            </h3>
          </div>
        </div>
      </section>

      {/* Mobile Section */}
      <section className="hero-parallex section-parallex relative flex flex-col md:hidden">
        <div className="hero-header md:absolute transform -translate-y-1/2">
          <h1 className="h1-parallex font-luxury">Templo Imep Central</h1>
        </div>

        <div className="hero-copy md:absolute">
          <h3 className="h3-parallex font-luxury ">
            Iglesia misión evangélica pentecostal, fundada con la visión de ser
            un templo de adoración, enseñanza y comunión para la gloria de Dios.
          </h3>
        </div>

        <div className="hero-img relative w-full h-75 md:h-screen">
          <Image
            src="/assets/img/1.jpg"
            alt="Templo Imep Central"
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </section>

      <div className="cursor-custom" />

      <div className="relative overflow-hidden">
        <section className="about-parallex section-parallex section-about img-background">
          <div className="about-header z-10">
            <h3 className="about-subtitle font-luxury">
              Un lugar para crecer en la palabra, servir con amor y vivir en
              comunión.
            </h3>
            <h3 className="about-title font-luxury">
              Iglesia misión evangélica pentecostal, fundada en xxx, con la
              visión de ser un templo de adoración, enseñanza y comunión para la
              gloria de Dios.
            </h3>
            <p className="about-description font-luxury">
              Llevando el mensaje de fe, esperanza y transformación a las
              familias de nuestra comunidad.
            </p>
          </div>

          <div className="about-imgs-col">
            <div className="about-img-wrapper" id="about-imgs-col-1">
              <Image
                src="/assets/img/2.jpg"
                alt=""
                width={300}
                height={350}
                className="img"
              />
            </div>
            <div className="about-img-wrapper">
              <Image
                src="/assets/img/3.jpg"
                alt=""
                width={300}
                height={400}
                className="img"
              />
            </div>
            <div className="about-img-wrapper">
              <Image
                src="/assets/img/4.jpg"
                alt=""
                width={300}
                height={500}
                className="img"
              />
            </div>
            <div className="about-img-wrapper">
              <Image
                src="/assets/img/5.jpg"
                alt=""
                width={300}
                height={300}
                className="img"
              />
            </div>
            <div className="about-img-wrapper">
              <Image
                src="/assets/img/5.jpg"
                alt=""
                width={300}
                height={300}
                className="img"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ParallexPhoto;
