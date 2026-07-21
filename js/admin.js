(function () {
  const loginView = document.getElementById("login-view");
  const dashView = document.getElementById("dashboard-view");
  const slotsRoot = document.getElementById("slots-root");
  const loadingMsg = document.getElementById("loading-msg");
  const reviewsAdminList = document.getElementById("reviews-admin-list");
  const configWarning = document.getElementById("config-warning");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const SECTION_TITLES = {
    hero: "Hero (primeira tela)",
    about: "Sobre",
    portfolio: "Portfólio",
  };

  const SECTION_HINTS = {
    hero: "Aparece no fundo da abertura do site",
    about: "Aparece ao lado do texto Sobre",
    portfolio: "Aparece na grade do portfólio, na ordem numerada",
  };

  if (!window.LAF?.isSupabaseConfigured()) {
    configWarning?.classList.remove("hidden");
  }

  function getClient() {
    return window.LAF.getSupabase();
  }

  function showLogin() {
    loginView.classList.remove("hidden");
    dashView.classList.add("hidden");
  }

  function showDashboard() {
    loginView.classList.add("hidden");
    dashView.classList.remove("hidden");
  }

  function setLoginError(msg) {
    if (!loginError) return;
    if (!msg) {
      loginError.hidden = true;
      loginError.textContent = "";
      return;
    }
    loginError.hidden = false;
    loginError.textContent = msg;
  }

  async function initAuth() {
    const client = getClient();
    if (!client) {
      showLogin();
      return;
    }

    const { data } = await client.auth.getSession();
    if (data.session) {
      showDashboard();
      await loadSlots();
      await loadReviewsAdmin();
    } else {
      showLogin();
    }

    client.auth.onAuthStateChange(async (event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        showDashboard();
        await loadSlots();
        await loadReviewsAdmin();
      }
      if (event === "SIGNED_OUT") {
        showLogin();
      }
    });
  }

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoginError("");
    const client = getClient();
    if (!client) {
      setLoginError("Supabase não configurado. Veja o README.");
      return;
    }

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    loginBtn.disabled = true;
    loginBtn.textContent = "Entrando…";

    const { error } = await client.auth.signInWithPassword({ email, password });
    loginBtn.disabled = false;
    loginBtn.textContent = "Entrar";

    if (error) {
      setLoginError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message
      );
    }
  });

  logoutBtn?.addEventListener("click", async () => {
    const client = getClient();
    if (client) await client.auth.signOut();
    showLogin();
  });

  async function loadSlots() {
    const client = getClient();
    if (!client || !slotsRoot) return;

    if (loadingMsg) loadingMsg.textContent = "Carregando painéis…";

    const { data, error } = await client
      .from("photo_slots")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      slotsRoot.innerHTML = `<p class="loading-msg" style="color:#e8a0a0">Erro ao carregar: ${escapeHtml(
        error.message
      )}</p>`;
      return;
    }

    const bySection = { hero: [], about: [], portfolio: [] };
    (data || []).forEach((slot) => {
      if (bySection[slot.section]) bySection[slot.section].push(slot);
    });
    bySection.portfolio.sort((a, b) => a.sort_order - b.sort_order);

    const order = ["hero", "about", "portfolio"];
    slotsRoot.innerHTML = order
      .map((section) => {
        const items = bySection[section] || [];
        if (!items.length) return "";
        return `
          <section class="section-block" data-section="${section}">
            <h2>${escapeHtml(SECTION_TITLES[section] || section)}</h2>
            <div class="slots-grid">
              ${items.map(renderSlotCard).join("")}
            </div>
          </section>`;
      })
      .join("");

    slotsRoot.querySelectorAll("[data-upload]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-upload");
        const input = slotsRoot.querySelector(`input[data-file="${id}"]`);
        input?.click();
      });
    });

    slotsRoot.querySelectorAll('input[type="file"]').forEach((input) => {
      input.addEventListener("change", () => onFileChosen(input));
    });

    slotsRoot.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => onRemove(btn.getAttribute("data-remove")));
    });
  }

  function renderSlotCard(slot) {
    const badge = window.LAF.formatBadge(slot.format);
    const url = window.LAF.publicUrl(slot.image_path);
    const place = SECTION_HINTS[slot.section] || "";
    const aspect = slot.aspect_css || "1/1";

    return `
      <article class="slot-card" data-slot-id="${escapeAttr(slot.id)}">
        <div class="slot-meta">
          <h3>${escapeHtml(slot.label)}</h3>
          <div class="slot-badges">
            <span class="badge ${badge.className}">${escapeHtml(badge.text)}</span>
            <span class="badge badge-section">${escapeHtml(
              SECTION_TITLES[slot.section] || slot.section
            )}</span>
          </div>
          <p class="slot-place">${escapeHtml(place)} · ID: <code>${escapeHtml(
            slot.id
          )}</code></p>
        </div>
        <div class="slot-preview" style="aspect-ratio: ${escapeAttr(aspect)}">
          ${
            url
              ? `<img src="${escapeAttr(url)}" alt="${escapeAttr(slot.label)}" />`
              : `<div class="slot-preview-empty">Sem foto ainda<br/>Envie no formato ${escapeHtml(
                  badge.text
                )}</div>`
          }
        </div>
        <div class="slot-actions">
          <input type="file" accept="image/jpeg,image/png,image/webp" data-file="${escapeAttr(
            slot.id
          )}" />
          <button type="button" class="btn btn-primary btn-sm" data-upload="${escapeAttr(
            slot.id
          )}">${url ? "Trocar foto" : "Enviar foto"}</button>
          ${
            url
              ? `<button type="button" class="btn btn-danger btn-sm" data-remove="${escapeAttr(
                  slot.id
                )}">Remover</button>`
              : ""
          }
        </div>
        <p class="slot-status" data-status="${escapeAttr(slot.id)}"></p>
      </article>`;
  }

  function setStatus(slotId, msg, type) {
    const el = slotsRoot.querySelector(`[data-status="${slotId}"]`);
    if (!el) return;
    el.textContent = msg || "";
    el.classList.remove("is-error", "is-ok");
    if (type === "error") el.classList.add("is-error");
    if (type === "ok") el.classList.add("is-ok");
  }

  async function onFileChosen(input) {
    const slotId = input.getAttribute("data-file");
    const file = input.files?.[0];
    input.value = "";
    if (!file || !slotId) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setStatus(slotId, "Use JPG, PNG ou WebP.", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus(slotId, "Arquivo muito grande (máx. 10 MB).", "error");
      return;
    }

    const client = getClient();
    if (!client) return;

    setStatus(slotId, "Enviando…", null);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${slotId}/${Date.now()}.${ext}`;

    const { data: current } = await client
      .from("photo_slots")
      .select("image_path")
      .eq("id", slotId)
      .maybeSingle();

    const { error: upErr } = await client.storage.from("photos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    if (upErr) {
      setStatus(slotId, upErr.message, "error");
      return;
    }

    const { error: dbErr } = await client
      .from("photo_slots")
      .update({ image_path: path })
      .eq("id", slotId);

    if (dbErr) {
      setStatus(slotId, dbErr.message, "error");
      return;
    }

    if (current?.image_path && current.image_path !== path) {
      await client.storage.from("photos").remove([current.image_path]);
    }

    setStatus(slotId, "Foto atualizada!", "ok");
    await loadSlots();
  }

  async function onRemove(slotId) {
    if (!slotId) return;
    if (!confirm("Remover esta foto do site?")) return;

    const client = getClient();
    if (!client) return;

    setStatus(slotId, "Removendo…", null);
    const { data: current } = await client
      .from("photo_slots")
      .select("image_path")
      .eq("id", slotId)
      .maybeSingle();

    const { error } = await client
      .from("photo_slots")
      .update({ image_path: null })
      .eq("id", slotId);

    if (error) {
      setStatus(slotId, error.message, "error");
      return;
    }

    if (current?.image_path) {
      await client.storage.from("photos").remove([current.image_path]);
    }

    await loadSlots();
  }

  function starsText(n) {
    const r = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
    return "★".repeat(r) + "☆".repeat(5 - r);
  }

  async function loadReviewsAdmin() {
    const client = getClient();
    if (!client || !reviewsAdminList) return;

    reviewsAdminList.innerHTML = `<p class="loading-msg">Carregando avaliações…</p>`;

    const { data, error } = await client
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      reviewsAdminList.innerHTML = `<p class="loading-msg" style="color:#e8a0a0">${escapeHtml(
        error.message
      )}</p>`;
      return;
    }

    const reviews = data || [];
    if (!reviews.length) {
      reviewsAdminList.innerHTML = `<p class="loading-msg">Nenhuma avaliação ainda.</p>`;
      return;
    }

    reviewsAdminList.innerHTML = `
      <div class="admin-reviews-list">
        ${reviews
          .map((r) => {
            const low = Number(r.rating) <= 2;
            const date = new Date(r.created_at).toLocaleString("pt-BR");
            return `
          <article class="admin-review-card${low ? " is-low" : ""}" data-review-id="${escapeAttr(
              r.id
            )}">
            <div class="admin-review-top">
              <div>
                <strong>${escapeHtml(r.author_name)}</strong>
                <span class="admin-review-stars" aria-label="${r.rating} de 5">${starsText(
                  r.rating
                )}</span>
                ${low ? `<span class="badge badge-low">Atenção</span>` : ""}
              </div>
              <button type="button" class="btn btn-danger btn-sm" data-delete-review="${escapeAttr(
                r.id
              )}">Apagar</button>
            </div>
            <p class="admin-review-comment">${escapeHtml(r.comment)}</p>
            <p class="admin-review-date">${escapeHtml(date)}</p>
          </article>`;
          })
          .join("")}
      </div>`;

    reviewsAdminList.querySelectorAll("[data-delete-review]").forEach((btn) => {
      btn.addEventListener("click", () =>
        onDeleteReview(btn.getAttribute("data-delete-review"))
      );
    });
  }

  async function onDeleteReview(id) {
    if (!id) return;
    if (!confirm("Apagar esta avaliação do site?")) return;
    const client = getClient();
    if (!client) return;

    const { error } = await client.from("reviews").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    await loadReviewsAdmin();
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

  initAuth();
})();
