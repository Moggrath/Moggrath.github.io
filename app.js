const roles = [
  "IT Support Specialist",
  "Investor Relations Analyst",
  "Data Engineer",
  "Desktop Support Technician",
  "Tableau & Power BI Builder",
  "Python & SQL Problem Solver",
];

const typedRole = document.querySelector("#typed-role");
const typedArticle = document.querySelector("#typed-article");
const navMenu = document.querySelector(".top-nav nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".top-nav nav a");
let roleIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeRole() {
  if (!typedRole) return;

  const currentRole = roles[roleIndex];
  if (typedArticle) {
    typedArticle.textContent = /^[aeiou]/i.test(currentRole) ? "An" : "A";
  }
  typedRole.textContent = currentRole.slice(0, letterIndex);

  if (!deleting && letterIndex < currentRole.length) {
    letterIndex += 1;
  } else if (!deleting && letterIndex === currentRole.length) {
    deleting = true;
    setTimeout(typeRole, 1250);
    return;
  } else if (deleting && letterIndex > 0) {
    letterIndex -= 1;
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeRole, deleting ? 34 : 58);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 },
);

document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
typeRole();

/* ---------- Scroll reveal ---------- */
// Tag additional blocks so they fade/slide in on scroll (project + skill cards are tagged in HTML).
document
  .querySelectorAll(
    ".section-heading, .about-grid > *, .contact-cards a, .contact-section > div:first-of-type",
  )
  .forEach((el) => el.classList.add("reveal"));

