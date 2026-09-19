'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { routes } from '@/data/mock-data';
import { routeColors } from '@/lib/geo';
import { Bus, Wifi, Cpu, Camera, Activity, AlertCircle, Info, ScanLine, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulation } from '@/context/simulation-context';

const BusMonitorMapComponent = dynamic(
  () => import('@/components/maps/bus-monitor-map'),
  { ssr: false, loading: () => <div className="w-full h-full bg-[#111827] rounded-xl animate-pulse" /> }
);

export default function LiveMonitorPage() {
  const { buses } = useSimulation();
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const selectedBus = buses.find(b => b.id === selectedBusId);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto h-[calc(100vh-120px)] flex flex-col gap-4"
      >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
              Live Edge Monitor
            </h1>
            <p className="text-gray-400 mt-1">Real-time tracking of AI-equipped public transit</p>
          </div>
          <div className="text-xs text-gray-500 italic flex items-center gap-2">
            <Info className="w-4 h-4" />
            Prototype demonstration using simulated/illustrative data.
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full overflow-hidden">
          {/* Map Section */}
          <div className="lg:w-[60%] h-[400px] lg:h-full rounded-2xl border border-cyan-500/20 overflow-hidden relative shadow-[0_0_15px_rgba(0,212,255,0.05)]">
            <BusMonitorMapComponent
              onBusClick={(id) => setSelectedBusId(id)}
              selectedBusId={selectedBusId}
            />
            
            <div className="absolute top-4 left-4 z-[400] flex gap-2">
              <div className="bg-[#111827]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3 shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                <span className="text-sm font-medium text-gray-200">
                  {buses.filter(b => b.aiDeviceStatus === 'online').length} Active Edge Nodes
                </span>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:w-[40%] h-full flex flex-col gap-4 overflow-hidden">
            {/* Expanded Details / Camera Feed (if selected) */}
            <AnimatePresence>
              {selectedBus && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-[#111827]/80 backdrop-blur-xl border border-teal-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(20,184,166,0.1)] shrink-0"
                >
                  <div className="p-3 bg-teal-950/40 border-b border-teal-500/20 flex justify-between items-center">
                    <h3 className="font-semibold text-teal-400 flex items-center gap-2">
                      <ScanLine className="w-4 h-4" /> Node Telemetry: {selectedBus.id}
                    </h3>
                    <button 
                      onClick={() => setSelectedBusId(null)}
                      className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-4 grid grid-cols-2 gap-4">
                    {/* Simulated Camera */}
                    <div className="col-span-2 aspect-video bg-black rounded-lg border border-gray-800 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute top-2 left-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] text-white/70 font-mono">REC // {selectedBus.id}</span>
                      </div>
                      
                      {selectedBus.aiDeviceStatus === 'online' ? (
                        <>
                          <ScanLine className="w-12 h-12 text-teal-500/20" />
                          <div className="absolute inset-0 border border-teal-500/10 pointer-events-none" />
                          {/* Simulated detection boxes */}
                          <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 border border-yellow-500/50 bg-yellow-500/10 rounded-sm">
                            <span className="absolute -top-4 left-0 text-[8px] bg-yellow-500/50 text-white px-1">POTHOLE 92%</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-600 flex flex-col items-center">
                          <AlertCircle className="w-8 h-8 mb-2" />
                          <span className="text-sm">FEED OFFLINE</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Node Stats */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Cpu className="w-3 h-3"/> Edge Compute</div>
                      <div className="font-mono text-sm text-gray-200">GPU: {selectedBus.gpuTemperature}°C</div>
                      <div className="font-mono text-sm text-gray-200">Storage: 42%</div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Today's Stats</div>
                      <div className="font-mono text-sm text-teal-400">Issues: {selectedBus.detectionsToday}</div>
                      <div className="font-mono text-sm text-gray-200">Uptime: 99.9%</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bus List */}
            <div className="flex-1 bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,212,255,0.05)] flex flex-col">
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-semibold text-cyan-400">Fleet Overview</h2>
                <span className="text-xs text-gray-400">Total: {buses.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {buses.map(bus => {
                  const isSelected = selectedBusId === bus.id;
                  const isActive = bus.aiDeviceStatus === 'online';
                  
                  return (
                    <motion.div
                      key={bus.id}
                      layout
                      onClick={() => setSelectedBusId(bus.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all duration-300",
                        isSelected 
                          ? "bg-teal-900/20 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.15)]" 
                          : "bg-white/5 border-white/5 hover:border-cyan-500/30 hover:bg-white/10"
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Bus className="w-4 h-4 text-gray-400" />
                            <h3 className="font-medium text-gray-100">{bus.id}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{bus.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `${routeColors[bus.routeId as keyof typeof routeColors]}30`,
                              color: routeColors[bus.routeId as keyof typeof routeColors]
                            }}
                          >
                            {bus.routeId}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium border",
                            isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                          )}>
                            {isActive ? 'ACTIVE' : 'OFFLINE'}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-4 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Wifi className={cn("w-3.5 h-3.5", bus.gpsStatus === 'online' ? "text-green-400" : "text-red-400")} />
                          GPS
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Camera className={cn("w-3.5 h-3.5", bus.cameraStatus === 'online' ? "text-green-400" : "text-red-400")} />
                          Cam
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Activity className={cn("w-3.5 h-3.5", isActive ? "text-green-400" : "text-red-400")} />
                          {bus.networkType}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs text-gray-500">
                        <span>{bus.detectionsToday} detections today</span>
                        <span suppressHydrationWarning>Sync: {bus.lastSync}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
