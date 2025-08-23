import React, { useEffect } from 'react';
import L from 'leaflet';

const SiteLinkManager = ({ map, sites, layerGroup }) => {
  useEffect(() => {
    if (!map || !layerGroup) return;

    // Clear existing connections
    layerGroup.clearLayers();

    // Create an array of site coordinates
    const siteCoordinates = sites.map(site => [site.lat, site.lng]);

    // Draw a polyline connecting all sites with solid blue lines
    if (siteCoordinates.length > 1) {
      const polyline = L.polyline(siteCoordinates, {
        color: '#007bff', // Solid blue color
        weight: 5,
        opacity: 1 // Solid line
      }).addTo(layerGroup);

      polyline.bindPopup('Connection between all sites');
      
      // Add dots at each site location where the line meets a site
      sites.forEach(site => {
        const dot = L.circleMarker([site.lat, site.lng], {
          radius: 9,
          fillColor: '#007bff',
          color: '#ffffff',
          weight: 3,
          opacity: 1,
          fillOpacity: 1
        }).addTo(layerGroup);
        
        dot.bindPopup(`Connection point: ${site.name}`);
      });
    }
  }, [map, sites, layerGroup]);

  return null; // No UI needed for this functionality
};

export default SiteLinkManager;
