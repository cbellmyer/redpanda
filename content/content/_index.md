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

<div id="omni-pulse-wrapper">
  <a href="#" id="omni-pulse-link" target="_blank" rel="noopener" class="omni-pulse-ticker">
    <span class="pulse-label" id="omni-pulse-label"></span>
    <span class="pulse-divider">//</span>
    <span class="pulse-text" id="omni-pulse-text">Loading signals...</span>
  </a>
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const pulseLink = document.getElementById("omni-pulse-link");
    const pulseLabel = document.getElementById("omni-pulse-label");
    const pulseText = document.getElementById("omni-pulse-text");
    const pulseWrapper = document.getElementById("omni-pulse-wrapper");

    // Move the wrapper directly to the body to escape the <main> element's stacking context!
    document.body.appendChild(pulseWrapper);

    // TODO: Update this with your actual Worker deployed URL
    const WORKER_URL = "https://pulse.redpanda.workers.dev";

    async function updatePulse() {
      try {
        const res = await fetch(WORKER_URL);
        const data = await res.json();

        if (data && data.label && data.text) {
          pulseWrapper.style.display = "block";

          if (pulseText.textContent !== data.text) {
            pulseText.style.animation = "none";
            void pulseText.offsetWidth; // Trigger DOM reflow to restart animation seamlessly
            pulseLabel.textContent = data.label;
            pulseText.textContent = data.text;
            pulseLink.href = data.url || "#";
            pulseText.style.animation = "pulseSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
          }
        } else if (data && data.error) {
          console.error("Omni-Pulse Worker Error:", data.error);
        } else {
          console.warn("Omni-Pulse Worker returned incomplete data:", data);
        }
      } catch (err) { console.warn("Omni-Pulse fetch failed:", err); }
    }

    updatePulse();
    setInterval(updatePulse, 60000); // Check for new signals every 60 seconds
  });
</script>
