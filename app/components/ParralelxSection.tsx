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

    // cada que se actualize el scroll se actualiza el lenis
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    //ayudar a que el lenis no se quede atrás del scroll
    gsap.ticker.lagSmoothing(0);

    const heroCopySplit = SplitText.create(".hero-copy h3", {
      type: "words",
      wordsClass: "word",
    });

    let isHeroCopyHidden = false;

    ScrollTrigger.create({
      trigger: ".hero-parallex",
      start: "top top",
      end: `+=${window.innerHeight * 2.5}`, // aniamciond ela img al aparecer
      pin: true,
      pinSpacing: true,
      immediateRender: true, // Para evitar parpadeos al iniciar
      onUpdate: (self) => {
        const progress = self.progress;

        //Header move
        const heroHeaderProgress = Math.min(progress / 0.29, 1);

        //Fade confic
        const fadeStart = 0.29;
        const fadeDuration = 0.25;

        const opacityProgress = Math.max(
          0,
          Math.min((progress - fadeStart) / fadeDuration, 1),
        );

        const opacity = 1 - opacityProgress;
        gsap.set(".hero-header", {
          yPercent: -heroHeaderProgress * 10,
          opacity,
        });

      
        //1- aparece palabra por palabras  por scroll desde el 5% hasta el 40% del scroll
        const inttroProgress = Math.max(
          0,
          Math.min((progress - 0.05) / 0.35, 1),
        );

        const totalWords = heroCopySplit.words.length;
        heroCopySplit.words.forEach((word, i) => {
          const wordStart = i / totalWords;
          const wordEnd = (i + 1) / totalWords;
          const wordOpacity = Math.max(
            0,
            Math.min((inttroProgress - wordStart) / (wordEnd - wordStart)),
          );
          gsap.set(word, { opacity: wordOpacity });
        });

        if (progress > 0.64 && !isHeroCopyHidden) {
          isHeroCopyHidden = true;
          gsap.to(".hero-copy h3", {
            opacity: 1,
            duration: 0.2,
            overwrite: true,
          }); // Ocultar
        } else if (progress <= 0.64 && isHeroCopyHidden) {
          isHeroCopyHidden = false;
          gsap.to(".hero-copy h3", {
            opacity: 0,
            duration: 0.2,
            overwrite: true,
          }); // Mostrar
        }

        ScrollTrigger.refresh(); // Asegura que ScrollTrigger se actualice con los cambios de estilo


          // Animación de la imagen del hero, desde el 65% hasta el 100% del scroll
        const heroImgStart = 0.65;
        const heroImgProgress = Math.max(
          0,
          Math.min((progress - heroImgStart) / 0.35, 1),
        );
        const heroImgWith = gsap.utils.interpolate(
          400,
          window.innerWidth * 0.8,
          heroImgProgress,
        );
        const heroImgHeight = gsap.utils.interpolate(
          400,
          window.innerHeight * 0.8,
          heroImgProgress,
        );
        const heroImgBorderRadius = gsap.utils.interpolate(
          0,
          10,
          heroImgProgress,
        );
        gsap.set(".hero-img", {
          width: heroImgWith,
          height: heroImgHeight,
          borderRadius: heroImgBorderRadius,
        });
      },
    });

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
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      
      
    };
  }, []);

  return (
    <main>
      <section className="hero-parallex section-parallex ">
        <div className="hero-img">
          <Image src="/assets/img/1.jpg" alt="" fill />
        </div>
        <div className="hero-header">
          <h1 className="h1-parallex text-center text-black font-luxury">Templo Imep Central</h1>
        </div>
        <div className="hero-copy">
          <h3 className="h3-parallex text-center text-white border-2 border-black/20 p-4 rounded-lg font-luxury bg-stone-600/30">
            Iglesia mision evangélica pentecostal, fundada en xxx, con la visión de ser un templo de adoración, enseñanza y comunión para la gloria de Dios.
          </h3>
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
