'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { roadSegments } from '@/data/mock-data';
import { roadHealthColors, roadHealthLabels } from '@/lib/geo';
import { Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import map to avoid SSR issues
const RoadHealthMapComponent = dynamic(
  () => import('@/components/maps/road-health-map'),
  { ssr: false, loading: () => <div className="w-full h-full bg-[#111827] rounded-xl animate-pulse flex items-center justify-center">Loading map...</div> }
);

export default function RoadHealthPage() {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto h-[calc(100vh-120px)] flex flex-col gap-4"
      >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Road Health Analytics
            </h1>
            <p className="text-gray-400 mt-1">Real-time infrastructure quality assessment</p>
          </div>
          <div className="text-xs text-gray-500 italic flex items-center gap-2">
            <Info className="w-4 h-4" />
            Prototype demonstration using simulated/illustrative data.
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full overflow-hidden">
          {/* Map Section */}
          <div className="lg:w-[65%] h-[500px] lg:h-full rounded-2xl border border-cyan-500/20 overflow-hidden relative shadow-[0_0_15px_rgba(0,212,255,0.05)]">
            <RoadHealthMapComponent
              onSegmentClick={(id) => setSelectedSegmentId(id)}
              selectedSegmentId={selectedSegmentId}
            />
            
            {/* Legend Overlay */}
            <div className="absolute bottom-6 left-6 z-[400] bg-[#111827]/90 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <h3 className="text-xs font-semibold text-gray-300 uppercase mb-3 tracking-wider">Health Index</h3>
              <div className="space-y-2">
                {Object.entries(roadHealthColors).map(([key, color]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-gray-300 capitalize">{roadHealthLabels[key as keyof typeof roadHealthLabels]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:w-[35%] h-full flex flex-col bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,212,255,0.05)]">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold text-cyan-400">Road Segments</h2>
              <p className="text-sm text-gray-400">Select a segment for details</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {roadSegments.map((segment) => {
                let category: 'good' | 'monitor' | 'poor' | 'critical' = 'good';
                if (segment.healthScore < 40) category = 'critical';
                else if (segment.healthScore < 60) category = 'poor';
                else if (segment.healthScore < 80) category = 'monitor';

                const isSelected = selectedSegmentId === segment.id;

                return (
                  <motion.div
                    key={segment.id}
                    layout
                    onClick={() => setSelectedSegmentId(segment.id)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-300",
                      isSelected 
                        ? "bg-white/10 border-cyan-500/50 shadow-[0_0_15px_rgba(0,212,255,0.15)]" 
                        : "bg-white/5 border-white/5 hover:border-cyan-500/30 hover:bg-white/10"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-100">{segment.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold" style={{ color: roadHealthColors[category] }}>
                          {segment.healthScore}
                        </span>
                        <div 
                          className="w-2.5 h-2.5 rounded-full shadow-[0_0_5px_currentColor]"
                          style={{ backgroundColor: roadHealthColors[category], color: roadHealthColors[category] }} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                      <div className="bg-black/20 p-2 rounded-lg">
                        <div className="text-gray-500 text-xs mb-1">Potholes</div>
                        <div className="font-medium text-gray-200">{segment.potholes}</div>
                      </div>
                      <div className="bg-black/20 p-2 rounded-lg">
                        <div className="text-gray-500 text-xs mb-1">Waterlogging</div>
                        <div className="font-medium text-gray-200">{segment.waterlogging}</div>
                      </div>
                      <div className="bg-black/20 p-2 rounded-lg">
                        <div className="text-gray-500 text-xs mb-1">Infra Issues</div>
                        <div className="font-medium text-gray-200">{segment.infrastructureIssues}</div>
                      </div>
                      <div className="bg-black/20 p-2 rounded-lg">
                        <div className="text-gray-500 text-xs mb-1">Bus Coverage</div>
                        <div className="font-medium text-gray-200">{segment.busCoverage} buses</div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
                      <span>Last scanned: {segment.lastScanned}</span>
                      {category === 'critical' && (
                        <span className="flex items-center gap-1 text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          Needs Attention
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
