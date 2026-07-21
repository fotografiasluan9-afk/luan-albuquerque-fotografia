const fs = require("fs");
const path = require("path");
const os = require("os");
const https = require("https");

function findToken() {
  const candidates = [
    path.join(os.homedir(), "AppData", "Roaming", "netlify", "Config", "config.json"),
    path.join(os.homedir(), ".config", "netlify", "config.json"),
    path.join(os.homedir(), ".netlify", "config.json"),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const cfg = JSON.parse(fs.readFileSync(p, "utf8"));
    const users = cfg.users || {};
    const authed = cfg.userId && users[cfg.userId];
    const token = (authed && authed.auth && authed.auth.token) || cfg.access_token;
    if (token) return token;
  }
  throw new Error("Netlify token not found in local config");
}

const token = findToken();
const siteId = "f47c300d-b2bc-44fb-b2ed-7111b05a3083";
const body = JSON.stringify({ name: "luanfotografia" });

const req = https.request(
  {
    hostname: "api.netlify.com",
    path: `/api/v1/sites/${siteId}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  },
  (res) => {
    let data = "";
    res.on("data", (c) => (data += c));
    res.on("end", () => {
      console.log("STATUS", res.statusCode);
      try {
        const j = JSON.parse(data);
        console.log("NAME", j.name);
        console.log("URL", j.ssl_url || j.url);
        if (j.message) console.log("MESSAGE", j.message);
        if (j.errors) console.log("ERRORS", JSON.stringify(j.errors));
        console.log("BODY", data.slice(0, 800));
      } catch {
        console.log(data.slice(0, 800));
      }
      if (res.statusCode >= 400) process.exit(1);
    });
  }
);
req.on("error", (e) => {
  console.error(e.message);
  process.exit(1);
});
req.write(body);
req.end();
