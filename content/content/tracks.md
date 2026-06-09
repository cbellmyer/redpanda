---
title: "Panda Tracks 🐾"
description: "A map of all the conventions and places I've left my paw prints!"
type: "page"
ShowToc: false
ShowPostMeta: false
ShowBreadCrumbs: false
---

<div class="tracks-intro">
  <span class="tracks-intro-icon">🗺️</span>
  <div class="tracks-intro-body">
    <strong>Welcome to my travel map!</strong>
    <p>This is where I keep track of all the conventions, furmeets, and fun places I've visited. Click any bouncing paw print to see the details, or scroll the filmstrip below to explore upcoming and past adventures.</p>
  </div>
</div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script defer src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<!-- Next 3 upcoming events -->
<div id="next-events-box" class="dashboard-box" style="display:none;">
  <div class="dashboard-box-header">
    <span class="dashboard-box-title">🗓️ Upcoming Deployments</span>
  </div>
  <div id="next-events-strip" class="next-events-strip"></div>
</div>

<!-- SCADA stats tiles -->
<div id="stats-box" class="dashboard-box" style="display:none;">
  <div class="dashboard-box-header">
    <span class="dashboard-box-title">📊 Expedition Stats</span>
  </div>
  <div id="stats-tiles-row" class="stats-tiles-row"></div>
</div>

<!-- Year filter row -->
<div id="year-filter-row" class="year-filter-row" style="display:none;"></div>

<div id="map-container" class="tracks-map"></div>

<h2 class="upcoming-section-title" id="upcoming-title" style="display: none;">Upcoming Adventures</h2>

<div id="filmstrip-controls" class="filmstrip-controls" style="display: none;">
  <div class="filmstrip-toggles">
    <button class="filmstrip-toggle active" id="toggle-upcoming">Upcoming</button>
    <button class="filmstrip-toggle" id="toggle-past">Past</button>
  </div>
  <div class="filmstrip-filters">
    <button class="filter-chip active" data-type="all">All</button>
    <button class="filter-chip" data-type="convention">🎪 Convention</button>
    <button class="filter-chip" data-type="shutterpaws">🐾 Shutterpaws</button>
    <button class="filter-chip" data-type="event">✨ Event</button>
    <button class="filter-chip" data-type="roadtrip">🚗 Trip / Photo</button>
  </div>
</div>

<div id="upcoming-filmstrip" class="filmstrip-scroll" style="display: none;">
  <div id="filmstrip-track" class="filmstrip-track"></div>
</div>

<!-- Con Passport panel -->
<div id="passport-panel" class="passport-panel" style="display:none;">
  <div class="passport-header">
    <span class="passport-icon">🛂</span>
    <div>
      <h2>Con Passport</h2>
      <p>Achievements unlocked through expeditions, service, and miles on the road.</p>
    </div>
  </div>
  <div id="passport-badges" class="passport-badges"></div>
</div>

