/* =========================================================
   YAZONII — PORTFOLIO INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     NAVBAR — changes when scrolling
     ======================================================= */

  const navbar = document.querySelector(".navbar");

  const updateNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 40
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

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-scale"
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  /* =======================================================
     HERO TEXT ENTRANCE
     ======================================================= */

  const heroLines = document.querySelectorAll(
    ".hero h1 .line"
  );

  heroLines.forEach((line, index) => {

    line.style.opacity = "0";
    line.style.transform = "translateY(45px)";

    line.style.transition =
      `opacity 1s cubic-bezier(.16,1,.3,1) ${index * 100}ms,
       transform 1s cubic-bezier(.16,1,.3,1) ${index * 100}ms`;

    requestAnimationFrame(() => {

      setTimeout(() => {

        line.style.opacity = "1";
        line.style.transform = "translateY(0)";

      }, 150);

    });

  });


  /* =======================================================
     SMOOTH ANCHOR SCROLLING
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
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =======================================================
     MAGNETIC BUTTONS
     ======================================================= */

  const magneticElements =
    document.querySelectorAll(
      ".btn, .nav-contact"
    );

  magneticElements.forEach(element => {

    element.addEventListener(
      "mousemove",
      event => {

        if (
          window.matchMedia(
            "(pointer: coarse)"
          ).matches
        ) {
          return;
        }

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

        element.style.transform =
          `translate(${x * 0.12}px, ${y * 0.12}px)`;

      }
    );

    element.addEventListener(
      "mouseleave",
      () => {

        element.style.transform = "";

      }
    );

  });


  /* =======================================================
     CUSTOM CURSOR GLOW
     ======================================================= */

  const cursorGlow =
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
      width: 260px;
      height: 260px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(
        circle,
        rgba(255,104,26,.08),
        transparent 68%
      );
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity .3s ease;
      will-change: left, top;
    }

    @media (pointer: coarse) {
      .cursor-glow {
        display: none;
      }
    }
  `;

  document.head.appendChild(
    cursorStyle
  );

  window.addEventListener(
    "mousemove",
    event => {

      cursorGlow.style.left =
        `${event.clientX}px`;

      cursorGlow.style.top =
        `${event.clientY}px`;

      cursorGlow.style.opacity = "1";

    }
  );


  /* =======================================================
     SPARKLE SYSTEM
     ======================================================= */

  const sparkleContainer =
    document.createElement("div");

  sparkleContainer.className =
    "sparkle-container";

  document.body.appendChild(
    sparkleContainer
  );

  const sparkleStyle =
    document.createElement("style");

  sparkleStyle.textContent = `
    .sparkle-container {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 3;
      overflow: hidden;
    }

    .sparkle {
      position: absolute;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background: #ff8a4c;
      box-shadow:
        0 0 8px rgba(255,104,26,.8);
      opacity: 0;
      animation: sparkleFloat linear forwards;
    }

    @keyframes sparkleFloat {

      0% {
        opacity: 0;
        transform:
          translateY(20px)
          scale(.4);
      }

      20% {
        opacity: .8;
      }

      80% {
        opacity: .5;
      }

      100% {
        opacity: 0;
        transform:
          translateY(-100px)
          scale(1);
      }

    }
  `;

  document.head.appendChild(
    sparkleStyle
  );


  const createSparkle = () => {

    if (
      document.hidden ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const sparkle =
      document.createElement("span");

    sparkle.className = "sparkle";

    sparkle.style.left =
      `${Math.random() * 100}%`;

    sparkle.style.top =
      `${55 + Math.random() * 45}%`;

    sparkle.style.animationDuration =
      `${3 + Math.random() * 4}s`;

    sparkle.style.animationDelay =
      `${Math.random() * 1}s`;

    sparkleContainer.appendChild(
      sparkle
    );

    setTimeout(() => {
      sparkle.remove();
    }, 8000);

  };


  setInterval(
    createSparkle,
    500
  );


  /* =======================================================
     CARD TILT
     ======================================================= */

  const cards =
    document.querySelectorAll(
      ".why-card, .service"
    );

  cards.forEach(card => {

    card.addEventListener(
      "mousemove",
      event => {

        if (
          window.matchMedia(
            "(pointer: coarse)"
          ).matches
        ) {
          return;
        }

        const rect =
          card.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const rotateX =
          ((y / rect.height) - 0.5) * -4;

        const rotateY =
          ((x / rect.width) - 0.5) * 4;

        card.style.transform =
          `perspective(700px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateY(-5px)`;

      }
    );

    card.addEventListener(
      "mouseleave",
      () => {

        card.style.transform = "";

      }
    );

  });


  /* =======================================================
     ACTIVE NAV LINK
     ======================================================= */

  const sections =
    document.querySelectorAll(
      "section[id]"
    );

  const navLinks =
    document.querySelectorAll(
      ".nav-links a"
    );

  const sectionObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          const id =
            entry.target.getAttribute("id");

          navLinks.forEach(link => {

            link.classList.remove(
              "active"
            );

            if (
              link.getAttribute("href") ===
              `#${id}`
            ) {
              link.classList.add(
                "active"
              );
            }

          });

        });

      },
      {
        threshold: 0.35
      }
    );

  sections.forEach(section => {
    sectionObserver.observe(section);
  });


  /* =======================================================
     ACTIVE NAV STYLE
     ======================================================= */

  const activeStyle =
    document.createElement("style");

  activeStyle.textContent = `
    .nav-links a.active {
      color: #f5f5f5;
    }

    .nav-links a.active::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  `;

  document.head.appendChild(
    activeStyle
  );


  /* =======================================================
     PARALLAX HERO GRID
     ======================================================= */

  const heroGrid =
    document.querySelector(
      ".hero-grid"
    );

  if (heroGrid) {

    window.addEventListener(
      "scroll",
      () => {

        const offset =
          window.scrollY * 0.12;

        heroGrid.style.transform =
          `translateY(${offset}px)`;

      },
      { passive: true }
    );

  }


  /* =======================================================
     MOUSE PARALLAX ON HERO
     ======================================================= */

  const hero =
    document.querySelector(
      ".hero"
    );

  const heroHighlight =
    document.querySelector(
      ".hero h1 .highlight"
    );

  if (
    hero &&
    heroHighlight &&
    !window.matchMedia(
      "(pointer: coarse)"
    ).matches
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

        heroHighlight.style.transform =
          `translate(
            ${x * 8}px,
            ${y * 5}px
          )`;

      }
    );

    hero.addEventListener(
      "mouseleave",
      () => {

        heroHighlight.style.transform =
          "";

      }
    );

  }


  /* =======================================================
     PAGE READY
     ======================================================= */

  document.body.classList.add(
    "loaded"
  );

});
