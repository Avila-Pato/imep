"use client";

import { CSSProperties, useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);

export default function LandingRevealAnimation({
  onReveal,
  onExitStart,
}: {
  onReveal?: () => void;
  onExitStart?: () => void;
}) {
  const preloaderText = useRef<HTMLDivElement | null>(null);
  const preloaderBtn = useRef<HTMLDivElement | null>(null);
  const btnOutLineTrack = useRef<SVGCircleElement | null>(null);
  const btnOutlineProgress = useRef<SVGCircleElement | null>(null);
  const loadingLabelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Bloqueo estricto de scroll
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    const preventScrollKeys = (e: KeyboardEvent) => {
      const keys = ["Space", "PageUp", "PageDown", "End", "Home", "ArrowUp", "ArrowDown"];
      if (keys.includes(e.code)) {
        e.preventDefault();
      }
    };

    const disableScroll = () => {
      document.body.style.overflow = "hidden";
      window.addEventListener("wheel", preventDefault, { passive: false });
      window.addEventListener("touchmove", preventDefault, { passive: false });
      window.addEventListener("keydown", preventScrollKeys, { passive: false });
    };

    const enableScroll = () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("keydown", preventScrollKeys);
    };

    disableScroll();

    CustomEase.create("hop", "0.9, 0, 0.1, 1");
    CustomEase.create("glide", "0.8, 0, 0.2, 1");

    const svgPathLength = btnOutLineTrack.current?.getTotalLength() ?? 0;
    let preloaderComplete = false;

    if (btnOutLineTrack.current && btnOutlineProgress.current) {
      gsap.set([btnOutLineTrack.current, btnOutlineProgress.current], {
        strokeDasharray: svgPathLength,
        strokeDashoffset: svgPathLength,
      });
    }

    const texts = preloaderText.current?.querySelectorAll(".pb-col-title") ?? [];

    texts.forEach((p) => {
      new SplitText(p, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      });
    });

    if (document.querySelector(".hero .h1-landing")) {
      new SplitText(".hero .h1-landing", {
        type: "words",
        wordsClass: "word",
        mask: "words",
      });
      gsap.set(".hero .h1-landing .word", { y: "100%" });
    }

    gsap.set(".preloader-revealer", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });
    gsap.set("#pbc-logo", { opacity: 1 });

    // Animación continua de los puntos de "Cargando..."
    const dotsAnimation = gsap.to(".loading-dot", {
      opacity: 0.2,
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      duration: 0.4,
      ease: "power1.inOut",
    });

    const introTL = gsap.timeline({ delay: 0.5 });

    introTL
      .to(".preloader .p-row .line", {
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.1,
      })
      .to(
        btnOutLineTrack.current,
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "hop",
        },
        "<"
      )
      .to(
        ".pbc-svg-strokes svg",
        {
          rotate: 270,
          duration: 2,
          ease: "hop",
        },
        "<"
      );

    const progressStops = [0.2, 0.25, 0.85, 1].map((base, i) => {
      if (i === 3) return 1;
      return base + (Math.random() - 0.5) * 0.1;
    });

    progressStops.forEach((stop, i) => {
      introTL.to(btnOutlineProgress.current, {
        strokeDashoffset: svgPathLength - svgPathLength * stop,
        duration: 0.25,
        ease: "glide",
        delay: i === 0 ? 0.3 : 0.3 + Math.random() * 0.2,
      });
    });

    introTL
      .to(
        "#pbc-logo",
        {
          opacity: 0,
          duration: 0.15,
          ease: "power1.out",
        },
        "-=0.25"
      )
      .to(
        loadingLabelRef.current,
        {
          opacity: 0,
          y: 5,
          duration: 0.15,
          ease: "power1.in",
          onComplete: () => {
            dotsAnimation.kill(); // Detenemos la animación infinita de los puntos al completarse
          },
        },
        "<"
      )
      .to(
        preloaderBtn.current,
        {
          scale: 0.9,
          duration: 1.5,
          ease: "hop",
        },
        "-=0.5"
      )
      .to(
        "#pc-label",
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            preloaderComplete = true;
            preloaderBtn.current?.classList.add("is-ready");
          },
        },
        "-=0.5"
      );

    const handleEnter = () => {
      if (!preloaderComplete) return;
      preloaderComplete = false;
      onExitStart?.();

      const exitTL = gsap.timeline();

      exitTL
        .to("#pc-label", {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        })
        .to(
          [btnOutLineTrack.current, btnOutlineProgress.current],
          {
            strokeDashoffset: -svgPathLength,
            duration: 0.9,
            ease: "hop",
          },
          "<"
        )
        .to(
          "#pbc-outro-label",
          {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          ".preloader",
          {
            scale: 0.9,
            duration: 0.6,
            ease: "power2.in",
          },
          "+=0.3"
        )
        .to(
          ".preloader",
          {
            yPercent: -105,
            duration: 0.8, // Duración de la animación
            ease: "hop",
            onComplete: () => {
              gsap.set(".preloader", { display: "none" });
              enableScroll();
              onReveal?.();
            },
          },
          "-=0.3"
        )
        .to(
          ".hero .h1-landing .word",
          {
            y: "0%",
            duration: 1,
            ease: "glide",
            stagger: 0.08,
          },
          "-=0.9"
        );
    };

    const btn = preloaderBtn.current;
    btn?.addEventListener("click", handleEnter);

    return () => {
      btn?.removeEventListener("click", handleEnter);
      dotsAnimation.kill();
      enableScroll();
    };
  }, []);

  return (
    <div
      className="preloader fixed inset-0 z-50 text-black bg-[#C7C8A3]/30 select-none overscroll-none"
      ref={preloaderText}
      style={styles.preloader}
    >
      <div
        className="preloader-btn-container relative flex items-center justify-center cursor-pointer select-none"
        ref={preloaderBtn}
        style={styles.btnContainer}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id="pbc-logo"
          src="/logo5.png"
          alt="pc image"
          className="absolute z-10 object-contain pointer-events-none"
          style={{ width: "160px", height: "160px", maxWidth: "none" }}
        />

        <p
          id="pc-label"
          className="pb-col-title absolute z-10 text-xl font-bold tracking-widest uppercase opacity-0 pointer-events-none"
        >
          Entrar
        </p>

        <p
          id="pbc-outro-label"
          className="pb-col-title absolute z-10 text-lg font-bold tracking-wider uppercase opacity-0 pointer-events-none text-center font-luxury"
        >
          Bienvenido
        </p>

        {/* SVG aislado en su propio div para rotación */}
        <div className="pbc-svg-strokes absolute inset-0 pointer-events-none">
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              ref={btnOutLineTrack}
              className="stroke-track"
              cx="160"
              cy="160"
              r="155"
              stroke="#2b2b2b"
              strokeWidth="2"
              fill="none"
              strokeDasharray="974"
              strokeDashoffset="974"
            />
            <circle
              ref={btnOutlineProgress}
              className="stroke-progress"
              cx="160"
              cy="160"
              r="155"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeDasharray="974"
              strokeDashoffset="974"
            />
          </svg>
        </div>

        {/* Indicador de carga independiente (sin rotación) */}
        <div
          ref={loadingLabelRef}
          className="absolute -bottom-10 left-0 w-full pointer-events-none"
        >
          <p className="font-luxury text-center text-sm tracking-wider uppercase">
            Cargando{" "}
            <span className="loading-dot inline-block font-bold text-2xl">.</span>
            <span className="loading-dot inline-block font-bold text-2xl" >.</span>
            <span className="loading-dot inline-block font-bold text-2xl">.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  preloader: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  btnContainer: {
    width: "320px",
    height: "320px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};