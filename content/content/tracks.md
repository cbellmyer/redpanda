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

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="map-container" style="height: 500px; width: 100%; border-radius: var(--radius); overflow: hidden; margin-top: 2rem; border: 2px solid var(--border);">
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
      { name: 'Anthrocon', location: 'Pittsburgh, PA', coords: [40.4406, -79.9959], info: '2024 (Attendee)<br>2025 (Attendee)' },
      { name: 'Furcationland', location: 'Portland, ME', coords: [43.6591, -70.2568], info: '2025 (Attendee)<br>2026 (Volunteer)' },
      { name: 'Furgeddaboutdit', location: 'Fairfield, NJ', coords: [40.8729, -74.2724], info: '2025 (Attendee)<br>2026 (Attendee)' },
      { name: 'New Year\'s Fur Ball', location: 'Newark, DE', coords: [39.6837, -75.7497], info: '2025 (Attendee)' },
      { name: 'FursonaCon', location: 'Virginia Beach, VA', coords: [36.8529, -75.9780], info: '2024 (Attendee)<br>2025 (Attendee)' },
      { name: 'Fur the \'More', location: 'Baltimore, MD', coords: [39.2904, -76.6122], info: '2025 (Attendee)<br>2026 (Volunteer)' },
      { name: 'Furnal Equinox', location: 'Toronto, ON', coords: [43.6532, -79.3832], info: '2025 (Attendee)<br>2026 (Volunteer)' },
      { name: 'CanFURence', location: 'Ottawa, ON', coords: [45.4215, -75.6972], info: '2025 (Attendee)' },
      { name: 'Furpocalypse', location: 'Stamford, CT', coords: [41.0534, -73.5387], info: '2025 (Attendee)<br>2026 (Attendee)' },
      { name: 'Eufuria', location: 'Albany, NY', coords: [42.6526, -73.7562], info: '2025 (Attendee)' },
      { name: 'Furrydelphia', location: 'Philadelphia, PA', coords: [39.9526, -75.1652], info: '2024 (Attendee)<br>2025 (Attendee)<br>2026 (Attendee)' },
      { name: 'Road Trip', location: 'Boston, MA', coords: [42.3601, -71.0589], info: '2025 (Photographer)' }
    ];

    const markerBounds = [];
    const allMarkers = [];
    const upcomingGrid = document.getElementById('upcoming-cons-grid');
    const upcomingTitle = document.getElementById('upcoming-title');
    let cardsHtml = '';

    function formatInfo(info) {
      return info
        .replace(/\(Attendee\)/g, '<span class="role-attendee">(Attendee)</span>')
        .replace(/\(Volunteer\)/g, '<span class="role-volunteer">(Volunteer)</span>')
        .replace(/\(Staff\)/g, '<span class="role-staff">(Staff)</span>')
        .replace(/\(Photographer\)/g, '<span class="role-photographer">(Photographer)</span>');
    }

    conventions.forEach((con, index) => {
      // Identify upcoming cons by checking for current/future years
      const isUpcoming = con.info.includes('2025') || con.info.includes('2026');
      let iconClass = 'paw-marker' + (isUpcoming ? ' upcoming' : '');

      const formattedInfo = formatInfo(con.info);

      // Generate card HTML for upcoming cons
      if (isUpcoming) {
        cardsHtml += `
          <div class="con-card" data-index="${index}">
            <h3>${con.name}</h3>
            <p class="location">📍 ${con.location}</p>
            <div class="roles">${formattedInfo}</div>
          </div>
        `;
      }

      var pawIcon = L.divIcon({
        html: '<div style="font-size: 24px; text-shadow: 2px 2px 2px rgba(0,0,0,0.5); line-height: 1; cursor: pointer;">🐾</div>',
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
