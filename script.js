/* =========================================================
   YAZONII PORTFOLIO — INTERACTIONS
   script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     LOADER
     ======================================================= */

  const loader = document.querySelector(".loader");
  const loaderPercent = document.querySelector(".loader-percent");

  let progress = 0;

  if (loader) {
    const loaderInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 4;

      if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);

        if (loaderPercent) {
          loaderPercent.textContent = "100%";
        }

        setTimeout(() => {
          loader.classList.add("hidden");
          document.body.classList.add("loaded");
        }, 350);

        return;
      }

      if (loaderPercent) {
        loaderPercent.textContent = `${progress}%`;
      }
    }, 80);
  }


  /* =======================================================
     CUSTOM CURSOR
     ======================================================= */

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let ringX = mouseX;
  let ringY = mouseY;

  if (window.matchMedia("(pointer: fine)").matches) {

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
    });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    const interactiveElements = document.querySelectorAll(
      "a, button, .peek-card, .project-visual, .skill"
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });

      element.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      });
    });
  }


  /* =======================================================
     NAVBAR
     ======================================================= */

  const nav = document.querySelector(".nav");

  const updateNav = () => {
    if (!nav) return;

    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", updateNav, {
    passive: true
  });

  updateNav();


  /* =======================================================
     SCROLL REVEALS
     ======================================================= */

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-text"
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
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

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });


  /* =======================================================
     STAGGERED REVEALS
     ======================================================= */

  const staggerGroups = document.querySelectorAll(
    ".skills-grid, .outside-grid, .projects, .process-list"
  );

  staggerGroups.forEach((group) => {

    const children = [...group.children];

    children.forEach((child, index) => {

      child.style.transitionDelay =
        `${index * 90}ms`;

      child.classList.add("reveal");

      revealObserver.observe(child);
    });

  });


  /* =======================================================
     MAGNETIC BUTTONS
     ======================================================= */

  const magneticElements = document.querySelectorAll(
    ".magnetic, .button-primary, .contact-button"
  );

  magneticElements.forEach((element) => {

    element.addEventListener("mousemove", (event) => {

      const rect = element.getBoundingClientRect();

      const x =
        event.clientX -
        (rect.left + rect.width / 2);

      const y =
        event.clientY -
        (rect.top + rect.height / 2);

      const strength = 0.18;

      element.style.transform =
        `translate(${x * strength}px, ${y * strength}px)`;
    });

    element.addEventListener("mouseleave", () => {

      element.style.transform = "";

    });

  });


  /* =======================================================
     PARALLAX BACKGROUND
     ======================================================= */

  const orbs = document.querySelectorAll(
    ".ambient-orb"
  );

  window.addEventListener(
    "scroll",
    () => {

      const scrollY = window.scrollY;

      orbs.forEach((orb, index) => {

        const multiplier =
          (index + 1) * 0.035;

        orb.style.transform =
          `translate3d(0, ${scrollY * multiplier}px, 0)`;

      });

    },
    {
      passive: true
    }
  );


  /* =======================================================
     HERO MOUSE PARALLAX
     ======================================================= */

  const heroContent =
    document.querySelector(".hero-content");

  const heroGrid =
    document.querySelector(".hero-grid");

  if (
    heroContent &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    window.addEventListener("mousemove", (event) => {

      const x =
        (event.clientX / window.innerWidth - 0.5);

      const y =
        (event.clientY / window.innerHeight - 0.5);

      heroContent.style.transform =
        `translate3d(${x * 12}px, ${y * 8}px, 0)`;

      if (heroGrid) {
        heroGrid.style.transform =
          `translate3d(${x * -8}px, ${y * -5}px, 0)`;
      }

    });

  }


  /* =======================================================
     PROJECT TILT
     ======================================================= */

  const tiltElements = document.querySelectorAll(
    ".project-browser, .phone-mockup, .minecraft-ui"
  );

  if (window.matchMedia("(pointer: fine)").matches) {

    tiltElements.forEach((element) => {

      element.addEventListener("mousemove", (event) => {

        const rect =
          element.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        const rotateY =
          (x - 0.5) * 8;

        const rotateX =
          (0.5 - y) * 6;

        element.style.transform =
          `perspective(1000px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateY(-5px)`;
      });

      element.addEventListener("mouseleave", () => {

        element.style.transform = "";

      });

    });

  }


  /* =======================================================
     ACTIVE SECTION NAVIGATION
     ======================================================= */

  const sections =
    document.querySelectorAll("section[id]");

  const navLinks =
    document.querySelectorAll(".nav-links a");

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          const id =
            entry.target.getAttribute("id");

          navLinks.forEach((link) => {

            link.classList.remove("active");

            if (
              link.getAttribute("href") ===
              `#${id}`
            ) {
              link.classList.add("active");
            }

          });

        });

      },
      {
        threshold: 0.35
      }
    );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });


  /* =======================================================
     SMOOTH ANCHOR SCROLL
     ======================================================= */

  document.querySelectorAll(
    'a[href^="#"]'
  ).forEach((link) => {

    link.addEventListener("click", (event) => {

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
     PROJECT HOVER GLOW
     ======================================================= */

  const cards = document.querySelectorAll(
    ".peek-card, .project-visual, .skill, .outside-card"
  );

  if (window.matchMedia("(pointer: fine)").matches) {

    cards.forEach((card) => {

      card.addEventListener("mousemove", (event) => {

        const rect =
          card.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        card.style.background =
          `radial-gradient(
            circle at ${x}px ${y}px,
            rgba(255,106,26,.07),
            rgba(255,255,255,.025) 45%,
            rgba(255,255,255,.015)
          )`;
      });

      card.addEventListener("mouseleave", () => {

        card.style.background = "";

      });

    });

  }


  /* =======================================================
     TEXT SCRAMBLE EFFECT
     ======================================================= */

  const scrambleElements =
    document.querySelectorAll("[data-scramble]");

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  scrambleElements.forEach((element) => {

    const original =
      element.textContent;

    element.addEventListener("mouseenter", () => {

      let iteration = 0;

      clearInterval(element.scrambleInterval);

      element.scrambleInterval =
        setInterval(() => {

          element.textContent =
            original
              .split("")
              .map((letter, index) => {

                if (index < iteration) {
                  return original[index];
                }

                return characters[
                  Math.floor(
                    Math.random() *
                    characters.length
                  )
                ];

              })
              .join("");

          iteration += 1 / 3;

          if (iteration >= original.length) {

            clearInterval(
              element.scrambleInterval
            );

            element.textContent =
              original;

          }

        }, 30);

    });

  });


  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  const yearElements =
    document.querySelectorAll("[data-year]");

  yearElements.forEach((element) => {
    element.textContent =
      new Date().getFullYear();
  });


  /* =======================================================
     IMAGE LAZY LOAD
     ======================================================= */

  const images =
    document.querySelectorAll("img[data-src]");

  const imageObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          const image = entry.target;

          image.src =
            image.dataset.src;

          image.removeAttribute(
            "data-src"
          );

          observer.unobserve(image);

        });

      },
      {
        rootMargin: "200px"
      }
    );

  images.forEach((image) => {
    imageObserver.observe(image);
  });


  /* =======================================================
     KEYBOARD ACCESSIBILITY
     ======================================================= */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      document.body.classList.remove(
        "cursor-hover"
      );

    }

  });


  /* =======================================================
     PAGE READY
     ======================================================= */

  document.body.classList.add("js-ready");

});
