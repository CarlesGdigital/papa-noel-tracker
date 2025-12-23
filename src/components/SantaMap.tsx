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
  showSantaAtVillage?: boolean;
}

// Create custom icons
const createSantaIcon = () => {
  return L.divIcon({
    html: `<div style="font-size: 40px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); animation: float 3s ease-in-out infinite;">🎅</div>`,
    className: 'santa-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

const createVillageIcon = () => {
  return L.divIcon({
    html: `<div style="font-size: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🏠</div>`,
    className: 'village-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
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
function MapController({ selectedProfile, santaPosition, showSantaAtVillage }: { selectedProfile: Profile | null; santaPosition: SantaPosition; showSantaAtVillage?: boolean }) {
  const map = useMap();
  const hasMovedRef = useRef(false);
  const initializedRef = useRef(false);

  // Initial view - center on Santa Claus Village
  useEffect(() => {
    if (!initializedRef.current) {
      if (showSantaAtVillage) {
        map.setView([SANTA_VILLAGE.lat, SANTA_VILLAGE.lon], 4, { animate: false });
      }
      initializedRef.current = true;
    }
  }, [map, showSantaAtVillage]);

  useEffect(() => {
    if (selectedProfile && !hasMovedRef.current) {
      map.flyTo([selectedProfile.lat, selectedProfile.lon], 6, { duration: 1.5 });
      hasMovedRef.current = true;
    }
  }, [selectedProfile, map]);

  // Reset when profile changes
  useEffect(() => {
    hasMovedRef.current = false;
  }, [selectedProfile?.id]);

  return null;
}

export function SantaMap({ santaPosition, currentTime, selectedProfile, isTracking, showSantaAtVillage }: SantaMapProps) {
  const [trajectoryPath, setTrajectoryPath] = useState<[number, number][]>([]);
  
  useEffect(() => {
    if (isTracking) {
      setTrajectoryPath(getTrajectoryPath(currentTime));
    }
  }, [currentTime, isTracking]);

  const santaIcon = createSantaIcon();
  const villageIcon = createVillageIcon();

  // Determine Santa's display position
  const santaDisplayLat = showSantaAtVillage ? SANTA_VILLAGE.lat : santaPosition.lat;
  const santaDisplayLon = showSantaAtVillage ? SANTA_VILLAGE.lon : santaPosition.lon;

  return (
    <MapContainer
      center={[SANTA_VILLAGE.lat, SANTA_VILLAGE.lon]}
      zoom={4}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MapController selectedProfile={selectedProfile} santaPosition={santaPosition} showSantaAtVillage={showSantaAtVillage} />

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

      {/* Santa Claus Village marker - only show when Santa is not there */}
      {isTracking && (
        <Marker position={[SANTA_VILLAGE.lat, SANTA_VILLAGE.lon]} icon={villageIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold">🏠 Santa Claus Village</p>
              <p className="text-xs text-gray-600">Rovaniemi, Laponia</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Santa marker - always visible */}
      <Marker 
        position={[santaDisplayLat, santaDisplayLon]} 
        icon={santaIcon}
      >
        <Popup>
          <div className="text-center">
            <p className="font-bold">🎅 Papá Noel</p>
            {showSantaAtVillage ? (
              <p className="text-xs text-gray-600">Preparándose en Santa Claus Village</p>
            ) : (
              <>
                <p className="text-xs text-gray-600">{santaPosition.currentSegmentLabel}</p>
                <p className="text-xs">Velocidad: {santaPosition.speed.toLocaleString()} km/h</p>
              </>
            )}
          </div>
        </Popup>
      </Marker>

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
