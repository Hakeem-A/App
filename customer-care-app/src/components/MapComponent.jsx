import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const { userRole: role } = useAuth();
  const dataContext = useContext(DataContext);
  const canAddRouter = dataContext?.canAddRouter || false;
  const groupsRef = useRef({
    route_point: L.layerGroup(),
    closure: L.layerGroup(),
    building: L.layerGroup(),
    client: L.layerGroup(),
    fat: L.layerGroup(),
    switch: L.layerGroup(),
    adapter: L.layerGroup(),
    site: L.layerGroup(),
    router: L.layerGroup()
  });

  useEffect(() => {
    if (!mapRef.current) return;

    const leafletMap = L.map(mapRef.current).setView([-1.312, 36.822], 16);
    setMap(leafletMap);

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OSM'
    });
    
    const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '© Esri'
    });

    const baseLayers = { "OpenStreetMap": osm, "Satellite": esri };
    osm.addTo(leafletMap);

    const overlays = {
      'Routes': groupsRef.current.route_point,
      'Closures': groupsRef.current.closure,
      'Buildings': groupsRef.current.building,
      'Clients': groupsRef.current.client,
      'FATs': groupsRef.current.fat,
      'Switches': groupsRef.current.switch,
      'Adapter Boxes': groupsRef.current.adapter,
      'Sites': groupsRef.current.site,
      'Routers': groupsRef.current.router
    };

    Object.values(groupsRef.current).forEach(group => group.addTo(leafletMap));
    L.control.layers(baseLayers, overlays).addTo(leafletMap);

    return () => {
      leafletMap.remove();
      Object.values(groupsRef.current).forEach(group => group.clearLayers());
    };
  }, []);

  const loadData = () => {
    fetch('/api/map-data')
      .then(r => r.json())
      .then(items => {
        Object.values(groupsRef.current).forEach(g => g.clearLayers());
        const routeCoords = [];
        items.forEach(i => {
          const marker = L.circleMarker([i.lat, i.lng], { radius: 6 });
          marker.bindPopup(`<b>${i.type}</b><br>${i.name}`);
          groupsRef.current[i.type]?.addLayer(marker);
          if (i.type === 'route_point') routeCoords.push([i.lat, i.lng]);
        });
        if (routeCoords.length) {
          L.polyline(routeCoords, { weight: 4 }).addTo(groupsRef.current.route_point);
        }
      });
  };

  useEffect(() => {
    if (!map) return;
    loadData();

    let adding = null;
    const handleMapClick = (e) => {
      if (!adding) return;
      const url = adding === 'site' ? '/api/add-site' : '/api/add-router';
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng, name: adding })
      }).then(async res => {
        if (!res.ok) {
          const j = await res.json();
          alert(j.error || 'Error');
          return;
        }
        adding = null;
        loadData();
      });
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
        {role && ['admin', 'tech'].includes(role) && (
          <button className="btn btn-primary" onClick={() => { adding = 'site'; }}>
            Add Site (click map)
          </button>
        )}
        {canAddRouter && (
          <button className="btn btn-primary" onClick={() => { adding = 'router'; }}>
            Add Router (click map)
          </button>
        )}
      </div>
      <div id="map" ref={mapRef} style={{ height: '70vh', width: '100%' }} />
    </div>
  );
};

export default MapComponent;
