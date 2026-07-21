(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const ready = Boolean(cfg.url && cfg.anonKey);

  window.LAF = window.LAF || {};

  window.LAF.isSupabaseConfigured = function () {
    return ready && typeof window.supabase !== "undefined";
  };

  window.LAF.getSupabase = function () {
    if (!window.LAF.isSupabaseConfigured()) return null;
    if (!window.LAF._client) {
      window.LAF._client = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
    return window.LAF._client;
  };

  window.LAF.publicUrl = function (path) {
    if (!path) return "";
    const client = window.LAF.getSupabase();
    if (!client) return "";
    const { data } = client.storage.from("photos").getPublicUrl(path);
    return data?.publicUrl || "";
  };

  window.LAF.formatBadge = function (format) {
    if (format === "9:16") return { text: "TikTok 9:16", className: "badge-tiktok" };
    if (format === "16:9") return { text: "Horizontal 16:9", className: "badge-horizontal" };
    return { text: "1:1 Quadrado", className: "badge-square" };
  };
})();
