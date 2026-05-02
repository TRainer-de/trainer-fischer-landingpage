(() => {
  "use strict";
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];
  const consentKey = "tf_consent_v3";
  const navToggle = qs("[data-nav-toggle]");
  const nav = qs("[data-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    qsa("a", nav).forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }));
  }
  const reveals = qsa(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add("is-visible"));

  const frameworkCards = qsa(".framework-card");
  const mobileCards = window.matchMedia("(max-width: 640px)");
  const resetFrameworkCard = card => {
    card.classList.remove("is-flipped");
    if (mobileCards.matches) card.setAttribute("aria-pressed", "false");
  };
  const syncFrameworkCards = () => {
    frameworkCards.forEach(card => {
      const mobile = mobileCards.matches;
      if (mobile) {
        card.setAttribute("role", "button");
        card.setAttribute("aria-pressed", String(card.classList.contains("is-flipped")));
      } else {
        card.removeAttribute("role");
        card.removeAttribute("aria-pressed");
        resetFrameworkCard(card);
      }
    });
  };
  frameworkCards.forEach(card => {
    card.addEventListener("click", () => {
      if (!mobileCards.matches) return;
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
    card.addEventListener("keydown", event => {
      if (!mobileCards.matches || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      card.click();
    });
  });
  syncFrameworkCards();
  mobileCards.addEventListener?.("change", syncFrameworkCards);
  if ("IntersectionObserver" in window) {
    const cardResetObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!mobileCards.matches || entry.isIntersecting) return;
        resetFrameworkCard(entry.target);
      });
    }, { threshold: 0 });
    frameworkCards.forEach(card => cardResetObserver.observe(card));
  }

  const modal = qs("[data-consent-modal]");
  const stat = qs("[data-consent-statistics]");
  const media = qs("[data-consent-media]");
  const getConsent = () => {
    try { return JSON.parse(localStorage.getItem(consentKey) || "null"); } catch { return null; }
  };
  const setConsent = (value) => {
    localStorage.setItem(consentKey, JSON.stringify({ ...value, savedAt: new Date().toISOString() }));
    if (modal) modal.hidden = true;
  };
  const openConsent = () => {
    if (!modal) return;
    const current = getConsent();
    if (stat) stat.checked = Boolean(current?.statistics);
    if (media) media.checked = Boolean(current?.media);
    modal.hidden = false;
  };
  qsa("[data-open-consent]").forEach(btn => btn.addEventListener("click", openConsent));
  qs("[data-consent-necessary]")?.addEventListener("click", () => setConsent({ necessary: true, statistics: false, media: false }));
  qs("[data-consent-save]")?.addEventListener("click", () => setConsent({ necessary: true, statistics: Boolean(stat?.checked), media: Boolean(media?.checked) }));
  qs("[data-consent-all]")?.addEventListener("click", () => setConsent({ necessary: true, statistics: true, media: true }));
  if (!getConsent()) openConsent();
})();


/* === V5 Premium micro-interactions === */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;
  const tiltItems = [...document.querySelectorAll(".hero-visual, .offer-card, .video-card")];
  tiltItems.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-3px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
})();
