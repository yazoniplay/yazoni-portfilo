/* =========================================================
   YAZONII — PREMIUM PORTFOLIO MOTION SYSTEM
   No libraries required.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isTouch =
    window.matchMedia("(pointer: coarse)").matches;

  const root = document.documentElement;
  const body = document.body;

  /* =======================================================
     HELPERS
     ======================================================= */

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const lerp = (start, end, amount) =>
    start + (end - start) * amount;


  /* =======================================================
     PAGE READY
     ======================================================= */

  requestAnimationFrame(() => {
    body.classList.add("page-ready");
    body.classList.add("animations-ready");
  });


  /* =======================================================
     NAVBAR
     ======================================================= */

  const navbar = document.querySelector(".navbar");

  const updateNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle(
      "navbar-scrolled",
      window.scrollY > 50
    );
  };

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

  updateNavbar();


  /* =======================================================
     SMOOTH ANCHOR NAVIGATION
     ======================================================= */

  document.querySelectorAll(
    'a[href^="#"]'
  ).forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) return;

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior:
          prefersReducedMotion
            ? "auto"
            : "smooth",
        block: "start"
      });

    });

  });


  /* =======================================================
     HERO LINE REVEAL
     ======================================================= */

  const heroLines =
    document.querySelectorAll(
      ".hero-line"
    );

  heroLines.forEach((line, index) => {

    if (prefersReducedMotion) {

      line.classList.add(
        "hero-line-visible"
      );

      return;
    }

    setTimeout(() => {

      line.classList.add(
        "hero-line-visible"
      );

    }, 250 + index * 180);

  });


  /* =======================================================
     IMPOSSIBLE UNDERLINE
     ======================================================= */

  const impossible =
    document.querySelector(
      ".hero-impossible"
    );

  if (impossible) {

    setTimeout(() => {

      impossible.classList.add(
        "underline-active"
      );

    }, prefersReducedMotion ? 0 : 1100);

  }


  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {

    revealElements.forEach(element => {
      element.classList.add(
        "is-visible"
      );
    });

  } else {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting)
              return;

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

  }


  /* =======================================================
     GLOBAL CURSOR GLOW
     ======================================================= */

  let cursorGlow = null;

  if (
    !isTouch &&
    !prefersReducedMotion
  ) {

    cursorGlow =
      document.createElement("div");

    cursorGlow.className =
      "cursor-glow";

    document.body.appendChild(
      cursorGlow
    );


    const cursorStyle =
      document.createElement("style");

    cursorStyle.textContent = `
      .cursor-glow {
        position: fixed;
        width: 420px;
        height: 420px;
        left: 0;
        top: 0;
        pointer-events: none;
        z-index: 1;
        border-radius: 50%;
        transform: translate3d(-50%, -50%, 0);
        background:
          radial-gradient(
            circle,
            rgba(255,104,26,.075) 0%,
            rgba(255,104,26,.025) 32%,
            transparent 70%
          );
        opacity: 0;
        will-change: transform;
        transition: opacity .5s ease;
      }
    `;

    document.head.appendChild(
      cursorStyle
    );


    let cursorX = -500;
    let cursorY = -500;

    let glowX = cursorX;
    let glowY = cursorY;


    window.addEventListener(
      "mousemove",
      event => {

        cursorX = event.clientX;
        cursorY = event.clientY;

        cursorGlow.style.opacity = "1";

      },
      { passive: true }
    );


    const animateGlow = () => {

      glowX = lerp(
        glowX,
        cursorX,
        0.1
      );

      glowY = lerp(
        glowY,
        cursorY,
        0.1
      );

      cursorGlow.style.transform =
        `translate3d(
          ${glowX}px,
          ${glowY}px,
          0
        )`;

      requestAnimationFrame(
        animateGlow
      );

    };

    animateGlow();

  }


  /* =======================================================
     LIQUID GLASS CURSOR REFLECTION
     ======================================================= */

  const glassElements =
    document.querySelectorAll(
      ".liquid-glass"
    );

  if (
    !isTouch &&
    !prefersReducedMotion
  ) {

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

          card.style.setProperty(
            "--mouse-x",
            "50%"
          );

          card.style.setProperty(
            "--mouse-y",
            "50%"
          );

          card.classList.remove(
            "glass-hover"
          );

        }
      );

    });

  }


  /* =======================================================
     MAGNETIC BUTTONS
     ======================================================= */

  const magneticElements =
    document.querySelectorAll(
      ".magnetic"
    );

  if (
    !isTouch &&
    !prefersReducedMotion
  ) {

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
            `translate3d(
              ${x * strength}px,
              ${y * strength}px,
              0
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
     HERO PARALLAX
     ======================================================= */

  const hero =
    document.querySelector(
      ".hero"
    );

  const heroContent =
    document.querySelector(
      ".hero-content"
    );

  const signatureSparkles =
    document.querySelectorAll(
      ".signature-sparkle"
    );

  if (
    hero &&
    !isTouch &&
    !prefersReducedMotion
  ) {

    let heroMouseX = 0;
    let heroMouseY = 0;

    hero.addEventListener(
      "mousemove",
      event => {

        const rect =
          hero.getBoundingClientRect();

        heroMouseX =
          (event.clientX -
            rect.left -
            rect.width / 2) /
          rect.width;

        heroMouseY =
          (event.clientY -
            rect.top -
            rect.height / 2) /
          rect.height;

      },
      { passive: true }
    );


    hero.addEventListener(
      "mouseleave",
      () => {

        heroMouseX = 0;
        heroMouseY = 0;

      }
    );


    const animateHero = () => {

      if (heroContent) {

        heroContent.style.transform =
          `translate3d(
            ${heroMouseX * 7}px,
            ${heroMouseY * 4}px,
            0
          )`;

      }


      signatureSparkles.forEach(
        (sparkle, index) => {

          const strength =
            12 + index * 10;

          sparkle.style.transform =
            `translate3d(
              ${heroMouseX * strength}px,
              ${heroMouseY * strength}px,
              0
            )`;

        }
      );


      requestAnimationFrame(
        animateHero
      );

    };

    animateHero();

  }


  /* =======================================================
     3D SERVICE CARD TILT
     ======================================================= */

  const cards =
    document.querySelectorAll(
      ".service-card"
    );

  if (
    !isTouch &&
    !prefersReducedMotion
  ) {

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
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-7px)`;

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
     ORB PARALLAX
     ======================================================= */

  const orbs =
    document.querySelectorAll(
      ".orb"
    );

  if (
    !isTouch &&
    !prefersReducedMotion
  ) {

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener(
      "mousemove",
      event => {

        mouseX =
          (event.clientX /
            window.innerWidth -
            0.5);

        mouseY =
          (event.clientY /
            window.innerHeight -
            0.5);

      },
      { passive: true }
    );


    const animateOrbs = () => {

      orbs.forEach(
        (orb, index) => {

          const strength =
            15 + index * 12;

          orb.style.transform =
            `translate3d(
              ${mouseX * strength}px,
              ${mouseY * strength}px,
              0
            )`;

        }
      );

      requestAnimationFrame(
        animateOrbs
      );

    };

    animateOrbs();

  }


  /* =======================================================
     SPARKLE SYSTEM
     ======================================================= */

  const sparkleField =
    document.querySelector(
      ".sparkle-field"
    );

  const sparkleCharacters = [
    "✦",
    "✧",
    "·",
    "✦"
  ];


  const createSparkle = () => {

    if (
      !sparkleField ||
      prefersReducedMotion ||
      document.hidden
    ) {
      return;
    }


    const sparkle =
      document.createElement("span");

    sparkle.className =
      "generated-sparkle";

    sparkle.textContent =
      sparkleCharacters[
        Math.floor(
          Math.random() *
          sparkleCharacters.length
        )
      ];


    sparkle.style.left =
      `${Math.random() * 100}%`;

    sparkle.style.top =
      `${15 + Math.random() * 80}%`;

    sparkle.style.setProperty(
      "--spark-size",
      `${5 + Math.random() * 10}px`
    );

    sparkle.style.setProperty(
      "--spark-duration",
      `${3.5 + Math.random() * 3}s`
    );

    sparkle.style.setProperty(
      "--spark-delay",
      `${Math.random() * .5}s`
    );


    sparkleField.appendChild(
      sparkle
    );


    setTimeout(() => {
      sparkle.remove();
    }, 8000);

  };


  if (!prefersReducedMotion) {

    setInterval(
      createSparkle,
      650
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
     SIGNATURE SPARKLE BURSTS
     ======================================================= */

  signatureSparkles.forEach(
    sparkle => {

      if (prefersReducedMotion)
        return;

      const trigger =
        1800 +
        Math.random() * 4500;

      setTimeout(() => {

        sparkle.classList.add(
          "sparkle-burst"
        );

        setTimeout(() => {

          sparkle.classList.remove(
            "sparkle-burst"
          );

        }, 1200);

      }, trigger);

    }
  );


  /* =======================================================
     PROCESS LINE
     ======================================================= */

  const process =
    document.querySelector(
      ".process"
    );

  const processLine =
    document.querySelector(
      ".process-line span"
    );


  if (process && processLine) {

    const updateProcess =
      () => {

        const rect =
          process.getBoundingClientRect();

        const viewport =
          window.innerHeight;

        const start =
          viewport * 0.75;

        const progress =
          clamp(
            (start - rect.top) /
            rect.height,
            0,
            1
          );


        processLine.style.height =
          `${progress * 100}%`;

      };


    window.addEventListener(
      "scroll",
      updateProcess,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateProcess
    );

    updateProcess();

  }


  /* =======================================================
     STATEMENT ORB PARALLAX
     ======================================================= */

  const statement =
    document.querySelector(
      ".statement"
    );

  const statementOrb =
    document.querySelector(
      ".statement-orb"
    );


  if (
    statement &&
    statementOrb &&
    !prefersReducedMotion
  ) {

    const updateStatement =
      () => {

        const rect =
          statement.getBoundingClientRect();

        const progress =
          (
            window.innerHeight -
            rect.top
          ) /
          (
            window.innerHeight +
            rect.height
          );

        const y =
          (progress - 0.5) * 120;

        statementOrb.style.transform =
          `translate3d(
            -50%,
            calc(-50% + ${y}px),
            0
          )`;

      };


    window.addEventListener(
      "scroll",
      updateStatement,
      { passive: true }
    );

    updateStatement();

  }


  /* =======================================================
     CONTACT GLOW
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
    !prefersReducedMotion
  ) {

    contact.addEventListener(
      "mousemove",
      event => {

        const rect =
          contact.getBoundingClientRect();

        contactGlow.style.left =
          `${event.clientX - rect.left}px`;

        contactGlow.style.top =
          `${event.clientY - rect.top}px`;

      }
    );

  }


  /* =======================================================
     HOVER MICRO INTERACTIONS
     ======================================================= */

  document.querySelectorAll(
    "a, button, .service-card"
  ).forEach(element => {

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

  const year =
    document.querySelector(
      ".footer-year"
    );

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =======================================================
     VISIBILITY OPTIMIZATION
     ======================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      body.classList.toggle(
        "page-hidden",
        document.hidden
      );

    }
  );


  /* =======================================================
     RESIZE CLEANUP
     ======================================================= */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {

        root.style.setProperty(
          "--viewport-height",
          `${window.innerHeight}px`
        );

      }, 150);

    }
  );


  root.style.setProperty(
    "--viewport-height",
    `${window.innerHeight}px`
  );


  /* =======================================================
     FINAL INITIALIZATION
     ======================================================= */

  requestAnimationFrame(() => {

    body.classList.add(
      "portfolio-loaded"
    );

  });

});
