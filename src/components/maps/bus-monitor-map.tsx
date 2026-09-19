'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { buses, routes, CITY_CENTER } from '@/data/mock-data';
import { routeColors } from '@/lib/geo';

// Create custom icons for buses
const createBusIcon = (isActive: boolean, heading: number) => {
  const color = isActive ? '#0ea5e9' : '#64748b'; // cyan-500 or slate-500
  
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div style="transform: rotate(${heading}deg); transition: transform 0.3s; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="${color}" stroke-width="2" fill="${color}40" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 22l10-4 10 4L12 2z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface BusMonitorMapProps {
  onBusClick: (busId: string) => void;
  selectedBusId: string | null;
}

export default function BusMonitorMap({ onBusClick, selectedBusId }: BusMonitorMapProps) {
  // We need to simulate slight movement for effect
  const [activeBuses, setActiveBuses] = useState(buses);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBuses(current => 
        current.map(bus => {
          if (bus.aiDeviceStatus === 'offline') return bus;
          // Very slight random movement
          const latJitter = (Math.random() - 0.5) * 0.0005;
          const lngJitter = (Math.random() - 0.5) * 0.0005;
          return {
            ...bus,
            currentLat: bus.currentLat + latJitter,
            currentLng: bus.currentLng + lngJitter
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; CARTO'
      />

      {/* Render Routes */}
      {routes.map(route => (
        <Polyline
          key={route.id}
          positions={route.waypoints}
          color={routeColors[route.id as keyof typeof routeColors] || '#ffffff'}
          weight={3}
          opacity={0.3}
          dashArray="5, 10"
        />
      ))}

      {/* Render Buses */}
      {activeBuses.map(bus => {
        const isSelected = selectedBusId === bus.id;
        
        return (
          <Marker
            key={bus.id}
            position={[bus.currentLat, bus.currentLng]}
            icon={createBusIcon(bus.aiDeviceStatus === 'online', bus.heading || 0)}
            eventHandlers={{
              click: () => onBusClick(bus.id)
            }}
            zIndexOffset={isSelected ? 1000 : 0}
          >
            <Popup>
              <div className="font-medium">{bus.id}</div>
              <div className="text-xs text-gray-500">Route: {bus.routeId}</div>
              <div className="text-xs text-gray-500">{bus.speed} km/h</div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
