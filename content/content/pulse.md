---
title: "Pulse"
description: "Live ecosystem vitals and field observations from the furry frontier."
type: "page"
ShowToc: false
ShowBreadCrumbs: false
---

<!-- markdownlint-disable MD011 -- inline JavaScript `(...)[...]` is not a reversed markdown link -->

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

<div class="bio-container">
  <h2>Field Conditions</h2>
  <!-- Featured presence panel — full-width base-camp link -->
  <div id="discord-widget" class="pulse-feature">
    <span style="opacity: 0.7;">Establishing field radio link...</span>
  </div>
  <!-- Masonry dashboard — remaining instruments pack into balanced columns -->
  <div class="pulse-dashboard">
    <h3 class="pulse-cat"><span>📡</span> Live Presence</h3>
    <div id="steam-widget">
      <div style="opacity: 0.7; font-size: 1.1rem; padding: 1rem; text-align: center;">Booting steam terminal...</div>
    </div>
    <div id="lastfm-widget">
      <div style="opacity: 0.7; font-size: 1.1rem; padding: 1rem; text-align: center;">Tuning audio receiver...</div>
    </div>
    <div id="abs-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Spinning up listening log...</div>
    </div>
    <h3 class="pulse-cat"><span>🌤️</span> Habitat Conditions</h3>
    <div id="system-status-weather" class="pulse-span-full">
      <div id="weather-loading" style="opacity: 0.7; font-size: 1.1rem; padding: 1rem; text-align: center;">Sampling habitat conditions...</div>
      <div id="weather-data" style="display: none;">
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
                  <span class="scada-label">Dawn Golden Hour</span>
                  <span class="scada-value" id="ww-golden-dawn" style="font-size: 0.9rem; color: #FFB300; text-shadow: 0 0 8px color-mix(in srgb, #FFB300 60%, transparent);">--</span>
                </div>
                <div class="scada-metric">
                  <span class="scada-label">Dusk Golden Hour</span>
                  <span class="scada-value" id="ww-golden-dusk" style="font-size: 0.9rem; color: #FF8F00; text-shadow: 0 0 8px color-mix(in srgb, #FF8F00 60%, transparent);">--</span>
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
    <div id="solar-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Tracking solar arc...</div>
    </div>
    <div id="tidal-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Reading tide gauge...</div>
    </div>
    <div id="seismic-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Polling seismographs...</div>
    </div>
    <h3 class="pulse-cat"><span>🌌</span> Orbital &amp; Sky</h3>
    <div id="lunar-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Calculating lunar phase...</div>
    </div>
    <div id="geomag-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Reading magnetometer...</div>
    </div>
    <div id="iss-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Acquiring orbital telemetry...</div>
    </div>
    <h3 class="pulse-cat"><span>🧭</span> Expedition Log</h3>
    <div id="github-widget">
      <div style="opacity: 0.7; font-size: 1.1rem; padding: 1rem; text-align: center;">Pulling expedition records...</div>
    </div>
    <div id="con-season-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Consulting expedition dossier...</div>
    </div>
    <div id="field-metrics-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Computing field metrics...</div>
    </div>
    <div id="streak-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Tallying field tenure...</div>
    </div>
    <div id="onthisday-widget">
      <div class="loading-feed" style="font-size: 0.9rem; padding: 1rem;">Leafing through field journals...</div>
    </div>
  </div>
</div>

