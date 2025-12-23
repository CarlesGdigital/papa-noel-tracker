import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SantaPosition, getTrajectoryPath } from '@/lib/santaTracking';
import { SANTA_VILLAGE } from '@/lib/waypoints';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  lat: number;
  lon: number;
  city_label: string;
}

interface SantaMapProps {
  santaPosition: SantaPosition;
  currentTime: Date;
  selectedProfile: Profile | null;
  isTracking: boolean;
}

// Create custom icons
const createSantaIcon = () => {
  return L.divIcon({
    html: `<div style="font-size: 36px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🎅</div>`,
    className: 'santa-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createVillageIcon = () => {
  return L.divIcon({
    html: `<div style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🏠</div>`,
    className: 'village-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createHomeIcon = (avatar: string) => {
  return L.divIcon({
    html: `<div style="font-size: 28px; background: hsl(145 60% 25% / 0.8); padding: 4px; border-radius: 50%; border: 2px solid hsl(45 90% 55%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${avatar}</div>`,
    className: 'home-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to handle map movements
function MapController({ selectedProfile, santaPosition }: { selectedProfile: Profile | null; santaPosition: SantaPosition }) {
  const map = useMap();
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (selectedProfile && !hasMovedRef.current) {
      map.flyTo([selectedProfile.lat, selectedProfile.lon], 8, { duration: 1 });
      hasMovedRef.current = true;
    }
  }, [selectedProfile, map]);

  // Reset when profile changes
  useEffect(() => {
    hasMovedRef.current = false;
  }, [selectedProfile?.id]);

  return null;
}

export function SantaMap({ santaPosition, currentTime, selectedProfile, isTracking }: SantaMapProps) {
  const [trajectoryPath, setTrajectoryPath] = useState<[number, number][]>([]);
  
  useEffect(() => {
    if (isTracking) {
      setTrajectoryPath(getTrajectoryPath(currentTime));
    }
  }, [currentTime, isTracking]);

  const santaIcon = createSantaIcon();
  const villageIcon = createVillageIcon();

  return (
    <MapContainer
      center={[40.4168, -3.7038]} // Madrid as default center
      zoom={4}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MapController selectedProfile={selectedProfile} santaPosition={santaPosition} />

      {/* Trajectory path */}
      {trajectoryPath.length > 1 && (
        <Polyline
          positions={trajectoryPath}
          pathOptions={{
            color: '#c9302c',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 5',
          }}
        />
      )}

      {/* Santa Claus Village marker */}
      <Marker position={[SANTA_VILLAGE.lat, SANTA_VILLAGE.lon]} icon={villageIcon}>
        <Popup>
          <div className="text-center">
            <p className="font-bold">🏠 Santa Claus Village</p>
            <p className="text-xs text-gray-600">Rovaniemi, Laponia</p>
          </div>
        </Popup>
      </Marker>

      {/* Santa marker */}
      {isTracking && (
        <Marker 
          position={[santaPosition.lat, santaPosition.lon]} 
          icon={santaIcon}
        >
          <Popup>
            <div className="text-center">
              <p className="font-bold">🎅 ¡Papá Noel!</p>
              <p className="text-xs text-gray-600">{santaPosition.currentSegmentLabel}</p>
              <p className="text-xs">Velocidad: {santaPosition.speed.toLocaleString()} km/h</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Selected home marker */}
      {selectedProfile && (
        <Marker 
          position={[selectedProfile.lat, selectedProfile.lon]} 
          icon={createHomeIcon(selectedProfile.avatar)}
        >
          <Popup>
            <div className="text-center">
              <p className="font-bold">{selectedProfile.avatar} Casa de {selectedProfile.name}</p>
              <p className="text-xs text-gray-600">{selectedProfile.city_label.split(',')[0]}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
