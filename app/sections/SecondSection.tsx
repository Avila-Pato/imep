"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Lenis from "lenis";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

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
  const activeIdxRef = useRef(4);
  const stickyContainer = useRef<HTMLDivElement | null>(null);

  // ── Gallery scroll animation ──────────────────────────────────────────────
  useGSAP(() => {
    gsap.set(".g-img3", { clipPath: "inset(0% 0% 0% 0% round 4px)" });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stickyContainer.current,
            start: isDesktop ? "top top" : "-=50%",
            end: isDesktop ? "+=200%" : "+=50%",
            scrub: isDesktop,
            pin: isDesktop,
            pinSpacing: true,
          },
        });

        if (isDesktop) {
          // ── DESKTOP ANIMATION ───────────────────────────────────────────
          tl.to(".g-img3", {
            scale: 1.8,
            ease: "none",
            duration: 1,
            transformOrigin: "center 2%",
          })
            .to(".g-img1", { x: -160, y: -40, ease: "none", duration: 1 }, 0)
            .to(".g-img2", { x: -180, y: 80, ease: "none", duration: 1 }, 0)
            .to(".g-img4", { x: 140, y: -80, ease: "none", duration: 1 }, 0)
            .to(".g-img5", { x: -120, y: 100, ease: "none", duration: 1 }, 0)
            .to(".g-img6", { x: 160, y: 80, ease: "none", duration: 1 }, 0)
            .to(".g-img7", { x: 150, y: -60, ease: "none", duration: 1 }, 0)
            .to(".g-img3", {
              clipPath: isMobile 
      ? "inset(20% 15% 0% 15% round 999px 999px 12px 12px)" 
      : "inset(40% 38% 0% 38% round 999px 999px 12px 12px)",
              ease: "none",
              duration: 2,
            })
            .to(
              ".g-slide-img",
              {
                scale: 0.7,
                transformOrigin: "center bottom",
                objectFit: "cover",
                ease: "none",
                duration: 2,
              },
              "<",
            )
            .to(
              ".g-btn-prev",
              {
                marginLeft: isMobile ? "30%" : "40%",
                ease: "none",
                duration: 2,
                marginTop: "35%",
                width: "30px",
                height: "30px",
              },
              "<",
            )
            .to(
              ".g-btn-next",
              {
                marginRight: isMobile ? "30%" : "40%",
                ease: "none",
                duration: 2,
                marginTop: "35%",
                width: "30px",
                height: "30px",
              },
              "<",
            )
            .to(
              [
                ".g-img1",
                ".g-img2",
                ".g-img4",
                ".g-img5",
                ".g-img6",
                ".g-img7",
              ],
              { opacity: 0, ease: "none", duration: 0.7 },
              "<0.2",
            );
        } else {
          // ── MOBILE ANIMATION ────────────────────────────────────────────
          tl.to(".g-img3", {
            scale: 0.8,
            ease: "none",
            duration: 1,
            transformOrigin: "center top",
          })
            .to(
              [
                ".g-img1",
                ".g-img2",
                ".g-img4",
                ".g-img5",
                ".g-img6",
                ".g-img7",
              ],
              { opacity: 0, ease: "none", duration: 0.4 },
              0,
            )
            .to(".btn-position", {
              marginTop: "95%",
              marginLeft: "25%",
              ease: "none",
              duration: 2,
              width: "50%",
              height: "50px",
              gap: "10px",
            })

            .to(".g-img3", {
              // marginTop: "30%",
              // clipPath: "inset(50% 28% 0% 28% round 50% 50% 12px 12px)",
              ease: "none",
              duration: 2,
              objectFit: "cover",
            });
        }
      },
    );
  });

  // ── Cursor ───────────────────────────────────────────────────────────────
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

  // ── Lenis + SplitText ────────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    let split: { revert: () => void } | null = null;

    if (window.innerWidth >= 768) {
      const el = document.querySelector(".h1_text");
      if (el) {
        split = SplitText.create(".h1_text", { type: "chars" });
        gsap.from((split as SplitText).chars, {
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
    }

    return () => {
      gsap.ticker.remove(tickerCallback);
      split?.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="cursor" />

      {/* ── Sección principal ─────────────────────────────────────────── */}
      <main className='img-overlay w-full min-h-screen bg-[url("/assets/stone-wall.webp")] bg-cover bg-center bg-fixed z-10'>
        {/* Texto */}
        <section className="w-full h-[30vh] items-center flex justify-center flex-col overflow-hidden">
          <h1 className="h1_text font-voyager tracking-wide text-stone-200 lg:text-6xl md:text-3xl text-xl text-center">
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
          className="gallery-section flex justify-center h-screen overflow-hidden w-full"
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

            {/* img3 — todas las imgs apiladas para el slider */}
            <div className="g-img3">
              {IMGS.map((src, i) => (
                <div
                  key={i}
                  className="gallery-slide absolute inset-0 overflow-hidden"
                  style={{ transform: `translateX(${(i - 4) * 100}%)` }}
                >
                  <Image
                    src={src}
                    alt={`Imagen ${i + 1}`}
                    fill
                    sizes="60vw"
                    className={`object-cover g-slide-img ${
                      src === "/assets/img/2.jpg"
                        ? "object-[center_20%]"
                        : "object-center"
                    }`}
                  />
                </div>
              ))}
              {/* Botones */}
              <div
                className=" btn-position md:absolute sm:flex  lg:inset-16 md:inset-2  flex md:justify-between justify-center  
                md:items-center z-20 pointer-events-none pb-4 md:pb-0  "
              >
                <button
                  className="g-btn-prev pointer-events-auto md:w-9 md:h-9 w-12 h-12 rounded-full
                   bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center
                    hover:bg-black/90 transition-colors cursor-pointer"
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
                  className="g-btn-next pointer-events-auto md:w-9 md:h-9 w-12 h-12 rounded-full
                   bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
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
    </>
  );
};

export default SecondSection;
