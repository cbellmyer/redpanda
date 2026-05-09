---
title: "About Rory"
description: "The Operator's Journey: From the Bayou to the Bay"
type: "page"
ShowToc: false
ShowPostMeta: false
ShowBreadCrumbs: false
---

<div class="art-placeholder">
  <span>[ Future Art / Character Reference Placement ]</span>
</div>

<div class="bio-container">
  <h2>The Operator’s Journey: From the Bayou to the Bay</h2>

  <p>I grew up where the land dissolves into the water—the Alabama shores, surrounded by cypress swamps, brackish bayous, and the high-energy spirit of the original Mardi Gras. That environment taught me two things early on: how to navigate complex, murky ecosystems and how to appreciate a vibrant, costumed spectacle.</p>

  <p>Today, I’ve traded the Gulf for the Chesapeake Bay watershed. As a Wastewater Operator III in Maryland, my life still revolves around the water. I see the Bay not just as a landmark, but as a massive biological process that requires precision, balance, and constant care to protect. My work in process control is about stabilizing the system to keep the environment thriving.</p>

  <p>By night (and at conventions), I bring that same "Operator's mindset" to my photography and the founding of Shutterpaws. Whether I’m tracking a high-speed dance battle through my Nikon Z6 III or troubleshooting a Cloudflare Worker for this site, I’m always looking for the "Process Control" in the chaos. I’m here to document the community with the same precision I use to protect the watershed.</p>
</div>

<div class="feed-container">
  <h3 class="feed-title">Latest Transmissions</h3>
  <p class="feed-subtitle">Recent updates from Bluesky and Pixelfed.</p>
  <div id="social-feed-scroll" class="feed-scroll">
    <div class="loading-feed">Establishing connection...</div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('social-feed-scroll');

    // Fetch latest 10 from Bluesky
    async function fetchBluesky() {
      try {
        const res = await fetch('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=redpanda.pet&limit=10');
        const data = await res.json();
        return data.feed.map(item => {
          const post = item.post;
          const text = post.record.text || '';
          const image = post.embed?.images?.[0]?.thumb || null;
          return {
            source: 'Bluesky',
            date: new Date(post.indexedAt),
            text: text,
            image: image,
            url: `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`
          };
        });
      } catch (e) {
        console.error("Bluesky fetch error:", e);
        return [];
      }
    }

    // Fetch latest 10 from Pixelfed (Using Atom feed via CORS proxy)
    async function fetchPixelfed() {
      try {
        // Add a timestamp cache-buster to the target URL to ensure fresh results
        const targetUrl = 'https://pixelfed.social/users/roryredpanda.atom?t=' + Date.now();
        const rssUrl = encodeURIComponent(targetUrl);
        // Use disableCache=true for the proxy to prevent stale data
        const res = await fetch(`https://api.allorigins.win/get?disableCache=true&url=${rssUrl}`);
        const data = await res.json();

        if (!data || !data.contents) {
          console.error("No data received from Pixelfed proxy.");
          return [];
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        // getElementsByTagName is more reliable for XML namespaces across browsers
        const entries = Array.from(xml.getElementsByTagName("entry")).slice(0, 10);

        return entries.map(entry => {
          const contentNodes = entry.getElementsByTagName("content");
          const contentHtml = contentNodes.length > 0 ? contentNodes[0].textContent : '';

          let image = null;
          let postUrl = 'https://pixelfed.social/roryredpanda';

          // Manually iterate links to avoid querySelector namespace issues in XML
          const links = entry.getElementsByTagName("link");
          for (let i = 0; i < links.length; i++) {
            const rel = links[i].getAttribute("rel");
            const type = links[i].getAttribute("type") || '';
            const href = links[i].getAttribute("href");

            if (rel === "enclosure" && type.startsWith("image")) {
              if (!image) image = href; // Take the first image enclosure
            } else if (!rel || rel === "alternate") {
              postUrl = href;
            }
          }

          if (!image) {
            const imgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) image = imgMatch[1];
          }

          // Strip HTML tags for clean text preview
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = contentHtml;
          const text = tempDiv.textContent || tempDiv.innerText || "";

          // Parse date carefully (fallback to updated if published is missing)
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
            url: postUrl
          };
        });
      } catch (e) {
        console.error("Pixelfed fetch error:", e);
        return [];
      }
    }

    // Load, combine, and render the feeds
    Promise.all([fetchBluesky(), fetchPixelfed()]).then(([bsky, pxfed]) => {
      let combined = [...bsky, ...pxfed]
        .filter(post => post.date && !isNaN(post.date.getTime())) // Prevent Invalid Dates from breaking the sort
        .sort((a, b) => b.date.getTime() - a.date.getTime()) // Strict chronological sort (newest first)
        .slice(0, 20);

      if (combined.length === 0) {
        feedContainer.innerHTML = '<div class="loading-feed">Could not retrieve signals at this time.</div>';
        return;
      }

      feedContainer.innerHTML = combined.map(post => `
        <a href="${post.url}" target="_blank" rel="noopener" class="feed-card">
          <div class="meta">
            <span class="feed-source ${post.source.toLowerCase()}">${post.source}</span>
            <span class="feed-date">${post.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          ${post.image ? `<img src="${post.image}" alt="Post image" loading="lazy">` : ''}
          <div class="content">${post.text}</div>
        </a>
      `).join('');
    });
  });
</script>
