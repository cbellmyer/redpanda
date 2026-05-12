---
title: "Omni-Pulse"
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

  /* Photo card hover animation */
  #photo-feed-grid .con-card img {
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  #photo-feed-grid .con-card:hover img {
    transform: scale(1.08);
  }
</style>

<div class="bio-container" style="text-align: center; margin-bottom: 3rem;">
  <h2 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--primary);">System Status</h2>
  <div id="discord-widget" style="font-size: 1.1rem;">
    <span style="opacity: 0.7;">Checking connection...</span>
  </div>
</div>

<h2 class="upcoming-section-title" style="margin-top: 1rem;">Recent Transmissions</h2>

<div id="social-feed-grid" class="feed-scroll">
  <div class="loading-feed">Establishing connection to signals...</div>
</div>

<h2 class="upcoming-section-title" style="margin-top: 4rem;">Shots from the Field</h2>
<div id="photo-feed-grid" class="upcoming-grid">
  <div class="loading-feed" style="grid-column: 1 / -1;">Developing latest field shots...</div>
</div>

<div style="text-align: center; margin-top: 2rem; margin-bottom: 4rem;">
  <a href="https://photo.redpanda.pet" target="_blank" rel="noopener" class="button" style="padding: 0.8rem 2rem; border-radius: 30px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
    View Full Gallery 📸
  </a>
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
        const data = await res.json();

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
    });

    // 3. Shots from the Field (photo.redpanda.pet RSS)
    const photoFeedContainer = document.getElementById('photo-feed-grid');

    async function fetchPhotos() {
      try {
        console.log("[SmugMug] Starting field data retrieval...");

        let items = [];

        // Attempt 1: First-party Cloudflare Pages API (Fastest, avoids CORS and rate limits)
        try {
          const res = await fetch('/api/smugmug');
          if (res.ok) {
            items = await res.json();
            console.log("[SmugMug] Local API successful");
          } else {
            throw new Error(`Local API returned ${res.status}`);
          }
        } catch (err) {
          console.warn("[SmugMug] Local API failed (normal during local dev), falling back to rss2json...", err.message);
          
          // Attempt 2: rss2json fallback
          const SMUGMUG_NICKNAME = 'furcologist';
          const targetUrl = `https://${SMUGMUG_NICKNAME}.smugmug.com/hack/feed.mg?Type=NicknameRecentPhotos&Data=${SMUGMUG_NICKNAME}&format=rss200`;
          const encodedUrl = encodeURIComponent(targetUrl);
          
          const res2 = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodedUrl}`);
          if (!res2.ok) throw new Error("rss2json API failed");
          
          const data = await res2.json();
          if (data.status !== 'ok' || !data.items) throw new Error("Invalid data from rss2json");
          
          items = data.items.map(item => {
            let image = item.thumbnail || (item.enclosure && item.enclosure.link) || null;
            if (!image) {
              const content = item.content || item.description || "";
              const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (imgMatch) image = imgMatch[1];
            }
            return {
              title: item.title || "Field Update",
              link: item.link || "#",
              image: image
            };
          });
        }

        if (!items || items.length === 0) {
          photoFeedContainer.innerHTML = '<div class="loading-feed" style="grid-column: 1 / -1;">No field data found at this time.</div>';
          return;
        }

        const latest = items.slice(0, 6);
        photoFeedContainer.innerHTML = latest.map(item => {
          return `
            <a href="${item.link}" target="_blank" rel="noopener" class="con-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; text-decoration: none;">
              ${item.image ? `<img src="${item.image}" alt="${item.title.replace(/"/g, '&quot;')}" loading="lazy" style="width: 100%; height: 250px; object-fit: cover; border-bottom: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent);">` : ''}
              <div style="padding: 1.2rem;">
                <h3 style="margin: 0; font-size: 1.1rem; color: var(--primary); text-align: left;">${item.title}</h3>
              </div>
            </a>
          `;
        }).join('');
      } catch (e) {
        console.error("Photo fetch error:", e);
        photoFeedContainer.innerHTML = '<div class="loading-feed" style="grid-column: 1 / -1;">Could not load transmissions from the field at this time.</div>';
      }
    }
    fetchPhotos();
  });
</script>
