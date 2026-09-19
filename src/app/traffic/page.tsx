'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Activity, MapPin, Users, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { trafficData, vehicleDistribution, hourlyTraffic, routes } from '@/data/mock-data';
import { useSimulation } from '@/context/simulation-context';

const COLORS = ['#00d4ff', '#8b5cf6', '#22c55e', '#f97316', '#ec4899'];

export default function TrafficPage() {
  const { addToast } = useSimulation();

  // Dynamically derive traffic metrics
  const totalVehicles = trafficData.reduce((acc, t) => acc + t.vehicleCount, 0);
  const avgSpeed = Math.round(
    trafficData.reduce((acc, t) => acc + t.avgSpeed, 0) / trafficData.length
  );
  const congestionZones = trafficData.filter(t => t.congestionLevel === 'heavy' || t.congestionLevel === 'moderate');
  const totalPedestrians = trafficData.reduce((acc, t) => acc + t.pedestrianCount, 0);
  const totalIncidents = trafficData.reduce((acc, t) => acc + t.incidents, 0);

  const handleInspectRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    addToast({
      title: `Monitoring ${routeId}`,
      message: `Active fleet telemetry locked to ${route?.name || routeId}.`,
      type: 'info',
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-20 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-1">Traffic & Pedestrian Intelligence</h1>
            <p className="text-gray-400 text-sm">
              Edge-estimated vehicle classification, congestion density, and pedestrian safety risk zones
            </p>
          </div>
          <div className="text-xs text-gray-400 font-mono bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
            Sensor Feed: 7 Bus Front IMX390 Cameras
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Vehicles Scanned Today', value: totalVehicles.toLocaleString(), icon: Car, color: 'text-cyan-400' },
            { label: 'Avg Observed Speed', value: `${avgSpeed} km/h`, icon: Activity, color: 'text-teal-400' },
            { label: 'Congested Corridors', value: `${congestionZones.length} Routes`, icon: MapPin, color: 'text-orange-500' },
            { label: 'Pedestrians Observed', value: totalPedestrians.toLocaleString(), icon: Users, color: 'text-blue-400' },
            { label: 'Active Road Incidents', value: totalIncidents.toString(), icon: AlertTriangle, color: 'text-red-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 shadow-[0_0_15px_rgba(0,212,255,0.08)] flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gray-800 border border-gray-700/60 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-white truncate">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Chart 1: Vehicles per Hour */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Hourly Vehicle Flow Profile (City-Wide)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyTraffic || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(6,182,212,0.3)', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="vehicles" name="Vehicles" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.2} strokeWidth={2} />
                  <Area type="monotone" dataKey="pedestrians" name="Pedestrians" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Vehicle Type Distribution */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <h2 className="text-base font-semibold text-white mb-4">Observed Vehicle Modal Split</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                    labelLine={false}
                  >
                    {vehicleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(6,182,212,0.3)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Congestion Hotspot Corridor Cards */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" /> Monitored Transit Route Congestion Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trafficData.map((td) => {
              const route = routes.find(r => r.id === td.routeId);
              const isHeavy = td.congestionLevel === 'heavy';
              const isModerate = td.congestionLevel === 'moderate';

              return (
                <div
                  key={td.routeId}
                  className="bg-gray-900/60 border border-gray-800 hover:border-cyan-500/30 p-4 rounded-xl space-y-3 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{td.routeId}</span>
                      <h4 className="text-sm font-semibold text-white truncate max-w-[180px]">
                        {route?.name || td.routeId}
                      </h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        isHeavy
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : isModerate
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}
                    >
                      {td.congestionLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 pt-2 border-t border-gray-800">
                    <div>
                      <span className="text-[10px] block text-gray-500">Volume</span>
                      <span className="text-white font-bold">{td.vehicleCount} vph</span>
                    </div>
                    <div>
                      <span className="text-[10px] block text-gray-500">Avg Speed</span>
                      <span className="text-white font-bold">{td.avgSpeed} km/h</span>
                    </div>
                    <div>
                      <span className="text-[10px] block text-gray-500">Incidents</span>
                      <span className={td.incidents > 0 ? 'text-red-400 font-bold' : 'text-gray-400'}>
                        {td.incidents}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInspectRoute(td.routeId)}
                    className="w-full text-center text-xs py-1.5 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Inspect Corridor <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-500 font-mono">
          Prototype demonstration using simulated/illustrative data for SIH 2026 evaluation.
        </p>
      </motion.div>
    </div>
  );
}