// Stagger the cards within a grid so they "pop in" one after another.
const stagger = (selector, step) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * step, 360)}ms`;
  });
};
stagger("#project-grid .reveal", 90);
stagger(".skill-grid .reveal", 70);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Matrix digital rain ---------- */
const rain = document.createElement("canvas");
rain.className = "matrix-rain";
rain.setAttribute("aria-hidden", "true");
document.body.appendChild(rain);

const rainCtx = rain.getContext("2d");
const rainGlyphs = "01";
const rainCell = 15;
const rainColGap = 32;
let rainCols = 0;
let rainDrops = [];
let rainSpeeds = [];

function sizeRain() {
  rain.width = window.innerWidth;
  rain.height = window.innerHeight;
  rainCols = Math.ceil(rain.width / rainColGap);
  rainDrops = Array.from({ length: rainCols }, () => Math.random() * (-2 * rain.height / rainCell));
  rainSpeeds = Array.from({ length: rainCols }, () => 0.25 + Math.random() * 0.4);
}
sizeRain();
window.addEventListener("resize", sizeRain);

setInterval(() => {
  // fade previous frame while keeping the canvas transparent
  rainCtx.globalCompositeOperation = "destination-out";
  rainCtx.fillStyle = "rgba(0, 0, 0, 0.09)";
  rainCtx.fillRect(0, 0, rain.width, rain.height);
  rainCtx.globalCompositeOperation = "source-over";

  rainCtx.font = `${rainCell}px Consolas, monospace`;
  for (let i = 0; i < rainCols; i++) {
    const y = rainDrops[i] * rainCell;
    if (y > 0) {
      const glyph = rainGlyphs[(Math.random() * rainGlyphs.length) | 0];
      // occasional bright "head" glyph, otherwise dim fern
      rainCtx.fillStyle = Math.random() > 0.92 ? "rgba(160, 230, 190, 0.85)" : "rgba(111, 174, 140, 0.5)";
      rainCtx.fillText(glyph, i * rainColGap, y);
    }
    rainDrops[i] += rainSpeeds[i];
    if (y > rain.height + 40) {
      rainDrops[i] = Math.random() * -60;
      rainSpeeds[i] = 0.25 + Math.random() * 0.4;
    }
  }
}, 66);

/* ---------- Floating background motes ---------- */
const motes = document.createElement("div");
motes.className = "bg-motes";
motes.setAttribute("aria-hidden", "true");
for (let i = 0; i < 22; i++) {
  const mote = document.createElement("span");
  mote.style.left = `${Math.random() * 100}%`;
  mote.style.top = `${8 + Math.random() * 88}%`;
  mote.style.setProperty("--s", `${(2 + Math.random() * 3).toFixed(1)}px`);
  mote.style.setProperty("--d", `${(14 + Math.random() * 18).toFixed(1)}s`);
  mote.style.setProperty("--del", `${(-Math.random() * 30).toFixed(1)}s`);
  mote.style.setProperty("--x", `${(Math.random() * 44 - 22).toFixed(0)}px`);
  mote.style.setProperty("--o", (0.18 + Math.random() * 0.3).toFixed(2));
  motes.appendChild(mote);
}
document.body.appendChild(motes);

/* ---------- Experience company console ---------- */
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");
const tabGlider = document.querySelector(".tab-glider");

function moveGlider(btn) {
  if (!tabGlider || !btn) return;
  tabGlider.style.transform = `translateY(${btn.offsetTop}px)`;
  tabGlider.style.height = `${btn.offsetHeight}px`;
}

if (tabBtns.length) {
  moveGlider(document.querySelector(".tab-btn.on"));

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.toggle("on", b === btn));
      tabPanes.forEach((pane, i) => {
        pane.classList.remove("on");
        if (i === Number(btn.dataset.t)) {
          void pane.offsetWidth; // restart the entry animation
          pane.classList.add("on");
        }
      });
      moveGlider(btn);
    });
  });

  window.addEventListener("resize", () => moveGlider(document.querySelector(".tab-btn.on")));
}

/* ---------- Certificate carousel ---------- */
const certs = [
  {
    src: "assets/cert-python-project-data-engineering.jpg",
    title: "Python Project for Data Engineering",
    meta: "IBM · Coursera · Jan 2026",
    verify: "https://coursera.org/verify/JRGLXWGCHE46",
  },
  {
    src: "assets/cert-python-data-science.jpg",
    title: "Python for Data Science, AI & Development",
    meta: "IBM · Coursera · Aug 2025",
    verify: "https://coursera.org/verify/JOTUBA1CBP60",
  },
  {
    src: "assets/cert-intro-data-engineering.jpg",
    title: "Introduction to Data Engineering",
    meta: "IBM · Coursera · Aug 2025",
    verify: "https://coursera.org/verify/CATBGNNJUT94",
  },
  {
    src: "assets/cert-querying-sql-2019.jpg",
    title: "Querying Microsoft SQL Server 2019",
    meta: "LinkedIn Learning · Oct 2022",
    verify: "https://www.linkedin.com/learning/certificates/74b9c512258e03e1237f872f6a5e74ca67fc2d06372bdcdddb0a259d041eba42",
  },
  {
    src: "assets/cert-querying-sql-2022.jpg",
    title: "Querying Microsoft SQL Server 2022",
    meta: "LinkedIn Learning · Oct 2022",
    verify: "https://www.linkedin.com/learning/certificates/425323afe7e214f0912a76800da3b3cceb966a02356f950db9bc4c1375a5e4a3",
  },
  {
    src: "assets/cert-sql-server-essential.jpg",
    title: "Microsoft SQL Server 2022 Essential Training",
    meta: "LinkedIn Learning · Oct 2022",
    verify: "https://www.linkedin.com/learning/certificates/8c99341f88d6ed9625f66aa0d9be1473f3c6c3b754a0248d5c39eb4e73f9d399",
  },
];

const certImage = document.querySelector("#cert-image");
const certTitle = document.querySelector("#cert-title");
const certMeta = document.querySelector("#cert-meta");
const certVerify = document.querySelector("#cert-verify");
const certDots = document.querySelector("#cert-dots");

if (certImage && certDots) {
  certs.forEach((cert) => {
    const img = new Image();
    img.src = cert.src;
  });

  let certIndex = 0;

  const dots = certs.map((cert, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show certificate ${i + 1} of ${certs.length}: ${cert.title}`);
    dot.addEventListener("click", () => showCert(i));
    certDots.appendChild(dot);
    return dot;
  });

  function showCert(i) {
    certIndex = (i + certs.length) % certs.length;
    const cert = certs[certIndex];
    certImage.style.opacity = "0";
    setTimeout(() => {
      certImage.src = cert.src;
      certImage.alt = `${cert.title} certificate`;
      certImage.style.opacity = "1";
    }, 200);
    certTitle.textContent = cert.title;
    certMeta.textContent = cert.meta;
    certVerify.href = cert.verify;
    dots.forEach((dot, d) => dot.classList.toggle("is-active", d === certIndex));
  }

  document.querySelector("#cert-prev")?.addEventListener("click", () => showCert(certIndex - 1));
  document.querySelector("#cert-next")?.addEventListener("click", () => showCert(certIndex + 1));
  dots[0].classList.add("is-active");
}
