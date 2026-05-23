---
title: "Pulse"
description: "Live signals and recent dashboard activity."
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
  }
  .discord-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(20%) contrast(120%);
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
  /* CRT Scanline Overlay */
  .scada-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      color-mix(in srgb, #00E5FF 4%, transparent) 2px,
      color-mix(in srgb, #00E5FF 4%, transparent) 4px
    );
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
    gap: 1px; /* Creates clean 1px grid lines */
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
  .scada-status-dot {
    width: 8px;
    height: 8px;
    background-color: #00FF00;
    border-radius: 50%;
    box-shadow: 0 0 8px #00FF00;
    animation: scada-pulse 2s infinite;
  }
  @keyframes scada-pulse {
    0% { opacity: 1; box-shadow: 0 0 8px #00FF00; }
    50% { opacity: 0.4; box-shadow: 0 0 2px #00FF00; }
    100% { opacity: 1; box-shadow: 0 0 8px #00FF00; }
  }
  @media (max-width: 600px) {
    .scada-body { flex-direction: column; }
    .scada-grid { border-left: none; border-top: 1px solid color-mix(in srgb, #00E5FF 30%, transparent); }
  }
</style>

<div class="bio-container" style="text-align: center; margin-bottom: 3rem;">
  <h2 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--primary);">Field Conditions</h2>
  <div id="discord-widget" style="font-size: 1.1rem; margin-bottom: 1.5rem;">
    <span style="opacity: 0.7;">Checking connection...</span>
  </div>
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; margin: 0 auto;">
    <div id="system-status-weather" style="margin: 0; text-align: center;">
      <div id="weather-loading" style="opacity: 0.7; font-size: 1.1rem;">Gathering atmospheric data...</div>
      <div id="weather-data" style="display: none; width: 100%; max-width: 700px; margin: 0 auto;">
        <div class="scada-panel">
          <div style="width: 100%;">
            <div class="scada-header">
              <span>[ ATMOSPHERIC SENSOR TELEMETRY ]</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<h2 class="upcoming-section-title" style="margin-top: 1rem;">Field Notes</h2>

<div id="social-feed-grid" class="feed-scroll">
  <div class="loading-feed">Establishing connection to signals...</div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Discord Lanyard Widget (Client-Side)
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
              activitiesHtml += `<div class="scada-metric" style="grid-column: 1 / -1;"><span class="scada-label">Status Log</span><span class="scada-value" style="font-size: 1rem; color: #fff; text-shadow: none;">${emoji} <span>${text}</span></span></div>`;
            }
          }

          if (spotify) {
            activitiesHtml += `<div class="scada-metric"><span class="scada-label">Audio Stream</span><span class="scada-value" style="font-size: 1rem; color: #1DB954; text-shadow: 0 0 8px rgb(29 185 84 / 60%);">🎵 <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; display: inline-block; vertical-align: bottom;">${spotify.song}</span></span></div>`;
          } else if (playingActivity) {
            activitiesHtml += `<div class="scada-metric"><span class="scada-label">Active Process</span><span class="scada-value" style="font-size: 1rem; color: var(--eye-highlight); text-shadow: 0 0 8px color-mix(in srgb, var(--eye-highlight) 60%, transparent);">🎮 <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; display: inline-block; vertical-align: bottom;">${playingActivity.name}</span></span></div>`;
          }

          if (isVoice) {
            activitiesHtml += `<div class="scada-metric"><span class="scada-label">Comms Channel</span><span class="scada-value" style="font-size: 1rem;"><div class="eq-bars" style="margin-right: 6px; margin-bottom: 2px;"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div> ACTIVE</span></div>`;
          }

          let clientHtml = '';
          if (isOnline) {
            let activeClients = [];
            if (data.active_on_discord_desktop) activeClients.push('DSK');
            if (data.active_on_discord_mobile) activeClients.push('MOB');
            if (data.active_on_discord_web) activeClients.push('WEB');

            if (activeClients.length > 0) {
              clientHtml = `<div class="scada-metric"><span class="scada-label">Active Nodes</span><span class="scada-value" style="font-size: 1rem;">[ ${activeClients.join(' / ')} ]</span></div>`;
            }
          }

          if (!activitiesHtml && !clientHtml) {
            activitiesHtml = `<div class="scada-metric" style="grid-column: 1 / -1;"><span class="scada-label">System State</span><span class="scada-value" style="font-size: 1rem; color: var(--muzzle-grey); text-shadow: none;">Awaiting telemetry...</span></div>`;
          }

          discordContainer.innerHTML = `
            <div class="scada-panel fade-in" style="max-width: 700px; margin: 0 auto;">
              <div style="width: 100%;">
                <div class="scada-header">
                  <span>[ COMM-LINK TELEMETRY ]</span>
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
                      <div class="scada-label" style="margin-bottom: 0.2rem;">OPERATOR ID</div>
                      <div class="scada-value" style="font-size: 1.4rem;">${username}</div>
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
        discordContainer.innerHTML = '<span style="color: var(--muzzle-grey);">Signal lost</span>';
      }
    }

    fetchDiscord();
    setInterval(fetchDiscord, 60000); // Check discord every 60 seconds

    // 2. Social Feeds (Bluesky + Pixelfed Grid)
    const feedContainer = document.getElementById('social-feed-grid');

    // Fetch latest 10 from Bluesky
    async function fetchBluesky() {
      try {
        const res = await fetch('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=redpanda.pet&filter=posts_no_replies&limit=20');
        const data = await res.json();

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

    // Fetch latest 10 from Pixelfed
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

    // Fetch latest 10 from Mastodon
    async function fetchMastodon() {
      try {
        // exclude_replies=true filters out thread spam, just like we do for Bluesky
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

          // Strip HTML tags for clean text preview
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

    // Load, combine, and render the feeds into the grid
    Promise.all([fetchBluesky(), fetchPixelfed(), fetchMastodon()]).then(([bsky, pxfed, mstdn]) => {
      let combined = [...bsky, ...pxfed, ...mstdn]
        .filter(post => post.date && !isNaN(post.date.getTime()))
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 20); // Show latest 20 items combined

      if (combined.length === 0) {
        feedContainer.innerHTML = '<div class="loading-feed">Could not retrieve signals at this time.</div>';
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

    // 3. Weather Widget (Open-Meteo)
    const lat = 39.2904; // Baltimore, MD
    const lon = -76.6122;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,wind_direction_10m,cloud_cover&daily=sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York`;

    function getWindDirection(degrees) {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(degrees / 22.5) % 16;
      return directions[index];
    }

    fetch(weatherUrl)
      .then(async response => {
        const data = await response.json();
        if (!response.ok || data.error) throw new Error(data.reason || `HTTP ${response.status}`);
        return data;
      })
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
        // Apply drop-shadow for outline effect. A slightly larger radius (8px) is used here due to the 3.5rem font size.
        iconEl.style.filter = `drop-shadow(0 0 8px ${codeInfo.color})`;

        document.getElementById('ww-desc').textContent = codeInfo.desc;
        document.getElementById('ww-temp').textContent = Math.round(current.temperature_2m);
        document.getElementById('ww-feels').textContent = Math.round(current.apparent_temperature) + '°F';
        document.getElementById('ww-humidity').textContent = current.relative_humidity_2m + '%';
        document.getElementById('ww-precip').textContent = current.precipitation.toFixed(2) + '"';
        document.getElementById('ww-wind').textContent = current.wind_speed_10m.toFixed(1) + ' mph';
        document.getElementById('ww-wind-dir').textContent = getWindDirection(current.wind_direction_10m);
        document.getElementById('ww-pressure').textContent = (current.surface_pressure * 0.02953).toFixed(2) + ' inHg';
        document.getElementById('ww-cloud').textContent = current.cloud_cover + '%';
        document.getElementById('ww-sunrise').textContent = formatTime(daily.sunrise[0]);
        document.getElementById('ww-sunset').textContent = formatTime(daily.sunset[0]);

        document.getElementById('weather-loading').style.display = 'none';
        const weatherData = document.getElementById('weather-data');
        weatherData.style.display = 'block';
        weatherData.classList.add('fade-in');
      })
      .catch(err => {
        console.error('Failed to fetch weather data:', err);
        document.getElementById('weather-loading').textContent = 'Weather telemetry offline.';
      });
  });
</script>
