(function () {
  const cfg = window.SITE_CONFIG;
  if (!cfg) return;

  const waUrl = () => {
    const text = encodeURIComponent(cfg.whatsapp.message || "");
    return `https://wa.me/${cfg.whatsapp.number}?text=${text}`;
  };

  function wireWhatsApp() {
    document.querySelectorAll("[data-whatsapp]").forEach((el) => {
      el.setAttribute("href", waUrl());
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  function renderBasics() {
    const nameEl = document.getElementById("site-name");
    const sloganEl = document.getElementById("slogan");
    const taglineEl = document.getElementById("tagline");
    const footerName = document.getElementById("footer-name");
    const year = document.getElementById("year");

    if (nameEl) nameEl.textContent = cfg.siteName;
    if (sloganEl) sloganEl.textContent = cfg.slogan;
    if (taglineEl) taglineEl.textContent = cfg.tagline || "";
    if (footerName) footerName.textContent = cfg.siteName;
    if (year) year.textContent = String(new Date().getFullYear());
    document.title = cfg.siteName;
  }

  function renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid || !cfg.services) return;

    grid.innerHTML = cfg.services
      .map(
        (s) => `
      <article class="service-item">
        <img src="${s.icon}" alt="" width="72" height="72" loading="lazy" />
        <div>
          <h3>${escapeHtml(s.title)}</h3>
          <p>${escapeHtml(s.description)}</p>
        </div>
      </article>`
      )
      .join("");
  }

  function renderPortfolio() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid || !cfg.portfolio) return;

    grid.innerHTML = cfg.portfolio
      .map((item) => {
        const ratio = item.ratio || "4/5";
        const media = item.image
          ? `<img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.label)}" loading="lazy" />`
          : "";
        return `
      <article class="portfolio-item">
        <div class="ph" style="aspect-ratio: ${escapeAttr(ratio)}">
          ${media}
          <div class="ph-label">
            <span>${escapeHtml(item.label)}</span>
            <span class="ph-frame" aria-hidden="true"></span>
          </div>
        </div>
      </article>`;
      })
      .join("");
  }

  function renderAbout() {
    const title = document.getElementById("about-title");
    const paras = document.getElementById("about-paragraphs");
    const photo = document.getElementById("about-photo");
    if (!cfg.about) return;

    if (title) title.textContent = cfg.about.title || "Sobre";
    if (paras) {
      paras.innerHTML = (cfg.about.paragraphs || [])
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("");
    }
    if (photo) {
      if (cfg.about.image) {
        photo.innerHTML = `<img src="${escapeAttr(cfg.about.image)}" alt="${escapeAttr(
          cfg.siteName
        )}" loading="lazy" />`;
      } else {
        photo.innerHTML = `<div class="ph-label"><span>Retrato</span><span class="ph-frame" aria-hidden="true"></span></div>`;
      }
    }
  }

  function renderContact() {
    const box = document.getElementById("contact-links");
    if (!box) return;
    box.innerHTML = `
      <a class="contact-link" data-whatsapp href="#">
        <span>WhatsApp</span>
        <strong>${escapeHtml(cfg.whatsapp.display)}</strong>
      </a>
      <a class="contact-link" href="${escapeAttr(cfg.instagram.url)}" target="_blank" rel="noopener noreferrer">
        <span>Instagram</span>
        <strong>@${escapeHtml(cfg.instagram.handle)}</strong>
      </a>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function setupNav() {
    const header = document.getElementById("header");
    const toggle = document.getElementById("nav-toggle");
    const drawer = document.getElementById("nav-drawer");

    const onScroll = () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && drawer) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        drawer.classList.toggle("is-open", !open);
      });

      drawer.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          toggle.setAttribute("aria-expanded", "false");
          drawer.classList.remove("is-open");
        });
      });
    }
  }

  function setupReveal() {
    const targets = document.querySelectorAll(
      ".reveal, .service-item, .portfolio-item"
    );
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => io.observe(el));
  }

  renderBasics();
  renderServices();
  renderPortfolio();
  renderAbout();
  renderContact();
  wireWhatsApp();
  setupNav();
  setupReveal();
})();
