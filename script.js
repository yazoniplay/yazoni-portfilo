document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initSmoothScrolling();
  initScrollReveal();
  initActiveNavigation();
  initMagneticButtons();
  initCursorGlow();
  initProjectTilt();
  initHeroParallax();
});

/* Header */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* Smooth scrolling */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const offset = header ? header.offsetHeight : 0;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth"
      });
    });
  });
}

/* Scroll reveal */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".section-heading, .intro-content, .service-card, .process-item, .about-content, .contact-card"
  );

  if (!elements.length) return;

  elements.forEach((element) => element.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px"
  });

  elements.forEach((element) => observer.observe(element));
}

/* Active navigation */
function initActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const linkMap = {};
  navLinks.forEach((link) => {
    const id = link.getAttribute("href");
    if (id) linkMap[id] = link;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => link.classList.remove("active"));

      const activeLink = linkMap[`#${entry.target.id}`];
      if (activeLink) activeLink.classList.add("active");
    });
  }, {
    threshold: 0.3,
    rootMargin: "-20% 0px -50% 0px"
  });

  sections.forEach((section) => observer.observe(section));
}

/* Magnetic buttons */
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".button, .nav-cta");
  if (!buttons.length || window.matchMedia("(pointer: coarse)").matches) return;

  buttons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

/* Cursor glow */
function initCursorGlow() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

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

    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(animate);
  };

  animate();
}

/* Project tilt kept generic for future real projects */
function initProjectTilt() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length || window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      card.style.transform =
        `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* Hero parallax */
function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");
  const heroGlow = document.querySelector(".hero-glow");

  if (!hero || !heroContent || window.matchMedia("(pointer: coarse)").matches) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > window.innerHeight) return;

    heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;

    if (heroGlow) {
      heroGlow.style.transform = `translateX(-50%) translateY(${scrollY * 0.08}px)`;
    }
  }, { passive: true });
}

/* Reduced motion */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reducedMotion.matches) {
  document.documentElement.classList.add("reduced-motion");
}