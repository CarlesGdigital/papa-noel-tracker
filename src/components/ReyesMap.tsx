import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  getAllReyesPositions, 
  getReyTrajectoryPath,
  AllReyesPositions,
} from '@/lib/reyesTracking';
import { ETHIOPIA_START, REYES_INFO, ReyName } from '@/lib/reyesWaypoints';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  lat: number;
  lon: number;
  city_label: string;
}

type VisibleReyes = 'all' | ReyName;

interface ReyesMapProps {
  currentTime: Date;
  selectedProfile: Profile | null;
  isTracking: boolean;
  showAtStart?: boolean;
  visibleReyes: VisibleReyes;
}

const REY_ICONS: Record<ReyName, string> = {
  melchor: '👑',
  gaspar: '🎁',
  baltasar: '⭐',
};

const REY_COLORS: Record<ReyName, string> = {
  melchor: '#FFD700',
  gaspar: '#E74C3C',
  baltasar: '#3498DB',
};

export function ReyesMap({ 
  currentTime, 
  selectedProfile, 
  isTracking, 
  showAtStart,
  visibleReyes,
}: ReyesMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const reyMarkersRef = useRef<Record<ReyName, L.Marker | null>>({
    melchor: null,
    gaspar: null,
    baltasar: null,
  });
  const homeMarkerRef = useRef<L.Marker | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const trajectoriesRef = useRef<Record<ReyName, L.Polyline | null>>({
    melchor: null,
    gaspar: null,
    baltasar: null,
  });
  const hasMovedToProfileRef = useRef(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [ETHIOPIA_START.lat, ETHIOPIA_START.lon],
      zoom: 3,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Get positions - siempre calculamos aunque sea para mostrar en Etiopía
  const positions: AllReyesPositions | null = selectedProfile 
    ? getAllReyesPositions(
        currentTime, 
        selectedProfile.lat, 
        selectedProfile.lon, 
        selectedProfile.city_label
      )
    : {
        melchor: { lat: ETHIOPIA_START.lat, lon: ETHIOPIA_START.lon, heading: 0, speed: 0, altitude: 0, currentSegmentLabel: 'Descansando', nextStop: '', progress: 0 },
        gaspar: { lat: ETHIOPIA_START.lat, lon: ETHIOPIA_START.lon, heading: 0, speed: 0, altitude: 0, currentSegmentLabel: 'Descansando', nextStop: '', progress: 0 },
        baltasar: { lat: ETHIOPIA_START.lat, lon: ETHIOPIA_START.lon, heading: 0, speed: 0, altitude: 0, currentSegmentLabel: 'Descansando', nextStop: '', progress: 0 },
      };

  // Update Rey markers - SIEMPRE mostrar los Reyes (en Etiopía si están descansando)
  useEffect(() => {
    if (!mapRef.current || !positions) return;

    const reyes: ReyName[] = ['melchor', 'gaspar', 'baltasar'];

    reyes.forEach((rey) => {
      const position = showAtStart 
        ? { lat: ETHIOPIA_START.lat, lon: ETHIOPIA_START.lon }
        : positions[rey];
      
      const shouldShow = visibleReyes === 'all' || visibleReyes === rey;
      const statusText = showAtStart 
        ? '🐪 Descansando en Etiopía' 
        : positions[rey].currentSegmentLabel;

      if (reyMarkersRef.current[rey]) {
        if (shouldShow) {
          reyMarkersRef.current[rey]!.setLatLng([position.lat, position.lon]);
          // Actualizar popup
          reyMarkersRef.current[rey]!.setPopupContent(`
            <div style="text-align: center;">
              <p style="font-weight: bold; margin: 0;">${REY_ICONS[rey]} ${REYES_INFO[rey].name}</p>
              <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">
                ${statusText}
              </p>
            </div>
          `);
        } else {
          reyMarkersRef.current[rey]!.remove();
          reyMarkersRef.current[rey] = null;
        }
      } else if (shouldShow) {
        const icon = L.divIcon({
          html: `<div style="font-size: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); background: ${REY_COLORS[rey]}22; border-radius: 50%; padding: 4px; border: 2px solid ${REY_COLORS[rey]};">${REY_ICONS[rey]}</div>`,
          className: `rey-marker-${rey}`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        reyMarkersRef.current[rey] = L.marker([position.lat, position.lon], { icon })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div style="text-align: center;">
              <p style="font-weight: bold; margin: 0;">${REY_ICONS[rey]} ${REYES_INFO[rey].name}</p>
              <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">
                ${statusText}
              </p>
            </div>
          `);
      }
    });
  }, [positions, showAtStart, visibleReyes]);

  // Update start marker - siempre visible
  useEffect(() => {
    if (!mapRef.current) return;

    if (!startMarkerRef.current) {
      const startIcon = L.divIcon({
        html: `<div style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🏕️</div>`,
        className: 'start-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      startMarkerRef.current = L.marker([ETHIOPIA_START.lat, ETHIOPIA_START.lon], { icon: startIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <p style="font-weight: bold; margin: 0;">🏕️ Campamento Real</p>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">Addis Abeba, Etiopía</p>
          </div>
        `);
    }
  }, []);

  // Update home marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (homeMarkerRef.current) {
      homeMarkerRef.current.remove();
      homeMarkerRef.current = null;
    }

    if (selectedProfile) {
      const homeIcon = L.divIcon({
        html: `<div style="font-size: 28px; background: hsl(45 90% 55% / 0.3); padding: 6px; border-radius: 50%; border: 2px solid hsl(45 90% 55%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${selectedProfile.avatar}</div>`,
        className: 'home-marker',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      homeMarkerRef.current = L.marker([selectedProfile.lat, selectedProfile.lon], { icon: homeIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <p style="font-weight: bold; margin: 0;">${selectedProfile.avatar} Casa de ${selectedProfile.name}</p>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">${selectedProfile.city_label.split(',')[0]}</p>
          </div>
        `);

      if (!hasMovedToProfileRef.current) {
        mapRef.current.flyTo([selectedProfile.lat, selectedProfile.lon], 5, { duration: 1.5 });
        hasMovedToProfileRef.current = true;
      }
    }
  }, [selectedProfile?.id, selectedProfile?.lat, selectedProfile?.lon]);

  // Reset movement flag when profile changes
  useEffect(() => {
    hasMovedToProfileRef.current = false;
  }, [selectedProfile?.id]);

  // Update trajectories
  useEffect(() => {
    if (!mapRef.current || !selectedProfile) return;

    const reyes: ReyName[] = ['melchor', 'gaspar', 'baltasar'];

    reyes.forEach((rey) => {
      // Remove old trajectory
      if (trajectoriesRef.current[rey]) {
        trajectoriesRef.current[rey]!.remove();
        trajectoriesRef.current[rey] = null;
      }

      const shouldShow = (visibleReyes === 'all' || visibleReyes === rey) && isTracking;

      if (shouldShow) {
        const path = getReyTrajectoryPath(
          rey,
          currentTime,
          selectedProfile.lat,
          selectedProfile.lon,
          selectedProfile.city_label
        );
        
        if (path.length > 1) {
          trajectoriesRef.current[rey] = L.polyline(path, {
            color: REY_COLORS[rey],
            weight: 3,
            opacity: 0.7,
            dashArray: '8, 4',
          }).addTo(mapRef.current!);
        }
      }
    });
  }, [currentTime, isTracking, selectedProfile, visibleReyes]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ background: 'hsl(220 50% 10%)' }}
    />
  );
}
