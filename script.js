const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const topbar = document.querySelector(".topbar");
const progress = document.querySelector(".page-progress");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const current = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = max > 0 ? (current / max) * 100 + "%" : "0%";
  if (topbar) {
    topbar.style.transform = current > lastScroll && current > 140
      ? "translate(-50%, -120px)"
      : "translate(-50%, 0)";
  }
  lastScroll = current;
}, { passive: true });

const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (event) => {
  if (glow) {
    glow.style.left = event.clientX + "px";
    glow.style.top = event.clientY + "px";
  }
});

const heroArt = document.querySelector(".tilt-card");
const orb = document.querySelector(".hero-art .orb");
if (heroArt && window.matchMedia("(pointer:fine)").matches) {
  heroArt.addEventListener("pointermove", (event) => {
    const r = heroArt.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - .5;
    const y = (event.clientY - r.top) / r.height - .5;
    heroArt.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg)`;
    if (orb) orb.style.transform = `translate(${x * 10}px,${y * 10}px)`;
  });
  heroArt.addEventListener("pointerleave", () => {
    heroArt.style.transform = "";
    if (orb) orb.style.transform = "";
  });
}

document.querySelectorAll(".project-visual").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const r = card.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - .5;
    const y = (event.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(1000px) rotateX(${-y * 2.5}deg) rotateY(${x * 3}deg) translateY(-7px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});