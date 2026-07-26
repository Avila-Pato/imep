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

  // CURSOR
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

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // ── Animación hero section ───────────────────────────────────────────────
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

        // ── Desktop ──────────────────────────────────────────────────────────────
        if (isDesktop) {
          const finalImgW = window.innerWidth * 0.8;
          const finalImgH = window.innerHeight * 0.8;
          const initialH1Scale = 400 / finalImgW;

          const copyStart = { x: 50, y: 40 };
          const copyEnd = { x: 0, y: 0 };

          gsap.set(".hero-img", {
            xPercent: -50,
            yPercent: -50,
            width: 400,
            height: 400,
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

          const setImgW = gsap.quickSetter(".hero-img", "width", "px") as (
            v: number,
          ) => void;
          const setImgH = gsap.quickSetter(".hero-img", "height", "px") as (
            v: number,
          ) => void;
          const setImgR = gsap.quickSetter(
            ".hero-img",
            "borderRadius",
            "px",
          ) as (v: number) => void;

          const setH1ContainerOp = gsap.quickSetter(
            ".hero-header",
            "opacity",
          ) as (v: number) => void;
          const setH1Scale = gsap.quickSetter(".hero-header", "scale") as (
            v: number,
          ) => void;

          const setCopyX = gsap.quickSetter(".hero-copy", "x", "px") as (
            v: number,
          ) => void;
          const setCopyY = gsap.quickSetter(".hero-copy", "y", "px") as (
            v: number,
          ) => void;
          const setCopyOp = gsap.quickSetter(".hero-copy", "opacity") as (
            v: number,
          ) => void;

          const st = ScrollTrigger.create({
            trigger: ".hero-parallex",
            start: "top top",
            end: `+=${window.innerHeight * 1.5}`,
            pin: isDesktop,
            scrub: isDesktop,
            pinSpacing: true,

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

          return () => st.kill();
        }

        // ── Mobile ───────────────────────────────────────────────────────────────
        if (isMobile) {
          const finalImgW = window.innerWidth * 0.95;
          const finalImgH = window.innerHeight * 0.6;

          gsap.set(".hero-img", {
            xPercent: -50,
            yPercent: -50,
            width: 400,
            height: 400,
            borderRadius: 0,
          });

          gsap.set(".hero-header", {
            xPercent: -50,
            yPercent: -120,
            y: -180,
            zIndex: 1,
          });

          gsap.set(".hero-copy h3", {
            y: -40,
            zIndex: 2,
          });

          mm.add("(max-width: 767px)", () => {
            gsap.set([".hero-header", ".hero-copy", ".hero-copy h3"], {
              clearProps: "all",
            });
          });

          const setImgW = gsap.quickSetter(".hero-img", "width", "px") as (
            v: number,
          ) => void;
          const setImgH = gsap.quickSetter(".hero-img", "height", "px") as (
            v: number,
          ) => void;
          const setHdrOp = gsap.quickSetter(".hero-header", "opacity") as (
            v: number,
          ) => void;

          const st = ScrollTrigger.create({
            trigger: ".hero-parallex",
            start: "top top",
            end: `+=${window.innerHeight * 1.5}`,
            pin: isDesktop,
            pinSpacing: isDesktop,
            scrub: isDesktop,

            onUpdate: ({ progress: p }) => {
              setHdrOp(Math.max(0, 1 - p / 0.4));

              const imgP = Math.max(0, Math.min((p - 0.4) / 0.6, 1));

              setImgW(gsap.utils.interpolate(300, finalImgW, imgP));
              setImgH(gsap.utils.interpolate(300, finalImgH, imgP));
            },
          });

          return () => st.kill();
        }
      },
    );

    // ── Móvil ────────────────────────────────────────────────────────────────
    mm.add("(max-width: 768px)", () => {
      const finalImgW = window.innerWidth * 0.95;
      const finalImgH = window.innerHeight * 0.6;

      gsap.set(".hero-img", {
        xPercent: -50,
        yPercent: -10,
        width: 300,
        height: 300,
        borderRadius: 0,
      });
      gsap.set(".hero-header", { xPercent: -50, yPercent: -220, y: -50 });
      gsap.set(".hero-copy h3", {
        opacity: 100,
        xPercent: -60,
        yPercent: -250,
        y: -50,
      });

      const setImgW = gsap.quickSetter(".hero-img", "width", "px") as (
        v: number,
      ) => void;
      const setImgH = gsap.quickSetter(".hero-img", "height", "px") as (
        v: number,
      ) => void;
      const setHdrOp = gsap.quickSetter(".hero-header", "opacity") as (
        v: number,
      ) => void;
      const st = ScrollTrigger.create({
        trigger: ".hero-parallex",
        start: "top top",
        end: `+=${window.innerHeight * 1.5}`,
        pin: false,
        scrub: false,
        pinSpacing: false,
        onUpdate: ({ progress: p }) => {
          setHdrOp(Math.max(0, 1 - p / 0.4));
          const imgP = Math.max(0, Math.min((p - 0.4) / 0.6, 1));
          setImgW(gsap.utils.interpolate(300, finalImgW, imgP));
          setImgH(gsap.utils.interpolate(300, finalImgH, imgP));
        },
      });

      return () => st.kill();
    });

    // ── About section parallax ───────────────────────────────────────────────
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

    // ── EFECTO HAZ DE LINTERNA BRRILLANTE (SECCIÓN ABOUT) ─────────────────────
    const aboutSection = document.querySelector(".section-about");
    const spotlight = spotlightRef.current;
    let cleanupSpotlight = () => {};

    if (aboutSection && spotlight) {
      // Ocultamos e inicializamos el tamaño del haz
      gsap.set(spotlight, {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 1,
      });

      // Movimiento ultrasuave con GSAP quickTo
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

      // Ampliar el haz de luz cuando pasa sobre las imágenes
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

    return () => {
      cleanupSpotlight();
      gsap.ticker.remove(tickerCallback);
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <main
      className="relative w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/w-bg.jpg')" }}
    >
      <section className="hero-parallex section-parallex hidden md:block">
        <div className="hero-img">
          <Image
            src="/assets/img/1.jpg"
            alt=""
            fill
            className="object-cover rounded-2xl"
          />
          <div className="hero-header">
            <h1 className="h1-parallex font-luxury ">Templo Imep Central</h1>
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
      <section className="hero-parallex section-parallex relative flex flex-col md:hidden ">
        {/* En mobile van ordenados linealmente si quieres, o superpuestos en desktop */}
        <div className="hero-header md:absolute  transform -translate-y-1/2">
          <h1 className="h1-parallex font-luxury">Templo Imep Central</h1>
        </div>

        <div className="hero-copy md:absolute">
          <h3 className="h3-parallex font-luxury">
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

      {/* Cursor personalizado */}
      <div className="cursor-custom" />

      {/* Contenedor relativo de la sección About */}
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
