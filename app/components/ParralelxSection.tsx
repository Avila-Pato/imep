"use client";

import Image from "next/image";
import { useEffect } from "react";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(SplitText, ScrollTrigger);

const ParallexPhoto = () => {
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const heroCopySplit = SplitText.create(".hero-copy h3", {
      type: "words",
      wordsClass: "word",
    });
    const totalWords = heroCopySplit.words.length;

    const mm = gsap.matchMedia();

    // ── Desktop ──────────────────────────────────────────────────────────────
    mm.add("(min-width: 769px)", () => {
      const finalImgW = window.innerWidth * 0.8;
      const finalImgH = window.innerHeight * 0.8;

      // GSAP toma ownership de transforms antes de que ScrollTrigger exista
      // → evita el salto CSS→GSAP en el primer frame
      // ── Posición inicial y final del contenedor h3 ──────────────
      // Modifica estos valores para ajustar la animación de posición
      const copyStart = { x: 50, y: 40 };  // posición inicial (px desde el anchor CSS)
      const copyEnd   = { x:   0, y:  0 };  // posición final   (el anchor CSS: bottom-left)

      gsap.set(".hero-img",    { xPercent: -50, yPercent: -50, width: 400, height: 400, borderRadius: 0 });
      gsap.set(".hero-header", { opacity: 0 });
      gsap.set(".hero-copy",   { x: copyStart.x, y: copyStart.y, opacity: 0 });
      gsap.set(".hero-copy h3", { opacity: 1 });
      heroCopySplit.words.forEach((w) => gsap.set(w, { opacity: 0 }));

      // quickSetter: omite el parsing de propiedades en cada frame del scroll
      const setImgW    = gsap.quickSetter(".hero-img",    "width",        "px") as (v: number) => void;
      const setImgH    = gsap.quickSetter(".hero-img",    "height",       "px") as (v: number) => void;
      const setImgR    = gsap.quickSetter(".hero-img",    "borderRadius", "px") as (v: number) => void;
      const setH1Op    = gsap.quickSetter(".hero-header", "opacity")            as (v: number) => void;
      const setCopyX   = gsap.quickSetter(".hero-copy",   "x",           "px") as (v: number) => void;
      const setCopyY   = gsap.quickSetter(".hero-copy",   "y",           "px") as (v: number) => void;
      const setCopyOp  = gsap.quickSetter(".hero-copy",   "opacity")           as (v: number) => void;

        //
      const st = ScrollTrigger.create({
        trigger: ".hero-parallex",
        start: "top top",
        end: `+=${window.innerHeight * 1.5}`,
        pin: true,
        pinSpacing: true,
        onUpdate: ({ progress: p }) => {

          // h3 contenedor — se mueve de copyStart → copyEnd (0.05 → 0.50)
          const copyP = Math.max(0, Math.min((p - 0.05) / 0.45, 1));
          setCopyX(gsap.utils.interpolate(copyStart.x, copyEnd.x, copyP));
          setCopyY(gsap.utils.interpolate(copyStart.y, copyEnd.y, copyP));
          setCopyOp(copyP);

          // h3 palabras — aparecen una a una (0.05 → 0.40)
          const wordP = Math.max(0, Math.min((p - 0.05) / 0.35, 1));
          heroCopySplit.words.forEach((word, i) => {
            const wOpacity = Math.max(
              0,
              Math.min((wordP - i / totalWords) / (1 / totalWords), 1),
            );
            gsap.set(word, { opacity: wOpacity });
          });

          // Imagen — crece (0.65 → 1.0)
          const imgP = Math.max(0, Math.min((p - 0.65) / 0.35, 1));
          setImgW(gsap.utils.interpolate(400, finalImgW, imgP));
          setImgH(gsap.utils.interpolate(400, finalImgH, imgP));
          setImgR(gsap.utils.interpolate(0, 10, imgP));

          // h1 — aparece sincronizado con el crecimiento de la imagen
          setH1Op(imgP);
        },
      });

      return () => st.kill();
    });

    // ── Móvil — animación simplificada ──────────────────────────────────────
    mm.add("(max-width: 768px)", () => {
      const finalImgW = window.innerWidth * 0.95;
      const finalImgH = window.innerHeight * 0.6;

      gsap.set(".hero-img",    { xPercent: -50, yPercent: -50, width: 300, height: 300, borderRadius: 0 });
      gsap.set(".hero-header", { xPercent: -50, yPercent: -50 });
      // En móvil se omite la animación de palabras para ahorrar CPU
      gsap.set(".hero-copy h3", { opacity: 0 });

      const setImgW  = gsap.quickSetter(".hero-img",    "width",  "px") as (v: number) => void;
      const setImgH  = gsap.quickSetter(".hero-img",    "height", "px") as (v: number) => void;
      const setHdrOp = gsap.quickSetter(".hero-header", "opacity")      as (v: number) => void;

      const st = ScrollTrigger.create({
        trigger: ".hero-parallex",
        start: "top top",
        end: `+=${window.innerHeight * 1.5}`, // recorrido más corto en móvil
        pin: true,
        pinSpacing: true,
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
      { id: "#about-imgs-col-1", y: -200 },
      { id: "#about-imgs-col-2", y: -200 },
      { id: "#about-imgs-col-3", y: -250 },
      { id: "#about-imgs-col-4", y: -500 },
    ];

    aboutImgCols.forEach(({ id, y }) => {
      gsap.to(id, {
        y,
        scrollTrigger: {
          trigger: ".about-parallex",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      gsap.ticker.remove(tickerCallback);
      mm.revert();                                      // limpia ScrollTriggers del matchMedia
      ScrollTrigger.getAll().forEach((t) => t.kill()); // limpia about triggers
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <section className="hero-parallex section-parallex">
        <div className="hero-img">
          <div className="hero-img-inner">
            <Image
              src="/assets/img/1.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 95vw, 80vw"
            />
          </div>
          <div className="hero-header">
            <h1 className="h1-parallex font-luxury">Templo Imep Central</h1>
          </div>
          <div className="hero-copy">
            <h3 className="h3-parallex font-luxury">
              Iglesia misión evangélica pentecostal, fundada con la visión de ser un templo de adoración, enseñanza y comunión para la gloria de Dios.
            </h3>
          </div>
        </div>
      </section>

      <section className="about-parallex section-parallex">
        <div className="about-img">
          <div className="about-imgs-col" id="about-imgs-col-1">
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={500} height={500} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={500} height={500} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={500} height={500} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={500} height={500} />
            </div>
          </div>
          <div className="about-imgs-col" id="about-imgs-col-2">
            <div className="img">
              <Image src="/assets/img/5.jpg" alt="" width={500} height={500} />
            </div>
            <div className="img">
              <Image src="/assets/img/6.jpg" alt="" width={500} height={500} />
            </div>
            <div className="img">
              <Image src="/assets/img/7.jpg" alt="" width={500} height={500} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={500} height={500} />
            </div>
          </div>
          <div className="about-imgs-col" id="about-imgs-col-3">
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={100} height={100} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={100} height={100} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={100} height={100} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={100} height={100} />
            </div>
          </div>
          <div className="about-imgs-col" id="about-imgs-col-4">
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={100} height={100} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={100} height={100} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={100} height={100} />
            </div>
            <div className="img">
              <Image src="/assets/img/1.jpg" alt="" width={100} height={100} />
            </div>
          </div>
        </div>

        <div className="about-header">
          <h3>
            Iglesia mision evangélica pentecostal, fundada en xxx, con la visión de ser un templo de adoración, enseñanza y comunión para la gloria de Dios.
          </h3>
        </div>
      </section>

      <section className="outro section-parallex">
        <h3 className="h3-outro">
          the frame settles back into quiet stillness
        </h3>
      </section>
    </main>
  );
};

export default ParallexPhoto;
