/* =========================================================
   YAZONII — SIGNATURE PORTFOLIO
   Liquid Glass / Motion / Sparkles / Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isTouch =
    window.matchMedia("(pointer: coarse)").matches;


  /* =======================================================
     HELPERS
     ======================================================= */

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);


  /* =======================================================
     PAGE LOADER
     ======================================================= */

  document.body.classList.add("page-ready");


  /* =======================================================
     NAVBAR
     ======================================================= */

  const navbar = document.querySelector(".navbar");

  const updateNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle(
      "navbar-scrolled",
      window.scrollY > 45
    );
  };

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

  updateNavbar();


  /* =======================================================
     SCROLL REVEALS
     ======================================================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  if (!reducedMotion) {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "is-visible"
            );

            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -70px 0px"
        }
      );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add(
        "is-visible"
      );
    });

  }


  /* =======================================================
     HERO TEXT REVEAL
     ======================================================= */

  const heroLines =
    document.querySelectorAll(
      ".hero-line"
    );

  heroLines.forEach((line, index) => {

    if (reducedMotion) {
      line.classList.add(
        "hero-line-visible"
      );
      return;
    }

    setTimeout(() => {

      line.classList.add(
        "hero-line-visible"
      );

    }, 350 + index * 180);

  });


  /* =======================================================
     IMPOSSIBLE UNDERLINE
     ======================================================= */

  const impossible =
    document.querySelector(
      ".hero-impossible"
    );

  if (impossible && !reducedMotion) {

    setTimeout(() => {

      impossible.classList.add(
        "underline-active"
      );

    }, 1050);

  }


  /* =======================================================
     MAGNETIC ELEMENTS
     ======================================================= */

  const magneticElements =
    document.querySelectorAll(
      ".magnetic"
    );

  if (!isTouch && !reducedMotion) {

    magneticElements.forEach(element => {

      element.addEventListener(
        "mousemove",
        event => {

          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          const strength =
            element.classList.contains(
              "nav-cta"
            )
              ? 0.18
              : 0.12;

          element.style.transform =
            `translate(
              ${x * strength}px,
              ${y * strength}px
            )`;

        }
      );


      element.addEventListener(
        "mouseleave",
        () => {

          element.style.transform =
            "";

        }
      );

    });

  }


  /* =======================================================
     GLOBAL MOUSE LIGHT
     ======================================================= */

  const mouseLight =
    document.createElement("div");

  mouseLight.className =
    "global-mouse-light";

  document.body.appendChild(
    mouseLight
  );


  const mouseLightStyle =
    document.createElement("style");

  mouseLightStyle.textContent = `
    .global-mouse-light {
      position: fixed;
      width: 420px;
      height: 420px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 2;
      transform: translate(-50%, -50%);
      background:
        radial-gradient(
          circle,
          rgba(255,104,26,.075) 0%,
          rgba(255,104,26,.025) 35%,
          transparent 70%
        );
      opacity: 0;
      transition: opacity .5s ease;
      will-change: left, top;
    }

    @media (pointer: coarse) {
      .global-mouse-light {
        display: none;
      }
    }
  `;

  document.head.appendChild(
    mouseLightStyle
  );


  if (!isTouch && !reducedMotion) {

    window.addEventListener(
      "mousemove",
      event => {

        mouseLight.style.left =
          `${event.clientX}px`;

        mouseLight.style.top =
          `${event.clientY}px`;

        mouseLight.style.opacity =
          "1";

      },
      { passive: true }
    );

  }


  /* =======================================================
     LIQUID GLASS MOUSE REFLECTION
     ======================================================= */

  const glassElements =
    document.querySelectorAll(
      ".liquid-glass"
    );

  if (!isTouch && !reducedMotion) {

    glassElements.forEach(card => {

      card.addEventListener(
        "mousemove",
        event => {

          const rect =
            card.getBoundingClientRect();

          const x =
            ((event.clientX -
              rect.left) /
              rect.width) * 100;

          const y =
            ((event.clientY -
              rect.top) /
              rect.height) * 100;

          card.style.setProperty(
            "--mouse-x",
            `${x}%`
          );

          card.style.setProperty(
            "--mouse-y",
            `${y}%`
          );

          card.classList.add(
            "glass-hover"
          );

        }
      );


      card.addEventListener(
        "mouseleave",
        () => {

          card.classList.remove(
            "glass-hover"
          );

          card.style.setProperty(
            "--mouse-x",
            "50%"
          );

          card.style.setProperty(
            "--mouse-y",
            "50%"
          );

        }
      );

    });

  }


  /* =======================================================
     GLASS CARD 3D TILT
     ======================================================= */

  const cards =
    document.querySelectorAll(
      ".service-card"
    );

  if (!isTouch && !reducedMotion) {

    cards.forEach(card => {

      card.addEventListener(
        "mousemove",
        event => {

          const rect =
            card.getBoundingClientRect();

          const px =
            (event.clientX -
              rect.left) /
            rect.width;

          const py =
            (event.clientY -
              rect.top) /
            rect.height;

          const rotateX =
            (0.5 - py) * 5;

          const rotateY =
            (px - 0.5) * 5;

          card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-8px)`;

        }
      );


      card.addEventListener(
        "mouseleave",
        () => {

          card.style.transform =
            "";

        }
      );

    });

  }


  /* =======================================================
     HERO MOUSE PARALLAX
     ======================================================= */

  const hero =
    document.querySelector(
      ".hero"
    );

  const heroContent =
    document.querySelector(
      ".hero-content"
    );

  const heroSparkles =
    document.querySelectorAll(
      ".signature-sparkle"
    );


  if (
    hero &&
    !isTouch &&
    !reducedMotion
  ) {

    hero.addEventListener(
      "mousemove",
      event => {

        const rect =
          hero.getBoundingClientRect();

        const x =
          (event.clientX -
            rect.left -
            rect.width / 2) /
          rect.width;

        const y =
          (event.clientY -
            rect.top -
            rect.height / 2) /
          rect.height;


        if (heroContent) {

          heroContent.style.transform =
            `translate(
              ${x * 8}px,
              ${y * 5}px
            )`;

        }


        heroSparkles.forEach(
          (sparkle, index) => {

            const strength =
              10 + index * 8;

            sparkle.style.transform =
              `translate(
                ${x * strength}px,
                ${y * strength}px
              )`;

          }
        );

      }
    );


    hero.addEventListener(
      "mouseleave",
      () => {

        if (heroContent) {
          heroContent.style.transform =
            "";
        }

        heroSparkles.forEach(
          sparkle => {
            sparkle.style.transform =
              "";
          }
        );

      }
    );

  }


  /* =======================================================
     YAZONII SPARKLE SYSTEM
     ======================================================= */

  const sparkleField =
    document.querySelector(
      ".sparkle-field"
    );

  const sparkleSymbols = [
    "✦",
    "✧",
    "✦",
    "·"
  ];


  const createSparkle = () => {

    if (
      !sparkleField ||
      reducedMotion ||
      document.hidden
    ) {
      return;
    }


    const sparkle =
      document.createElement("span");

    sparkle.className =
      "generated-sparkle";

    sparkle.textContent =
      sparkleSymbols[
        Math.floor(
          Math.random() *
          sparkleSymbols.length
        )
      ];


    sparkle.style.left =
      `${Math.random() * 100}%`;

    sparkle.style.top =
      `${25 + Math.random() * 70}%`;

    sparkle.style.setProperty(
      "--spark-size",
      `${5 + Math.random() * 10}px`
    );

    sparkle.style.setProperty(
      "--spark-duration",
      `${3 + Math.random() * 4}s`
    );

    sparkle.style.setProperty(
      "--spark-delay",
      `${Math.random() * .8}s`
    );


    sparkleField.appendChild(
      sparkle
    );


    setTimeout(
      () => sparkle.remove(),
      8000
    );

  };


  if (!reducedMotion) {

    setInterval(
      createSparkle,
      550
    );

  }


  /* =======================================================
     BRAND SPARKLE
     ======================================================= */

  const brand =
    document.querySelector(
      ".sparkle-trigger"
    );

  const brandSparkle =
    document.querySelector(
      ".brand-sparkle"
    );


  if (brand && brandSparkle) {

    brand.addEventListener(
      "mouseenter",
      () => {

        brandSparkle.classList.add(
          "sparkle-pop"
        );

      }
    );


    brand.addEventListener(
      "mouseleave",
      () => {

        brandSparkle.classList.remove(
          "sparkle-pop"
        );

      }
    );

  }


  /* =======================================================
     RANDOM SIGNATURE SPARKLE BURSTS
     ======================================================= */

  const signatureSparkles =
    document.querySelectorAll(
      ".signature-sparkle"
    );


  signatureSparkles.forEach(
    sparkle => {

      if (reducedMotion) return;

      const delay =
        1500 +
        Math.random() * 4000;

      setTimeout(
        () => {

          sparkle.classList.add(
            "sparkle-burst"
          );

          setTimeout(
            () => {

              sparkle.classList.remove(
                "sparkle-burst"
              );

            },
            1200
          );

        },
        delay
      );

    }
  );


  /* =======================================================
     PROCESS LINE
     ======================================================= */

  const processSection =
    document.querySelector(
      ".process"
    );

  const processLine =
    document.querySelector(
      ".process-line span"
    );


  if (
    processSection &&
    processLine
  ) {

    const updateProcessLine = () => {

      const rect =
        processSection.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      const start =
        viewportHeight * 0.75;

      const distance =
        start - rect.top;

      const total =
        rect.height;

      const progress =
        clamp(
          distance / total,
          0,
          1
        );


      processLine.style.height =
        `${progress * 100}%`;

    };


    window.addEventListener(
      "scroll",
      updateProcessLine,
      { passive: true }
    );

    updateProcessLine();

  }


  /* =======================================================
     PARALLAX ORBS
     ======================================================= */

  const orbs =
    document.querySelectorAll(
      ".orb"
    );


  if (
    !isTouch &&
    !reducedMotion
  ) {

    window.addEventListener(
      "mousemove",
      event => {

        const x =
          (event.clientX /
            window.innerWidth -
            0.5);

        const y =
          (event.clientY /
            window.innerHeight -
            0.5);


        orbs.forEach(
          (orb, index) => {

            const strength =
              15 +
              index * 12;

            orb.style.transform =
              `translate(
                ${x * strength}px,
                ${y * strength}px
              )`;

          }
        );

      },
      { passive: true }
    );

  }


  /* =======================================================
     SCROLL PARALLAX FOR STATEMENT ORB
     ======================================================= */

  const statementOrb =
    document.querySelector(
      ".statement-orb"
    );


  if (
    statementOrb &&
    !reducedMotion
  ) {

    window.addEventListener(
      "scroll",
      () => {

        const rect =
          statementOrb.parentElement
            .getBoundingClientRect();

        const progress =
          (window.innerHeight -
            rect.top) /
          (window.innerHeight +
            rect.height);

        const y =
          (progress - 0.5) * 120;

        statementOrb.style.transform =
          `translateY(${y}px)`;

      },
      { passive: true }
    );

  }


  /* =======================================================
     CONTACT MAGNETIC GLOW
     ======================================================= */

  const contact =
    document.querySelector(
      ".contact"
    );

  const contactGlow =
    document.querySelector(
      ".contact-glow"
    );


  if (
    contact &&
    contactGlow &&
    !isTouch &&
    !reducedMotion
  ) {

    contact.addEventListener(
      "mousemove",
      event => {

        const rect =
          contact.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        contactGlow.style.left =
          `${x}px`;

        contactGlow.style.top =
          `${y}px`;

      }
    );

  }


  /* =======================================================
     HOVER SOUNDLESS MICRO INTERACTIONS
     ======================================================= */

  const interactive =
    document.querySelectorAll(
      "a, button, .service-card"
    );


  interactive.forEach(element => {

    element.addEventListener(
      "mouseenter",
      () => {

        element.classList.add(
          "is-hovering"
        );

      }
    );


    element.addEventListener(
      "mouseleave",
      () => {

        element.classList.remove(
          "is-hovering"
        );

      }
    );

  });


  /* =======================================================
     FOOTER YEAR
     ======================================================= */

  const yearElement =
    document.querySelector(
      ".footer-year"
    );


  if (yearElement) {

    yearElement.textContent =
      `© ${new Date().getFullYear()}`;

  }


  /* =======================================================
     PAGE VISIBILITY
     ======================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      document.body.classList.toggle(
        "page-hidden",
        document.hidden
      );

    }
  );


  /* =======================================================
     FINAL READY STATE
     ======================================================= */

  requestAnimationFrame(() => {

    document.body.classList.add(
      "animations-ready"
    );

  });

});
