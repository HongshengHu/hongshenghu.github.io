const navToggle = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = [...document.querySelectorAll(".site-nav a")];
const viewLinks = [...document.querySelectorAll('a[href="#about"], a[href="#publications"], a[href="#service"]')];
const aboutSection = document.querySelector("#about");
const newsSection = document.querySelector(".news");
const publicationsSection = document.querySelector("#publications");
const serviceSection = document.querySelector("#service");
const pageSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function closeNavigation() {
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

function setSectionVisibility(visibleSections) {
  [aboutSection, newsSection, publicationsSection, serviceSection].forEach((section) => {
    if (!section) {
      return;
    }

    section.hidden = !visibleSections.includes(section);
  });
}

function setCurrentNavigation(hash) {
  navigationLinks.forEach((link) => {
    if (link.getAttribute("href") === hash) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function showPageView(hash) {
  if (hash === "#publications") {
    setSectionVisibility([publicationsSection]);
    setCurrentNavigation(hash);
    return;
  }

  if (hash === "#service") {
    setSectionVisibility([serviceSection]);
    setCurrentNavigation(hash);
    return;
  }

  setSectionVisibility([aboutSection, newsSection]);
  setCurrentNavigation("#about");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeNavigation();
    return;
  }

  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation");
  navigation.classList.add("is-open");
  document.body.classList.add("nav-open");
});

viewLinks.forEach((link) => {
  link.addEventListener("click", () => {
    showPageView(link.getAttribute("href"));
    closeNavigation();
  });
});

showPageView(window.location.hash);

window.addEventListener("hashchange", () => {
  showPageView(window.location.hash);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeNavigation();
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection) {
        return;
      }

      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visibleSection.target.id}`;
        if (isCurrent) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-20% 0px -65%", threshold: [0, 0.25, 0.5] },
  );

  pageSections.forEach((section) => observer.observe(section));
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
