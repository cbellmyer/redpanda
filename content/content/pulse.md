---
title: "Omni-Pulse"
description: "Live signals and recent dashboard activity."
type: "page"
menu:
  main:
    name: "Pulse"
    weight: 30
---

<div id="pulse-container" class="pulse-grid">
  <div class="loading-feed">Establishing connection to signals...</div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const pulseContainer = document.getElementById("pulse-container");
    // ⚠️ IMPORTANT: This must be the URL of your API Worker, NOT your website URL!
    const WORKER_URL = "https://pulse-redpanda.self-host.workers.dev";

    function timeAgo(timestamp) {
      if (!timestamp) return "";
      const seconds = Math.floor((new Date() - timestamp) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " years ago";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " minutes ago";
      return Math.floor(seconds) + " seconds ago";
    }

    async function fetchSignals() {
      try {
        const res = await fetch(WORKER_URL);

        // Fetch as text first so we can see exactly what the worker is sending back
        const rawText = await res.text();
        let signals;
        try {
          signals = JSON.parse(rawText);
        } catch (e) {
          console.error("Omni-Pulse received a non-JSON response. Raw text:", rawText);
          throw new Error("Worker returned HTML or invalid data instead of JSON.");
        }

        if (signals && signals.error) {
          console.error("Worker explicitly returned an error:", signals.error);
          pulseContainer.innerHTML = `<div class="loading-feed" style="color: var(--eye-highlight);">Worker Error: ${signals.error}</div>`;
        } else if (Array.isArray(signals) && signals.length > 0) {
          pulseContainer.innerHTML = signals.map(sig => {
            let opacity = 1;
            let timeStr = "";

            if (sig.isActive) {
              opacity = 1;
              timeStr = "Live Now";
            } else if (sig.timestamp) {
              const hoursAgo = (Date.now() - sig.timestamp) / (1000 * 60 * 60);
              // Dim the cards slowly, capping out at 0.4 opacity once they hit 168 hours (1 week) old
              opacity = Math.max(0.4, 0.9 - (hoursAgo / 168) * 0.5);
              timeStr = timeAgo(sig.timestamp);
            } else {
              opacity = 0.5; // Static fallbacks like X
            }

            return `
              <a href="${sig.url}" target="_blank" rel="noopener" class="pulse-card ${sig.isActive ? 'active' : ''}" style="opacity: ${opacity}">
                <div class="pulse-card-header">
                  <span class="pulse-source">${sig.source} // ${sig.label}</span>
                  <div class="pulse-indicator"></div>
                </div>
                <div class="pulse-content">${sig.text}</div>
                <div class="pulse-time">${timeStr}</div>
              </a>
            `;
          }).join('');
        } else {
          pulseContainer.innerHTML = '<div class="loading-feed">No signals available at the moment.</div>';
        }
      } catch (err) {
        console.error("Pulse fetch failed:", err);
        pulseContainer.innerHTML = `
          <div class="loading-feed" style="color: var(--eye-highlight); line-height: 1.6;">
            Failed to connect to the signal relay.<br>
            <span style="font-size: 0.85rem; opacity: 0.8;">(Check the console. If you see a CORS error with Status 200, your WORKER_URL is pointing to your website instead of the API Worker!)</span>
          </div>`;
      }
    }

    fetchSignals();
    setInterval(fetchSignals, 60000); // Check for new signals every 60 seconds
  });
</script>
