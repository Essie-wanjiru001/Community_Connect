import React, { useState, useEffect } from 'react';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';

interface Business {
  id: number;
  name: string;
  position: LatLngExpression;
  description: string;
}

const ChangeMapView: React.FC<{ center: LatLngExpression }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapSearch: React.FC<{ searchResults: Business[] }> = ({ searchResults }) => {
  const defaultCenter: LatLngExpression = [51.505, -0.09]; // Default center
  const zoomLevel = 13;
  
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      });
    }
  }, []);

  const center = userLocation || (searchResults.length ? searchResults[0].position : defaultCenter);

  return (
    <MapContainer center={center} zoom={zoomLevel} style={{ height: '500px', width: '100%' }}>
      <ChangeMapView center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Add markers dynamically based on search results */}
      {searchResults.map((business) => (
        <Marker key={business.id} position={business.position}>
          <Popup>
            <strong>{business.name}</strong><br />
            {business.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapSearch;
