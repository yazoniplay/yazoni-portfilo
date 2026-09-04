/* =========================================================
   YAZONI — PORTFOLIO JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initSmoothScrolling();
  initScrollReveal();
  initActiveNavigation();
  initMagneticButtons();
  initCursorGlow();
});


/* =========================================================
   HEADER
   ========================================================= */

function initHeader() {
  const header = document.querySelector(".site-header");

  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });
}


/* =========================================================
   SMOOTH SCROLLING
   ========================================================= */

function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });
}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".section-heading, " +
    ".intro-content, " +
    ".service-card, " +
    ".project-card, " +
    ".process-item, " +
    ".about-content, " +
    ".contact-card"
  );

  if (!elements.length) return;

  elements.forEach((element) => {
    element.classList.add("reveal");
  });

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
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

  elements.forEach((element) => {
    observer.observe(element);
  });
}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  if (!sections.length || !navLinks.length) return;

  const linkMap = {};

  navLinks.forEach((link) => {
    const id = link.getAttribute("href");

    if (id) {
      linkMap[id] = link;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = `#${entry.target.id}`;

        navLinks.forEach((link) => {
          link.classList.remove("active");
        });

        if (linkMap[id]) {
          linkMap[id].classList.add("active");
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-20% 0px -50% 0px"
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}


/* =========================================================
   MAGNETIC BUTTONS
   ========================================================= */

function initMagneticButtons() {
  const buttons = document.querySelectorAll(
    ".button, .nav-cta"
  );

  if (!buttons.length) return;

  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) return;

  buttons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left -
        rect.width / 2;

      const y =
        event.clientY -
        rect.top -
        rect.height / 2;

      const strength = 0.15;

      button.style.transform =
        `translate(${x * strength}px, ${y * strength}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}


/* =========================================================
   CURSOR GLOW
   ========================================================= */

function initCursorGlow() {
  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) return;

  const glow = document.createElement("div");

  glow.className = "cursor-glow";

  document.body.appendChild(glow);

  let mouseX = -100;
  let mouseY = -100;

  let currentX = mouseX;
  let currentY = mouseY;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const animate = () => {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    glow.style.transform =
      `translate3d(${currentX}px, ${currentY}px, 0)`;

    requestAnimationFrame(animate);
  };

  animate();
}


/* =========================================================
   REDUCED MOTION
   ========================================================= */

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (reducedMotion.matches) {
  document.documentElement.classList.add(
    "reduced-motion"
  );
}


/* =========================================================
   PROJECT CARD TILT
   ========================================================= */

function initProjectTilt() {
  const cards = document.querySelectorAll(".project-card");

  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice || !cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width;

      const y =
        (event.clientY - rect.top) /
        rect.height;

      const rotateX = (0.5 - y) * 5;
      const rotateY = (x - 0.5) * 5;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

initProjectTilt();


/* =========================================================
   HERO PARALLAX
   ========================================================= */

function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");
  const heroGlow = document.querySelector(".hero-glow");

  if (!hero || !heroContent) return;

  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice) return;

  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;

      if (scrollY > window.innerHeight) return;

      heroContent.style.transform =
        `translateY(${scrollY * 0.12}px)`;

      if (heroGlow) {
        heroGlow.style.transform =
          `translateY(${scrollY * 0.08}px)`;
      }
    },
    {
      passive: true
    }
  );
}

initHeroParallax();


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelector(".nav-links");

  if (!navbar || !navLinks) return;

  const mobileQuery = window.matchMedia(
    "(max-width: 768px)"
  );

  if (!mobileQuery.matches) return;

  let menuButton = document.querySelector(".mobile-menu");

  if (!menuButton) {
    menuButton = document.createElement("button");

    menuButton.className = "mobile-menu";
    menuButton.type = "button";
    menuButton.setAttribute(
      "aria-label",
      "Open navigation"
    );
    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    navbar.appendChild(menuButton);
  }

  menuButton.addEventListener("click", () => {
    const isOpen =
      navLinks.classList.toggle("open");

    menuButton.classList.toggle(
      "open",
      isOpen
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });
}

initMobileNavigation();


/* =========================================================
   YEAR
   ========================================================= */

function initYear() {
  const yearElements = document.querySelectorAll(
    ".current-year"
  );

  const year = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = year;
  });
}

initYear();
