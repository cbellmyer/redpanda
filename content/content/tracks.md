---
title: "Panda Tracks 🐾"
description: "A map of all the conventions and places I've left my paw prints!"
type: "page"
ShowToc: false
ShowPostMeta: false
ShowBreadCrumbs: false
---

<style>
  .post-header {
    text-align: center;
  }
</style>

> **Welcome to my travel map!** 🗺️✨
>
> This is where I keep track of all the conventions, furmeets, and fun places I've visited around the world. Click on any of the bouncing paw prints below to see the details!

<div id="next-con-widget" class="next-con-widget" style="display: none;">
  <div class="widget-header">Next Deployment</div>
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
<div id="upcoming-cons-grid" class="upcoming-grid"></div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize map without a default view; we'll set it automatically.
    var map = L.map('map-container');

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    const conventions = [
      { name: 'Anthrocon', location: 'Pittsburgh, PA', coords: [40.4406, -79.9959], info: '2024 (Attendee)<br>2025 (Attendee)', dates: ['2024-07-04', '2025-07-03'] },
      { name: 'Furcationland', location: 'Portland, ME', coords: [43.6591, -70.2568], info: '2025 (Attendee)<br>2026 (Volunteer)<br>2027 (Staff)', dates: ['2025-04-11', '2026-04-10', '2027-04-09'] },
      { name: 'Furgeddaboutdit', location: 'Fairfield, NJ', coords: [40.8729, -74.2724], info: '2025 (Attendee)<br>2026 (Volunteer)<br>2027 (Unknown)', dates: ['2025-05-01', '2026-04-23', '2027-04-22'] },
      { name: 'New Year\'s Fur Ball', location: 'Newark, DE', coords: [39.6837, -75.7497], info: '2025 (Attendee)', dates: ['2025-12-31'] },
      { name: 'FursonaCon', location: 'Newport News, VA', coords: [37.0857, -76.4944], info: '2024 (Attendee)<br>2025 (Attendee)<br>2026 (Staff)', dates: ['2024-09-05', '2025-09-04', '2026-09-03'] },
      { name: 'Fur the \'More', location: 'Baltimore, MD', coords: [39.2904, -76.6122], info: '2025 (Attendee)<br>2026 (Volunteer)<br>2027 (Staff)', dates: ['2025-04-04', '2026-04-10', '2027-04-09'] },
      { name: 'Furnal Equinox', location: 'Toronto, ON', coords: [43.6532, -79.3832], info: '2025 (Attendee)<br>2026 (Volunteer)<br>2027 (Unknown)', dates: ['2025-03-14', '2026-03-20', '2027-03-19'] },
      { name: 'CanFURence', location: 'Ottawa, Canada', coords: [45.4215, -75.6972], info: '2025 (Attendee)<br>2027 (Unknown)', dates: ['2025-08-01', '2027-08-06'] },
      { name: 'Furpocalypse', location: 'Stamford, CT', coords: [41.0534, -73.5387], info: '2025 (Attendee)<br>2026 (Staff)', dates: ['2025-10-30', '2026-10-29'] },
      { name: 'Eufuria', location: 'Albany, NY', coords: [42.6526, -73.7562], info: '2025 (Attendee)', dates: ['2025-04-18'] },
      { name: 'Furrydelphia', location: 'Philadelphia, PA', coords: [39.9526, -75.1652], info: '2024 (Attendee)<br>2025 (Attendee)<br>2026 (Staff)', dates: ['2024-08-09', '2025-08-08', '2026-08-14'] },
      { name: 'Road Trip', location: 'Boston, MA', coords: [42.3601, -71.0589], info: '2025 (Photographer)', dates: ['2025-06-01'] }
    ];

    const markerBounds = [];
    const allMarkers = [];
    const upcomingGrid = document.getElementById('upcoming-cons-grid');
    const upcomingTitle = document.getElementById('upcoming-title');
    let cardsHtml = '';
    const currentYear = new Date().getFullYear();
    const upcomingCardsData = [];

    function formatInfo(info) {
      return info
        .replace(/\(Attendee\)/g, '<span class="role-attendee">(Attendee)</span>')
        .replace(/\(Volunteer\)/g, '<span class="role-volunteer">(Volunteer)</span>')
        .replace(/\(Staff\)/g, '<span class="role-staff">(Staff)</span>')
        .replace(/\(Photographer\)/g, '<span class="role-photographer">(Photographer)</span>')
        .replace(/\(Unknown\)/g, '<span class="role-unknown">(Unknown)</span>');
    }

    conventions.forEach((con, index) => {
      // Identify upcoming cons by checking for current/future years
      const years = con.info.match(/\b20\d{2}\b/g) || [];
      const isUpcoming = years.some(year => parseInt(year, 10) >= currentYear);
      let iconClass = 'paw-marker' + (isUpcoming ? ' upcoming' : '');

      const formattedInfo = formatInfo(con.info);

      // Generate card HTML for upcoming cons
      if (isUpcoming) {
        // Find the earliest upcoming year for sorting
        const upcomingYears = years.map(y => parseInt(y, 10)).filter(y => y >= currentYear);
        const earliestYear = Math.min(...upcomingYears);

        // Filter the info to only show current or future years on the cards
        const upcomingInfo = con.info.split('<br>').filter(line => {
          const yearMatch = line.match(/\b20\d{2}\b/);
          return yearMatch && parseInt(yearMatch[0], 10) >= currentYear;
        }).join('<br>');
        const formattedCardInfo = formatInfo(upcomingInfo);

        upcomingCardsData.push({
          year: earliestYear,
          html: `
            <div class="con-card" data-index="${index}">
              <h3>${con.name}</h3>
              <p class="location">📍 ${con.location}</p>
              <div class="roles">${formattedCardInfo}</div>
            </div>
          `
        });
      }

      var pawIcon = L.divIcon({
        html: '<div class="paw-icon" style="font-size: 24px; line-height: 1; cursor: pointer;">🐾</div>',
        className: iconClass,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      const popupContent = `<b>${con.name}</b><br>${con.location}<br><br>${formattedInfo}`;
      const marker = L.marker(con.coords, {icon: pawIcon}).addTo(map).bindPopup(popupContent);
      markerBounds.push(con.coords);
      allMarkers[index] = marker;
    });

    // --- Odometer Calculation ---
    const homeCoords = [39.1640, -76.6250]; // Glen Burnie, MD

    function calculateDistance(coords1, coords2) {
      const R = 3958.8; // Radius of the Earth in miles
      const lat1 = coords1[0] * Math.PI/180;
      const lon1 = coords1[1] * Math.PI/180;
      const lat2 = coords2[0] * Math.PI/180;
      const lon2 = coords2[1] * Math.PI/180;

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    let totalMiles = 0;
    conventions.forEach(con => {
      const oneWayDistance = calculateDistance(homeCoords, con.coords);
      const roundTripDistance = oneWayDistance * 2;
      const numTrips = (con.info.match(/\b20\d{2}\b/g) || []).length;
      if (numTrips > 0) {
        totalMiles += roundTripDistance * numTrips;
      }
    });
    document.getElementById('odometer-miles').textContent = Math.round(totalMiles).toLocaleString();

    // --- Next Deployment Widget Logic ---
    const now = new Date();
    let nextEvent = null;
    let minDiff = Infinity;

    // Find the closest future date
    conventions.forEach(con => {
      if (con.dates) {
        con.dates.forEach(dateStr => {
          const eventDate = new Date(dateStr + 'T00:00:00'); // Ensure local time parsing
          const diff = eventDate - now;
          if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextEvent = { ...con, date: eventDate };
          }
        });
      }
    });

    if (nextEvent) {
      const daysUntil = Math.ceil(minDiff / (1000 * 60 * 60 * 24));
      document.getElementById('widget-con-name').textContent = nextEvent.name;
      document.getElementById('widget-days').textContent = daysUntil;
      document.getElementById('widget-location').textContent = nextEvent.location;
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
      const [lat, lon] = nextEvent.coords;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`)
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

    // Sort the cards chronologically by their earliest upcoming year
    if (upcomingCardsData.length > 0) {
      upcomingCardsData.sort((a, b) => a.year - b.year);
      cardsHtml = upcomingCardsData.map(card => card.html).join('');
    }

    // Insert cards into the page if we found any
    if (cardsHtml) {
      upcomingGrid.innerHTML = cardsHtml;
      upcomingTitle.style.display = 'block';

      // Attach hover events to cards to highlight map markers
      const cards = upcomingGrid.querySelectorAll('.con-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          const index = card.getAttribute('data-index');
          const marker = allMarkers[index];
          if (marker && marker._icon) {
            marker._icon.classList.add('highlight');
            marker.setZIndexOffset(1000); // Bring marker to the front
          }
        });
        card.addEventListener('mouseleave', () => {
          const index = card.getAttribute('data-index');
          const marker = allMarkers[index];
          if (marker && marker._icon) {
            marker._icon.classList.remove('highlight');
            marker.setZIndexOffset(0); // Reset z-index
          }
        });
      });
    }

    // Automatically zoom the map to fit all markers with some padding
    if (markerBounds.length > 0) {
      map.fitBounds(markerBounds, { padding: [50, 50] });
    }
  });
</script>
