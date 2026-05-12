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
  .post-header {
    text-align: center;
  }
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
    border-radius: 50%;
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
  <div class="loading-feed" style="grid-column: 1 / -1;">Retrieving latest field data...</div>
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
          const isOnline = data.discord_status !== "offline";
          const isVoice = data.active_on_discord_voice;
          const playingActivity = data.activities?.find(a => a.type === 0);

          if (isOnline) {
            let text = "Online";
            if (playingActivity && isVoice) {
              text = `Playing <strong>${playingActivity.name}</strong> & in <strong>Voice</strong>`;
            } else if (playingActivity) {
              text = `Playing <strong>${playingActivity.name}</strong>`;
            } else if (isVoice) {
              text = `In <strong>Voice Chat</strong>`;
            }

            discordContainer.innerHTML = `
              <div style="display: inline-flex; align-items: center; gap: 0.8rem; background: color-mix(in srgb, var(--fur-secondary) 80%, transparent); padding: 0.8rem 1.5rem; border-radius: 30px; border: 1px solid #00E5FF; box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: #00E5FF; box-shadow: 0 0 10px #00E5FF; animation: pulse-dot 1.5s infinite;"></div>
                <span>LIVE // ${text}</span>
              </div>
            `;
          } else {
            discordContainer.innerHTML = `
              <div style="display: inline-flex; align-items: center; gap: 0.8rem; background: color-mix(in srgb, var(--fur-secondary) 80%, transparent); padding: 0.8rem 1.5rem; border-radius: 30px; border: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent);">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--muzzle-grey);"></div>
                <span style="color: var(--muzzle-grey);">OFFLINE</span>
              </div>
            `;
          }
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
        const targetUrl = 'https://pixelfed.social/users/roryredpanda.atom?t=' + Date.now();
        const encodedUrl = encodeURIComponent(targetUrl);

        const proxies = [
          `https://corsproxy.io/?${encodedUrl}`,
          `https://api.allorigins.win/raw?url=${encodedUrl}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`
        ];

        let xmlText = null;
        for (const proxy of proxies) {
          try {
            const res = await fetch(proxy);
            if (res.ok) {
              xmlText = await res.text();
              break;
            }
          } catch (e) {
            console.warn(`Proxy fetch failed for ${proxy}`);
          }
        }

        if (!xmlText) return [];

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const entries = Array.from(xml.getElementsByTagName("entry")).slice(0, 10);

        return entries.map(entry => {
          const contentNodes = entry.getElementsByTagName("content");
          const contentHtml = contentNodes.length > 0 ? contentNodes[0].textContent : '';

          let image = null;
          let postUrl = 'https://pixelfed.social/roryredpanda';

          const links = entry.getElementsByTagName("link");
          for (let i = 0; i < links.length; i++) {
            const rel = links[i].getAttribute("rel");
            const type = links[i].getAttribute("type") || '';
            const href = links[i].getAttribute("href");

            if (rel === "enclosure" && type.startsWith("image")) {
              if (!image) image = href;
            } else if (!rel || rel === "alternate") {
              postUrl = href;
            }
          }

          if (!image) {
            const imgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) image = imgMatch[1];
          }

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = contentHtml;
          const text = tempDiv.textContent || tempDiv.innerText || "";

          const pubNodes = entry.getElementsByTagName("published");
          const updNodes = entry.getElementsByTagName("updated");
          const dateStr = (pubNodes.length > 0 ? pubNodes[0].textContent : null) ||
                          (updNodes.length > 0 ? updNodes[0].textContent : null);
          const date = dateStr ? new Date(dateStr) : new Date();

          return {
            source: 'Pixelfed',
            date: date,
            text: text.trim(),
            image: image,
            url: postUrl,
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
        const targetUrl = 'https://photo.redpanda.pet/index.xml?t=' + Date.now();
        let xmlText = null;
        
        try {
          // Try direct fetch first
          const res = await fetch(targetUrl);
          if (res.ok) xmlText = await res.text();
        } catch (e) {
          // Direct fetch failed (likely CORS), use proxy fallbacks
          const encodedUrl = encodeURIComponent(targetUrl);
          const proxies = [
            `https://corsproxy.io/?${encodedUrl}`,
            `https://api.allorigins.win/raw?url=${encodedUrl}`
          ];
          
          for (const proxy of proxies) {
            try {
              const res = await fetch(proxy);
              if (res.ok) {
                xmlText = await res.text();
                break;
              }
            } catch (err) {}
          }
        }

        if (!xmlText) throw new Error("All proxy fetches failed.");

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        
        // Support both RSS <item> and Atom <entry> format feeds
        let items = Array.from(xml.getElementsByTagName("item"));
        if (items.length === 0) items = Array.from(xml.getElementsByTagName("entry"));
        
        const latest = items.slice(0, 6); // Fetch latest 6 shots for a balanced grid
        
        if (latest.length === 0) {
          photoFeedContainer.innerHTML = '<div class="loading-feed" style="grid-column: 1 / -1;">No field data found at this time.</div>';
          return;
        }

        photoFeedContainer.innerHTML = latest.map(item => {
          const title = item.getElementsByTagName("title")[0]?.textContent || "Field Update";
          
          let link = "#";
          const linkNodes = item.getElementsByTagName("link");
          if (linkNodes.length > 0) link = linkNodes[0].textContent.trim() || linkNodes[0].getAttribute("href") || "#";

          let image = null;
          const enclosures = item.getElementsByTagName("enclosure");
          if (enclosures.length > 0) image = enclosures[0].getAttribute("url");
          
          if (!image) {
            const desc = item.getElementsByTagName("description")[0]?.textContent || "";
            const content = item.getElementsByTagNameNS("*", "encoded")[0]?.textContent || item.getElementsByTagName("content")[0]?.textContent || "";
            const imgMatch = (content || desc).match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) image = imgMatch[1];
          }
          
          return `
            <a href="${link}" target="_blank" rel="noopener" class="con-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; text-decoration: none;">
              ${image ? `<img src="${image}" alt="${title.replace(/"/g, '&quot;')}" loading="lazy" style="width: 100%; height: 250px; object-fit: cover; border-bottom: 1px solid color-mix(in srgb, var(--muzzle-grey) 30%, transparent);">` : ''}
              <div style="padding: 1.2rem;">
                <h3 style="margin: 0; font-size: 1.1rem; color: var(--primary); text-align: left;">${title}</h3>
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
