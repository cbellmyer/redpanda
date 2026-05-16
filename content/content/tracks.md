---
title: "Panda Tracks 🐾"
description: "A map of all the conventions and places I've left my paw prints!"
type: "page"
ShowToc: false
ShowPostMeta: false
ShowBreadCrumbs: false
---

> **Welcome to my travel map!** 🗺️✨
>
> This is where I keep track of all the conventions, furmeets, and fun places I've visited around the world. Click on any of the bouncing paw prints below to see the details!

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

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="map-container" class="tracks-map"></div>

<div id="odometer-widget" class="odometer-widget">
  <div class="odometer-header">Total Deployment Mileage</div>
  <div class="odometer-value">
    <span id="odometer-miles">0</span> Miles
  </div>
</div>

<h2 class="upcoming-section-title" id="upcoming-title" style="display: none;">Upcoming Adventures</h2>
<div id="upcoming-filmstrip" class="filmstrip-scroll" style="display: none;">
  <div id="filmstrip-track" class="filmstrip-track"></div>
</div>

<script>
  // Tab Switcher for Tooltips
  window.switchTab = function(btn, targetId, parentClass) {
    const container = btn.closest('.' + parentClass);
    container.querySelectorAll('.tooltip-tab-btn').forEach(b => b.classList.remove('active'));
    container.querySelectorAll('.tooltip-tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    container.querySelector('#' + targetId).classList.add('active');
  };

  document.addEventListener('DOMContentLoaded', async function() {
    // Initialize map focused on the Northeast US
    var map = L.map('map-container').setView([41.5, -73.5], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Map Legend Control
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <div><span style="background: var(--color-con)"></span> Convention</div>
        <div><span style="background: var(--color-trip)"></span> Road Trip</div>
        <div><span style="background: var(--color-sp)"></span> Shutterpaws</div>
      `;
      return div;
    };
    legend.addTo(map);

    // Fetch Unified Data Schema
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
      return; // Stop execution if data fails to load
    }

    const markerBounds = [];
    let totalMiles = 0;
    const now = new Date();
    const allExposures = [];

    // Emoji helper for pills
    function getAlbumEmoji(name) {
      const n = name.toLowerCase();
      if (n.includes('parade')) return '🐾';
      if (n.includes('dance')) return '💃';
      return '📸';
    }

    // Date Parser helper for sorting/seasons
    function parseStartDate(dateStr, yearStr) {
      const match = dateStr.match(/([a-zA-Z]+)\s+(\d+)/);
      if (match) return new Date(`${match[1]} ${match[2]}, ${yearStr}`);
      return new Date(yearStr, 0, 1);
    }

    function getSeason(date) {
      const m = date.getMonth();
      if (m === 11 || m === 0 || m === 1) return { name: 'Winter', class: 'season-winter' };
      if (m >= 2 && m <= 4) return { name: 'Spring', class: 'season-spring' };
      if (m >= 5 && m <= 7) return { name: 'Summer', class: 'season-summer' };
      return { name: 'Autumn', class: 'season-autumn' };
    }

    // 1. Process Data & Map Markers
    eventsData.forEach((loc, locIndex) => {
      const latLng = [loc.coordinates[1], loc.coordinates[0]];
      markerBounds.push(latLng);

      let tabsHtml = '';
      let contentHtml = '';
      const popupId = `popup-wrap-${locIndex}`;

      loc.history.forEach((hist, histIdx) => {
        const isActive = histIdx === 0 ? 'active' : '';
        const tabId = `tab-${locIndex}-${hist.year}`;

        // Tab Button
        tabsHtml += `<button class="tooltip-tab-btn ${isActive}" onclick="window.switchTab(this, '${tabId}', '${popupId}')">'${hist.year.slice(2)}</button>`;

        // Distance Odometer Aggregation
        if (hist.roundTripMiles) totalMiles += hist.roundTripMiles;

        // Collect for timeline
        const parsedDate = parseStartDate(hist.dates, hist.year);
        allExposures.push({ ...hist, locationName: loc.locationName, type: loc.type, dateObj: parsedDate, coords: latLng });

        // Album Pills
        let pillsHtml = '';
        if (hist.albums && Object.keys(hist.albums).length > 0) {
          pillsHtml = '<div style="margin-top:10px;">';
          for (const [albumName, url] of Object.entries(hist.albums)) {
            pillsHtml += `<a href="${url}" target="_blank" class="album-pill">${getAlbumEmoji(albumName)} ${albumName}</a>`;
          }
          pillsHtml += '</div>';
        }

        // Tooltip Content Frame
        const hyperTag = hist.withHyper ? `<span class="hypercat-tag">[HYPER_LINK]</span>` : '';
        const roleClass = hist.role ? `role-${hist.role.toLowerCase()}` : 'role-unknown';
        const roleDisplay = hist.role ? `<span class="${roleClass}">(${hist.role})</span>` : '';

        contentHtml += `
          <div id="${tabId}" class="tooltip-tab-content ${isActive}">
            <div style="font-weight:bold; font-size:1.1em;">${hist.eventName} ${hyperTag}</div>
            <div style="color:var(--muzzle-grey); margin-bottom: 8px;">${loc.locationName} ${roleDisplay}</div>
            <div>📅 ${hist.dates}</div>
            <div>📍 ${hist.venue}</div>
            ${pillsHtml}
          </div>
        `;
      });

      var pawIcon = L.divIcon({
        html: '<div class="paw-icon" style="font-size: 24px; line-height: 1; cursor: pointer;">🐾</div>',
        className: `paw-marker type-${loc.type}`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      const finalPopupHtml = `
        <div class="${popupId}">
          <div class="tooltip-tabs">${tabsHtml}</div>
          ${contentHtml}
        </div>
      `;

      L.marker(latLng, {icon: pawIcon}).addTo(map).bindPopup(finalPopupHtml);
    });

    // Populate Odometer
    document.getElementById('odometer-miles').textContent = Math.round(totalMiles).toLocaleString();

    // 2. Filmstrip Timeline Generation (Upcoming)
    const upcomingExposures = allExposures.filter(exp => exp.dateObj >= now);
    upcomingExposures.sort((a, b) => a.dateObj - b.dateObj);

    if (upcomingExposures.length > 0) {
      document.getElementById('upcoming-title').style.display = 'block';
      const filmstripContainer = document.getElementById('upcoming-filmstrip');
      const filmstripTrack = document.getElementById('filmstrip-track');
      filmstripContainer.style.display = 'block';

      let lastSeason = '';
      let trackHtml = '';

      upcomingExposures.forEach((exp, index) => {
        const seasonObj = getSeason(exp.dateObj);
        const seasonId = `${seasonObj.name} ${exp.year}`;

        if (seasonId !== lastSeason) {
          trackHtml += `
            <div class="season-divider ${seasonObj.class}">
              ${seasonId}
            </div>
          `
          lastSeason = seasonId;
        }

        const hyperTag = exp.withHyper ? `<span class="hypercat-tag">[HYPER]</span>` : '';
        const roleClass = exp.role ? `role-${exp.role.toLowerCase()}` : 'role-unknown';
        const roleDisplay = exp.role ? `<span class="${roleClass}" style="margin-left: 6px;">(${exp.role})</span>` : '';

        trackHtml += `
          <div class="event-card">
            <h3>${exp.eventName} ${hyperTag}</h3>
            <div style="color: var(--secondary); font-size: 0.9em; margin-bottom: 8px;">📍 ${exp.locationName}${roleDisplay}</div>
            <div style="font-size: 0.95em;">${exp.dates}</div>
            <div class="frame-meta">
              <span>FRM-${String(index + 1).padStart(2, '0')}</span>
              <span>${exp.roundTripMiles} MILES</span>
            </div>
          </div>
        `;
      });

      filmstripTrack.innerHTML = trackHtml;
    }

    // 3. Next Deployment Widget (Weather Integration)
    // Filter specifically for the next convention (ignoring road trips/NPO business)
    const upcomingCons = upcomingExposures.filter(exp => exp.type === 'convention');
    if (upcomingCons.length > 0) {
      const nextEvent = upcomingCons[0];
      const daysUntil = Math.ceil((nextEvent.dateObj - now) / (1000 * 60 * 60 * 24));

      document.getElementById('widget-con-name').textContent = nextEvent.eventName;
      document.getElementById('widget-days').textContent = daysUntil;
      document.getElementById('widget-location').textContent = nextEvent.locationName;
      document.getElementById('next-con-widget').style.display = 'block';

      // Map WMO weather codes to emojis
      function getWeatherEmoji(code) {
        if (code === 0) return '☀️'; // Clear
        if (code === 1 || code === 2 || code === 3) return '⛅'; // Partly cloudy
        if (code >= 45 && code <= 48) return '🌫️'; // Fog
        if (code >= 51 && code <= 67) return '🌧️'; // Rain/Drizzle
        if (code >= 71 && code <= 77) return '❄️'; // Snow
        if (code >= 80 && code <= 82) return '🌧️'; // Showers
        if (code >= 95) return '⛈️'; // Thunderstorm
        return '☁️';
      }

      // Fetch current weather for the convention location
      const [lat, lng] = nextEvent.coords;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=fahrenheit`)
        .then(response => response.json())
        .then(data => {
          if (data.current_weather) {
            document.getElementById('widget-temp').textContent = Math.round(data.current_weather.temperature);
            document.getElementById('widget-weather-icon').textContent = getWeatherEmoji(data.current_weather.weathercode);
          }
        })
        .catch(err => {
          console.error("Failed to fetch weather data", err);
          document.querySelector('.weather').style.display = 'none'; // Hide weather on failure
        });
    }

  });
</script>