<div class="bio-container">
  <h2>Field Notes</h2>
  <div id="social-feed-grid" class="feed-scroll">
    <div class="loading-feed">Tuning to field frequencies...</div>
  </div>
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

    function fetchWithTimeout(url, timeoutMs = 8000) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
    }

    function windPointToDeg(point) {
      const dirs = { N:0, NNE:22, NE:45, ENE:67, E:90, ESE:112, SE:135, SSE:157, S:180, SSW:202, SW:225, WSW:247, W:270, WNW:292, NW:315, NNW:337 };
      return dirs[point] ?? 0;
    }

    function normalizeWttrData(raw) {
      const cc = raw.current_condition[0];
      const astro = raw.weather[0].astronomy[0];
      const parseAstroTime = (str) => {
        const [time, meridiem] = str.trim().split(' ');
        let [h, m] = time.split(':').map(Number);
        if (meridiem === 'PM' && h !== 12) h += 12;
        if (meridiem === 'AM' && h === 12) h = 0;
        const d = new Date(); d.setHours(h, m, 0, 0);
        return d.toISOString();
      };
      const wttrToWmo = {
        113:0, 116:2, 119:3, 122:3, 143:45, 248:45, 260:48,
        176:61, 263:51, 266:51, 281:51, 293:61, 296:61, 284:55,
        299:63, 302:65, 305:65, 308:65, 179:71, 317:71, 320:71,
        323:73, 326:75, 329:75, 332:75, 335:75, 338:75, 350:77,
        182:61, 185:51, 311:51, 314:55, 353:80, 356:81, 359:82,
        362:80, 365:80, 368:71, 371:73, 374:80, 377:77,
        200:95, 386:95, 389:95, 392:95, 227:75, 230:75, 395:99
      };
      return {
        current: {
          temperature_2m: parseFloat(cc.temp_F),
          apparent_temperature: parseFloat(cc.FeelsLikeF),
          relative_humidity_2m: parseInt(cc.humidity),
          precipitation: parseFloat(cc.precipMM) / 25.4,
          weather_code: wttrToWmo[parseInt(cc.weatherCode)] ?? 3,
          wind_speed_10m: parseFloat(cc.windspeedMiles),
          surface_pressure: parseFloat(cc.pressure),
          wind_direction_10m: windPointToDeg(cc.winddir16Point),
          cloud_cover: parseInt(cc.cloudcover)
        },
        daily: {
          sunrise: [parseAstroTime(astro.sunrise)],
          sunset: [parseAstroTime(astro.sunset)]
        }
      };
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
            const allClients = [
              { code: 'DSK', label: 'Desktop', active: data.active_on_discord_desktop },
              { code: 'MOB', label: 'Mobile', active: data.active_on_discord_mobile },
              { code: 'WEB', label: 'Web', active: data.active_on_discord_web },
            ];
            const anyActive = allClients.some(c => c.active);
            if (anyActive) {
              clientHtml = `<div class="scada-metric">
                <span class="scada-label">Signal Points</span>
                <span class="scada-value" style="font-size: 0.85rem; gap: 1rem; flex-wrap: wrap;">
                  ${allClients.map(c => `
                    <span style="display: inline-flex; align-items: center; gap: 5px; color: ${c.active ? '#43b581' : 'rgba(127,127,127,0.35)'}; text-shadow: ${c.active ? '0 0 6px rgb(67 181 129 / 50%)' : 'none'};">
                      <span style="width: 7px; height: 7px; border-radius: 50%; background: currentColor; display: inline-block; ${c.active ? 'box-shadow: 0 0 5px currentColor;' : ''}"></span>
                      ${c.code}
                    </span>
                  `).join('')}
                </span>
              </div>`;
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
        const targetUrl = 'https://furry.engineer/@rory.rss';
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetUrl)}`);
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
            source: 'Mastodon',
            date: new Date(item.pubDate),
            text: text.trim(),
            image: image,
            url: item.link,
            isRepost: false
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
        <a href="${post.url}" target="_blank" rel="noopener" class="feed-card ${post.source.toLowerCase()}">
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

    // Shared state so AQI can recalculate Field Index once it arrives
    let _wx = { feelsTemp: null, windSpeed: null, precip: null };

    function applyAqiData(aqiData) {
      const aqi = aqiData?.current?.us_aqi ?? null;
      const uvi = aqiData?.current?.uv_index ?? null;

      if (uvi !== null) {
        const uvCat = getUvCategory(uvi);
        const uvEl = document.getElementById('ww-uv');
        uvEl.textContent = uvCat.label;
        uvEl.style.color = uvCat.color;
        uvEl.style.textShadow = `0 0 8px color-mix(in srgb, ${uvCat.color} 60%, transparent)`;
      } else {
        document.getElementById('ww-uv').textContent = 'N/A';
      }

      if (aqi !== null) {
        const aqiCat = getAqiCategory(aqi);
        const aqiEl = document.getElementById('ww-aqi');
        aqiEl.textContent = aqiCat.label;
        aqiEl.style.color = aqiCat.color;
        aqiEl.style.textShadow = `0 0 8px color-mix(in srgb, ${aqiCat.color} 60%, transparent)`;
        if (_wx.feelsTemp !== null) {
          const rating = computeFieldRating(_wx.feelsTemp, _wx.windSpeed, _wx.precip, aqi);
          const ratingEl = document.getElementById('ww-field-rating');
          ratingEl.textContent = rating.label;
          ratingEl.style.color = rating.color;
          ratingEl.style.textShadow = `0 0 8px color-mix(in srgb, ${rating.color} 60%, transparent)`;
        }
        if (aqi > 150) {
          document.querySelector('#weather-data .scada-panel').classList.add('critical-alert');
          document.querySelector('#weather-data .scada-header span:first-child').textContent = '[ CRITICAL HABITAT ALERT ]';
          document.querySelector('#weather-data .scada-status').innerHTML = '<div class="scada-status-dot"></div> WARNING';
        }
      } else {
        document.getElementById('ww-aqi').textContent = 'N/A';
      }
    }

    async function fetchWeatherWithFallback() {
      try {
        const r = await fetchWithTimeout(weatherUrl);
        const d = await r.json();
        if (!r.ok || d.error) throw new Error(d.reason || `HTTP ${r.status}`);
        return d;
      } catch (e) {
        console.warn('Open-Meteo unavailable, falling back to wttr.in:', e.message);
        const wttrUrl = `https://wttr.in/${lat},${lon}?format=j1`;
        const r = await fetchWithTimeout(wttrUrl);
        if (!r.ok) throw new Error(`wttr.in HTTP ${r.status}`);
        return normalizeWttrData(await r.json());
      }
    }

    // Weather fetch — renders the panel immediately; falls back to wttr.in if Open-Meteo fails
    fetchWeatherWithFallback()
      .then(data => {
        const current = data.current;
        const daily = data.daily;

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

        const fmt = t => t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunriseDate = new Date(daily.sunrise[0]);
        const sunsetDate = new Date(daily.sunset[0]);
        const oneHour = 60 * 60 * 1000;
        document.getElementById('ww-golden-dawn').textContent =
          fmt(sunriseDate) + '–' + fmt(new Date(sunriseDate.getTime() + oneHour));
        document.getElementById('ww-golden-dusk').textContent =
          fmt(new Date(sunsetDate.getTime() - oneHour)) + '–' + fmt(sunsetDate);

        // Initial field rating — AQI unknown until second fetch resolves
        _wx = { feelsTemp, windSpeed, precip: current.precipitation };
        const rating = computeFieldRating(feelsTemp, windSpeed, current.precipitation, null);
        const ratingEl = document.getElementById('ww-field-rating');
        ratingEl.textContent = rating.label;
        ratingEl.style.color = rating.color;
        ratingEl.style.textShadow = `0 0 8px color-mix(in srgb, ${rating.color} 60%, transparent)`;

        const seasonInfo = getSeasonLabel();
        document.querySelector('#weather-data .scada-header span:first-child').textContent =
          `[ HABITAT CONDITIONS — ${seasonInfo.season} ]`;

        if (isCritical) {
          document.querySelector('#weather-data .scada-panel').classList.add('critical-alert');
          document.querySelector('#weather-data .scada-header span:first-child').textContent = '[ CRITICAL HABITAT ALERT ]';
          document.querySelector('#weather-data .scada-status').innerHTML = '<div class="scada-status-dot"></div> WARNING';
        }

        document.getElementById('weather-loading').style.display = 'none';
        const weatherData = document.getElementById('weather-data');
        weatherData.style.display = 'block';
        weatherData.classList.add('fade-in');
      })
      .catch(err => {
        console.error('Weather fetch failed:', err);
        const isTimeout = err.name === 'AbortError';
        document.getElementById('weather-loading').style.display = 'none';
        const iconEl = document.getElementById('ww-icon');
        iconEl.textContent = '📡';
        iconEl.style.filter = 'drop-shadow(0 0 8px #f04747)';
        document.getElementById('ww-desc').textContent = isTimeout ? 'REQUEST TIMEOUT' : 'API UNAVAILABLE';
        document.querySelector('#weather-data .scada-header span:first-child').textContent = '[ HABITAT CONDITIONS — OFFLINE ]';
        const statusEl = document.querySelector('#weather-data .scada-status');
        statusEl.innerHTML = '<div class="scada-status-dot" style="background-color: #f04747; box-shadow: 0 0 8px #f04747; animation: none;"></div> OFFLINE';
        statusEl.style.color = '#f04747';
        statusEl.style.textShadow = '0 0 5px #f04747';
        const weatherData = document.getElementById('weather-data');
        weatherData.style.display = 'block';
        weatherData.classList.add('fade-in');
      });

    // AQI fetch — independent; fills UV + AQI cells and refines Field Index when ready
    fetchWithTimeout(aqiUrl)
      .then(r => r.json())
      .then(aqiData => applyAqiData(aqiData))
      .catch(() => {
        document.getElementById('ww-uv').textContent = 'N/A';
        document.getElementById('ww-aqi').textContent = 'N/A';
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
          if (isPush) {
            const commits = recentEvent.payload.commits;
            const headSha = recentEvent.payload.head;
            if (commits && commits.length > 0) {
              // Old API format: full commits array in payload
              const head = commits.find(c => c.sha === headSha) || commits[commits.length - 1];
              commitMessage = head.message.split('\n')[0];
            } else if (headSha) {
              // New GitHub API format: only head SHA present — fetch commit details separately
              try {
                const cr = await fetch(`https://api.github.com/repos/${repoName}/commits/${headSha}`);
                if (cr.ok) {
                  const cd = await cr.json();
                  commitMessage = (cd.commit?.message || '').split('\n')[0] || 'No entry details available.';
                }
              } catch (_) { /* silent fallback */ }
            }
          } else if (recentEvent.type === 'CreateEvent') {
            commitMessage = `Created ${recentEvent.payload.ref_type || 'repository'} ${recentEvent.payload.ref || ''}`;
          } else if (recentEvent.type === 'PullRequestEvent') {
            const pr = recentEvent.payload.pull_request;
            if (pr?.title) {
              commitMessage = `PR #${recentEvent.payload.number || pr.number}: ${pr.title}`;
            } else if (pr?.url) {
              // New GitHub API format: pull_request omits title — fetch PR details separately
              try {
                const prr = await fetch(pr.url);
                if (prr.ok) {
                  const prd = await prr.json();
                  commitMessage = `PR #${prd.number}: ${prd.title}`;
                }
              } catch (_) { /* silent fallback */ }
            }
          }

          if (commitMessage.length > 60) commitMessage = commitMessage.substring(0, 60) + '...';

          const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
          commitMessage = esc(commitMessage);

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

    // ── 5. Steam Terminal ─────────────────────────────────────────────────
    const steamContainer = document.getElementById('steam-widget');

    async function fetchSteam() {
      try {
        // Same-origin proxy (Cloudflare Worker, see /worker.js). Steam's API
        // has no CORS headers, so the browser can't call it directly; the
        // Worker also holds the API key server-side.
        const res = await fetchWithTimeout('/api/steam');
        if (!res.ok) throw new Error('Steam API failed');
        const { summary: summaryData, games: gamesData } = await res.json();

        const player     = summaryData.response.players[0];
        const allGames   = gamesData.response?.games || [];
        const recentGame = allGames.length > 0
          ? allGames.sort((a, b) => b.playtime_forever - a.playtime_forever)[0]
          : null;
        const isInGame   = !!player.gameextrainfo;

        const stateMap = {
          0: { label: 'OFFLINE',  color: 'var(--muzzle-grey)' },
          1: { label: 'ONLINE',   color: '#7DC26B' },
          2: { label: 'BUSY',     color: '#EF4444' },
          3: { label: 'AWAY',     color: '#FFB300' },
          4: { label: 'SNOOZE',   color: '#FFB300' },
          5: { label: 'TRADING',  color: 'var(--eye-highlight)' },
          6: { label: 'LFG',      color: 'var(--eye-highlight)' },
        };
        const state = stateMap[player.personastate] || stateMap[0];

        const esc = s => String(s).replace(/[&<>"']/g, c =>
          ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

        // Primary section: game banner if in-game, otherwise avatar
        let primaryHtml, missionLabel;
        if (isInGame) {
          const gameArt = `https://cdn.akamaihd.net/steam/apps/${player.gameid}/capsule_184x69.jpg`;
          primaryHtml = `
            <img src="${gameArt}" alt="Game art"
              style="width:92px;height:34px;object-fit:cover;border-radius:3px;border:1px solid color-mix(in srgb,var(--throat-teal) 40%,transparent);"
              onerror="this.replaceWith(Object.assign(document.createElement('div'),{textContent:'🎮',style:'font-size:2.5rem;line-height:1'}))">
            <div class="eq-bars" style="margin-top:0.6rem;justify-content:center;">
              <div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div>
            </div>`;
          missionLabel = `<span style="color:#EF4444;font-size:0.75rem;letter-spacing:0.12em;animation:scada-warn-blink 1.2s infinite;display:inline-block;">● ACTIVE MISSION</span>`;
        } else {
          primaryHtml = `<img src="${esc(player.avatarmedium)}" alt="Steam avatar"
            style="width:64px;height:64px;border-radius:4px;object-fit:cover;border:1px solid color-mix(in srgb,var(--throat-teal) 40%,transparent);">`;
          missionLabel = `<span style="color:${state.color};font-size:0.75rem;letter-spacing:0.1em;">${state.label}</span>`;
        }

        // Grid rows
        const gameRow = isInGame ? `
          <div class="scada-metric" style="grid-column:1/-1;">
            <span class="scada-label">Active Mission</span>
            <span class="scada-value" style="font-size:1.05rem;color:var(--eye-highlight);">${esc(player.gameextrainfo)}</span>
          </div>` : '';

        let recentRow = '';
        if (recentGame) {
          const hrs = Math.round(recentGame.playtime_forever / 60);
          recentRow = `
            <div class="scada-metric" style="grid-column:1/-1;">
              <span class="scada-label">Most Played</span>
              <span class="scada-value" style="font-size:0.95rem;text-shadow:none;">${esc(recentGame.name)}</span>
            </div>
            <div class="scada-metric">
              <span class="scada-label">Total Hours</span>
              <span class="scada-value" style="font-size:0.95rem;text-shadow:none;">${hrs.toLocaleString()}h</span>
            </div>
            <div class="scada-metric">
              <span class="scada-label">Library</span>
              <span class="scada-value" style="font-size:0.95rem;text-shadow:none;">${allGames.length.toLocaleString()} games</span>
            </div>`;
        }

        const lastSeen = player.personastate === 0 && player.lastlogoff
          ? new Date(player.lastlogoff * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : null;
        const lastSeenRow = lastSeen ? `
          <div class="scada-metric">
            <span class="scada-label">Last Active</span>
            <span class="scada-value" style="font-size:0.85rem;color:var(--muzzle-grey);text-shadow:none;">${lastSeen}</span>
          </div>` : '';

        const statusDotStyle = isInGame
          ? '' : player.personastate === 0
          ? 'background-color:var(--muzzle-grey);box-shadow:none;animation:none;'
          : '';

        steamContainer.innerHTML = `
          <div class="scada-panel fade-in" style="max-width:700px;margin:0 auto;">
            <div style="width:100%;">
              <div class="scada-header">
                <span>[ STEAM TERMINAL ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status">
                  <div class="scada-status-dot" style="${statusDotStyle}"></div>
                  ${isInGame ? 'TRANSMITTING' : state.label}
                </span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="flex-direction:column;align-items:center;padding:1.2rem;min-width:200px;gap:0.6rem;">
                  ${primaryHtml}
                  <div style="display:flex;flex-direction:column;align-items:center;gap:0.25rem;">
                    <div class="scada-label">STATUS</div>
                    ${missionLabel}
                  </div>
                </div>
                <div class="scada-grid" style="flex:1;">
                  ${gameRow}
                  ${recentRow}
                  ${lastSeenRow}
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();

      } catch (e) {
        console.error('Steam fetch failed:', e);
        steamContainer.innerHTML = `
          <div class="scada-panel fade-in" style="max-width:700px;margin:0 auto;">
            <div style="width:100%;">
              <div class="scada-header">
                <span>[ STEAM TERMINAL ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status" style="color:#f04747;text-shadow:0 0 5px #f04747;">
                  <div class="scada-status-dot" style="background-color:#f04747;box-shadow:0 0 8px #f04747;animation:none;"></div>
                  OFFLINE
                </span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width:200px;">
                  <div style="font-size:3rem;line-height:1;">🎮</div>
                </div>
                <div class="scada-grid" style="flex:1;">
                  <div class="scada-metric" style="grid-column:1/-1;">
                    <span class="scada-label">Field State</span>
                    <span class="scada-value" style="font-size:1rem;color:var(--muzzle-grey);text-shadow:none;">Steam terminal offline.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      }
    }

    fetchSteam();

    // ── 6. Audio Signal Monitor (Last.fm) ────────────────────────────────
    const lastfmContainer = document.getElementById('lastfm-widget');
    const LASTFM_USER = 'furcologist';
    const LASTFM_KEY  = '88711862b7890ce6c3ad9538697571bd';

    async function fetchLastFm() {
      try {
        const res = await fetchWithTimeout(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`
        );
        if (!res.ok) throw new Error('Last.fm API failed');
        const data = await res.json();

        const raw = data.recenttracks?.track;
        if (!raw) throw new Error('No track data');
        const track = Array.isArray(raw) ? raw[0] : raw;

        const isPlaying = track['@attr']?.nowplaying === 'true';
        const trackName = track.name || 'Unknown Track';
        const artist    = track.artist?.['#text'] || 'Unknown Artist';
        const album     = track.album?.['#text'] || '';
        const images    = track.image || [];
        const artUrl    = (images.find(i => i.size === 'large') || images.find(i => i.size === 'medium') || {})['#text'] || '';

        const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

        let signalHtml;
        if (isPlaying) {
          signalHtml = `<span style="color:#EF4444;font-size:0.75rem;letter-spacing:0.12em;animation:scada-warn-blink 1.2s infinite;display:inline-block;">● NOW PLAYING</span>`;
        } else {
          const ts = parseInt(track.date?.uts || '0') * 1000;
          const diff = Date.now() - ts;
          const mins = Math.floor(diff / 60000);
          const hours = Math.floor(mins / 60);
          const days = Math.floor(hours / 24);
          const ago = ts ? (days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : `${mins}m ago`) : '—';
          signalHtml = `<span style="color:var(--muzzle-grey);font-size:0.75rem;letter-spacing:0.08em;">LAST PLAYED ${ago}</span>`;
        }

        const eqBars = isPlaying ? `
          <div class="eq-bars" style="margin-top:0.6rem;justify-content:center;">
            <div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div>
          </div>` : '';

        const artHtml = artUrl
          ? `<img src="${esc(artUrl)}" alt="Album art" style="width:80px;height:80px;border-radius:4px;object-fit:cover;border:1px solid color-mix(in srgb,var(--throat-teal) 40%,transparent);">`
          : `<div style="font-size:3rem;line-height:1;">🎵</div>`;

        const albumRow = album ? `
          <div class="scada-metric">
            <span class="scada-label">Album</span>
            <span class="scada-value" style="font-size:0.85rem;color:var(--secondary);text-shadow:none;">${esc(album)}</span>
          </div>` : '';

        lastfmContainer.innerHTML = `
          <div class="scada-panel fade-in" style="max-width:700px;margin:0 auto;">
            <div style="width:100%;">
              <div class="scada-header">
                <span>[ AUDIO SIGNAL MONITOR ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status">
                  <div class="scada-status-dot"></div>
                  ${isPlaying ? 'TRANSMITTING' : 'ACTIVE'}
                </span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="flex-direction:row;gap:1.2rem;justify-content:center;padding:1.2rem;min-width:200px;">
                  <div style="display:flex;flex-direction:column;align-items:center;">
                    ${artHtml}
                    ${eqBars}
                  </div>
                  <div style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;text-align:left;">
                    <div class="scada-label" style="margin-bottom:0.3rem;">SIGNAL</div>
                    ${signalHtml}
                  </div>
                </div>
                <div class="scada-grid" style="flex:1;">
                  <div class="scada-metric" style="grid-column:1/-1;">
                    <span class="scada-label">Track</span>
                    <span class="scada-value" style="font-size:1.05rem;color:var(--eye-highlight);">${esc(trackName)}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Artist</span>
                    <span class="scada-value" style="font-size:0.95rem;text-shadow:none;">${esc(artist)}</span>
                  </div>
                  ${albumRow}
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();

      } catch (e) {
        console.error('Last.fm fetch failed:', e);
        lastfmContainer.innerHTML = `
          <div class="scada-panel fade-in" style="max-width:700px;margin:0 auto;">
            <div style="width:100%;">
              <div class="scada-header">
                <span>[ AUDIO SIGNAL MONITOR ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status" style="color:#f04747;text-shadow:0 0 5px #f04747;">
                  <div class="scada-status-dot" style="background-color:#f04747;box-shadow:0 0 8px #f04747;animation:none;"></div>
                  OFFLINE
                </span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width:200px;">
                  <div style="font-size:3rem;line-height:1;">🎵</div>
                </div>
                <div class="scada-grid" style="flex:1;">
                  <div class="scada-metric" style="grid-column:1/-1;">
                    <span class="scada-label">Field State</span>
                    <span class="scada-value" style="font-size:1rem;color:var(--muzzle-grey);text-shadow:none;">Audio signal lost.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      }
    }

    fetchLastFm();

    // ── 6. Expedition Briefing (Con Season from events.json) ─────────────
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

    // ── 6. Field Metrics (events.json — miles + gallery) ─────────────────
    async function fetchFieldMetrics() {
      const container = document.getElementById('field-metrics-widget');
      try {
        const res = await fetch('/data/events.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const events = await res.json();

        const currentYear = new Date().getFullYear().toString();
        let totalMiles = 0, ytdMiles = 0, totalEvents = 0, ytdEvents = 0, galleriesPublished = 0;
        let latestEntry = null, latestDate = null, latestAlbumName = null, latestAlbumUrl = null;

        events.forEach(loc => {
          loc.history.forEach(entry => {
            totalMiles += entry.roundTripMiles || 0;
            totalEvents++;
            if (entry.year === currentYear) {
              ytdMiles += entry.roundTripMiles || 0;
              ytdEvents++;
            }
            if (entry.albums) {
              Object.entries(entry.albums).forEach(([name, url]) => {
                if (url && url !== '#') {
                  galleriesPublished++;
                  const yearMatch = entry.dates.match(/\b(20\d{2})\b/);
                  const mdMatch = entry.dates.match(/([A-Za-z]+)\s+(\d+)/);
                  const dateObj = yearMatch && mdMatch
                    ? new Date(`${mdMatch[1]} ${mdMatch[2]}, ${yearMatch[1]}`)
                    : yearMatch ? new Date(`${yearMatch[1]}-01-01`) : null;
                  if (!latestDate || (dateObj && dateObj > latestDate)) {
                    latestDate = dateObj;
                    latestEntry = { ...entry, locationName: loc.locationName };
                    latestAlbumName = name;
                    latestAlbumUrl = url;
                  }
                }
              });
            }
          });
        });

        const latestHtml = latestAlbumUrl ? `
          <div class="scada-metric" style="grid-column: 1 / -1;">
            <span class="scada-label">Latest Transmission</span>
            <a href="${latestAlbumUrl}" target="_blank" rel="noopener" style="text-decoration: none; display: block;">
              <span class="scada-value" style="font-size: 1rem; color: #FF6700; text-shadow: 0 0 8px rgb(255 103 0 / 60%);">
                📷 ${latestAlbumName} — ${latestEntry.locationName}
                <span style="font-size: 0.7em; color: var(--muzzle-grey); text-shadow: none; margin-left: 6px;">[→ OPEN GALLERY]</span>
              </span>
            </a>
          </div>` : '';

        container.innerHTML = `
          <div class="scada-panel fade-in">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ FIELD METRICS ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> LOGGED</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.5rem;">🛣️</div>
                  <div class="scada-value" style="font-size: 2rem; justify-content: center;">${totalMiles.toLocaleString()}</div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">Total<br>Miles Logged</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric">
                    <span class="scada-label">YTD Miles</span>
                    <span class="scada-value">${ytdMiles.toLocaleString()} <span style="font-size: 0.65em; opacity: 0.6;">mi</span></span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Events — All Time</span>
                    <span class="scada-value">${totalEvents}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">YTD Events</span>
                    <span class="scada-value">${ytdEvents}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Galleries Published</span>
                    <span class="scada-value">${galleriesPublished}</span>
                  </div>
                  ${latestHtml}
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Field metrics fetch failed:', e);
        container.remove();
      }
    }
    fetchFieldMetrics();

    // ── 7. Lunar Phase (computed — no API) ───────────────────────────────
    function renderLunar() {
      const container = document.getElementById('lunar-widget');
      try {
        const SYNODIC = 29.53058867; // mean synodic month, days
        const refNew = Date.UTC(2000, 0, 6, 18, 14, 0); // reference new moon
        const now = Date.now();
        let phase = (((now - refNew) / 86400000) % SYNODIC) / SYNODIC;
        if (phase < 0) phase += 1;
        const age = phase * SYNODIC;
        const illum = Math.round((1 - Math.cos(2 * Math.PI * phase)) / 2 * 100);

        const phases = [
          { max: 0.0196, name: 'New Moon', icon: '🌑' },
          { max: 0.2304, name: 'Waxing Crescent', icon: '🌒' },
          { max: 0.2696, name: 'First Quarter', icon: '🌓' },
          { max: 0.4804, name: 'Waxing Gibbous', icon: '🌔' },
          { max: 0.5196, name: 'Full Moon', icon: '🌕' },
          { max: 0.7304, name: 'Waning Gibbous', icon: '🌖' },
          { max: 0.7696, name: 'Last Quarter', icon: '🌗' },
          { max: 0.9804, name: 'Waning Crescent', icon: '🌘' },
          { max: 1.0001, name: 'New Moon', icon: '🌑' },
        ];
        const p = phases.find(x => phase < x.max) || phases[phases.length - 1];

        const daysToFull = ((0.5 - phase + 1) % 1) * SYNODIC;
        const daysToNew = ((1 - phase) % 1) * SYNODIC;
        const fmtDate = d => new Date(now + d * 86400000).toLocaleDateString([], { month: 'short', day: 'numeric' });

        container.innerHTML = `
          <div class="scada-panel fade-in">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ LUNAR PHASE ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> TRACKING</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 3.2rem; line-height: 1.1; margin-bottom: 0.4rem;">${p.icon}</div>
                  <div class="scada-value" style="font-size: 2rem; justify-content: center;">${illum}<span style="font-size: 1rem; opacity: 0.8;">%</span></div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">Illuminated</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Phase</span>
                    <span class="scada-value" style="font-size: 1.05rem;">${p.name}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Moon Age</span>
                    <span class="scada-value" style="font-size: 0.95rem;">${age.toFixed(1)} <span style="font-size: 0.65em; opacity: 0.6;">days</span></span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Cycle</span>
                    <span class="scada-value" style="font-size: 0.95rem;">${Math.round(phase * 100)}%</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Next Full</span>
                    <span class="scada-value" style="font-size: 0.9rem; color: #E1F5FE; text-shadow: 0 0 8px rgb(225 245 254 / 50%);">${fmtDate(daysToFull)} <span style="font-size: 0.7em; color: var(--muzzle-grey); text-shadow: none;">(${Math.round(daysToFull)}d)</span></span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Next New</span>
                    <span class="scada-value" style="font-size: 0.9rem;">${fmtDate(daysToNew)} <span style="font-size: 0.7em; color: var(--muzzle-grey); text-shadow: none;">(${Math.round(daysToNew)}d)</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Lunar render failed:', e);
        container.remove();
      }
    }
    renderLunar();

    // ── 8. Seismic Monitor (USGS — no auth) ──────────────────────────────
    async function fetchSeismic() {
      const container = document.getElementById('seismic-widget');
      const HOME = { lat: 39.2904, lon: -76.6122 }; // Baltimore base camp
      try {
        const res = await fetchWithTimeout('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const quakes = data.features || [];
        if (quakes.length === 0) throw new Error('No recent events');

        const haversine = (lat1, lon1, lat2, lon2) => {
          const R = 3958.8, toRad = d => d * Math.PI / 180;
          const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
          const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        let largest = quakes[0], nearest = quakes[0], nearestDist = Infinity;
        quakes.forEach(q => {
          if ((q.properties.mag ?? -99) > (largest.properties.mag ?? -99)) largest = q;
          const [lon, lat] = q.geometry.coordinates;
          const d = haversine(HOME.lat, HOME.lon, lat, lon);
          if (d < nearestDist) { nearestDist = d; nearest = q; }
        });

        const magColor = m => m >= 6 ? '#f04747' : m >= 5 ? '#FF6700' : m >= 4 ? '#FFB300' : m >= 3 ? '#FFD700' : '#7DC26B';
        const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

        const lg = largest.properties;
        const nr = nearest.properties;
        const lgTime = new Date(lg.time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const isAlert = (lg.mag ?? 0) >= 6;

        container.innerHTML = `
          <div class="scada-panel fade-in${isAlert ? ' critical-alert' : ''}">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ SEISMIC MONITOR ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> ${isAlert ? 'ALERT' : 'LOGGED'}</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.4rem;">🌐</div>
                  <div class="scada-value" style="font-size: 2.2rem; justify-content: center; color: ${magColor(lg.mag)}; text-shadow: 0 0 10px color-mix(in srgb, ${magColor(lg.mag)} 60%, transparent);">M${(lg.mag ?? 0).toFixed(1)}</div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">Strongest<br>Past 24h</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric">
                    <span class="scada-label">Events (M2.5+)</span>
                    <span class="scada-value">${quakes.length}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Strongest When</span>
                    <span class="scada-value" style="font-size: 0.85rem; color: #B0BEC5; text-shadow: none;">${lgTime}</span>
                  </div>
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Strongest Location</span>
                    <span class="scada-value" style="font-size: 0.9rem; color: var(--eye-highlight); text-shadow: none;">${esc(lg.place || 'Unknown')}</span>
                  </div>
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Nearest to Base Camp</span>
                    <span class="scada-value" style="font-size: 0.88rem;">M${(nr.mag ?? 0).toFixed(1)} · ${Math.round(nearestDist).toLocaleString()} mi <span style="font-size: 0.8em; color: var(--muzzle-grey); text-shadow: none;">— ${esc(nr.place || 'Unknown')}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Seismic fetch failed:', e);
        container.remove();
      }
    }
    fetchSeismic();

    // ── 9. Geomagnetic Field / Aurora (NOAA SWPC) ────────────────────────
    async function fetchGeomag() {
      const container = document.getElementById('geomag-widget');
      try {
        const res = await fetchWithTimeout('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json(); // array of { time_tag, Kp, a_running, station_count }
        const latest = rows[rows.length - 1];
        const kp = parseFloat(latest.Kp);
        if (isNaN(kp)) throw new Error('No Kp reading');

        let cond, color, aurora;
        if (kp < 3)      { cond = 'QUIET';     color = '#7DC26B'; aurora = 'Unlikely'; }
        else if (kp < 5) { cond = 'UNSETTLED'; color = '#FFD700'; aurora = 'High latitudes only'; }
        else if (kp < 6) { cond = 'G1 STORM';  color = '#FFB300'; aurora = 'Possible — high lat'; }
        else if (kp < 7) { cond = 'G2 STORM';  color = '#FF6700'; aurora = 'Likely — high lat'; }
        else if (kp < 8) { cond = 'G3 STORM';  color = '#f04747'; aurora = 'Likely — mid lat'; }
        else             { cond = 'G4+ STORM'; color = '#B39DDB'; aurora = 'Possible — low lat'; }

        const isAlert = kp >= 7;
        const fmtWhen = new Date(latest.time_tag + 'Z').toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        container.innerHTML = `
          <div class="scada-panel fade-in${isAlert ? ' critical-alert' : ''}">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ GEOMAGNETIC FIELD ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> ${isAlert ? 'STORM' : 'MONITORING'}</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.4rem;">🧲</div>
                  <div class="scada-value" style="font-size: 2.2rem; justify-content: center; color: ${color}; text-shadow: 0 0 10px color-mix(in srgb, ${color} 60%, transparent);">Kp ${kp.toFixed(1)}</div>
                  <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: ${color}; opacity: 0.85; text-align: center; margin-top: 0.3rem;">${cond}</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric">
                    <span class="scada-label">Kp Index</span>
                    <span class="scada-value" style="color: ${color}; text-shadow: 0 0 8px color-mix(in srgb, ${color} 60%, transparent);">${kp.toFixed(2)} <span style="font-size: 0.6em; opacity: 0.6;">/ 9</span></span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Condition</span>
                    <span class="scada-value" style="font-size: 0.9rem; color: ${color}; text-shadow: none;">${cond}</span>
                  </div>
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Aurora Visibility</span>
                    <span class="scada-value" style="font-size: 0.95rem; color: #B39DDB; text-shadow: 0 0 8px rgb(179 157 219 / 50%);">🌌 ${aurora}</span>
                  </div>
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Last Reading</span>
                    <span class="scada-value" style="font-size: 0.82rem; color: var(--muzzle-grey); text-shadow: none;">${fmtWhen}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Geomagnetic fetch failed:', e);
        container.remove();
      }
    }
    fetchGeomag();

    // ── 10. Expedition Streak (events.json — computed) ───────────────────
    async function fetchStreak() {
      const container = document.getElementById('streak-widget');
      try {
        const res = await fetch('/data/events.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const events = await res.json();
        const now = new Date();

        const dates = [];
        const years = new Set();
        events.forEach(loc => loc.history.forEach(entry => {
          const ym = entry.dates.match(/\b(20\d{2})\b/);
          const md = entry.dates.match(/([A-Za-z]+)\s+(\d+)/);
          if (ym && parseInt(ym[1]) <= now.getFullYear()) years.add(parseInt(ym[1])); // tenure counts years already reached, not future plans
          if (ym && md) {
            const d = new Date(`${md[1]} ${md[2]}, ${ym[1]}`);
            if (!isNaN(d)) dates.push(d);
          }
        }));
        if (dates.length === 0) throw new Error('No dated events');
        dates.sort((a, b) => a - b);

        const past = dates.filter(d => d <= now);
        const future = dates.filter(d => d > now);
        const lastDate = past[past.length - 1] || null;
        const nextDate = future[0] || null;
        const daysSince = lastDate ? Math.floor((now - lastDate) / 86400000) : null;
        const daysUntil = nextDate ? Math.ceil((nextDate - now) / 86400000) : null;

        const yrs = [...years].sort((a, b) => a - b);
        let longest = 1, run = 1;
        for (let i = 1; i < yrs.length; i++) {
          if (yrs[i] === yrs[i - 1] + 1) { run++; longest = Math.max(longest, run); }
          else run = 1;
        }
        let curStreak = yrs.length ? 1 : 0;
        for (let i = yrs.length - 1; i > 0; i--) {
          if (yrs[i] === yrs[i - 1] + 1) curStreak++; else break;
        }
        const yearsActive = yrs.length;
        const firstYear = yrs[0];

        container.innerHTML = `
          <div class="scada-panel fade-in">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ EXPEDITION STREAK ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> ON TRAIL</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.4rem;">🐾</div>
                  <div class="scada-value" style="font-size: 2.2rem; justify-content: center;">${yearsActive}</div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">Years<br>on the Trail</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric">
                    <span class="scada-label">Days Since Last</span>
                    <span class="scada-value">${daysSince !== null ? daysSince : '—'}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Days Until Next</span>
                    <span class="scada-value" style="color: #FF6700; text-shadow: 0 0 8px rgb(255 103 0 / 60%);">${daysUntil !== null ? daysUntil : '—'}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Longest Streak</span>
                    <span class="scada-value" style="font-size: 0.95rem;">${longest} yr${longest !== 1 ? 's' : ''}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Current Streak</span>
                    <span class="scada-value" style="font-size: 0.95rem;">${curStreak} yr${curStreak !== 1 ? 's' : ''}</span>
                  </div>
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">On the Trail Since</span>
                    <span class="scada-value" style="font-size: 1rem; color: var(--eye-highlight); text-shadow: none;">${firstYear}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Streak fetch failed:', e);
        container.remove();
      }
    }
    fetchStreak();

    // ── 11. Solar Tracker (Open-Meteo daylight) ──────────────────────────
    async function fetchSolar() {
      const container = document.getElementById('solar-widget');
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,daylight_duration&past_days=1&forecast_days=1&timezone=America%2FNew_York`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = (await res.json()).daily;
        const ti = d.time.length - 1; // today is the last entry (yesterday is first)
        const todaySec = d.daylight_duration[ti];
        const deltaMin = (todaySec - d.daylight_duration[ti - 1]) / 60;

        const sunrise = new Date(d.sunrise[ti]);
        const sunset = new Date(d.sunset[ti]);
        const noon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
        const fmtT = t => t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dayLen = `${Math.floor(todaySec / 3600)}h ${Math.round((todaySec % 3600) / 60)}m`;

        const gaining = deltaMin >= 0;
        const deltaColor = gaining ? '#7DC26B' : '#FF8F00';
        const deltaText = `${gaining ? '▲ +' : '▼ −'}${Math.abs(deltaMin).toFixed(1)} min`;

        const now = Date.now();
        const isDay = now >= sunrise.getTime() && now <= sunset.getTime();
        let progress = (now - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime());
        progress = Math.round(Math.max(0, Math.min(1, progress)) * 100);
        const statusText = isDay ? `☀️ Daytime · ${progress}% elapsed` : '🌙 Nighttime';

        container.innerHTML = `
          <div class="scada-panel fade-in">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ SOLAR TRACKER ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> ${isDay ? 'DAYLIGHT' : 'NIGHT'}</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.4rem;">${isDay ? '☀️' : '🌙'}</div>
                  <div class="scada-value" style="font-size: 1.7rem; justify-content: center;">${dayLen}</div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">Daylight Today</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric">
                    <span class="scada-label">Sunrise</span>
                    <span class="scada-value" style="font-size: 0.95rem;">${fmtT(sunrise)}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Sunset</span>
                    <span class="scada-value" style="font-size: 0.95rem;">${fmtT(sunset)}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Solar Noon</span>
                    <span class="scada-value" style="font-size: 0.95rem; color: #FFD700; text-shadow: 0 0 8px rgb(255 215 0 / 50%);">${fmtT(noon)}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">vs Yesterday</span>
                    <span class="scada-value" style="font-size: 0.9rem; color: ${deltaColor}; text-shadow: 0 0 8px color-mix(in srgb, ${deltaColor} 60%, transparent);">${deltaText}</span>
                  </div>
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Current</span>
                    <span class="scada-value" style="font-size: 0.95rem;">${statusText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Solar fetch failed:', e);
        container.remove();
      }
    }
    fetchSolar();

    // ── 12. Tidal Station (NOAA CO-OPS — Baltimore Harbor) ───────────────
    async function fetchTides() {
      const container = document.getElementById('tidal-widget');
      try {
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const begin = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
        const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${begin}&range=48&station=8574680&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const preds = ((await res.json()).predictions || []).map(p => ({
          time: new Date(p.t.replace(' ', 'T')),
          v: parseFloat(p.v),
          type: p.type,
        }));
        if (preds.length === 0) throw new Error('No predictions');

        const upcoming = preds.filter(p => p.time > now);
        const next = upcoming[0];
        if (!next) throw new Error('No upcoming tide');
        const nextHigh = upcoming.find(p => p.type === 'H');
        const nextLow = upcoming.find(p => p.type === 'L');
        const rising = next.type === 'H';

        const fmtT = t => t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const fmtIn = t => {
          const mins = Math.round((t - now) / 60000);
          const h = Math.floor(mins / 60), m = mins % 60;
          return h > 0 ? `${h}h ${m}m` : `${m}m`;
        };
        const trendColor = rising ? '#26C6DA' : '#FFB300';

        container.innerHTML = `
          <div class="scada-panel fade-in">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ TIDAL STATION ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> ${rising ? 'FLOODING' : 'EBBING'}</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.4rem;">🌊</div>
                  <div class="scada-value" style="font-size: 1.6rem; justify-content: center; color: ${trendColor}; text-shadow: 0 0 10px color-mix(in srgb, ${trendColor} 60%, transparent);">${rising ? '▲ RISING' : '▼ FALLING'}</div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">${next.type === 'H' ? 'High' : 'Low'} in ${fmtIn(next.time)}</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric">
                    <span class="scada-label">Next High</span>
                    <span class="scada-value" style="font-size: 0.92rem;">${nextHigh ? `${fmtT(nextHigh.time)} <span style="font-size:0.75em;opacity:0.65;">${nextHigh.v.toFixed(1)} ft</span>` : '—'}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Next Low</span>
                    <span class="scada-value" style="font-size: 0.92rem;">${nextLow ? `${fmtT(nextLow.time)} <span style="font-size:0.75em;opacity:0.65;">${nextLow.v.toFixed(1)} ft</span>` : '—'}</span>
                  </div>
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Station</span>
                    <span class="scada-value" style="font-size: 0.9rem; color: var(--secondary); text-shadow: none;">Baltimore Harbor (8574680)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Tide fetch failed:', e);
        container.remove();
      }
    }
    fetchTides();

    // ── 13. ISS Tracker (wheretheiss.at) ─────────────────────────────────
    async function fetchISS() {
      const container = document.getElementById('iss-widget');
      const HOME = { lat: 39.2904, lon: -76.6122 };
      try {
        const res = await fetchWithTimeout('https://api.wheretheiss.at/v1/satellites/25544');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();

        const R = 6371; // km
        const toRad = x => x * Math.PI / 180;
        const dLat = toRad(d.latitude - HOME.lat), dLon = toRad(d.longitude - HOME.lon);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(HOME.lat)) * Math.cos(toRad(d.latitude)) * Math.sin(dLon / 2) ** 2;
        const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distMi = distKm * 0.621371;
        const overhead = distKm < 2260; // within the ISS ground footprint → above the horizon

        const visMap = {
          daylight: { label: 'SUNLIT', color: '#FFD700' },
          eclipsed: { label: 'IN SHADOW', color: 'var(--muzzle-grey)' },
          night: { label: 'NIGHT SIDE', color: '#B39DDB' },
        };
        const vis = visMap[d.visibility] || { label: String(d.visibility || '—').toUpperCase(), color: '#00E5FF' };
        const hemiNS = d.latitude >= 0 ? 'N' : 'S';
        const hemiEW = d.longitude >= 0 ? 'E' : 'W';

        container.innerHTML = `
          <div class="scada-panel fade-in${overhead ? ' critical-alert' : ''}">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ ISS TRACKER ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> ${overhead ? 'OVERHEAD' : 'TRACKING'}</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.4rem;">🛰️</div>
                  <div class="scada-value" style="font-size: 1.9rem; justify-content: center;">${Math.round(distMi).toLocaleString()}<span style="font-size: 0.9rem; opacity: 0.8;"> mi</span></div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">From Base Camp</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric">
                    <span class="scada-label">Latitude</span>
                    <span class="scada-value" style="font-size: 0.92rem;">${Math.abs(d.latitude).toFixed(2)}° ${hemiNS}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Longitude</span>
                    <span class="scada-value" style="font-size: 0.92rem;">${Math.abs(d.longitude).toFixed(2)}° ${hemiEW}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Altitude</span>
                    <span class="scada-value" style="font-size: 0.92rem;">${Math.round(d.altitude)} <span style="font-size:0.7em;opacity:0.6;">km</span></span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Velocity</span>
                    <span class="scada-value" style="font-size: 0.92rem;">${Math.round(d.velocity * 0.621371).toLocaleString()} <span style="font-size:0.7em;opacity:0.6;">mph</span></span>
                  </div>
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">Sunlight & Visibility</span>
                    <span class="scada-value" style="font-size: 0.95rem; color: ${vis.color}; text-shadow: 0 0 8px color-mix(in srgb, ${vis.color} 55%, transparent);">${vis.label}${overhead ? ' · ABOVE HORIZON' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('ISS fetch failed:', e);
        container.remove();
      }
    }
    fetchISS();

    // ── 14. On This Day (events.json anniversaries) ──────────────────────
    async function fetchOnThisDay() {
      const container = document.getElementById('onthisday-widget');
      try {
        const res = await fetch('/data/events.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const events = await res.json();
        const now = new Date();
        const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const anns = [];
        events.forEach(loc => loc.history.forEach(entry => {
          const ym = entry.dates.match(/\b(20\d{2})\b/);
          const md = entry.dates.match(/([A-Za-z]+)\s+(\d+)/);
          if (!ym || !md) return;
          const orig = new Date(`${md[1]} ${md[2]}, ${ym[1]}`);
          if (isNaN(orig) || orig >= today0) return; // only past events have anniversaries
          let anniv = new Date(now.getFullYear(), orig.getMonth(), orig.getDate());
          if (anniv < today0) anniv = new Date(now.getFullYear() + 1, orig.getMonth(), orig.getDate());
          anns.push({
            eventName: entry.eventName,
            locationName: loc.locationName,
            anniv,
            daysUntil: Math.round((anniv - today0) / 86400000),
            years: anniv.getFullYear() - orig.getFullYear(),
          });
        }));
        if (anns.length === 0) throw new Error('No past events');
        anns.sort((a, b) => a.daysUntil - b.daysUntil);

        const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const todayHit = anns.find(a => a.daysUntil === 0);
        const feature = todayHit || anns[0];
        const fmtDate = d => d.toLocaleDateString([], { month: 'short', day: 'numeric' });

        const heroNum = todayHit ? todayHit.years : feature.daysUntil;
        const heroLabel = todayHit ? 'Years Ago<br>Today' : 'Days to Next<br>Anniversary';
        const heroIcon = todayHit ? '🎉' : '📖';

        container.innerHTML = `
          <div class="scada-panel fade-in">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ FIELD JOURNAL ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot" ${todayHit ? '' : 'style="animation: none; opacity: 0.6;"'}></div> ${todayHit ? 'ANNIVERSARY' : 'ARCHIVED'}</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.4rem;">${heroIcon}</div>
                  <div class="scada-value" style="font-size: 2.2rem; justify-content: center;">${heroNum}</div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">${heroLabel}</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  <div class="scada-metric" style="grid-column: 1 / -1;">
                    <span class="scada-label">${todayHit ? 'On This Day' : 'Next Anniversary'}</span>
                    <span class="scada-value" style="font-size: 1rem; color: var(--eye-highlight); text-shadow: none;">${esc(feature.eventName)} — ${esc(feature.locationName)}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">${todayHit ? 'Date' : 'Falls On'}</span>
                    <span class="scada-value" style="font-size: 0.92rem;">${fmtDate(feature.anniv)}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Anniversary</span>
                    <span class="scada-value" style="font-size: 0.92rem; color: #FF6700; text-shadow: 0 0 8px rgb(255 103 0 / 50%);">${feature.years} yr${feature.years !== 1 ? 's' : ''}${todayHit ? '' : ` · in ${feature.daysUntil}d`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('On This Day fetch failed:', e);
        container.remove();
      }
    }
    fetchOnThisDay();

    // ── 15. Listening Log (Audiobookshelf via /api/audiobookshelf) ───────
    async function fetchAudiobookshelf() {
      const container = document.getElementById('abs-widget');
      try {
        const res = await fetchWithTimeout('/api/audiobookshelf');
        if (!res.ok) throw new Error('Audiobookshelf API failed');
        const { stats, me } = await res.json();
        if (!stats) throw new Error('No listening stats');

        const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const fmtDur = s => {
          const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60);
          return h > 0 ? `${h}h ${m}m` : `${m}m`;
        };

        const totalHours = Math.round((stats.totalTime || 0) / 3600);
        const todaySec = stats.today || 0;
        const recent = (stats.recentSessions || [])[0];
        const progressArr = me?.mediaProgress || [];
        const finished = progressArr.filter(p => p.isFinished).length;
        const inProgress = progressArr.filter(p => !p.isFinished && (p.progress || 0) > 0).length;

        let nowHtml = '';
        if (recent) {
          const mp = progressArr.find(p => p.libraryItemId === recent.libraryItemId);
          const pct = mp ? Math.round((mp.progress || 0) * 100) : null;
          nowHtml = `
            <div class="scada-metric" style="grid-column: 1 / -1;">
              <span class="scada-label">Recently Listened</span>
              <span class="scada-value" style="font-size: 1rem; color: var(--eye-highlight); text-shadow: none;">${esc(recent.displayTitle || 'Unknown')}${pct !== null ? ` <span style="font-size: 0.72em; color: var(--muzzle-grey);">${pct}%</span>` : ''}</span>
            </div>
            ${recent.displayAuthor ? `<div class="scada-metric" style="grid-column: 1 / -1;"><span class="scada-label">Author</span><span class="scada-value" style="font-size: 0.9rem; text-shadow: none;">${esc(recent.displayAuthor)}</span></div>` : ''}`;
        }

        container.innerHTML = `
          <div class="scada-panel fade-in">
            <div style="width: 100%;">
              <div class="scada-header">
                <span>[ LISTENING LOG ]</span>
                <span class="scada-time">--:--:--</span>
                <span class="scada-status"><div class="scada-status-dot"></div> ${todaySec > 0 ? 'ACTIVE' : 'LOGGED'}</span>
              </div>
              <div class="scada-body">
                <div class="scada-primary" style="min-width: 140px;">
                  <div style="font-size: 2.8rem; line-height: 1.1; margin-bottom: 0.4rem;">🎧</div>
                  <div class="scada-value" style="font-size: 2rem; justify-content: center;">${totalHours.toLocaleString()}<span style="font-size: 0.9rem; opacity: 0.8;">h</span></div>
                  <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, #00E5FF 70%, #fff); opacity: 0.7; text-align: center; margin-top: 0.3rem;">Total Listened</div>
                </div>
                <div class="scada-grid" style="flex: 1;">
                  ${nowHtml}
                  <div class="scada-metric">
                    <span class="scada-label">Today</span>
                    <span class="scada-value" style="font-size: 0.95rem; color: #1DB954; text-shadow: 0 0 8px rgb(29 185 84 / 50%);">${fmtDur(todaySec)}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">In Progress</span>
                    <span class="scada-value">${inProgress}</span>
                  </div>
                  <div class="scada-metric">
                    <span class="scada-label">Finished</span>
                    <span class="scada-value">${finished}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        updateScadaClocks();
      } catch (e) {
        console.error('Audiobookshelf fetch failed:', e);
        container.remove();
      }
    }
    fetchAudiobookshelf();
  });
</script>
