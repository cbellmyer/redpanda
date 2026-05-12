---
title: "Home"
---

<div class="redpanda-tail-container">
  <div class="redpanda-tail">
    <div class="tail-stripe stripe1"></div>
    <div class="tail-stripe stripe2"></div>
    <div class="tail-stripe stripe3"></div>
    <div class="tail-stripe stripe4"></div>
  </div>
</div>

<h2 class="upcoming-section-title" style="margin-top: 4rem;">Shots from the Field</h2>
<div id="photo-feed-grid" class="upcoming-grid">
  <div class="loading-feed" style="grid-column: 1 / -1;">Developing latest field shots...</div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('photo-feed-grid');

    async function fetchPhotos() {
      try {
        console.log("[SmugMug] Starting field data retrieval...");
        let items = [];

        try {
          const res = await fetch('/api/smugmug');
          if (res.ok) {
            items = await res.json();
          } else {
            throw new Error(`Local API returned ${res.status}`);
          }
        } catch (err) {
          console.warn("[SmugMug] Local API failed, trying rss2json...", err.message);
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
            return { title: item.title || "Field Update", link: item.link || "#", image: image };
          });
        }

        if (!items || items.length === 0) {
          feedContainer.innerHTML = '<div class="loading-feed" style="grid-column: 1 / -1;">No field data found at this time.</div>';
          return;
        }

        const latest = items.slice(0, 6);
        feedContainer.innerHTML = latest.map(item => {
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
        feedContainer.innerHTML = '<div class="loading-feed" style="grid-column: 1 / -1;">Could not load transmissions from the field at this time.</div>';
      }
    }
    fetchPhotos();
  });
</script>
