import { useEffect, useRef } from 'react';
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

export function SantaMap({ santaPosition, currentTime, selectedProfile, isTracking, showSantaAtVillage }: SantaMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const santaMarkerRef = useRef<L.Marker | null>(null);
  const homeMarkerRef = useRef<L.Marker | null>(null);
  const villageMarkerRef = useRef<L.Marker | null>(null);
  const trajectoryRef = useRef<L.Polyline | null>(null);
  const hasMovedToProfileRef = useRef(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [SANTA_VILLAGE.lat, SANTA_VILLAGE.lon],
      zoom: 4,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Santa marker
  useEffect(() => {
    if (!mapRef.current) return;

    const santaLat = showSantaAtVillage ? SANTA_VILLAGE.lat : santaPosition.lat;
    const santaLon = showSantaAtVillage ? SANTA_VILLAGE.lon : santaPosition.lon;

    const santaIcon = L.divIcon({
      html: `<div style="font-size: 40px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🎅</div>`,
      className: 'santa-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    if (santaMarkerRef.current) {
      santaMarkerRef.current.setLatLng([santaLat, santaLon]);
    } else {
      santaMarkerRef.current = L.marker([santaLat, santaLon], { icon: santaIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <p style="font-weight: bold; margin: 0;">🎅 Papá Noel</p>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">
              ${showSantaAtVillage ? 'Preparándose en Santa Claus Village' : santaPosition.currentSegmentLabel}
            </p>
          </div>
        `);
    }
  }, [santaPosition.lat, santaPosition.lon, showSantaAtVillage, santaPosition.currentSegmentLabel]);

  // Update village marker (only when tracking)
  useEffect(() => {
    if (!mapRef.current) return;

    if (isTracking && !villageMarkerRef.current) {
      const villageIcon = L.divIcon({
        html: `<div style="font-size: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🏠</div>`,
        className: 'village-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      villageMarkerRef.current = L.marker([SANTA_VILLAGE.lat, SANTA_VILLAGE.lon], { icon: villageIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <p style="font-weight: bold; margin: 0;">🏠 Santa Claus Village</p>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">Rovaniemi, Laponia</p>
          </div>
        `);
    } else if (!isTracking && villageMarkerRef.current) {
      villageMarkerRef.current.remove();
      villageMarkerRef.current = null;
    }
  }, [isTracking]);

  // Update home marker
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old home marker
    if (homeMarkerRef.current) {
      homeMarkerRef.current.remove();
      homeMarkerRef.current = null;
    }

    if (selectedProfile) {
      const homeIcon = L.divIcon({
        html: `<div style="font-size: 28px; background: hsl(145 60% 25% / 0.8); padding: 4px; border-radius: 50%; border: 2px solid hsl(45 90% 55%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${selectedProfile.avatar}</div>`,
        className: 'home-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      homeMarkerRef.current = L.marker([selectedProfile.lat, selectedProfile.lon], { icon: homeIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <p style="font-weight: bold; margin: 0;">${selectedProfile.avatar} Casa de ${selectedProfile.name}</p>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">${selectedProfile.city_label.split(',')[0]}</p>
          </div>
        `);

      // Fly to profile location once
      if (!hasMovedToProfileRef.current) {
        mapRef.current.flyTo([selectedProfile.lat, selectedProfile.lon], 6, { duration: 1.5 });
        hasMovedToProfileRef.current = true;
      }
    }
  }, [selectedProfile?.id, selectedProfile?.lat, selectedProfile?.lon, selectedProfile?.name, selectedProfile?.avatar, selectedProfile?.city_label]);

  // Reset movement flag when profile changes
  useEffect(() => {
    hasMovedToProfileRef.current = false;
  }, [selectedProfile?.id]);

  // Update trajectory
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old trajectory
    if (trajectoryRef.current) {
      trajectoryRef.current.remove();
      trajectoryRef.current = null;
    }

    if (isTracking) {
      const path = getTrajectoryPath(currentTime);
      if (path.length > 1) {
        trajectoryRef.current = L.polyline(path, {
          color: '#c9302c',
          weight: 3,
          opacity: 0.7,
          dashArray: '10, 5',
        }).addTo(mapRef.current);
      }
    }
  }, [currentTime, isTracking]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ background: 'hsl(220 50% 15%)' }}
    />
  );
}
