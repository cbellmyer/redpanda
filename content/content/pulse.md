---
title: "Pulse"
description: "Live ecosystem vitals and field observations from the furry frontier."
type: "page"
ShowToc: false
ShowBreadCrumbs: false
menu:
  main:
    name: "Pulse"
    weight: 30
---

<style>
  .discord-avatar-wrapper {
    position: relative;
    width: 64px;
    height: 64px;
    border: 1px solid color-mix(in srgb, #00E5FF 50%, transparent);
    padding: 2px;
    background: color-mix(in srgb, #00E5FF 10%, transparent);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .discord-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(20%) contrast(120%);
    display: block;
  }
  .eq-bars { display: flex; align-items: flex-end; gap: 2px; height: 12px; }
  .eq-bar { width: 3px; background-color: #00E5FF; border-radius: 2px; animation: eq-bounce 0.8s infinite ease-in-out alternate; }
  .eq-bar:nth-child(1) { height: 60%; animation-delay: 0.1s; }
  .eq-bar:nth-child(2) { height: 100%; animation-delay: 0.3s; }
  .eq-bar:nth-child(3) { height: 80%; animation-delay: 0.2s; }
  @keyframes eq-bounce { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  /* SCADA Dashboard Panel Styles */
  .scada-panel {
    background: color-mix(in srgb, var(--background) 40%, #051217);
    border: 1px solid color-mix(in srgb, #00E5FF 50%, transparent);
    border-radius: 6px;
    box-shadow: 0 4px 20px rgb(0 229 255 / 15%), inset 0 0 15px rgb(0 229 255 / 10%);
    overflow: hidden;
    width: 100%;
    text-align: left;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    position: relative;
  }
  /* Hex-lattice dot grid — naturalist field transect pattern */
  .scada-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
      radial-gradient(circle, color-mix(in srgb, #00E5FF 18%, transparent) 1px, transparent 1px),
      radial-gradient(circle, color-mix(in srgb, #00E5FF 18%, transparent) 1px, transparent 1px);
    background-size: 18px 31px;
    background-position: 0 0, 9px 15.5px;
    pointer-events: none;
    z-index: 1;
  }
  .scada-header {
    background: color-mix(in srgb, #00E5FF 20%, transparent);
    border-bottom: 1px solid color-mix(in srgb, #00E5FF 50%, transparent);
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #00E5FF;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
    text-shadow: 0 0 5px color-mix(in srgb, #00E5FF 50%, transparent);
  }
  .scada-time {
    font-size: 0.75rem;
    color: color-mix(in srgb, #00E5FF 80%, transparent);
    letter-spacing: 0.1em;
  }
  .scada-body {
    display: flex;
    width: 100%;
    position: relative;
    z-index: 2;
  }
  .scada-primary {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 180px;
    background: color-mix(in srgb, #00E5FF 5%, transparent);
  }
  .scada-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: color-mix(in srgb, #00E5FF 30%, transparent);
    width: 100%;
    border-left: 1px solid color-mix(in srgb, #00E5FF 30%, transparent);
  }
  .scada-metric {
    background: color-mix(in srgb, var(--background) 40%, #051217);
    padding: 1rem 1.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.4rem;
  }
  .scada-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: color-mix(in srgb, #00E5FF 70%, #fff);
    letter-spacing: 0.1em;
    opacity: 0.7;
  }
  .scada-value {
    font-size: 1.25rem;
    color: #00E5FF;
    font-weight: 700;
    text-shadow: 0 0 8px color-mix(in srgb, #00E5FF 60%, transparent);
    display: flex;
    align-items: baseline;
    gap: 0.2rem;
  }
  .scada-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
  }
  /* Mossy green — living system, not neon circuit */
  .scada-status-dot {
    width: 8px;
    height: 8px;
    background-color: #7DC26B;
    border-radius: 50%;
    box-shadow: 0 0 8px #7DC26B;
    animation: scada-pulse 2s infinite;
  }
  @keyframes scada-pulse {
    0% { opacity: 1; box-shadow: 0 0 8px #7DC26B; }
    50% { opacity: 0.4; box-shadow: 0 0 2px #7DC26B; }
    100% { opacity: 1; box-shadow: 0 0 8px #7DC26B; }
  }
  @keyframes scada-warn-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .scada-panel.critical-alert {
    animation: scada-critical-border 1s infinite;
  }
  .scada-panel.critical-alert .scada-header {
    color: #f04747;
    border-bottom-color: #f04747;
    text-shadow: 0 0 8px rgb(240 71 71 / 60%);
  }
  .scada-panel.critical-alert .scada-status-dot {
    background-color: #f04747;
    box-shadow: 0 0 8px #f04747;
    animation: scada-pulse-critical 1s infinite;
  }
  @keyframes scada-critical-border {
    0%, 100% { border-color: #f04747; box-shadow: 0 0 25px rgb(240 71 71 / 60%), inset 0 0 15px rgb(240 71 71 / 20%); }
    50% { border-color: color-mix(in srgb, #f04747 50%, transparent); box-shadow: 0 0 5px rgb(240 71 71 / 10%); }
  }
  @keyframes scada-pulse-critical {
    0%, 100% { opacity: 1; box-shadow: 0 0 12px #f04747; }
    50% { opacity: 0.5; box-shadow: 0 0 4px #f04747; }
  }
  @media (max-width: 600px) {
    .scada-body { flex-direction: column; }
    .scada-grid { border-left: none; border-top: 1px solid color-mix(in srgb, #00E5FF 30%, transparent); }
    .scada-time { display: none; }
  }
</style>

<div class="bio-container" style="text-align: center; margin-bottom: 2rem;">
  <h2 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--primary);">Field Conditions</h2>
  <div id="discord-widget" style="font-size: 1.1rem; margin-bottom: 1.5rem;">
    <span style="opacity: 0.7;">Establishing field radio link...</span>
  </div>
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; margin: 0 auto;">
    <div id="system-status-weather" style="margin: 0; text-align: center; width: 100%; max-width: 700px;">
      <div id="weather-loading" style="opacity: 0.7; font-size: 1.1rem;">Sampling habitat conditions...</div>
      <div id="weather-data" style="display: none; width: 100%; max-width: 700px; margin: 0 auto;">
        <div class="scada-panel">
          <div style="width: 100%;">
            <div class="scada-header">
              <span>[ HABITAT CONDITIONS MONITOR ]</span>
              <span class="scada-time">--:--:--</span>
              <span class="scada-status"><div class="scada-status-dot"></div> ACTIVE</span>
            </div>
            <div class="scada-body">
              <div class="scada-primary">
                <div style="font-size: 3.5rem; line-height: 1.1; margin-bottom: 0.5rem;" id="ww-icon">☁️</div>
                <div class="scada-value" style="font-size: 2.2rem; justify-content: center;"><span id="ww-temp">--</span><span style="font-size: 1.1rem; opacity: 0.8;">°F</span></div>
                <div id="ww-desc" style="font-size: 0.85rem; color: #00E5FF; text-transform: uppercase; margin-top: 0.5rem; text-align: center; letter-spacing: 0.05em; opacity: 0.9;">--</div>
              </div>
              <div class="scada-grid">
                <div class="scada-metric">
                  <span class="scada-label">Heat Index</span>
                  <span class="scada-value" id="ww-feels">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Rel. Humidity</span>
                  <span class="scada-value" id="ww-humidity">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Precipitation</span>
                  <span class="scada-value" id="ww-precip">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Wind Velocity</span>
                  <span class="scada-value"><span id="ww-wind">--</span> <span id="ww-wind-dir" style="font-size: 0.7em; opacity: 0.7;">--</span></span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Atm. Pressure</span>
                  <span class="scada-value" id="ww-pressure">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Cloud Cover</span>
                  <span class="scada-value" id="ww-cloud">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Sunrise</span>
                  <span class="scada-value" id="ww-sunrise">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Sunset</span>
                  <span class="scada-value" id="ww-sunset">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">UV Index</span>
                  <span class="scada-value" id="ww-uv">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Air Quality (AQI)</span>
                  <span class="scada-value" id="ww-aqi">--</span>
                </div>
                <div class="scada-metric" style="grid-column: 1 / -1;">
                  <span class="scada-label">Fursuit Field Index</span>
                  <span class="scada-value" id="ww-field-rating" style="font-size: 1.3rem; letter-spacing: 0.08em;">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="github-widget" style="margin: 0; text-align: center; width: 100%; max-width: 700px;">
      <div style="opacity: 0.7; font-size: 1.1rem;">Pulling expedition records...</div>
    </div>
  </div>
</div>

<div id="con-season-widget" style="max-width: 700px; margin: 0 auto 2rem;">
  <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Consulting expedition dossier...</div>
</div>

<h2 class="upcoming-section-title" style="margin-top: 1rem;">Field Notes</h2>

<div id="social-feed-grid" class="feed-scroll">
  <div class="loading-feed">Tuning to field frequencies...</div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {

    // ── Helper functions ─────────────────────────────────────────────────

    function getSeasonLabel() {
      const month = new Date().getMonth(); // 0 = Jan
      if (month >= 2 && month <= 4) return { season: 'SPRING', activity: 'ACTIVITY RISING' };
      if (month >= 5 && month <= 7) return { season: 'SUMMER', activity: 'PEAK CON SEASON' };
      if (month >= 8 && month <= 10) return { season: 'FALL', activity: 'CON SEASON CLOSING' };
      return { season: 'WINTER', activity: 'LOW ACTIVITY SEASON' };
    }

    function computeFieldRating(feelsTemp, windSpeed, precip, aqi) {
      let score = 100;
      // Heat — fursuit wearers overheat easily
      if (feelsTemp >= 103) score -= 60;
      else if (feelsTemp >= 95) score -= 40;
      else if (feelsTemp >= 88) score -= 25;
      else if (feelsTemp >= 80) score -= 10;
      else if (feelsTemp <= 15) score -= 40;
      else if (feelsTemp <= 25) score -= 25;
      else if (feelsTemp <= 35) score -= 10;
      // Precipitation — bad for fur and cameras
      if (precip >= 0.5) score -= 50;
      else if (precip >= 0.1) score -= 30;
      else if (precip > 0) score -= 15;
      // Wind — light breeze helps with cooling
      if (windSpeed >= 40) score -= 30;
      else if (windSpeed >= 25) score -= 15;
      else if (windSpeed >= 10) score += 5;
      // Air quality
      if (aqi !== null) {
        if (aqi >= 151) score -= 30;
        else if (aqi >= 101) score -= 20;
        else if (aqi >= 51) score -= 10;
      }
      score = Math.max(0, Math.min(100, score));
      if (score >= 85) return { label: 'EXCELLENT', color: '#7DC26B' };
      if (score >= 65) return { label: 'FAVORABLE', color: '#00E5FF' };
      if (score >= 45) return { label: 'FAIR', color: '#FFB300' };
      if (score >= 25) return { label: 'POOR', color: '#FF6700' };
      return { label: 'HAZARDOUS', color: '#f04747' };
    }

    function getUvCategory(uvi) {
      if (uvi <= 2) return { label: uvi.toFixed(1) + ' · LOW', color: '#7DC26B' };
      if (uvi <= 5) return { label: uvi.toFixed(1) + ' · MODERATE', color: '#FFD700' };
      if (uvi <= 7) return { label: uvi.toFixed(1) + ' · HIGH', color: '#FF6700' };
      if (uvi <= 10) return { label: uvi.toFixed(1) + ' · V.HIGH', color: '#f04747' };
      return { label: uvi.toFixed(1) + ' · EXTREME', color: '#B39DDB' };
    }

    function getAqiCategory(aqi) {
      if (aqi <= 50) return { label: aqi + ' · GOOD', color: '#7DC26B' };
      if (aqi <= 100) return { label: aqi + ' · MODERATE', color: '#FFD700' };
      if (aqi <= 150) return { label: aqi + ' · USG', color: '#FF6700' };
      if (aqi <= 200) return { label: aqi + ' · UNHEALTHY', color: '#f04747' };
      if (aqi <= 300) return { label: aqi + ' · V.UNHEALTHY', color: '#B39DDB' };
      return { label: aqi + ' · HAZARDOUS', color: '#8B0000' };
    }

    // ── Global SCADA Timer ───────────────────────────────────────────────
    function updateScadaClocks() {
      const now = new Date();
      const timeString = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      document.querySelectorAll('.scada-time').forEach(el => {
        el.textContent = timeString;
      });
    }
    setInterval(updateScadaClocks, 1000);
    updateScadaClocks();

    // ── 1. Field Radio Widget (Discord / Lanyard) ────────────────────────
    const discordContainer = document.getElementById('discord-widget');
    const DISCORD_ID = '104330735866884096';

    async function fetchDiscord() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        if (res.ok) {
          const { data } = await res.json();
          const status = data.discord_status;
          const isOnline = status !== "offline";
          const isVoice = data.active_on_discord_voice;

          const customStatus = data.activities?.find(a => a.type === 4);
          const playingActivity = data.activities?.find(a => a.type === 0);
          const spotify = data.spotify;

          const user = data.discord_user;
          const avatarUrl = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=128` : 'https://cdn.discordapp.com/embed/avatars/0.png';
          const username = user.global_name || user.username;

          let statusColor = 'var(--muzzle-grey)';
          let statusText = 'OFFLINE';
          if (status === 'online') { statusColor = '#43b581'; statusText = 'ONLINE'; }
          else if (status === 'idle') { statusColor = '#faa61a'; statusText = 'IDLE'; }
          else if (status === 'dnd') { statusColor = '#f04747'; statusText = 'DND'; }

          let activitiesHtml = '';

          if (customStatus) {
            let emoji = '';
            if (customStatus.emoji) {
              if (customStatus.emoji.id) {
                const ext = customStatus.emoji.animated ? 'gif' : 'webp';
                emoji = `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${ext}" style="width: 18px; height: 18px; vertical-align: text-bottom; margin-right: 4px;">`;
              } else if (customStatus.emoji.name) {
                emoji = `<span style="margin-right: 4px;">${customStatus.emoji.name}</span>`;
              }
            }
            const text = customStatus.state || '';
            if (emoji || text) {
              activitiesHtml += `<div class="scada-metric" style="grid-column: 1 / -1;"><span class="scada-label">Field Log</span><span class="scada-value" style="font-size: 1rem; color: #fff; text-shadow: none;">${emoji} <span>${text}</span></span></div>`;
            }
          }

          if (spotify) {
            activitiesHtml += `<div class="scada-metric"><span class="scada-label">Audio Signal</span><span class="scada-value" style="font-size: 1rem; color: #1DB954; text-shadow: 0 0 8px rgb(29 185 84 / 60%);">🎵 <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; display: inline-block; vertical-align: bottom;">${spotify.song}</span></span></div>`;
          } else if (playingActivity) {
            activitiesHtml += `<div class="scada-metric"><span class="scada-label">Active Process</span><span class="scada-value" style="font-size: 1rem; color: var(--eye-highlight); text-shadow: 0 0 8px color-mix(in srgb, var(--eye-highlight) 60%, transparent);">🎮 <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; display: inline-block; vertical-align: bottom;">${playingActivity.name}</span></span></div>`;
          }

          if (isVoice) {
            activitiesHtml += `<div class="scada-metric"><span class="scada-label">Active Channel</span><span class="scada-value" style="font-size: 1rem;"><div class="eq-bars" style="margin-right: 6px; margin-bottom: 2px;"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div> LIVE</span></div>`;
          }

          let clientHtml = '';
          if (isOnline) {
            let activeClients = [];
            if (data.active_on_discord_desktop) activeClients.push('DSK');
            if (data.active_on_discord_mobile) activeClients.push('MOB');
            if (data.active_on_discord_web) activeClients.push('WEB');

            if (activeClients.length > 0) {
              clientHtml = `<div class="scada-metric"><span class="scada-label">Signal Points</span><span class="scada-value" style="font-size: 1rem;">[ ${activeClients.join(' / ')} ]</span></div>`;
            }
          }

          if (!activitiesHtml && !clientHtml) {
            activitiesHtml = `<div class="scada-metric" style="grid-column: 1 / -1;"><span class="scada-label">Field State</span><span class="scada-value" style="font-size: 1rem; color: var(--muzzle-grey); text-shadow: none;">Awaiting field signal...</span></div>`;
          }

          discordContainer.innerHTML = `
            <div class="scada-panel fade-in" style="max-width: 700px; margin: 0 auto;">
              <div style="width: 100%;">
                <div class="scada-header">
                  <span>[ FIELD RADIO — BASE CAMP LINK ]</span>
                  <span class="scada-time">--:--:--</span>
                  <span class="scada-status" style="color: ${statusColor}; text-shadow: 0 0 5px ${statusColor};">
                    <div class="scada-status-dot" style="background-color: ${statusColor}; box-shadow: 0 0 8px ${statusColor}; ${isOnline ? '' : 'animation: none; opacity: 0.5;'}"></div>
                    ${statusText}
                  </span>
                </div>
                <div class="scada-body">
                  <div class="scada-primary" style="flex-direction: row; gap: 1.2rem; justify-content: center; padding: 1.2rem; min-width: 200px;">
                    <div class="discord-avatar-wrapper">
                      <img src="${avatarUrl}" alt="${username}" class="discord-avatar">
                    </div>
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start;">
                      <div class="scada-label" style="margin-bottom: 0.2rem;">RESEARCHER</div>
                      <div class="scada-value" style="font-size: 1.4rem; margin-bottom: 0.8rem;">${username}</div>
                      <div class="scada-label" style="margin-bottom: 0.2rem;">FIELD PARTNER</div>
                      <div class="scada-value" style="font-size: 1rem;"><a href="https://hypercat.me/" target="_blank" rel="noopener" style="color: #FF6700; text-shadow: 0 0 8px rgb(255 103 0 / 60%); text-decoration: none; border-bottom: 1px dashed #FF6700;">HYPER</a></div>
                    </div>
                  </div>
                  <div class="scada-grid" style="flex: 1; ${activitiesHtml || clientHtml ? '' : 'display: none;'}">
                    ${activitiesHtml}
                    ${clientHtml}
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      } catch (e) {
        console.error("Discord fetch failed:", e);
        discordContainer.innerHTML = '<span style="color: var(--muzzle-grey);">Field radio lost</span>';
      }
    }

    fetchDiscord();
    setInterval(fetchDiscord, 60000);

    // ── 2. Social Feeds (Bluesky + Pixelfed + Mastodon) ──────────────────
    const feedContainer = document.getElementById('social-feed-grid');

    async function fetchBluesky() {
      try {
        const BSKY_HANDLE = 'redpanda.pet';
        const res = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${BSKY_HANDLE}&filter=posts_no_replies&limit=20`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

        return data.feed.filter(item => !item.reply).slice(0, 10).map(item => {
          const post = item.post;
          const text = post.record.text || '';
          const image = post.embed?.images?.[0]?.thumb || null;
          return {
            source: 'Bluesky',
            date: new Date(post.indexedAt),
            text: text,
            image: image,
            url: `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`,
            isRepost: !!item.reason
          };
        });
      } catch (e) {
        console.error("Bluesky fetch error:", e);
        return [];
      }
    }

    async function fetchPixelfed() {
      try {
        const targetUrl = 'https://pixelfed.social/users/roryredpanda.atom';
        const encodedUrl = encodeURIComponent(targetUrl);

        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodedUrl}`);
        if (!res.ok) throw new Error("rss2json API failed");

        const data = await res.json();
        if (data.status !== 'ok' || !data.items) throw new Error("Invalid data from rss2json");

        return data.items.slice(0, 10).map(item => {
          let image = item.thumbnail || (item.enclosure && item.enclosure.link) || null;
          if (!image) {
            const content = item.content || item.description || "";
            const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) image = imgMatch[1];
          }

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = item.content || item.description || "";
          const text = tempDiv.textContent || tempDiv.innerText || "";

          return {
            source: 'Pixelfed',
            date: new Date(item.pubDate),
            text: text.trim(),
            image: image,
            url: item.link,
            isRepost: false
          };
        });
      } catch (e) {
        console.error("Pixelfed fetch error:", e);
        return [];
      }
    }

    async function fetchMastodon() {
      try {
        const res = await fetch('https://furry.engineer/api/v1/accounts/110373887192663991/statuses?limit=10&exclude_replies=true');

        if (!res.ok) {
          console.warn(`Mastodon API returned HTTP ${res.status}`);
          return [];
        }

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.warn("Mastodon fetch error: API returned non-JSON payload");
          return [];
        }

        if (!Array.isArray(data)) {
          console.warn("Mastodon fetch error: API returned non-array", data);
          return [];
        }

        return data.map(status => {
          const isRepost = !!status.reblog;
          const actualStatus = isRepost ? status.reblog : status;

          let image = null;
          if (actualStatus.media_attachments && actualStatus.media_attachments.length > 0) {
            image = actualStatus.media_attachments[0].preview_url || actualStatus.media_attachments[0].url;
          }

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = actualStatus.content || "";
          const text = tempDiv.textContent || tempDiv.innerText || "";

          return {
            source: 'Mastodon',
            date: new Date(actualStatus.created_at),
            text: text.trim(),
            image: image,
            url: actualStatus.url,
            isRepost: isRepost
          };
        });
      } catch (e) {
        console.error("Mastodon fetch error:", e);
        return [];
      }
    }

    Promise.all([fetchBluesky(), fetchPixelfed(), fetchMastodon()]).then(([bsky, pxfed, mstdn]) => {
      let combined = [...bsky, ...pxfed, ...mstdn]
        .filter(post => post.date && !isNaN(post.date.getTime()))
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 20);

      if (combined.length === 0) {
        feedContainer.innerHTML = '<div class="loading-feed">Field signals unavailable at this time.</div>';
        return;
      }

      feedContainer.innerHTML = combined.map(post => `
        <a href="${post.url}" target="_blank" rel="noopener" class="feed-card">
          <div class="meta">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="feed-source ${post.source.toLowerCase()}">${post.source}</span>
              ${post.isRepost ? '<span style="font-size: 0.8rem; opacity: 0.8;" title="Repost">🔁 Repost</span>' : ''}
            </div>
            <span class="feed-date">${post.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          ${post.image ? `<img src="${post.image}" alt="Post image" loading="lazy">` : ''}
          <div class="content">${post.text}</div>
        </a>
      `).join('');

      feedContainer.classList.add('fade-in');
    });

    // ── 3. Habitat Conditions Monitor (Open-Meteo + AQI) ─────────────────
    const lat = 39.2904; // Baltimore, MD
    const lon = -76.6122;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,wind_direction_10m,cloud_cover&daily=sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,uv_index&timezone=America%2FNew_York`;

    function getWindDirection(degrees) {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(degrees / 22.5) % 16;
      return directions[index];
    }

    Promise.all([
      fetch(weatherUrl).then(async r => { const d = await r.json(); if (!r.ok || d.error) throw new Error(d.reason || `HTTP ${r.status}`); return d; }),
      fetch(aqiUrl).then(r => r.json()).catch(() => null)
    ]).then(([data, aqiData]) => {
        const current = data.current;
        const daily = data.daily;
        const aqi = aqiData?.current?.us_aqi ?? null;
        const uvi = aqiData?.current?.uv_index ?? null;

        const weatherCodes = {
          0: { icon: '☀️', desc: 'Clear sky', color: '#FFD700' },
          1: { icon: '🌤️', desc: 'Mainly clear', color: '#90CAF9' },
          2: { icon: '⛅', desc: 'Partly cloudy', color: '#90CAF9' },
          3: { icon: '☁️', desc: 'Overcast', color: '#90CAF9' },
          45: { icon: '🌫️', desc: 'Fog', color: '#B0BEC5' },
          48: { icon: '🌫️', desc: 'Depositing rime fog', color: '#B0BEC5' },
          51: { icon: '🌧️', desc: 'Light drizzle', color: '#26C6DA' },
          53: { icon: '🌧️', desc: 'Moderate drizzle', color: '#26C6DA' },
          55: { icon: '🌧️', desc: 'Dense drizzle', color: '#26C6DA' },
          61: { icon: '🌧️', desc: 'Light rain', color: '#26C6DA' },
          63: { icon: '🌧️', desc: 'Moderate rain', color: '#26C6DA' },
          65: { icon: '🌧️', desc: 'Heavy rain', color: '#26C6DA' },
          71: { icon: '❄️', desc: 'Light snow', color: '#E1F5FE' },
          73: { icon: '❄️', desc: 'Moderate snow', color: '#E1F5FE' },
          75: { icon: '❄️', desc: 'Heavy snow', color: '#E1F5FE' },
          77: { icon: '❄️', desc: 'Snow grains', color: '#E1F5FE' },
          80: { icon: '🌧️', desc: 'Light showers', color: '#26C6DA' },
          81: { icon: '🌧️', desc: 'Moderate showers', color: '#26C6DA' },
          82: { icon: '⛈️', desc: 'Violent showers', color: '#26C6DA' },
          95: { icon: '⛈️', desc: 'Thunderstorm', color: '#B39DDB' },
          96: { icon: '⛈️', desc: 'Thunderstorm w/ hail', color: '#B39DDB' },
          99: { icon: '⛈️', desc: 'Heavy thunderstorm w/ hail', color: '#B39DDB' }
        };

        const codeInfo = weatherCodes[current.weather_code] || { icon: '☁️', desc: 'Unknown', color: '#9E9E9E' };
        const formatTime = (isoString) => new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const iconEl = document.getElementById('ww-icon');
        iconEl.textContent = codeInfo.icon;
        iconEl.style.filter = `drop-shadow(0 0 8px ${codeInfo.color})`;

        document.getElementById('ww-desc').textContent = codeInfo.desc;
        document.getElementById('ww-temp').textContent = Math.round(current.temperature_2m);

        let isCritical = false;

        const feelsTemp = Math.round(current.apparent_temperature);
        let feelsColor = '#00E5FF';
        let feelsWarning = '';

        if (feelsTemp >= 103) {
          feelsColor = '#f04747';
          feelsWarning = ' <span style="font-size: 0.55em; vertical-align: middle; animation: scada-warn-blink 1s infinite;">[CRITICAL]</span>';
          isCritical = true;
        } else if (feelsTemp >= 90) {
          feelsColor = '#FF6700';
          feelsWarning = ' <span style="font-size: 0.55em; vertical-align: middle;">[HIGH]</span>';
        } else if (feelsTemp >= 80) {
          feelsColor = '#FFB300';
          feelsWarning = ' <span style="font-size: 0.55em; vertical-align: middle;">[ELEVATED]</span>';
        } else if (feelsTemp <= 32) {
          feelsColor = '#E1F5FE';
          feelsWarning = ' <span style="font-size: 0.55em; vertical-align: middle;">[FREEZE]</span>';
        }

        const feelsEl = document.getElementById('ww-feels');
        feelsEl.innerHTML = `${feelsTemp}°F${feelsWarning}`;
        feelsEl.style.color = feelsColor;
        feelsEl.style.textShadow = `0 0 8px color-mix(in srgb, ${feelsColor} 60%, transparent)`;

        document.getElementById('ww-humidity').textContent = current.relative_humidity_2m + '%';
        document.getElementById('ww-precip').textContent = current.precipitation.toFixed(2) + '"';

        const windSpeed = current.wind_speed_10m;
        let windColor = '#00E5FF';
        let windWarning = '';

        if (windSpeed >= 40) {
          windColor = '#f04747';
          windWarning = ' <span style="font-size: 0.55em; vertical-align: middle; animation: scada-warn-blink 1s infinite;">[GALE]</span>';
          isCritical = true;
        } else if (windSpeed >= 25) {
          windColor = '#FF6700';
          windWarning = ' <span style="font-size: 0.55em; vertical-align: middle;">[HIGH]</span>';
        } else if (windSpeed >= 15) {
          windColor = '#FFB300';
          windWarning = ' <span style="font-size: 0.55em; vertical-align: middle;">[BREEZY]</span>';
        }

        document.getElementById('ww-wind').textContent = windSpeed.toFixed(1) + ' mph';
        document.getElementById('ww-wind-dir').innerHTML = getWindDirection(current.wind_direction_10m) + windWarning;
        const windParent = document.getElementById('ww-wind').parentElement;
        windParent.style.color = windColor;
        windParent.style.textShadow = `0 0 8px color-mix(in srgb, ${windColor} 60%, transparent)`;

        document.getElementById('ww-pressure').textContent = (current.surface_pressure * 0.02953).toFixed(2) + ' inHg';
        document.getElementById('ww-cloud').textContent = current.cloud_cover + '%';
        document.getElementById('ww-sunrise').textContent = formatTime(daily.sunrise[0]);
        document.getElementById('ww-sunset').textContent = formatTime(daily.sunset[0]);

        // UV Index
        if (uvi !== null) {
          const uvCat = getUvCategory(uvi);
          const uvEl = document.getElementById('ww-uv');
          uvEl.textContent = uvCat.label;
          uvEl.style.color = uvCat.color;
          uvEl.style.textShadow = `0 0 8px color-mix(in srgb, ${uvCat.color} 60%, transparent)`;
        } else {
          document.getElementById('ww-uv').textContent = 'N/A';
        }

        // Air Quality Index
        if (aqi !== null) {
          const aqiCat = getAqiCategory(aqi);
          const aqiEl = document.getElementById('ww-aqi');
          aqiEl.textContent = aqiCat.label;
          aqiEl.style.color = aqiCat.color;
          aqiEl.style.textShadow = `0 0 8px color-mix(in srgb, ${aqiCat.color} 60%, transparent)`;
          if (aqi > 150) isCritical = true;
        } else {
          document.getElementById('ww-aqi').textContent = 'N/A';
        }

        // Fursuit Field Index
        const rating = computeFieldRating(feelsTemp, windSpeed, current.precipitation, aqi);
        const ratingEl = document.getElementById('ww-field-rating');
        ratingEl.textContent = rating.label;
        ratingEl.style.color = rating.color;
        ratingEl.style.textShadow = `0 0 8px color-mix(in srgb, ${rating.color} 60%, transparent)`;

        // Season label in panel header
        const seasonInfo = getSeasonLabel();
        document.querySelector('#weather-data .scada-header span:first-child').textContent =
          `[ HABITAT CONDITIONS — ${seasonInfo.season} ]`;

        if (isCritical) {
          const weatherPanel = document.querySelector('#weather-data .scada-panel');
          weatherPanel.classList.add('critical-alert');
          document.querySelector('#weather-data .scada-header span:first-child').textContent = '[ CRITICAL HABITAT ALERT ]';
          document.querySelector('#weather-data .scada-status').innerHTML = '<div class="scada-status-dot"></div> WARNING';
        }

        document.getElementById('weather-loading').style.display = 'none';
        const weatherData = document.getElementById('weather-data');
        weatherData.style.display = 'block';
        weatherData.classList.add('fade-in');
      })
      .catch(err => {
        console.error('Failed to fetch habitat data:', err);
        document.getElementById('weather-loading').textContent = 'Habitat sensors offline.';
      });

    // ── 4. Expedition Log (GitHub) ───────────────────────────────────────
    const githubContainer = document.getElementById('github-widget');
    const GITHUB_USERNAME = 'cbellmyer';

    async function fetchGitHub() {
      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
        if (!res.ok) {
          if (res.status === 403 || res.status === 429) throw new Error("API rate limit exceeded.");
          throw new Error("GitHub API failed");
        }
        const events = await res.json();

        const recentEvent = events.find(e => e.type === 'PushEvent' || e.type === 'CreateEvent' || e.type === 'PullRequestEvent') || events[0];

        if (recentEvent) {
          const repoName = recentEvent.repo.name;
          const isPush = recentEvent.type === 'PushEvent';
          const actionType = isPush ? 'FIELD REPORT' : recentEvent.type.replace('Event', '').toUpperCase();

          let commitMessage = 'No entry details available.';
          if (isPush && recentEvent.payload.commits && recentEvent.payload.commits.length > 0) {
            commitMessage = recentEvent.payload.commits[0].message;
          } else if (recentEvent.type === 'CreateEvent') {
            commitMessage = `Created ${recentEvent.payload.ref_type || 'repository'} ${recentEvent.payload.ref || ''}`;
          }

          if (commitMessage.length > 60) commitMessage = commitMessage.substring(0, 60) + '...';

          const timeAgo = new Date(recentEvent.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

          githubContainer.innerHTML = `
            <div class="scada-panel fade-in" style="max-width: 700px; margin: 0 auto;">
              <div style="width: 100%;">
                <div class="scada-header">
                  <span>[ EXPEDITION LOG ]</span>
                  <span class="scada-time">--:--:--</span>
                  <span class="scada-status"><div class="scada-status-dot"></div> ACTIVE</span>
                </div>
                <div class="scada-body">
                  <div class="scada-primary" style="flex-direction: row; gap: 1.2rem; justify-content: center; padding: 1.2rem; min-width: 200px;">
                    <div style="font-size: 3.5rem; line-height: 1;" id="gh-icon">📦</div>
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; text-align: left;">
                      <div class="scada-label" style="margin-bottom: 0.2rem;">RESEARCH FILE</div>
                      <div class="scada-value" style="font-size: 1.1rem; word-break: break-all; text-shadow: none;">${repoName.split('/').pop()}</div>
                    </div>
                  </div>
                  <div class="scada-grid" style="flex: 1;">
                    <div class="scada-metric">
                      <span class="scada-label">Last Entry</span>
                      <span class="scada-value" style="font-size: 1rem; color: #E1F5FE;">${actionType}</span>
                    </div>
                    <div class="scada-metric">
                      <span class="scada-label">Field Date</span>
                      <span class="scada-value" style="font-size: 0.9rem; color: #B0BEC5; text-shadow: none;">${timeAgo}</span>
                    </div>
                    <div class="scada-metric" style="grid-column: 1 / -1;">
                      <span class="scada-label">Entry Notes</span>
                      <span class="scada-value" style="font-size: 0.95rem; color: var(--eye-highlight); text-shadow: none; font-family: monospace;">> ${commitMessage}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          updateScadaClocks();
        } else {
          throw new Error("No recent events found.");
        }
      } catch (e) {
        console.error("GitHub fetch failed:", e);

        let errorText = "Unable to establish link...";
        if (e.message.includes("recent events")) errorText = "No recent public activity.";
        else if (e.message.includes("rate limit")) errorText = "API rate limit exceeded.";
        else errorText = "Connection to expedition log failed.";

        githubContainer.innerHTML = `
          <div class="scada-panel fade-in" style="max-width: 700px; margin: 0 auto;">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ EXPEDITION LOG ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status" style="color: #f04747; text-shadow: 0 0 5px #f04747;"><div class="scada-status-dot" style="background-color: #f04747; box-shadow: 0 0 8px #f04747; animation: none;"></div> OFFLINE</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 200px;">
                  <div style="font-size: 3.5rem; line-height: 1;">📦</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Field State</span>
                  <span class="scada-value" style="font-size: 1rem; color: var(--muzzle-grey); text-shadow: none;">${errorText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      }
    }

    fetchGitHub();

    // ── 5. Expedition Briefing (Con Season from events.json) ─────────────
    async function fetchConSeason() {
      const container = document.getElementById('con-season-widget');
      try {
        const res = await fetch('/data/events.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const events = await res.json();

        const now = new Date();
        const future90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

        let upcoming = [];
        events.forEach(location => {
          location.history.forEach(entry => {
            const yearMatch = entry.dates.match(/\b(20\d{2})\b/);
            const monthDayMatch = entry.dates.match(/([A-Za-z]+)\s+(\d+)/);
            if (yearMatch && monthDayMatch) {
              const d = new Date(`${monthDayMatch[1]} ${monthDayMatch[2]}, ${yearMatch[1]}`);
              if (d >= now && d <= future90) {
                upcoming.push({ ...entry, locationName: location.locationName, dateObj: d });
              }
            }
          });
        });

        upcoming.sort((a, b) => a.dateObj - b.dateObj);

        const season = getSeasonLabel();
        const count = upcoming.length;
        const next = upcoming[0];
        const daysUntil = next ? Math.ceil((next.dateObj - now) / (1000 * 60 * 60 * 24)) : null;
        const activityColor = count >= 3 ? '#7DC26B' : count >= 1 ? '#FFB300' : '#00E5FF';

        container.innerHTML = `
          <div class="scada-panel fade-in">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ EXPEDITION BRIEFING ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot" ${count === 0 ? 'style="animation: none; opacity: 0.5;"' : ''}></div> ${count > 0 ? 'ACTIVE' : 'STANDBY'}</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.5rem;">${count > 0 ? '🗺️' : '🏕️'}</div>
                  <div class="scada-value" style="font-size: 2.2rem; justify-content: center;">${count}</div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">Events<br>Next 90 Days</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric">
                    <span class="scada-label">Field Season</span>
                    <span class="scada-value" style="font-size: 0.95rem;">${season.season}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Activity Level</span>
                    <span class="scada-value" style="font-size: 0.85rem; color: ${activityColor}; text-shadow: 0 0 8px color-mix(in srgb, ${activityColor} 60%, transparent);">${season.activity}</span>
                  </div>
                  ${next ? `
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Next Expedition</span>
                    <span class="scada-value" style="font-size: 1rem; color: #FF6700; text-shadow: 0 0 8px rgb(255 103 0 / 60%);">${next.eventName} — ${next.locationName} <span style="font-size: 0.7em; color: var(--muzzle-grey); text-shadow: none;">(in ${daysUntil} day${daysUntil !== 1 ? 's' : ''})</span></span>
                  </div>` : `
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Next Expedition</span>
                    <span class="scada-value" style="font-size: 1rem; color: var(--muzzle-grey); text-shadow: none;">No expeditions in next 90 days</span>
                  </div>`}
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Con season fetch failed:', e);
        container.remove();
      }
    }

    fetchConSeason();
  });
</script>
