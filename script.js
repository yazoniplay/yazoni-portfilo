const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const topbar = document.querySelector(".topbar");
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const current = window.scrollY;
  if (topbar) {
    topbar.style.transform = current > lastScroll && current > 140
      ? "translate(-50%, -120px)"
      : "translate(-50%, 0)";
  }
  lastScroll = current;
}, { passive: true });