<script>
  window.switchTab = function(btn, targetId, parentClass) {
    const container = btn.closest('.' + parentClass);
    container.querySelectorAll('.tooltip-tab-btn').forEach(b => b.classList.remove('active'));
    container.querySelectorAll('.tooltip-tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    container.querySelector('#' + targetId).classList.add('active');
  };

  window.focusMapEvent = function(locIndex, tabId, lat, lng) {
    document.getElementById('map-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      window.tracksMap.flyTo([lat, lng], 9, { duration: 1.2 });
      setTimeout(() => {
        const marker = window.tracksMapMarkers[locIndex];
        if (marker) {
          marker.openPopup();
          setTimeout(() => {
            const tabBtn = document.querySelector(`.tooltip-tab-btn[onclick*="${tabId}"]`);
            if (tabBtn) tabBtn.click();
          }, 50);
        }
      }, 1250);
    }, 150);
  };

  document.addEventListener('DOMContentLoaded', async function() {
    const HOME_BASE = [39.2904, -76.6122]; // Baltimore, MD

    var map = L.map('map-container').setView([41.5, -73.5], 6);
    window.tracksMap = map;
    window.tracksMapMarkers = {};

    const arcLayer = L.layerGroup().addTo(map);

    function arcPoints(from, to) {
      var steps = 40, curvature = 0.25;
      var midLat = (from[0] + to[0]) / 2;
      var midLng = (from[1] + to[1]) / 2;
      var dLat = to[0] - from[0];
      var dLng = to[1] - from[1];
      var ctrl = [midLat - dLng * curvature, midLng + dLat * curvature];
      var pts = [];
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        pts.push([
          (1-t)*(1-t)*from[0] + 2*(1-t)*t*ctrl[0] + t*t*to[0],
          (1-t)*(1-t)*from[1] + 2*(1-t)*t*ctrl[1] + t*t*to[1]
        ]);
      }
      return pts;
    }

    function drawArc(from, to, color, opacity, weight, dashed) {
      return L.polyline(arcPoints(from, to), {
        color: color || '#FF6700',
        weight: weight || 2,
        opacity: opacity != null ? opacity : 0.6,
        dashArray: dashed ? '5 8' : null,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(arcLayer);
    }

    function buildCompanionsHtml(hist, small) {
      var parts = [];
      if (hist.withHyper) parts.push('<a href="https://hypercat.me/" target="_blank" rel="noopener" class="hypercat-tag" onclick="event.stopPropagation()">Hyper</a>');
      if (hist.companions && hist.companions.length > 0) {
        hist.companions.forEach(function(name) { parts.push('<span class="companion-tag">' + name + '</span>'); });
      }
      if (parts.length === 0) return '';
      var style = small
        ? 'font-size: 0.85em; color: var(--muzzle-grey); margin-bottom: 8px;'
        : 'margin-top: 10px; font-size: 0.9em; color: var(--muzzle-grey);';
      return '<div style="' + style + '">Traveled with: ' + parts.join(' ') + '</div>';
    }

    function getWeatherInfo(code) {
      if (code === 0) return { icon: '☀️', color: '#FFD700' };
      if (code <= 3) return { icon: '⛅', color: '#90CAF9' };
      if (code <= 48) return { icon: '🌫️', color: '#B0BEC5' };
      if (code <= 67) return { icon: '🌧️', color: '#26C6DA' };
      if (code <= 77) return { icon: '❄️', color: '#E1F5FE' };
      if (code <= 82) return { icon: '🌧️', color: '#26C6DA' };
      if (code >= 95) return { icon: '⛈️', color: '#B39DDB' };
      return { icon: '☁️', color: '#9E9E9E' };
    }

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Fullscreen toggle control
    var fsControl = L.control({ position: 'topleft' });
    fsControl.onAdd = function() {
      var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      var a = L.DomUtil.create('a', '', div);
      a.href = '#';
      a.title = 'Toggle fullscreen';
      a.innerHTML = '&#x26F6;';
      a.style.cssText = 'font-size:15px;display:flex;align-items:center;justify-content:center;width:34px;height:34px;text-decoration:none;';
      L.DomEvent.on(a, 'click', function(e) {
        L.DomEvent.preventDefault(e);
        const mapEl = document.getElementById('map-container');
        mapEl.classList.toggle('fullscreen');
        a.innerHTML = mapEl.classList.contains('fullscreen') ? '&#x2715;' : '&#x26F6;';
        map.invalidateSize();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          const mapEl = document.getElementById('map-container');
          if (mapEl.classList.contains('fullscreen')) {
            mapEl.classList.remove('fullscreen');
            a.innerHTML = '&#x26F6;';
            map.invalidateSize();
          }
        }
      });
      return div;
    };
    fsControl.addTo(map);

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <div><span style="background: #FF6700"></span> Convention</div>
        <div><span style="background: #FFB300"></span> Trip / Photo</div>
        <div><span style="background: #9333EA"></span> Shutterpaws</div>
        <div><span style="background: #EF4444"></span> Special Event</div>
      `;
      return div;
    };
    legend.addTo(map);

    let eventsData = [];
    try {
      const response = await fetch('/data/events.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load events.json`);
      const textData = await response.text();
      if (!textData || textData.trim() === '') throw new Error('The events.json file is completely empty (0 bytes).');
      eventsData = JSON.parse(textData);
    } catch (error) {
      console.error("Error loading events data:", error);
      document.getElementById('map-container').insertAdjacentHTML('afterbegin', `<div style="position: absolute; z-index: 1000; top: 10px; left: 50%; transform: translateX(-50%); background: var(--color-con); color: #fff; padding: 8px 16px; border-radius: 20px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.5); text-align: center;">⚠️ Error: Could not load map locations (${error.message}).<br><br>Please make sure <b>events.json</b> is saved inside the <b>content/static/data/</b> directory, NOT the <b>content/content/</b> directory!</div>`);
      return;
    }

    const markerBounds = [];
    let totalMiles = 0;
    const now = new Date();
    const allExposures = [];
    const markerYears = {};

    function getAlbumEmoji(name) {
      const n = name.toLowerCase();
      if (n.includes('parade')) return '🐾';
      if (n.includes('dance')) return '💃';
      return '📸';
    }

    function parseStartDate(dateStr, yearStr) {
      const yearInDate = dateStr.match(/\b(20\d{2})\b/);
      const resolvedYear = yearInDate ? yearInDate[1] : yearStr;
      const match = dateStr.match(/([a-zA-Z]+)\s+(\d+)/);
      if (match) return new Date(`${match[1]} ${match[2]}, ${resolvedYear}`);
      return new Date(resolvedYear, 0, 1);
    }

    function getSeason(date) {
      const m = date.getMonth();
      if (m === 11 || m === 0 || m === 1) return { name: 'Winter', class: 'season-winter' };
      if (m >= 2 && m <= 4) return { name: 'Spring', class: 'season-spring' };
      if (m >= 5 && m <= 7) return { name: 'Summer', class: 'season-summer' };
      return { name: 'Autumn', class: 'season-autumn' };
    }

    function computeStreak(history) {
      if (history.length < 2) return 0;
      const years = history.map(h => parseInt(h.year)).sort((a, b) => b - a);
      let streak = 1;
      for (let i = 0; i < years.length - 1; i++) {
        if (years[i] - years[i + 1] === 1) streak++;
        else break;
      }
      return streak >= 2 ? streak : 0;
    }

    // Process markers
    eventsData.forEach((loc, locIndex) => {
      const latLng = [loc.coordinates[1], loc.coordinates[0]];
      markerBounds.push(latLng);
      markerYears[locIndex] = loc.history.map(h => h.year);

      const streak = computeStreak(loc.history);
      const streakHtml = streak >= 2
        ? `<div class="streak-badge">🔥 ${streak}-Year Streak</div>`
        : '';

      let tabsHtml = '';
      let contentHtml = '';
      const popupId = `popup-wrap-${locIndex}`;
      const hasUpcoming = loc.history.some(h => parseStartDate(h.dates, h.year) >= now);

      loc.history.forEach((hist, histIdx) => {
        const isActive = histIdx === 0 ? 'active' : '';
        const tabId = `tab-${locIndex}-${hist.year}`;

        tabsHtml += `<button class="tooltip-tab-btn ${isActive}" onclick="window.switchTab(this, '${tabId}', '${popupId}')">'${hist.year.slice(2)}</button>`;

        if (hist.roundTripMiles) totalMiles += hist.roundTripMiles;

        const parsedDate = parseStartDate(hist.dates, hist.year);
        allExposures.push({ ...hist, locationName: loc.locationName, type: loc.type, dateObj: parsedDate, coords: latLng, locIndex, tabId });

        let pillsHtml = '';
        if (hist.albums && Object.keys(hist.albums).length > 0) {
          pillsHtml = '<div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">';
          for (const [albumName, url] of Object.entries(hist.albums)) {
            pillsHtml += `<a href="${url}" target="_blank" class="album-pill">${getAlbumEmoji(albumName)} ${albumName}</a>`;
          }
          pillsHtml += '</div>';
        }

        const companionsHtml = buildCompanionsHtml(hist, false);

        const roleClass = hist.role ? `role-${hist.role.toLowerCase()}` : 'role-unknown';
        const roleDisplay = hist.role ? `<span class="${roleClass}" style="font-size: 0.85em; vertical-align: middle; margin-left: 4px;">(${hist.role})</span>` : '';

        contentHtml += `
          <div id="${tabId}" class="tooltip-tab-content ${isActive}">
            <div style="font-weight: 800; font-size: 1.25em; color: var(--eye-highlight); margin-bottom: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${hist.eventName}
            </div>
            <div style="color: var(--secondary); font-size: 0.95em; margin-bottom: 12px; font-weight: 500;">
              ${loc.locationName} ${roleDisplay}
            </div>
            <div style="background: color-mix(in srgb, var(--nose-dark) 40%, transparent); padding: 8px 12px; border-radius: 8px; font-size: 0.9em; color: var(--muzzle-grey); display: inline-block; text-align: left; margin: 0 auto;">
              <div style="margin-bottom: 4px;">📅 <span style="color: var(--primary); margin-left: 6px;">${hist.dates}</span></div>
              <div>📍 <span style="color: var(--primary); margin-left: 6px;">${hist.venue}</span></div>
            </div>
            ${companionsHtml}
            ${pillsHtml}
          </div>
        `;
      });

      const iconSize = hasUpcoming ? 30 : 24;
      const iconAnchor = hasUpcoming ? 15 : 12;
      var pawIcon = L.divIcon({
        html: `<div class="paw-icon" style="font-size: ${iconSize}px; line-height: 1; cursor: pointer;">🐾</div>`,
        className: `paw-marker type-${loc.type}${hasUpcoming ? ' upcoming' : ''}`,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconAnchor, iconAnchor],
        popupAnchor: [0, -iconAnchor]
      });

      const finalPopupHtml = `
        <div class="${popupId}">
          ${streakHtml}
          <div class="tooltip-tabs">${tabsHtml}</div>
          ${contentHtml}
        </div>
      `;

      const marker = L.marker(latLng, { icon: pawIcon }).addTo(map).bindPopup(finalPopupHtml);
      window.tracksMapMarkers[locIndex] = marker;
    });

    // Draw permanent faint arcs from home base to each non-local location
    eventsData.forEach(function(loc) {
      var locLat = loc.coordinates[1];
      var locLng = loc.coordinates[0];
      var dist = Math.hypot(locLat - HOME_BASE[0], locLng - HOME_BASE[1]);
      if (dist > 0.4) {
        drawArc(HOME_BASE, [locLat, locLng], '#FFF8F0', 0.07, 1, true);
      }
    });

    // Compute stats
    const totalMilesRounded = Math.round(totalMiles);
    const conventionCount = allExposures.filter(e => e.type === 'convention').length;
    const staffCount = allExposures.filter(e => e.role === 'Staff').length;
    const uniqueYears = [...new Set(allExposures.map(e => e.year))].sort((a, b) => b - a);
    const uniqueCities = [...new Set(eventsData.map(loc => loc.locationName.split(',')[0].trim()))].length;
    const isInternational = eventsData.some(loc => loc.locationName.includes(', ON'));
    const countries = isInternational ? 2 : 1;

    // Render SCADA stats tiles
    const statsTilesEl = document.getElementById('stats-tiles-row');
    statsTilesEl.innerHTML = `
      <div class="stat-tile">
        <div class="stat-tile-icon">🛣️</div>
        <div class="stat-tile-value" id="odometer-miles">0</div>
        <div class="stat-tile-label">Total Miles</div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon">🎪</div>
        <div class="stat-tile-value">${conventionCount}</div>
        <div class="stat-tile-label">Con Appearances</div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon">📍</div>
        <div class="stat-tile-value">${uniqueCities}</div>
        <div class="stat-tile-label">Unique Cities</div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon">🌍</div>
        <div class="stat-tile-value">${countries}</div>
        <div class="stat-tile-label">Countries${isInternational ? ' 🇺🇸🇨🇦' : ' 🇺🇸'}</div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon">⭐</div>
        <div class="stat-tile-value">${staffCount}×</div>
        <div class="stat-tile-label">Staff Credits</div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon">📅</div>
        <div class="stat-tile-value">${uniqueYears.length}</div>
        <div class="stat-tile-label">Active Years</div>
      </div>
    `;
    document.getElementById('stats-box').style.display = 'block';

    // Odometer count-up on the Total Miles tile
    const odometerEl = document.getElementById('odometer-miles');
    function animateCountUp(element, target) {
      const start = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / 1800, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    const odometerObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(odometerEl, totalMilesRounded);
          odometerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    odometerObserver.observe(statsTilesEl);

    // Year filter row
    const yearFilterEl = document.getElementById('year-filter-row');
    yearFilterEl.innerHTML = `
      <span class="year-filter-label">Filter by Year:</span>
      <button class="year-chip active" data-year="all">All</button>
      ${uniqueYears.map(y => `<button class="year-chip" data-year="${y}">${y}</button>`).join('')}
    `;
    yearFilterEl.style.display = 'flex';

    yearFilterEl.querySelectorAll('.year-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        yearFilterEl.querySelectorAll('.year-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const activeYear = this.dataset.year;
        Object.entries(window.tracksMapMarkers).forEach(([idx, marker]) => {
          const years = markerYears[parseInt(idx)] || [];
          const show = activeYear === 'all' || years.includes(activeYear);
          if (show) { if (!map.hasLayer(marker)) marker.addTo(map); }
          else { map.removeLayer(marker); }
        });
      });
    });

    // Split upcoming / past
    const upcomingExposures = allExposures.filter(exp => exp.dateObj >= now);
    upcomingExposures.sort((a, b) => a.dateObj - b.dateObj);
    const pastExposures = allExposures.filter(exp => exp.dateObj < now);
    pastExposures.sort((a, b) => b.dateObj - a.dateObj);

    // Next 3 upcoming events strip
    const next3 = upcomingExposures.slice(0, 3);
    if (next3.length > 0) {
      const typeAccents = { convention: '#FF6700', shutterpaws: '#9333EA', event: '#EF4444', roadtrip: '#FFB300', photoshoot: '#FFB300' };
      const stripEl = document.getElementById('next-events-strip');
      stripEl.innerHTML = next3.map((exp, i) => {
        const daysUntil = Math.ceil((exp.dateObj - now) / (1000 * 60 * 60 * 24));
        const accent = typeAccents[exp.type] || '#FF6700';
        return `
          <div class="next-event-card type-${exp.type}${i === 0 ? ' primary' : ''}" id="next-card-${i}"
               style="--accent: ${accent};"
               onclick="window.focusMapEvent(${exp.locIndex}, '${exp.tabId}', ${exp.coords[0]}, ${exp.coords[1]})">
            ${i === 0 ? '<div class="next-event-label">NEXT DEPLOYMENT</div>' : ''}
            <div class="next-event-name">${exp.eventName}</div>
            <div class="next-event-countdown"><span>${daysUntil}</span> days</div>
            <div class="next-event-location">📍 ${exp.locationName}</div>
            <div class="next-event-dates">${exp.dates}</div>
            <div class="next-event-weather" id="next-weather-${i}">
              <span class="next-weather-icon">☁️</span>
              <span class="next-weather-temp">--°F</span>
            </div>
          </div>
        `;
      }).join('');
      document.getElementById('next-events-box').style.display = 'block';

      next3.forEach((exp, i) => {
        const [lat, lng] = exp.coords;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=fahrenheit`)
          .then(r => r.json())
          .then(data => {
            if (data.current_weather) {
              const wInfo = getWeatherInfo(data.current_weather.weathercode);
              const iconEl = document.querySelector(`#next-card-${i} .next-weather-icon`);
              const tempEl = document.querySelector(`#next-card-${i} .next-weather-temp`);
              if (iconEl) { iconEl.textContent = wInfo.icon; iconEl.style.filter = `drop-shadow(0 0 4px ${wInfo.color})`; }
              if (tempEl) tempEl.textContent = `${Math.round(data.current_weather.temperature)}°F`;
            }
          })
          .catch(() => {
            const el = document.getElementById(`next-weather-${i}`);
            if (el) el.style.display = 'none';
          });
      });
    }

    let activeTypeFilter = 'all';
    let showingUpcoming = true;

    const typeIcons = { convention: '🎪', roadtrip: '🚗', photoshoot: '📸', photography: '📸', shutterpaws: '🐾', event: '✨' };

    function applyFilters() {
      document.querySelectorAll('#filmstrip-track .event-card').forEach(card => {
        const t = card.dataset.type;
        const matches = activeTypeFilter === 'all' || t === activeTypeFilter || (activeTypeFilter === 'roadtrip' && t === 'photoshoot');
        card.style.display = matches ? '' : 'none';
      });
    }

    function renderFilmstrip(exposures) {
      const filmstripTrack = document.getElementById('filmstrip-track');
      const filmstripScroll = document.getElementById('upcoming-filmstrip');

      if (exposures.length === 0) {
        filmstripTrack.innerHTML = '<div style="color: var(--muzzle-grey); padding: 2rem 3rem; font-style: italic;">Nothing to show here yet.</div>';
        return;
      }

      let lastSeason = '';
      let trackHtml = '';

      exposures.forEach((exp, index) => {
        const seasonObj = getSeason(exp.dateObj);
        const seasonId = `${seasonObj.name} ${exp.dateObj.getFullYear()}`;

        if (seasonId !== lastSeason) {
          trackHtml += `<div class="season-divider ${seasonObj.class}">${seasonId}</div>`;
          lastSeason = seasonId;
        }

        const companionsHtml = buildCompanionsHtml(exp, true);

        const roleClass = exp.role ? `role-${exp.role.toLowerCase()}` : 'role-unknown';
        const roleDisplay = exp.role ? `<span class="${roleClass}" style="margin-left: 6px;">(${exp.role})</span>` : '';

        trackHtml += `
          <div class="event-card type-${exp.type}" data-type="${exp.type}" data-lat="${exp.coords[0]}" data-lng="${exp.coords[1]}" data-loc-index="${exp.locIndex}" onclick="window.focusMapEvent(${exp.locIndex}, '${exp.tabId}', ${exp.coords[0]}, ${exp.coords[1]})">
            <h3><span style="opacity: 0.8; font-size: 0.9em; margin-right: 4px;">${typeIcons[exp.type] || '📅'}</span> ${exp.eventName}</h3>
            <div style="color: var(--secondary); font-size: 0.9em; margin-bottom: ${exp.withHyper ? '4px' : '8px'};">📍 ${exp.locationName}${roleDisplay}</div>
            ${companionsHtml}
            <div style="font-size: 0.95em;">${exp.dates}</div>
            <div class="frame-meta">
              <span>FRM-${String(index + 1).padStart(2, '0')}</span>
              <span>${exp.roundTripMiles} MILES</span>
            </div>
          </div>
        `;
      });

      filmstripTrack.innerHTML = trackHtml;
      filmstripScroll.scrollLeft = 0;
      applyFilters();

      // Route arc hover listeners
      filmstripTrack.querySelectorAll('.event-card').forEach(card => {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        let hoverArc = null;
        card.addEventListener('mouseenter', function() {
          const dist = Math.hypot(lat - HOME_BASE[0], lng - HOME_BASE[1]);
          if (dist < 0.4) return;
          hoverArc = drawArc(HOME_BASE, [lat, lng], '#FF6700', 0.85, 3, false);
          const m = window.tracksMapMarkers[parseInt(card.dataset.locIndex)];
          if (m && m._icon) m._icon.classList.add('highlight');
        });
        card.addEventListener('mouseleave', function() {
          if (hoverArc) { arcLayer.removeLayer(hoverArc); hoverArc = null; }
          const m = window.tracksMapMarkers[parseInt(card.dataset.locIndex)];
          if (m && m._icon) m._icon.classList.remove('highlight');
        });
      });

      // Scroll hint nudge
      setTimeout(() => {
        filmstripScroll.scrollTo({ left: 50, behavior: 'smooth' });
        setTimeout(() => filmstripScroll.scrollTo({ left: 0, behavior: 'smooth' }), 500);
      }, 700);
    }

    if (allExposures.length > 0) {
      document.getElementById('upcoming-title').style.display = 'block';
      document.getElementById('upcoming-filmstrip').style.display = 'block';
      document.getElementById('filmstrip-controls').style.display = 'flex';

      if (upcomingExposures.length > 0) {
        renderFilmstrip(upcomingExposures);
      } else {
        showingUpcoming = false;
        document.getElementById('upcoming-title').textContent = 'Past Adventures';
        document.getElementById('toggle-upcoming').classList.remove('active');
        document.getElementById('toggle-past').classList.add('active');
        renderFilmstrip(pastExposures);
      }

      document.getElementById('toggle-upcoming').addEventListener('click', function() {
        if (showingUpcoming) return;
        showingUpcoming = true;
        this.classList.add('active');
        document.getElementById('toggle-past').classList.remove('active');
        document.getElementById('upcoming-title').textContent = 'Upcoming Adventures';
        renderFilmstrip(upcomingExposures);
      });

      document.getElementById('toggle-past').addEventListener('click', function() {
        if (!showingUpcoming) return;
        showingUpcoming = false;
        this.classList.add('active');
        document.getElementById('toggle-upcoming').classList.remove('active');
        document.getElementById('upcoming-title').textContent = 'Past Adventures';
        renderFilmstrip(pastExposures);
      });

      document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
          document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          this.classList.add('active');
          activeTypeFilter = this.dataset.type;
          applyFilters();
        });
      });
    }

    // Con Passport badges
    const allRoles = allExposures.map(e => (e.role || '').toLowerCase());
    const hasRole = r => allRoles.includes(r);
    const distinctRoleCount = [...new Set(allRoles.filter(r => r && r !== 'unknown'))].length;
    const hasNonFurryEvent = allExposures.some(e => e.furry === false);
    const hasPrideEvent = allExposures.some(e => e.eventName.toLowerCase().includes('pride'));
    const seasonNames = new Set(allExposures.map(e => getSeason(e.dateObj).name));
    const allSeasonsUnlocked = ['Winter', 'Spring', 'Summer', 'Autumn'].every(s => seasonNames.has(s));
    const eventTypesSet = new Set(allExposures.map(e => e.type));
    const wellRounded = ['convention', 'shutterpaws', 'event'].every(t => eventTypesSet.has(t)) && (eventTypesSet.has('roadtrip') || eventTypesSet.has('photoshoot'));
    const eventsWithCompanions = allExposures.filter(e => e.withHyper || (e.companions && e.companions.length > 0)).length;
    const photographerCount = allRoles.filter(r => r === 'photographer').length;
    const boardMemberCount = allRoles.filter(r => r === 'board member').length;
    const badges = [
      { icon: '🐾', name: 'First Steps',        desc: 'Attended your first convention',      unlocked: conventionCount >= 1 },
      { icon: '🎪', name: 'Convention Regular',  desc: '10+ convention appearances',          unlocked: conventionCount >= 10 },
      { icon: '🎭', name: 'Con Veteran',         desc: '25+ total appearances',               unlocked: allExposures.length >= 25 },
      { icon: '🛣️', name: 'Road Warrior',        desc: '5,000+ miles logged',                 unlocked: totalMilesRounded >= 5000 },
      { icon: '🚀', name: 'Megamiler',           desc: '10,000+ miles logged',                unlocked: totalMilesRounded >= 10000 },
      { icon: '🛸', name: 'Hyperdrive',          desc: '20,000+ miles logged',                unlocked: totalMilesRounded >= 20000 },
      { icon: '⭐', name: 'Staff Material',      desc: 'Earned a Staff credit',               unlocked: hasRole('staff') },
      { icon: '🤝', name: 'Volunteer Corps',     desc: 'Volunteered at an event',             unlocked: hasRole('volunteer') },
      { icon: '📋', name: 'Board Member',        desc: 'Shutterpaws board member',            unlocked: hasRole('board member') },
      { icon: '📸', name: 'Through the Lens',    desc: 'Attended as a photographer',          unlocked: hasRole('photographer') },
      { icon: '🌍', name: 'Border Hopper',       desc: 'Attended an event abroad',            unlocked: isInternational },
      { icon: '🌐', name: 'World Tour',          desc: 'Attended events in 3+ countries',     unlocked: countries >= 3 },
      { icon: '🔥', name: 'Streak Runner',       desc: '3+ year streak at one event',         unlocked: eventsData.some(l => computeStreak(l.history) >= 3) },
      { icon: '🏅', name: 'Veteran Paws',        desc: '4+ active years',                     unlocked: uniqueYears.length >= 4 },
      { icon: '🏙️', name: 'City Hopper',         desc: '10+ unique cities visited',           unlocked: uniqueCities >= 10 },
      { icon: '🎭', name: 'Multi-Role',           desc: 'Held 3+ distinct roles',              unlocked: distinctRoleCount >= 3 },
      { icon: '🎸', name: 'Off the Beaten Path',  desc: 'Attended a non-furry event',          unlocked: hasNonFurryEvent },
      { icon: '🏳️‍🌈', name: 'Pride Paw',           desc: 'Attended a Pride event',              unlocked: hasPrideEvent },
      { icon: '🌿', name: 'All Seasons',           desc: 'Attended events in all 4 seasons',   unlocked: allSeasonsUnlocked },
      { icon: '🧩', name: 'Well-Rounded',          desc: 'Attended all 4 event types',         unlocked: wellRounded },
      { icon: '🐺', name: 'Pack Leader',           desc: 'Traveled with companions to 5+ events', unlocked: eventsWithCompanions >= 5 },
      { icon: '📷', name: 'Serial Shooter',        desc: 'Attended as photographer 3+ times',  unlocked: photographerCount >= 3 },
      { icon: '🏛️', name: 'Founding Paws',         desc: 'Shutterpaws board member at 5+ events', unlocked: boardMemberCount >= 5 },
    ];

    const unlocked = badges.filter(b => b.unlocked);
    const locked = badges.filter(b => !b.unlocked);
    document.getElementById('passport-badges').innerHTML = [...unlocked, ...locked].map(b => `
      <div class="passport-badge ${b.unlocked ? 'unlocked' : 'locked'}" title="${b.desc}">
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
    `).join('');
    document.getElementById('passport-panel').style.display = 'block';

  });
</script>
