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
          feedContainer.innerHTML = '<div class="loading-feed" style="grid-column: 1 / -1;">No field data found at this time.</div>';
          return;
        }

        feedContainer.innerHTML = latest.map(item => {
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
        feedContainer.innerHTML = '<div class="loading-feed" style="grid-column: 1 / -1;">Could not load transmissions from the field at this time.</div>';
      }
    }
    fetchPhotos();
  });
</script>
