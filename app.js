// Highlight the nav link matching the section currently in view
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => observer.observe(section));

// Typing effect for the hero subtitle
const heroSubtitle = document.querySelector("#hero p");

if (heroSubtitle) {
  const fullText = heroSubtitle.textContent;
  heroSubtitle.textContent = "";
  let i = 0;

  function typeNext() {
    if (i <= fullText.length) {
      heroSubtitle.textContent = fullText.slice(0, i);
      i++;
      setTimeout(typeNext, 35);
    }
  }

  typeNext();
}
