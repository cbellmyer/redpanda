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
  .discord-card {
    display: inline-flex;
    align-items: center;
    gap: 1.2rem;
    background: color-mix(in srgb, var(--fur-secondary) 80%, transparent);
    padding: 0.8rem 1.8rem 0.8rem 1rem;
    border-radius: 50px;
    border: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent);
    box-shadow: 0 4px 15px rgb(0 0 0 / 20%);
    transition: all 0.3s ease;
    text-align: left;
  }
  .discord-card.active {
    border-color: color-mix(in srgb, #00E5FF 60%, transparent);
    box-shadow: 0 0 20px rgb(0 229 255 / 15%);
  }
  .discord-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgb(0 229 255 / 25%);
    border-color: #00E5FF;
  }
  .discord-avatar-wrapper {
    position: relative;
    width: 60px;
    height: 60px;
  }
  .discord-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50% !important;
    object-fit: cover;
    border: 2px solid color-mix(in srgb, var(--fur-secondary) 80%, transparent);
  }
  .discord-status-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 3px solid var(--fur-secondary);
    z-index: 2;
  }
  .discord-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .discord-username {
    font-weight: 800;
    color: var(--primary);
    font-size: 1.15rem;
    letter-spacing: 0.02em;
  }
  .discord-details {
    font-size: 0.9rem;
    color: var(--secondary);
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 0.1rem;
  }
  .voice-indicator { display: inline-flex; align-items: center; gap: 0.4rem; color: #00E5FF; font-weight: 600; }
  .eq-bars { display: flex; align-items: flex-end; gap: 2px; height: 12px; }
  .eq-bar { width: 3px; background-color: #00E5FF; border-radius: 2px; animation: eq-bounce 0.8s infinite ease-in-out alternate; }
  .eq-bar:nth-child(1) { height: 60%; animation-delay: 0.1s; }
  .eq-bar:nth-child(2) { height: 100%; animation-delay: 0.3s; }
  .eq-bar:nth-child(3) { height: 80%; animation-delay: 0.2s; }
  @keyframes eq-bounce { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }
  .activity-indicator { display: inline-flex; align-items: center; gap: 0.4rem; }
  .activity-indicator strong { color: var(--eye-highlight); }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  .weather-card {
    display: inline-flex;
    align-items: center;
    gap: 1.5rem;
    background: color-mix(in srgb, var(--fur-secondary) 80%, transparent);
    padding: 1.2rem 2rem 1.2rem 1.5rem;
    border-radius: 30px;
    border: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent);
    box-shadow: 0 4px 15px rgb(0 0 0 / 20%);
    transition: all 0.3s ease;
    text-align: left;
  }
  .weather-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgb(0 0 0 / 25%);
    border-color: color-mix(in srgb, var(--throat-teal) 60%, transparent);
  }
  .weather-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 110px;
    border-right: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent);
    padding-right: 1.5rem;
  }
  .weather-info-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .weather-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;
    row-gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--secondary);
  }
  .weather-grid > span {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .weather-grid strong {
    color: var(--primary);
    font-weight: 600;
  }
  @media (max-width: 600px) {
    .weather-card {
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      width: 100%;
      box-sizing: border-box;
    }
    .weather-avatar {
      border-right: none;
      border-bottom: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent);
      padding-right: 0;
      padding-bottom: 1rem;
      min-width: auto;
      width: 100%;
    }
    .weather-grid {
      grid-template-columns: 1fr;
      width: 100%;
    }
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
      <div id="weather-data" style="display: none;">
        <div class="weather-card">
          <div class="weather-avatar">
            <div style="font-size: 3.5rem; line-height: 1.1;" id="ww-icon">☁️</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-top: 0.2rem; letter-spacing: -0.02em;"><span id="ww-temp">--</span><span style="font-size: 1.1rem; color: var(--secondary); font-weight: 600;">°F</span></div>
            <div id="ww-desc" style="font-size: 0.9rem; color: var(--throat-teal); font-weight: 600; text-align: center; margin-top: 0.2rem; line-height: 1.2;">--</div>
          </div>
          <div class="weather-info-col">
            <div class="discord-username" style="margin-bottom: 0.5rem; border-bottom: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent); padding-bottom: 0.4rem;">Atmospheric Conditions</div>
            <div class="weather-grid">
              <span><strong>Heat Index:</strong> <span id="ww-feels">--</span></span>
              <span><strong>Humidity:</strong> <span id="ww-humidity">--</span></span>
              <span><strong>Precipitation:</strong> <span id="ww-precip">--</span></span>
              <span><strong>Wind:</strong> <span><span id="ww-wind">--</span> <span id="ww-wind-dir" style="font-size: 0.85em; opacity: 0.8; margin-left: 2px;">--</span></span></span>
              <span><strong>Pressure:</strong> <span id="ww-pressure">--</span></span>
              <span><strong>Cloud Cover:</strong> <span id="ww-cloud">--</span></span>
              <span><strong>Sunrise:</strong> <span id="ww-sunrise">--</span></span>
              <span><strong>Sunset:</strong> <span id="ww-sunset">--</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="system-status-aqi" style="margin: 0; text-align: center;">
      <div id="aqi-loading" style="opacity: 0.7; font-size: 1.1rem;">Gathering air quality data...</div>
      <div id="aqi-data" style="display: none;">
        <div class="weather-card">
          <div class="weather-avatar">
            <div style="font-size: 3.5rem; line-height: 1.1;" id="aqi-icon">🌿</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-top: 0.2rem; letter-spacing: -0.02em;"><span id="aqi-value">--</span></div>
            <div id="aqi-desc" style="font-size: 0.9rem; font-weight: 600; text-align: center; margin-top: 0.2rem; line-height: 1.2;">--</div>
          </div>
          <div class="weather-info-col">
            <div class="discord-username" style="margin-bottom: 0.5rem; border-bottom: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent); padding-bottom: 0.4rem;">Air Quality Index</div>
            <div class="weather-grid" style="grid-template-columns: 1fr; row-gap: 0.6rem; min-width: 180px;">
              <span><strong>PM2.5:</strong> <span><span id="aqi-pm25">--</span> <span style="font-size: 0.85em; opacity: 0.8; margin-left: 2px;">μg/m³</span></span></span>
              <span><strong>PM10:</strong> <span><span id="aqi-pm10">--</span> <span style="font-size: 0.85em; opacity: 0.8; margin-left: 2px;">μg/m³</span></span></span>
              <span><strong>Ozone:</strong> <span><span id="aqi-o3">--</span> <span style="font-size: 0.85em; opacity: 0.8; margin-left: 2px;">μg/m³</span></span></span>
              <span><strong>Carbon Mono:</strong> <span><span id="aqi-co">--</span> <span style="font-size: 0.85em; opacity: 0.8; margin-left: 2px;">μg/m³</span></span></span>
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
    const animateValue = (id, start, end, duration, decimals = 0, suffix = '') => {
      const obj = document.getElementById(id);
      if (!obj) return;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3); 
        const current = start + (end - start) * easeOut;
        
        obj.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          obj.textContent = (decimals > 0 ? end.toFixed(decimals) : Math.round(end)) + suffix;
        }
      };
      window.requestAnimationFrame(step);
    };

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
          if (status === 'online') statusColor = '#43b581';
          else if (status === 'idle') statusColor = '#faa61a';
          else if (status === 'dnd') statusColor = '#f04747';

          let detailsHtml = '';

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
              detailsHtml += `<div style="display: flex; align-items: center; margin-bottom: 4px;">${emoji} <span>${text}</span></div>`;
            }
          }

          if (spotify) {
            detailsHtml += `<div class="activity-indicator" style="color: #1DB954;">🎵 <span>Listening to <strong>${spotify.song}</strong></span></div>`;
          } else if (playingActivity) {
            detailsHtml += `<div class="activity-indicator">🎮 <span>Playing <strong>${playingActivity.name}</strong></span></div>`;
          }

          if (isVoice) {
            detailsHtml += `
              <div class="voice-indicator" style="margin-top: 4px;">
                <div class="eq-bars">
                  <div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div>
                </div>
                In Voice Chat
              </div>`;
          }

          if (!isOnline && !detailsHtml) {
            detailsHtml = '<div>Currently Offline</div>';
          } else if (isOnline && !detailsHtml) {
            detailsHtml = '<div>Online</div>';
          }

          if (isOnline) {
            let activeClients = [];
            if (data.active_on_discord_desktop) activeClients.push('💻 Desktop');
            if (data.active_on_discord_mobile) activeClients.push('📱 Mobile');
            if (data.active_on_discord_web) activeClients.push('🌐 Web');

            if (activeClients.length > 0) {
              detailsHtml += `<div style="font-size: 0.8rem; color: var(--muzzle-grey); margin-top: 6px; display: flex; gap: 0.5rem; align-items: center; font-weight: 500;">${activeClients.join('<span style="opacity: 0.4; font-size: 0.5rem;">⚫</span>')}</div>`;
            }
          }

          discordContainer.innerHTML = `
            <div class="discord-card ${isOnline ? 'active' : ''}">
              <div class="discord-avatar-wrapper">
                <img src="${avatarUrl}" alt="${username}" class="discord-avatar">
                <div class="discord-status-dot" style="background-color: ${statusColor};"></div>
              </div>
              <div class="discord-info">
                <div class="discord-username">${username}</div>
                <div class="discord-details">
                  ${detailsHtml}
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
          0: { icon: '☀️', desc: 'Clear sky' },
          1: { icon: '🌤️', desc: 'Mainly clear' },
          2: { icon: '⛅', desc: 'Partly cloudy' },
          3: { icon: '☁️', desc: 'Overcast' },
          45: { icon: '🌫️', desc: 'Fog' },
          48: { icon: '🌫️', desc: 'Depositing rime fog' },
          51: { icon: '🌧️', desc: 'Light drizzle' },
          53: { icon: '🌧️', desc: 'Moderate drizzle' },
          55: { icon: '🌧️', desc: 'Dense drizzle' },
          61: { icon: '🌧️', desc: 'Light rain' },
          63: { icon: '🌧️', desc: 'Moderate rain' },
          65: { icon: '🌧️', desc: 'Heavy rain' },
          71: { icon: '❄️', desc: 'Light snow' },
          73: { icon: '❄️', desc: 'Moderate snow' },
          75: { icon: '❄️', desc: 'Heavy snow' },
          77: { icon: '❄️', desc: 'Snow grains' },
          80: { icon: '🌧️', desc: 'Light showers' },
          81: { icon: '🌧️', desc: 'Moderate showers' },
          82: { icon: '⛈️', desc: 'Violent showers' },
          95: { icon: '⛈️', desc: 'Thunderstorm' },
          96: { icon: '⛈️', desc: 'Thunderstorm w/ hail' },
          99: { icon: '⛈️', desc: 'Heavy thunderstorm w/ hail' }
        };

        const codeInfo = weatherCodes[current.weather_code] || { icon: '☁️', desc: 'Unknown' };
        const formatTime = (isoString) => new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        document.getElementById('ww-icon').textContent = codeInfo.icon;
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

    // 4. Air Quality Index Widget (Open-Meteo)
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,ozone,carbon_monoxide&timezone=America%2FNew_York`;

    fetch(aqiUrl)
      .then(async response => {
        const data = await response.json();
        if (!response.ok || data.error) throw new Error(data.reason || `HTTP ${response.status}`);
        return data;
      })
      .then(data => {
        const current = data.current;
        const aqi = current.us_aqi;

        let icon = '🌿';
        let desc = 'Good';
        let color = '#43b581'; // Green

        if (aqi > 300) { icon = '☣️'; desc = 'Hazardous'; color = '#7e0023'; }
        else if (aqi > 200) { icon = '🫁'; desc = 'Very Unhealthy'; color = '#8f3f97'; }
        else if (aqi > 150) { icon = '😷'; desc = 'Unhealthy'; color = '#f04747'; }
        else if (aqi > 100) { icon = '🤧'; desc = 'Unhealthy (Sens.)'; color = '#faa61a'; }
        else if (aqi > 50) { icon = '😐'; desc = 'Moderate'; color = '#e67e22'; }

        document.getElementById('aqi-icon').textContent = icon;
        document.getElementById('aqi-desc').textContent = desc;
        document.getElementById('aqi-desc').style.color = color;
        document.getElementById('aqi-value').style.color = color;

        animateValue('aqi-value', 0, aqi, 1200, 0);
        animateValue('aqi-pm25', 0, current.pm2_5, 1200, 1);
        animateValue('aqi-pm10', 0, current.pm10, 1200, 1);
        animateValue('aqi-o3', 0, current.ozone, 1200, 0);
        animateValue('aqi-co', 0, current.carbon_monoxide, 1200, 0);

        document.getElementById('aqi-loading').style.display = 'none';
        const aqiData = document.getElementById('aqi-data');
        aqiData.style.display = 'block';
        aqiData.classList.add('fade-in');
      })
      .catch(err => {
        console.error('Failed to fetch AQI data:', err);
        document.getElementById('aqi-loading').textContent = 'Air Quality telemetry offline.';
      });

    // 5. Network Telemetry Widget (Client-to-Server Ping)
    const measureUplink = () => {
      const start = performance.now();
      // We append a timestamp to the URL to prevent the browser from returning a cached response
      const pingUrl = window.location.origin + window.location.pathname + '?ping=' + Date.now();
      
      // Use a HEAD request to minimize data transfer (we just want the connection time)
      fetch(pingUrl, { method: 'HEAD', cache: 'no-store' })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          const end = performance.now();
          const latency = Math.max(1, end - start); // Ensure it reads at least 1ms

          let icon = '📡';
          let desc = 'Optimal';
          let color = '#43b581'; // Green

          if (latency > 300) { icon = '⚠️'; desc = 'Degraded'; color = '#f04747'; }
          else if (latency > 100) { icon = '🐢'; desc = 'Slow'; color = '#faa61a'; }

          document.getElementById('up-icon').textContent = icon;
          document.getElementById('up-desc').textContent = desc;
          document.getElementById('up-desc').style.color = color;
          document.getElementById('up-status-text').textContent = 'Active';
          document.getElementById('up-status-text').style.color = color;

          animateValue('up-value', 0, latency, 1200, 0);

          document.getElementById('uplink-loading').style.display = 'none';
          const upData = document.getElementById('uplink-data');
          upData.style.display = 'block';
          upData.classList.add('fade-in');
        })
        .catch(err => {
          console.error('Failed to measure uplink:', err);
          document.getElementById('uplink-loading').textContent = 'Uplink telemetry offline.';
        });
    };
    
    measureUplink();
    setInterval(measureUplink, 30000); // Ping every 30 seconds to keep the metric "live"

    // 6. Suit Power Widget (Simulated Telemetry)
    const calculateSuitPower = () => {
      const now = new Date();
      const hours = now.getHours() + now.getMinutes() / 60;
      let power = 100;
      let isCharging = false;

      // Simulate battery: Discharges from 08:00 to 24:00, charges from 00:00 to 08:00
      if (hours >= 8) {
        power = 100 - ((hours - 8) / 16) * 85; // Drops to ~15% by midnight
        isCharging = false;
      } else {
        power = 15 + (hours / 8) * 85; // Charges back to 100% by 8 AM
        isCharging = true;
      }

      let icon = '🔋';
      let desc = isCharging ? 'Recharging' : 'Discharging';
      let color = '#43b581'; // Green

      if (power <= 20 && !isCharging) {
        icon = '🪫'; desc = 'Critical'; color = '#f04747'; // Red
      } else if (power <= 50 && !isCharging) {
        desc = 'Draining'; color = '#faa61a'; // Yellow
      } else if (isCharging) {
        icon = '⚡'; color = '#00E5FF'; // Cyan
      }

      document.getElementById('sp-icon').textContent = icon;
      document.getElementById('sp-desc').textContent = desc;
      document.getElementById('sp-desc').style.color = color;
      document.getElementById('sp-status-text').textContent = isCharging ? 'Docked' : 'Active';
      document.getElementById('sp-status-text').style.color = color;

      // Simulate jittering "live" numbers
      const coreTemp = 98.6 + (Math.random() * 0.4 - 0.2);
      const drawRate = isCharging ? -0.8 + (Math.random() * 0.1) : 1.2 + (Math.random() * 0.3);

      animateValue('sp-value', 0, power, 1200, 0);
      animateValue('sp-temp', 90, coreTemp, 1200, 1);
      animateValue('sp-draw', 0, drawRate, 1200, 2);

      document.getElementById('power-loading').style.display = 'none';
      const spData = document.getElementById('power-data');
      spData.style.display = 'block';
      spData.classList.add('fade-in');
    };
    
    setTimeout(calculateSuitPower, 400); // Slight delay so animations stagger gracefully

    // Interactive Glitch Effect for Suit Power
    const powerWidget = document.getElementById('system-status-power');
    powerWidget.style.cursor = 'pointer';
    powerWidget.title = 'Reboot Telemetry';
    let isGlitching = false;
    
    powerWidget.addEventListener('click', () => {
      if (isGlitching) return;
      isGlitching = true;
      
      const spValue = document.getElementById('sp-value');
      const spTemp = document.getElementById('sp-temp');
      const spDraw = document.getElementById('sp-draw');
      const spStatus = document.getElementById('sp-status-text');
      const spIcon = document.getElementById('sp-icon');
      
      spStatus.textContent = 'ERR_SYNC';
      spStatus.style.color = '#f04747';
      spIcon.textContent = '⚠️';
      
      const chars = '0123456789!@#$%^&*';
      const getRandomStr = (minLen) => {
        const len = minLen + Math.floor(Math.random() * 2); // Jitter the string length
        return Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      };

      const glitchInterval = setInterval(() => {
        spValue.textContent = getRandomStr(2);
        spTemp.textContent = getRandomStr(3);
        spDraw.textContent = getRandomStr(3);
      }, 50);

      setTimeout(() => {
        clearInterval(glitchInterval);
        isGlitching = false;
        calculateSuitPower(); // Re-initialize and animate back to normal
      }, 800);
    });
  });
</script>
