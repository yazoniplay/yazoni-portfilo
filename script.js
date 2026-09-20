document.addEventListener("DOMContentLoaded", () => {
  initIntro();
  initHeader();
  initSmoothScrolling();
  initScrollReveal();
  initActiveNavigation();
  initMagneticButtons();
  initCursorExperience();
  initHeroParallax();
  initScrollProgress();
  initServiceSpotlight();
  initClickBursts();
});

function initIntro() {
  const intro = document.querySelector(".intro-screen");
  if (!intro) {
    document.body.classList.remove("intro-active");
    return;
  }

  const finish = () => {
    document.body.classList.remove("intro-active");
    intro.remove();
  };

  intro.addEventListener("animationend", (event) => {
    if (event.animationName === "introExit") finish();
  });

  setTimeout(finish, 2600);
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("scrolled", window.scrollY > 40);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const header = document.querySelector(".site-header");
      const offset = header ? header.offsetHeight : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
    });
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll(".section-heading,.intro-content,.service-card,.process-item,.about-content,.contact-card,.process-list");
  if (!elements.length) return;
  elements.forEach((el, index) => {
    el.classList.add("reveal");
    if (el.classList.contains("service-card") || el.classList.contains("process-item")) {
      el.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    }
  });
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  elements.forEach((el) => observer.observe(el));
}

function initActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;
  const map = {};
  links.forEach((link) => { map[link.getAttribute("href")] = link; });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.remove("active"));
      const active = map[`#${entry.target.id}`];
      if (active) active.classList.add("active");
    });
  }, { threshold: 0.3, rootMargin: "-20% 0px -50% 0px" });
  sections.forEach((section) => observer.observe(section));
}

function initMagneticButtons() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll(".button,.nav-cta").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.12}px,${y * 0.12}px)`;
    });
    button.addEventListener("mouseleave", () => { button.style.transform = ""; });
  });
}

function initCursorExperience() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const glow = document.createElement("div");
  const ring = document.createElement("div");
  const dot = document.createElement("div");
  glow.className = "cursor-glow";
  ring.className = "custom-cursor";
  dot.className = "custom-cursor-dot";
  document.body.append(glow, ring, dot);

  let targetX = -100, targetY = -100, ringX = -100, ringY = -100, glowX = -100, glowY = -100, lastParticle = 0;

  document.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (performance.now() - lastParticle > 28) {
      createParticle(targetX, targetY);
      lastParticle = performance.now();
    }
  });

  document.querySelectorAll("a,button").forEach((element) => {
    element.addEventListener("mouseenter", () => ring.classList.add("cursor-active"));
    element.addEventListener("mouseleave", () => ring.classList.remove("cursor-active"));
  });

  const animate = () => {
    ringX += (targetX - ringX) * 0.22;
    ringY += (targetY - ringY) * 0.22;
    glowX += (targetX - glowX) * 0.1;
    glowY += (targetY - glowY) * 0.1;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    dot.style.left = `${targetX}px`;
    dot.style.top = `${targetY}px`;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animate);
  };
  animate();
}

function createParticle(x, y) {
  const particle = document.createElement("span");
  particle.className = "mouse-particle";
  particle.style.left = `${x + (Math.random() - 0.5) * 12}px`;
  particle.style.top = `${y + (Math.random() - 0.5) * 12}px`;
  particle.style.setProperty("--dx", `${(Math.random() - 0.5) * 55}px`);
  particle.style.setProperty("--dy", `${-20 - Math.random() * 55}px`);
  particle.style.setProperty("--size", `${2 + Math.random() * 5}px`);
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 650);
}

function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const content = document.querySelector(".hero-content");
  const glow = document.querySelector(".hero-glow");
  if (!hero || !content || window.matchMedia("(pointer: coarse)").matches) return;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > window.innerHeight) return;
    content.style.transform = `translateY(${y * 0.12}px)`;
    if (glow) glow.style.transform = `translateX(-50%) translateY(${y * 0.08}px)`;
  }, { passive: true });
}

function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initServiceSpotlight() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

function initClickBursts() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  document.addEventListener("click", (event) => {
    for (let i = 0; i < 7; i++) createBurstParticle(event.clientX, event.clientY);
  });
}

function createBurstParticle(x, y) {
  const particle = document.createElement("span");
  particle.className = "mouse-particle";
  const angle = Math.random() * Math.PI * 2;
  const distance = 25 + Math.random() * 45;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
  particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
  particle.style.setProperty("--size", `${2 + Math.random() * 4}px`);
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 650);
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("reduced-motion");
}