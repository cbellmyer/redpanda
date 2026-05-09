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

<script>
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[Omni-Pulse] Script initializing...");
    const menu = document.getElementById("menu");
    if (!menu) {
      console.error("[Omni-Pulse] Error: Could not find the site menu (#menu).");
      return;
    }

    // Dynamically create the ticker to prevent Hugo Markdown parsing issues
    const li = document.createElement("li");
    li.id = "omni-pulse-wrapper";

    const link = document.createElement("a");
    link.id = "omni-pulse-link";
    link.href = "#";
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "omni-pulse-ticker";

    const labelSpan = document.createElement("span");
    labelSpan.className = "pulse-label";
    labelSpan.id = "omni-pulse-label";
    labelSpan.textContent = "SYSTEM";

    const dividerSpan = document.createElement("span");
    dividerSpan.className = "pulse-divider";
    dividerSpan.textContent = "//";

    const textSpan = document.createElement("span");
    textSpan.className = "pulse-text";
    textSpan.id = "omni-pulse-text";
    textSpan.textContent = "Loading signals...";

    link.append(labelSpan, dividerSpan, textSpan);
    li.appendChild(link);
    menu.appendChild(li); // Mount directly to the site header menu!

    console.log("[Omni-Pulse] UI injected into menu. Starting fetch...");

    // TODO: Update this with your actual Worker deployed URL
    const WORKER_URL = "https://pulse-redpanda.self-host.workers.dev";

    async function updatePulse() {
      try {
        const res = await fetch(WORKER_URL);
        const data = await res.json();
        console.log("[Omni-Pulse] Data successfully received:", data);

        if (data && data.label && data.text) {
          if (textSpan.textContent !== data.text) {
            textSpan.style.animation = "none";
            void textSpan.offsetWidth; // Trigger DOM reflow
            labelSpan.textContent = data.label;
            textSpan.textContent = data.text;
            link.href = data.url || "#";
            textSpan.style.animation = "pulseFadeIn 0.5s ease forwards";
          }
        } else if (data && data.error) {
          console.error("[Omni-Pulse] Worker Error:", data.error);
          textSpan.textContent = "Signal error";
        } else {
          console.warn("[Omni-Pulse] Incomplete data:", data);
          textSpan.textContent = "Signal corrupted";
        }
      } catch (err) {
        console.error("[Omni-Pulse] Network fetch failed:", err);
        textSpan.textContent = "Connection failed";
      }
    }

    updatePulse();
    setInterval(updatePulse, 60000); // Check for new signals every 60 seconds
  });
</script>
