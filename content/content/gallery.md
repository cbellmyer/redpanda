---
title: "Gallery"
description: "Convention shots, furmeets, and field photography — every album from the road."
type: "page"
ShowToc: false
ShowBreadCrumbs: false
---

<div class="gallery-hero">
  <div class="gallery-hero-icon">📷</div>
  <h2 class="gallery-hero-title">Field Gallery</h2>
  <p class="gallery-hero-sub">Every fursuit run, convention floor, and city street — captured through the lens.</p>
  <a href="https://photo.redpanda.pet/" target="_blank" rel="noopener noreferrer" class="gallery-hero-cta">
    Browse Full Gallery →
  </a>
</div>

<div id="gallery-stats" class="gallery-stats"></div>
<div id="gallery-filters" class="gallery-filters"></div>
<div id="gallery-content">
  <div class="loading-feed">Developing field photographs...</div>
</div>

<script>
document.addEventListener('DOMContentLoaded', async () => {
  const statsEl   = document.getElementById('gallery-stats');
  const filtersEl = document.getElementById('gallery-filters');
  const contentEl = document.getElementById('gallery-content');

  const typeConfig = {
    convention:  { label: '🎪 Convention',    color: '#FF6700' },
    shutterpaws: { label: '🐾 Shutterpaws',   color: '#9333EA' },
    event:       { label: '✨ Event',          color: '#EF4444' },
    roadtrip:    { label: '🚗 Trip / Photo',   color: '#FFB300' },
    photoshoot:  { label: '📸 Photoshoot',     color: '#FFB300' },
  };

  function getAlbumEmoji(name) {
    const n = name.toLowerCase();
    if (n.includes('parade'))                return '🐾';
    if (n.includes('dance'))                 return '💃';
    if (n.includes('shoot') || n.includes('photo')) return '🎞️';
    return '📸';
  }

  function parseStartDate(dateStr, yearStr) {
    const yearInDate = dateStr.match(/\b(20\d{2})\b/);
    const resolvedYear = yearInDate ? yearInDate[1] : yearStr;
    const match = dateStr.match(/([a-zA-Z]+)\s+(\d+)/);
    if (match) return new Date(`${match[1]} ${match[2]}, ${resolvedYear}`);
    return new Date(resolvedYear, 0, 1);
  }

  const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  let allItems   = [];
  let activeYear = 'all';
  let activeType = 'all';

  // ── Load events.json ────────────────────────────────────────────────────
  try {
    const res = await fetch('/data/events.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const eventsData = await res.json();

    eventsData.forEach(loc => {
      loc.history.forEach(entry => {
        const realAlbums = Object.entries(entry.albums || {})
          .filter(([, url]) => url && url !== '#');
        if (realAlbums.length === 0) return;

        allItems.push({
          eventName:    entry.eventName,
          locationName: loc.locationName,
          type:         loc.type || 'convention',
          year:         entry.year,
          dates:        entry.dates,
          albums:       realAlbums,
          dateObj:      parseStartDate(entry.dates, entry.year)
        });
      });
    });

    // Newest first
    allItems.sort((a, b) => b.dateObj - a.dateObj);

    const years     = [...new Set(allItems.map(i => i.year))].sort((a, b) => b - a);
    const types     = [...new Set(allItems.map(i => i.type))];
    const albumCount = allItems.reduce((n, i) => n + i.albums.length, 0);

    // ── Stats bar ──────────────────────────────────────────────────────────
    statsEl.innerHTML = `
      <div class="gallery-stat-item"><span class="gallery-stat-value">${albumCount}</span> albums</div>
      <div class="gallery-stat-item"><span class="gallery-stat-value">${allItems.length}</span> events</div>
      <div class="gallery-stat-item"><span class="gallery-stat-value">${years.length}</span> year${years.length !== 1 ? 's' : ''}</div>
    `;

    // ── Filters ────────────────────────────────────────────────────────────
    const yearRow = document.createElement('div');
    yearRow.className = 'gallery-filter-row';
    yearRow.innerHTML =
      `<span class="gallery-filter-label">Year</span>` +
      `<button class="gallery-chip active" data-year="all">All</button>` +
      years.map(y => `<button class="gallery-chip" data-year="${y}">${y}</button>`).join('');

    const typeRow = document.createElement('div');
    typeRow.className = 'gallery-filter-row';
    typeRow.innerHTML =
      `<span class="gallery-filter-label">Type</span>` +
      `<button class="gallery-chip active" data-type="all">All</button>` +
      types.map(t => `<button class="gallery-chip" data-type="${t}">${typeConfig[t]?.label || t}</button>`).join('');

    filtersEl.append(yearRow, typeRow);

    yearRow.querySelectorAll('[data-year]').forEach(btn => {
      btn.addEventListener('click', () => {
        yearRow.querySelectorAll('[data-year]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeYear = btn.dataset.year;
        renderGallery();
      });
    });

    typeRow.querySelectorAll('[data-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        typeRow.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeType = btn.dataset.type;
        renderGallery();
      });
    });

    renderGallery();

  } catch (e) {
    console.error('Gallery load failed:', e);
    contentEl.innerHTML = '<div class="gallery-empty">Could not load gallery at this time.</div>';
  }

  // ── Render ───────────────────────────────────────────────────────────────
  function renderGallery() {
    const filtered = allItems.filter(item => {
      if (activeYear !== 'all' && item.year !== activeYear) return false;
      if (activeType !== 'all' && item.type !== activeType) return false;
      return true;
    });

    if (filtered.length === 0) {
      contentEl.innerHTML = '<div class="gallery-empty">No albums match this filter.</div>';
      return;
    }

    // Group by year, newest first
    const byYear = {};
    filtered.forEach(item => {
      (byYear[item.year] = byYear[item.year] || []).push(item);
    });
    const sortedYears = Object.keys(byYear).sort((a, b) => b - a);

    let html = '';

    sortedYears.forEach(year => {
      const items = byYear[year];
      const albumTotal = items.reduce((n, i) => n + i.albums.length, 0);

      html += `
        <div class="gallery-year-header">
          <span class="gallery-year-label">${year}</span>
          <div class="gallery-year-line"></div>
          <span class="gallery-year-count">${albumTotal} album${albumTotal !== 1 ? 's' : ''}</span>
        </div>
        <div class="gallery-grid">
      `;

      items.forEach((item, idx) => {
        const tc = typeConfig[item.type] || typeConfig.convention;
        const albumBtns = item.albums.map(([name, url]) =>
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="gallery-album-btn">
            ${getAlbumEmoji(name)} ${esc(name)}
          </a>`
        ).join('');

        html += `
          <div class="gallery-card type-${item.type}" style="animation-delay:${idx * 0.06}s;">
            <div class="gallery-card-meta">
              <span class="gallery-type-badge type-${item.type}">${tc.label}</span>
              <span class="gallery-year-badge">${item.year}</span>
            </div>
            <div>
              <h3 class="gallery-card-title">${esc(item.eventName)}</h3>
              <div class="gallery-card-location">📍 ${esc(item.locationName)}</div>
              <div class="gallery-card-date">${esc(item.dates)}</div>
            </div>
            <div class="gallery-card-albums">${albumBtns}</div>
          </div>
        `;
      });

      html += `</div>`;
    });

    contentEl.innerHTML = html;
  }
});
</script>
