// Cloudflare Worker entry point.
//
// Static assets (the Hugo build in ./content/public) are served by the
// ASSETS binding. Any request that doesn't match a static asset falls
// through to this fetch handler, which exposes a small same-origin API
// used by the Pulse page widgets.
//
// /api/steam proxies the Steam Web API server-side. Steam's API does not
// send CORS headers, so it can't be called from the browser directly, and
// the previous client-side approach routed it through corsproxy.io, which
// now blocks free traffic. Proxying here keeps the request same-origin and
// keeps the Steam API key out of client code (set it as a secret:
//   wrangler secret put STEAM_KEY).

// Public Steam profile id for furcologist. Not secret — it's visible on the
// public profile — so it's fine to keep in source.
const STEAM_ID = "76561198002641722";

async function handleSteam(env) {
  const key = env.STEAM_KEY;
  if (!key) {
    return jsonResponse({ error: "STEAM_KEY not configured" }, 500, 0);
  }

  const summaryUrl =
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${STEAM_ID}`;
  const gamesUrl =
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=true`;

  try {
    const [summaryRes, gamesRes] = await Promise.all([
      fetch(summaryUrl, { cf: { cacheTtl: 60, cacheEverything: true } }),
      fetch(gamesUrl, { cf: { cacheTtl: 300, cacheEverything: true } }),
    ]);

    if (!summaryRes.ok) {
      return jsonResponse({ error: "Steam API failed" }, 502, 0);
    }

    const summary = await summaryRes.json();
    const games = gamesRes.ok ? await gamesRes.json() : { response: {} };

    // Cache the combined payload at the edge / in the browser for a minute
    // so the live-status feel is preserved without hammering Steam.
    return jsonResponse({ summary, games }, 200, 60);
  } catch (e) {
    return jsonResponse({ error: "Steam fetch failed" }, 502, 0);
  }
}

// /api/audiobookshelf proxies a self-hosted Audiobookshelf server. The browser
// can't call it directly (cross-origin + the API token must stay private), so
// this route injects the bearer token server-side and forwards the request.
// Configure both as secrets/vars on the Worker:
//   wrangler secret put ABS_TOKEN     (an Audiobookshelf API token)
//   wrangler secret put ABS_URL       (base URL, e.g. https://abs.example.com)
async function handleAudiobookshelf(env) {
  const base = (env.ABS_URL || "").replace(/\/+$/, "");
  const token = env.ABS_TOKEN;
  if (!base || !token) {
    return jsonResponse({ error: "ABS_URL / ABS_TOKEN not configured" }, 500, 0);
  }

  const headers = { Authorization: `Bearer ${token}` };
  try {
    const [statsRes, meRes] = await Promise.all([
      fetch(`${base}/api/me/listening-stats`, { headers, cf: { cacheTtl: 120, cacheEverything: true } }),
      fetch(`${base}/api/me`, { headers, cf: { cacheTtl: 120, cacheEverything: true } }),
    ]);

    if (!statsRes.ok) {
      return jsonResponse({ error: "Audiobookshelf API failed" }, 502, 0);
    }

    const stats = await statsRes.json();
    const me = meRes.ok ? await meRes.json() : null;

    return jsonResponse({ stats, me }, 200, 120);
  } catch (e) {
    return jsonResponse({ error: "Audiobookshelf fetch failed" }, 502, 0);
  }
}

function jsonResponse(body, status, cacheSeconds) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheSeconds > 0
        ? `public, max-age=${cacheSeconds}`
        : "no-store",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/steam") {
      return handleSteam(env);
    }

    if (url.pathname === "/api/audiobookshelf") {
      return handleAudiobookshelf(env);
    }

    // Anything else: serve the static site.
    return env.ASSETS.fetch(request);
  },
};
