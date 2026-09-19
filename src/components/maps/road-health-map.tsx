'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { roadSegments, CITY_CENTER } from '@/data/mock-data';
import { roadHealthColors } from '@/lib/geo';

interface RoadHealthMapProps {
  onSegmentClick: (segmentId: string) => void;
  selectedSegmentId: string | null;
}

// Fix leaflet icon issue for any markers if needed later, but this uses Polyline
export default function RoadHealthMap({ onSegmentClick, selectedSegmentId }: RoadHealthMapProps) {
  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        className="dark-map-tiles"
      />
      
      {roadSegments.map((segment) => {
        // Find health category
        let category: 'good' | 'monitor' | 'poor' | 'critical' = 'good';
        if (segment.healthScore < 40) category = 'critical';
        else if (segment.healthScore < 60) category = 'poor';
        else if (segment.healthScore < 80) category = 'monitor';

        const color = roadHealthColors[category];
        const isSelected = selectedSegmentId === segment.id;

        return (
          <Polyline
            key={segment.id}
            positions={segment.coordinates}
            color={color}
            weight={isSelected ? 6 : 4}
            opacity={isSelected ? 1 : 0.7}
            eventHandlers={{
              click: () => onSegmentClick(segment.id),
            }}
          >
            <Popup>
              <div className="text-sm font-medium">{segment.name}</div>
              <div className="text-xs text-gray-500">Health: {segment.healthScore}/100</div>
            </Popup>
          </Polyline>
        );
      })}
    </MapContainer>
  );
}
