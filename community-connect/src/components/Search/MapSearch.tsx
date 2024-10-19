import React, { useState, useEffect } from 'react';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';

interface SearchResult {
  id: string;
  name: string;
  serviceType: string;
  location: string;
  availability: string;
  coordinates: { lat: number; lng: number };
}

const ChangeMapView: React.FC<{ center: LatLngExpression }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapSearch: React.FC<{ searchResults: SearchResult[] }> = ({ searchResults }) => {
  const defaultCenter: LatLngExpression = [51.505, -0.09]; // Default center
  const zoomLevel = 13;

  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);

  // Get user's current location with fallback on error
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const center = userLocation || (searchResults.length ? searchResults[0].coordinates : defaultCenter);

  return (
    <MapContainer center={center} zoom={zoomLevel} style={{ height: '70vh', width: '100%' }}>
      <ChangeMapView center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render dynamic markers based on search results */}
      {searchResults.map((result) => (
        <Marker key={result.id} position={[result.coordinates.lat, result.coordinates.lng]}>
          <Popup>
            <strong>{result.name}</strong><br />
            {result.serviceType} in {result.location}<br />
            Available on: {result.availability}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapSearch;
