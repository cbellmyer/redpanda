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
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div class="widgets-row">
  <div id="next-con-widget" class="next-con-widget" style="display: none;">
    <div class="widget-header">Next Convention</div>
    <div class="widget-body">
      <div class="con-name" id="widget-con-name">Loading...</div>
      <div class="countdown"><span id="widget-days">0</span> Days</div>
      <div class="weather">
        <span class="weather-icon" id="widget-weather-icon">☁️</span>
        <span id="widget-temp">--</span>°F in <span id="widget-location">City</span>
      </div>
    </div>
  </div>
  <div id="odometer-widget" class="odometer-widget">
    <div class="odometer-header">Total Deployment Mileage</div>
    <div class="odometer-value">
      <span id="odometer-miles">0</span> Miles
    </div>
  </div>
</div>

<div id="map-stats" class="map-stats" style="display: none;"></div>

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
    var map = L.map('map-container').setView([41.5, -73.5], 6);
    window.tracksMap = map;
    window.tracksMapMarkers = {};

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
        <div><span style="background: #00E5FF"></span> Shutterpaws</div>
        <div><span style="background: #E040FB"></span> Special Event</div>
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

        let companionsHtml = '';
        if (hist.withHyper) {
          companionsHtml = `<div style="margin-top: 10px; font-size: 0.9em; color: var(--muzzle-grey);">Traveled with: <a href="https://hypercat.me/" target="_blank" rel="noopener" class="hypercat-tag" onclick="event.stopPropagation()">Hyper</a></div>`;
        }

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

    // Odometer with count-up animation via IntersectionObserver
    const totalMilesRounded = Math.round(totalMiles);
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
    odometerObserver.observe(document.getElementById('odometer-widget'));

    // Stats line
    const conventionCount = allExposures.filter(e => e.type === 'convention').length;
    const staffCount = allExposures.filter(e => e.role === 'Staff').length;
    const uniqueYears = [...new Set(allExposures.map(e => e.year))].length;
    const statsEl = document.getElementById('map-stats');
    statsEl.innerHTML = `
      <span>${conventionCount} Convention Appearances</span>
      <span class="stats-dot">·</span>
      <span>${staffCount}× Staff</span>
      <span class="stats-dot">·</span>
      <span>${uniqueYears} Active Years</span>
    `;
    statsEl.style.display = 'flex';

    // Split into upcoming / past
    const upcomingExposures = allExposures.filter(exp => exp.dateObj >= now);
    upcomingExposures.sort((a, b) => a.dateObj - b.dateObj);
    const pastExposures = allExposures.filter(exp => exp.dateObj < now);
    pastExposures.sort((a, b) => b.dateObj - a.dateObj);

    let activeTypeFilter = 'all';
    let showingUpcoming = true;

    const typeIcons = {
      convention: '🎪',
      roadtrip: '🚗',
      photoshoot: '📸',
      photography: '📸',
      shutterpaws: '🐾',
      event: '✨'
    };

    function applyFilters() {
      document.querySelectorAll('#filmstrip-track .event-card').forEach(card => {
        const t = card.dataset.type;
        const matches = activeTypeFilter === 'all'
          || t === activeTypeFilter
          || (activeTypeFilter === 'roadtrip' && t === 'photoshoot');
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

        let companionsHtml = '';
        if (exp.withHyper) {
          companionsHtml = `<div style="font-size: 0.85em; color: var(--muzzle-grey); margin-bottom: 8px;">Traveled with: <a href="https://hypercat.me/" target="_blank" rel="noopener" class="hypercat-tag" onclick="event.stopPropagation()">Hyper</a></div>`;
        }

        const roleClass = exp.role ? `role-${exp.role.toLowerCase()}` : 'role-unknown';
        const roleDisplay = exp.role ? `<span class="${roleClass}" style="margin-left: 6px;">(${exp.role})</span>` : '';

        trackHtml += `
          <div class="event-card type-${exp.type}" data-type="${exp.type}" onclick="window.focusMapEvent(${exp.locIndex}, '${exp.tabId}', ${exp.coords[0]}, ${exp.coords[1]})">
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

    // Next Convention Widget with weather
    const upcomingCons = upcomingExposures.filter(exp => exp.type === 'convention');
    if (upcomingCons.length > 0) {
      const nextEvent = upcomingCons[0];
      const daysUntil = Math.ceil((nextEvent.dateObj - now) / (1000 * 60 * 60 * 24));

      document.getElementById('widget-con-name').textContent = nextEvent.eventName;
      document.getElementById('widget-days').textContent = daysUntil;
      document.getElementById('widget-location').textContent = nextEvent.locationName;
      document.getElementById('next-con-widget').style.display = 'block';

      function getWeatherInfo(code) {
        if (code === 0) return { icon: '☀️', color: '#FFD700' };
        if (code === 1 || code === 2 || code === 3) return { icon: '⛅', color: '#90CAF9' };
        if (code >= 45 && code <= 48) return { icon: '🌫️', color: '#B0BEC5' };
        if (code >= 51 && code <= 67) return { icon: '🌧️', color: '#26C6DA' };
        if (code >= 71 && code <= 77) return { icon: '❄️', color: '#E1F5FE' };
        if (code >= 80 && code <= 82) return { icon: '🌧️', color: '#26C6DA' };
        if (code >= 95) return { icon: '⛈️', color: '#B39DDB' };
        return { icon: '☁️', color: '#9E9E9E' };
      }

      const [lat, lng] = nextEvent.coords;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=fahrenheit`)
        .then(response => response.json())
        .then(data => {
          if (data.current_weather) {
            document.getElementById('widget-temp').textContent = Math.round(data.current_weather.temperature);
            const weather = getWeatherInfo(data.current_weather.weathercode);
            const iconEl = document.getElementById('widget-weather-icon');
            iconEl.textContent = weather.icon;
            iconEl.style.filter = `drop-shadow(0 0 4px ${weather.color})`;
          }
        })
        .catch(err => {
          console.error("Failed to fetch weather data", err);
          document.querySelector('.weather').style.display = 'none';
        });
    }

  });
</script>
