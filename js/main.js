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

  function portfolioFallback() {
    return (cfg.portfolio || []).map((item) => ({
      id: item.id,
      label: item.label,
      aspect_css: (item.ratio || "4/5").replace(/\s/g, ""),
      image_path: item.image || "",
      format: guessFormat(item.ratio),
    }));
  }

  function guessFormat(ratio) {
    if (!ratio) return "1:1";
    const n = String(ratio).replace(/\s/g, "");
    if (n === "16/9" || n === "3/2") return "16:9";
    if (n === "9/16" || n === "3/4" || n === "4/5") return "9:16";
    return "1:1";
  }

  function renderPortfolio(items) {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    const list = items && items.length ? items : portfolioFallback();

    grid.innerHTML = list
      .map((item) => {
        const ratio = item.aspect_css || "1/1";
        const url = item.image_url || item.image || "";
        const media = url
          ? `<img src="${escapeAttr(url)}" alt="${escapeAttr(item.label)}" loading="lazy" />`
          : "";
        const shortLabel = String(item.label || "").replace(/^Portfólio \d+ — /, "");
        return `
      <article class="portfolio-item">
        <div class="ph" style="aspect-ratio: ${escapeAttr(ratio)}">
          ${media}
          <div class="ph-label">
            <span>${escapeHtml(shortLabel)}</span>
            <span class="ph-frame" aria-hidden="true"></span>
          </div>
        </div>
      </article>`;
      })
      .join("");
  }

  function renderAbout(aboutUrl) {
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
      const url = aboutUrl || cfg.about.image || "";
      photo.style.aspectRatio = "1 / 1";
      if (url) {
        photo.innerHTML = `<img src="${escapeAttr(url)}" alt="${escapeAttr(
          cfg.siteName
        )}" loading="lazy" />`;
      } else {
        photo.innerHTML = `<div class="ph-label"><span>Retrato</span><span class="ph-frame" aria-hidden="true"></span></div>`;
      }
    }
  }

  function renderHero(heroUrl) {
    const media = document.getElementById("hero-media");
    if (!media) return;
    let img = media.querySelector(".hero-photo");
    if (heroUrl) {
      if (!img) {
        img = document.createElement("img");
        img.className = "hero-photo";
        img.alt = "";
        media.prepend(img);
      }
      img.src = heroUrl;
      media.classList.add("has-photo");
    } else if (img) {
      img.remove();
      media.classList.remove("has-photo");
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

  async function loadPhotosFromSupabase() {
    const client = window.LAF?.getSupabase?.();
    if (!client) return null;

    const { data, error } = await client
      .from("photo_slots")
      .select("*")
      .order("sort_order");

    if (error || !data) {
      console.warn("Não foi possível carregar fotos do Supabase:", error?.message);
      return null;
    }

    const withUrls = data.map((slot) => ({
      ...slot,
      image_url: slot.image_path ? window.LAF.publicUrl(slot.image_path) : "",
    }));

    return {
      hero: withUrls.find((s) => s.id === "hero_main"),
      about: withUrls.find((s) => s.id === "about_portrait"),
      portfolio: withUrls
        .filter((s) => s.section === "portfolio")
        .sort((a, b) => a.sort_order - b.sort_order),
    };
  }

  function starsText(n) {
    const r = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
    return "★".repeat(r) + "☆".repeat(5 - r);
  }

  function relativeDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "Hoje";
    if (days === 1) return "Ontem";
    if (days < 30) return `Há ${days} dias`;
    return d.toLocaleDateString("pt-BR");
  }

  function renderReviews(list) {
    const listEl = document.getElementById("reviews-list");
    const emptyEl = document.getElementById("reviews-empty");
    const summary = document.getElementById("reviews-summary");
    const avgValue = document.getElementById("reviews-avg-value");
    const avgStars = document.getElementById("reviews-avg-stars");
    const countEl = document.getElementById("reviews-count");
    if (!listEl) return;

    const reviews = list || [];
    if (!reviews.length) {
      if (emptyEl) emptyEl.hidden = false;
      listEl.querySelectorAll(".review-card").forEach((n) => n.remove());
      if (summary) summary.hidden = true;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    const avg = reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length;
    if (summary) summary.hidden = false;
    if (avgValue) avgValue.textContent = avg.toFixed(1).replace(".", ",");
    if (avgStars) avgStars.textContent = starsText(Math.round(avg));
    if (countEl) {
      countEl.textContent =
        reviews.length === 1 ? "1 avaliação" : `${reviews.length} avaliações`;
    }

    const cards = reviews
      .map(
        (r) => `
      <article class="review-card">
        <div class="review-card-head">
          <span class="review-author">${escapeHtml(r.author_name)}</span>
          <span class="review-stars" aria-label="${r.rating} de 5">${starsText(
            r.rating
          )}</span>
          <span class="review-date">${escapeHtml(relativeDate(r.created_at))}</span>
        </div>
        <p class="review-comment">${escapeHtml(r.comment)}</p>
      </article>`
      )
      .join("");

    listEl.querySelectorAll(".review-card").forEach((n) => n.remove());
    if (emptyEl) emptyEl.insertAdjacentHTML("afterend", cards);
    else listEl.insertAdjacentHTML("beforeend", cards);
  }

  async function loadReviews() {
    const client = window.LAF?.getSupabase?.();
    if (!client) return;
    const { data, error } = await client
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      console.warn("Avaliações:", error.message);
      return;
    }
    renderReviews(data || []);
  }

  function setupReviewForm() {
    const form = document.getElementById("review-form");
    const picker = document.getElementById("star-picker");
    const ratingInput = document.getElementById("review-rating");
    const msg = document.getElementById("review-form-msg");
    const submitBtn = document.getElementById("review-submit");
    if (!form || !picker || !ratingInput) return;

    let rating = 0;

    function paintStars(value, hover) {
      picker.querySelectorAll(".star-btn").forEach((btn) => {
        const n = Number(btn.getAttribute("data-rating"));
        btn.classList.toggle("is-active", n <= value);
        btn.classList.toggle("is-hover", hover > 0 && n <= hover);
      });
    }

    picker.querySelectorAll(".star-btn").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        paintStars(rating, Number(btn.getAttribute("data-rating")));
      });
      btn.addEventListener("mouseleave", () => paintStars(rating, 0));
      btn.addEventListener("click", () => {
        rating = Number(btn.getAttribute("data-rating"));
        ratingInput.value = String(rating);
        paintStars(rating, 0);
      });
    });

    function setMsg(text, type) {
      if (!msg) return;
      if (!text) {
        msg.hidden = true;
        msg.textContent = "";
        msg.classList.remove("is-error", "is-ok");
        return;
      }
      msg.hidden = false;
      msg.textContent = text;
      msg.classList.toggle("is-error", type === "error");
      msg.classList.toggle("is-ok", type === "ok");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setMsg("");
      const author = document.getElementById("review-author")?.value?.trim() || "";
      const comment = document.getElementById("review-comment")?.value?.trim() || "";
      const rate = Number(ratingInput.value);

      if (author.length < 2) {
        setMsg("Informe seu nome ou Instagram.", "error");
        return;
      }
      if (!rate || rate < 1 || rate > 5) {
        setMsg("Escolha uma nota de 1 a 5 estrelas.", "error");
        return;
      }
      if (comment.length < 3) {
        setMsg("Escreva um comentário um pouco maior.", "error");
        return;
      }

      const client = window.LAF?.getSupabase?.();
      if (!client) {
        setMsg("Avaliações indisponíveis no momento.", "error");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando…";
      }

      const { error } = await client.from("reviews").insert({
        author_name: author.slice(0, 80),
        rating: rate,
        comment: comment.slice(0, 500),
      });

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Publicar avaliação";
      }

      if (error) {
        setMsg(error.message || "Não foi possível enviar. Tente de novo.", "error");
        return;
      }

      form.reset();
      rating = 0;
      ratingInput.value = "";
      paintStars(0, 0);
      setMsg("Obrigado! Sua avaliação foi publicada.", "ok");
      await loadReviews();
    });
  }

  async function boot() {
    renderBasics();
    renderServices();
    renderPortfolio();
    renderAbout();
    renderContact();
    wireWhatsApp();
    setupNav();
    setupReviewForm();

    const photos = await loadPhotosFromSupabase();
    if (photos) {
      renderHero(photos.hero?.image_url || "");
      renderAbout(photos.about?.image_url || "");
      renderPortfolio(
        photos.portfolio.map((p) => ({
          ...p,
          label: p.label,
          image_url: p.image_url,
        }))
      );
    }

    await loadReviews();
    setupReveal();
  }

  boot();
})();
