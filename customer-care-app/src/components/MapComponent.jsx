import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [sites, setSites] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    lat: '',
    lng: '',
    description: ''
  });
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

    // Load sites
    loadSites(leafletMap);

    return () => {
      leafletMap.remove();
      Object.values(groupsRef.current).forEach(group => group.clearLayers());
    };
  }, []);

  const loadSites = async (leafletMap) => {
    try {
      // Mock sites data - in real app, this would come from API
      const mockSites = [
        { id: 1, name: 'Main Office', lat: -1.312, lng: 36.822, description: 'Headquarters' },
        { id: 2, name: 'Branch A', lat: -1.315, lng: 36.825, description: 'Branch office' },
        { id: 3, name: 'Data Center', lat: -1.308, lng: 36.818, description: 'Primary data center' }
      ];
      
      setSites(mockSites);
      
      // Add site markers to map
      mockSites.forEach(site => {
        const siteIcon = L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDEzLjc0TDEyIDIwTDEwLjkxIDEzLjc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjZCIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=',
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24]
        });

        const marker = L.marker([site.lat, site.lng], { icon: siteIcon });
        
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h5>${site.name}</h5>
            <p>${site.description}</p>
            <p><strong>Coordinates:</strong><br>
            Lat: ${site.lat}<br>
            Lng: ${site.lng}</p>
            <button class="btn btn-sm btn-primary" onclick="window.editSite(${site.id})">Edit</button>
            <button class="btn btn-sm btn-danger ms-2" onclick="window.deleteSite(${site.id})">Delete</button>
          </div>
        `);
        
        groupsRef.current.site.addLayer(marker);
      });
    } catch (error) {
      console.error('Error loading sites:', error);
    }
  };

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

  const handleAddSite = async (e) => {
    e.preventDefault();
    
    const siteData = {
      ...newSite,
      lat: parseFloat(newSite.lat),
      lng: parseFloat(newSite.lng)
    };

    try {
      // Mock API call - in real app, this would be actual API
      const newSiteWithId = {
        ...siteData,
        id: Date.now()
      };
      
      setSites(prev => [...prev, newSiteWithId]);
      
      // Add to map
      const siteIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDEzLjc0TDEyIDIwTDEwLjkxIDEzLjc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjZCIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
      });

      const marker = L.marker([newSiteWithId.lat, newSiteWithId.lng], { icon: siteIcon });
      
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h5>${newSiteWithId.name}</h5>
          <p>${newSiteWithId.description}</p>
          <p><strong>Coordinates:</strong><br>
          Lat: ${newSiteWithId.lat}<br>
          Lng: ${newSiteWithId.lng}</p>
          <button class="btn btn-sm btn-primary" onclick="window.editSite(${newSiteWithId.id})">Edit</button>
          <button class="btn btn-sm btn-danger ms-2" onclick="window.deleteSite(${newSiteWithId.id})">Delete</button>
        </div>
      `);
      
      groupsRef.current.site.addLayer(marker);
      
      setNewSite({ name: '', lat: '', lng: '', description: '' });
      setShowAddForm(false);
      
      // Reload all data
      loadData();
    } catch (error) {
      console.error('Error adding site:', error);
    }
  };

  const handleMapClick = (e) => {
    if (!map) return;
    
    const { lat, lng } = e.latlng;
    setNewSite(prev => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    setShowAddForm(true);
  };

  useEffect(() => {
    if (!map) return;
    
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
        {role && ['admin', 'tech'].includes(role) && (
          <>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddForm(true)}
            >
              Add Site
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                if (map) {
                  map.on('click', handleMapClick);
                  alert('Click on the map to add a site at that location');
                }
              }}
            >
              Add Site (Click Map)
            </button>
          </>
        )}
        {canAddRouter && (
          <button className="btn btn-primary" onClick={() => { }}>
            Add Router
          </button>
        )}
      </div>
      
      {showAddForm && (
        <div className="card mb-3">
          <div className="card-header">
            <h5>Add New Site</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddSite}>
              <div className="mb-3">
                <label className="form-label">Site Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newSite.name} 
                  onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Latitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  className="form-control" 
                  value={newSite.lat} 
                  onChange={(e) => setNewSite({...newSite, lat: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Longitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  className="form-control" 
                  value={newSite.lng} 
                  onChange={(e) => setNewSite({...newSite, lng: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  value={newSite.description} 
                  onChange={(e) => setNewSite({...newSite, description: e.target.value})}
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Site</button>
              <button 
                type="button" 
                className="btn btn-secondary ms-2" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div id="map" ref={mapRef} style={{ height: '70vh', width: '100%' }} />
    </div>
  );
};

export default MapComponent;
