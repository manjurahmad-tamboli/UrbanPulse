'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus, Wifi, WifiOff, Thermometer, Camera, MapPin, Activity,
  Cpu, HardDrive, RotateCcw, Radio, Download, ChevronDown, ChevronUp, CheckCircle, Shield
} from 'lucide-react';
import { useSimulation } from '@/context/simulation-context';

export default function FleetPage() {
  const { buses, restartEdgeNode, addToast } = useSimulation();
  const [expandedRow, setExpandedRow] = useState<string | null>(buses[0]?.id || null);

  // Derive stats dynamically from data
  const totalFleet = buses.length;
  const activeBuses = buses.filter(b => b.isActive).length;
  const offlineBuses = buses.filter(b => !b.isActive).length;
  const avgTemp = Math.round(
    buses.reduce((acc, b) => acc + (b.gpuTemperature || 55), 0) / (buses.length || 1)
  );

  const handlePing = (busId: string) => {
    addToast({
      title: `Ping Response — ${busId}`,
      message: `RTT: 24ms • 5G Uplink: 48 Mbps • Packet Loss: 0%`,
      type: 'success',
    });
  };

  const handleDownloadLogs = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    const logData = {
      busId,
      timestamp: new Date().toISOString(),
      hardware: 'NVIDIA Jetson Orin Nano 8GB',
      os: 'Ubuntu 22.04 LTS (JetPack 5.1.2)',
      tensorRT: '8.5.2',
      model: 'RoadVision-YOLOv8s-INT8',
      telemetry: bus,
      systemHealth: 'HEALTHY',
    };
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${busId}-edge-diagnostic.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      title: 'Diagnostic Log Exported',
      message: `Downloaded telemetry report for ${busId}.`,
      type: 'info',
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-20 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Fleet & Edge Device Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time monitoring of on-bus NVIDIA Jetson edge nodes, thermal stability, and sensor health
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Active Sync Protocol: 5G MQTT/gRPC
          </div>
        </div>

        {/* Dynamic KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Bus size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Total Fleet</p>
              <p className="text-2xl font-bold text-white">{totalFleet} buses</p>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
              <Wifi size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Active Edge Nodes</p>
              <p className="text-2xl font-bold text-green-400">{activeBuses}</p>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <WifiOff size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Offline / Standby</p>
              <p className="text-2xl font-bold text-red-400">{offlineBuses}</p>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Thermometer size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Avg Jetson GPU Temp</p>
              <p className="text-2xl font-bold text-orange-400">{avgTemp}°C</p>
            </div>
          </div>
        </div>

        {/* Fleet Table with Interactive Row Expansion */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <div className="p-4 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Monitored Fleet Units
            </h3>
            <span className="text-xs text-gray-500">Click any row to inspect edge hardware diagnostics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/40 border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Status</th>
                  <th className="p-4">Bus ID</th>
                  <th className="p-4">Vehicle Reg</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">GPU Temp</th>
                  <th className="p-4">Network</th>
                  <th className="p-4">Last Sync</th>
                  <th className="p-4">Detections Today</th>
                  <th className="p-4">Offline Queue</th>
                  <th className="p-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-800">
                {buses.map((bus) => {
                  const isExpanded = expandedRow === bus.id;

                  return (
                    <React.Fragment key={bus.id}>
                      <tr
                        onClick={() => setExpandedRow(isExpanded ? null : bus.id)}
                        className={`hover:bg-cyan-500/5 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-cyan-500/10' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block w-2.5 h-2.5 rounded-full ${
                                bus.isActive ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-red-400'
                              }`}
                            />
                            <span className="text-xs font-mono">{bus.isActive ? 'ONLINE' : 'OFFLINE'}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-cyan-400">{bus.id}</td>
                        <td className="p-4 text-gray-300 font-mono text-xs">{bus.name}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                            {bus.routeId}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-mono text-xs font-semibold ${
                              bus.gpuTemperature < 60
                                ? 'text-green-400'
                                : bus.gpuTemperature <= 70
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            {bus.gpuTemperature}°C
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-gray-300">{bus.networkType}</td>
                        <td className="p-4 text-gray-400 text-xs">{bus.lastSync}</td>
                        <td className="p-4 font-bold text-white">{bus.detectionsToday}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-mono ${
                              bus.offlineQueue > 0
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                                : 'text-gray-500'
                            }`}
                          >
                            {bus.offlineQueue} msgs
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-cyan-400 inline" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500 inline" />
                          )}
                        </td>
                      </tr>

                      {/* Expanded Edge Device Diagnostic Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={10} className="p-0 bg-gray-900/90 border-y border-cyan-500/30">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-6 space-y-6"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
                                    <Cpu className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-base text-white">
                                      {bus.id} Edge Compute Node Diagnostic
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      NVIDIA Jetson Orin Nano (8GB LPDDR5) • Model: {bus.modelVersion}
                                    </p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={() => handlePing(bus.id)}
                                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Radio className="w-3.5 h-3.5 text-cyan-400" /> Ping Node
                                  </button>
                                  <button
                                    onClick={() => restartEdgeNode(bus.id)}
                                    className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-medium border border-cyan-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" /> Restart Edge Node
                                  </button>
                                  <button
                                    onClick={() => handleDownloadLogs(bus.id)}
                                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5 text-teal-400" /> Export Logs (.JSON)
                                  </button>
                                </div>
                              </div>

                              {/* Telemetry Detail Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                                <div className="bg-gray-800/40 p-3.5 rounded-xl border border-gray-700/60 space-y-2">
                                  <span className="text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <Camera className="w-3.5 h-3.5 text-cyan-400" /> Camera Sensor
                                  </span>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Sensor Status:</span>
                                      <span className="text-green-400 font-medium">Online (Sony IMX390)</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Resolution:</span>
                                      <span className="text-gray-200 font-mono">1920x1080 @ 28 FPS</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Exposure:</span>
                                      <span className="text-gray-200 font-mono">Auto (WDR Active)</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-gray-800/40 p-3.5 rounded-xl border border-gray-700/60 space-y-2">
                                  <span className="text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> AI Accelerator
                                  </span>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Architecture:</span>
                                      <span className="text-gray-200 font-mono">Ampere (1024 Cores)</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Quantization:</span>
                                      <span className="text-cyan-400 font-mono font-bold">TensorRT INT8</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Avg Latency:</span>
                                      <span className="text-green-400 font-mono">42 ms / frame</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-gray-800/40 p-3.5 rounded-xl border border-gray-700/60 space-y-2">
                                  <span className="text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Memory & Storage
                                  </span>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Unified RAM:</span>
                                      <span className="text-gray-200 font-mono">4.8 GB / 8.0 GB</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">NVMe SSD:</span>
                                      <span className="text-gray-200 font-mono">38.4 GB / 128 GB</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Evidence Cache:</span>
                                      <span className="text-gray-200 font-mono">1.2 GB (Auto-purge 48h)</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-gray-800/40 p-3.5 rounded-xl border border-gray-700/60 space-y-2">
                                  <span className="text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-cyan-400" /> Privacy & Security
                                  </span>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Face Masking:</span>
                                      <span className="text-green-400 font-medium">Active (On-device)</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Plate Redaction:</span>
                                      <span className="text-green-400 font-medium">Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Payload Encryption:</span>
                                      <span className="text-gray-200 font-mono">AES-256-GCM</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
