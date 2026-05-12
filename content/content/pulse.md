---
title: "Omni-Pulse"
description: "Live signals and recent dashboard activity."
type: "page"
ShowToc: false
menu:
  main:
    name: "Pulse"
    weight: 30
---

<style>
  /* Ensure feed-card sizing behaves perfectly when placed inside a CSS Grid instead of a horizontal scroll */
  .pulse-feed-grid .feed-card {
    flex: auto;
  }
</style>

<div class="bio-container" style="text-align: center; margin-bottom: 3rem;">
  <h2 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--primary);">System Status</h2>
  <div id="discord-widget" style="font-size: 1.1rem;">
    <span style="opacity: 0.7;">Checking connection...</span>
  </div>
</div>

<h2 class="upcoming-section-title" style="margin-top: 1rem;">Recent Transmissions</h2>

<div id="social-feed-grid" class="upcoming-grid pulse-feed-grid">
  <div class="loading-feed" style="grid-column: 1 / -1;">Establishing connection to signals...</div>
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
        feedContainer.innerHTML = '<div class="loading-feed" style="grid-column: 1 / -1;">Could not retrieve signals at this time.</div>';
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
  });
</script>
