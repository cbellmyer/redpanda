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

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize map without a default view; we'll set it automatically.
    var map = L.map('map-container');

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    var pawIcon = L.divIcon({
      html: '<div style="font-size: 24px; text-shadow: 2px 2px 2px rgba(0,0,0,0.5); line-height: 1; cursor: pointer;">🐾</div>',
      className: 'paw-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });

    const conventions = [
      { name: 'Anthrocon', location: 'Pittsburgh, PA', coords: [40.4406, -79.9959], info: '2024 (Attendee)<br>2025 (Attendee)', logo: '/images/logos/anthrocon.png' },
      { name: 'Furcationland', location: 'Portland, ME', coords: [43.6591, -70.2568], info: '2025 (Attendee)<br>2026 (Volunteer)', logo: '/images/logos/furcationland.png' },
      { name: 'Furgeddaboutdit', location: 'Parsippany, NJ', coords: [40.8653, -74.4173], info: '2025 (Attendee)<br>2026 (Attendee)', logo: '/images/logos/furgeddaboutdit.png' },
      { name: 'New Year\'s Fur Ball', location: 'Newark, DE', coords: [39.6837, -75.7497], info: '2025 (Attendee)', logo: '/images/logos/nyfb.png' },
      { name: 'FursonaCon', location: 'Virginia Beach, VA', coords: [36.8529, -75.9780], info: '2024 (Attendee)<br>2025 (Attendee)', logo: '/images/logos/fursonacon.png' },
      { name: 'Fur the \'More', location: 'Arlington, VA', coords: [38.8483, -77.0514], info: '2025 (Attendee)<br>2026 (Volunteer)', logo: '/images/logos/ftm.png' },
      { name: 'Furnal Equinox', location: 'Toronto, ON', coords: [43.6532, -79.3832], info: '2025 (Attendee)<br>2026 (Volunteer)', logo: '/images/logos/furnal-equinox.png' },
      { name: 'CanFURence', location: 'Ottawa, ON', coords: [45.4215, -75.6972], info: '2025 (Attendee)', logo: '/images/logos/canfurence.png' },
      { name: 'Furpocalypse', location: 'Cromwell, CT', coords: [41.5959, -72.6437], info: '2025 (Attendee)', logo: '/images/logos/furpocalypse.png' },
      { name: 'Eufuria', location: 'Albany, NY', coords: [42.6526, -73.7562], info: '2025 (Attendee)', logo: '/images/logos/eufuria.png' },
      { name: 'Furrydelphia', location: 'Philadelphia, PA', coords: [39.9526, -75.1652], info: '2024 (Attendee)<br>2025 (Attendee)', logo: '/images/logos/furrydelphia.png' }
    ];

    const markerBounds = [];

    function formatInfo(info) {
      return info
        .replace(/\(Attendee\)/g, '<span class="role-attendee">(Attendee)</span>')
        .replace(/\(Volunteer\)/g, '<span class="role-volunteer">(Volunteer)</span>')
        .replace(/\(Staff\)/g, '<span class="role-staff">(Staff)</span>')
        .replace(/\(Photographer\)/g, '<span class="role-photographer">(Photographer)</span>');
    }

    conventions.forEach(con => {
      const logoHtml = con.logo ? `<img src="${con.logo}" alt="${con.name} logo" class="con-logo">` : '';
      const formattedInfo = formatInfo(con.info);
      const popupContent = `${logoHtml}<b>${con.name}</b><br>${con.location}<br><br>${formattedInfo}`;
      const marker = L.marker(con.coords, {icon: pawIcon}).addTo(map).bindPopup(popupContent);
      markerBounds.push(con.coords);
    });

    // Automatically zoom the map to fit all markers with some padding
    if (markerBounds.length > 0) {
      map.fitBounds(markerBounds, { padding: [50, 50] });
    }
  });
</script>
