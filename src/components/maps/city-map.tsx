'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routes, CITY_CENTER, DEFAULT_ZOOM } from '@/data/mock-data';
import { useSimulation } from '@/context/simulation-context';
import type { Bus, UrbanIssue } from '@/lib/types';
import Link from 'next/link';

// Custom icons
const createIssueIcon = (severity: string) => {
  const colors: Record<string, string> = {
    critical: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse',
    high: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]',
    medium: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]',
    low: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
  };
  const colorClass = colors[severity] || colors.low;
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-4 h-4 rounded-full border-2 border-white ${colorClass}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const busIcon = L.divIcon({
  className: 'custom-bus-icon',
  html: `<div class="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.9)] border-2 border-white text-xs">🚌</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

interface CityMapProps {
  buses?: Bus[];
  urbanIssues?: UrbanIssue[];
}

export default function CityMap({ buses: propBuses, urbanIssues: propIssues }: CityMapProps) {
  const { buses: contextBuses, issues: contextIssues } = useSimulation();
  const [mounted, setMounted] = useState(false);

  const buses = propBuses || contextBuses;
  const urbanIssues = propIssues || contextIssues;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[500px] bg-[#111827] rounded-xl flex items-center justify-center animate-pulse border border-cyan-500/20">
        <span className="text-cyan-400 font-mono text-sm">Initializing City Transit Map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_20px_rgba(0,212,255,0.15)] z-0 relative">
      <MapContainer
        center={CITY_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-map-tiles"
        />

        {/* Transit Routes */}
        {routes.map(route => (
          <Polyline 
            key={route.id} 
            positions={route.waypoints} 
            color={route.color} 
            weight={3.5} 
            opacity={0.6} 
            dashArray="6, 8" 
          />
        ))}

        {/* Detected Urban Issues Pins */}
        {urbanIssues.map(issue => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={createIssueIcon(issue.severity)}
          >
            <Popup className="urbanpulse-popup">
              <div className="p-2 min-w-[220px] text-gray-900">
                <div className="flex justify-between items-center border-b pb-1 mb-2">
                  <span className="font-bold text-sm capitalize">{issue.type.replace('_', ' ')}</span>
                  <span className="font-mono text-xs font-bold text-cyan-700">{issue.id}</span>
                </div>
                <div className="text-xs space-y-1">
                  <p><span className="font-semibold text-gray-700">Severity:</span> <span className="uppercase font-bold text-red-600">{issue.severity}</span></p>
                  <p><span className="font-semibold text-gray-700">AI Confidence:</span> {(issue.confidence * 100).toFixed(1)}%</p>
                  <p><span className="font-semibold text-gray-700">Sightings:</span> {issue.sightings} (Merged)</p>
                  <p><span className="font-semibold text-gray-700">Location:</span> {issue.address.split(',')[0]}</p>
                  <p><span className="font-semibold text-gray-700">Status:</span> <span className="font-semibold text-teal-700 capitalize">{issue.status}</span></p>
                </div>
                <Link
                  href={`/issues/${issue.id}`}
                  className="mt-3 block text-center w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold py-1.5 rounded transition-colors shadow"
                >
                  View Full Detection & Timeline
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Public Transport Buses Moving Units */}
        {buses.map(bus => (
          <Marker
            key={bus.id}
            position={[bus.currentLat, bus.currentLng]}
            icon={busIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px] text-gray-900">
                <div className="font-bold border-b pb-1 mb-1 text-sm text-blue-950 flex items-center justify-between">
                  <span>{bus.id}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-green-100 text-green-800 rounded font-semibold">
                    {bus.isActive ? 'ONLINE' : 'STANDBY'}
                  </span>
                </div>
                <div className="text-xs space-y-0.5 mt-1">
                  <p><span className="font-semibold">Vehicle:</span> {bus.name}</p>
                  <p><span className="font-semibold">Route:</span> {bus.routeId}</p>
                  <p><span className="font-semibold">Speed:</span> {bus.speed} km/h</p>
                  <p><span className="font-semibold">Jetson Temp:</span> {bus.gpuTemperature}°C</p>
                  <p><span className="font-semibold">Detections Today:</span> <span className="font-bold text-cyan-800">{bus.detectionsToday}</span></p>
                </div>
                <Link
                  href="/live-monitor"
                  className="mt-2 block text-center w-full bg-gray-900 hover:bg-black text-white text-xs py-1 rounded transition-colors"
                >
                  Open Live Camera Preview
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
