'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car, Activity, MapPin, Users, AlertTriangle, ArrowUpRight, TrendingUp,
  Clock, ShieldAlert, School, ArrowRight, Gauge, CheckCircle2, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { trafficData, vehicleDistribution, hourlyTraffic, routes, mockODFlows, mockSchoolZones } from '@/data/mock-data';
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

  const handleSchoolZoneAlert = (zoneName: string, advisory: string) => {
    addToast({
      title: `School Zone Advisory — ${zoneName}`,
      message: advisory,
      type: 'warning',
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-20 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 uppercase">
                BEL PS-26124 Mobility Analytics
              </span>
              <span className="text-xs text-gray-500 font-mono">Vehicle Density & Vulnerable Pedestrians</span>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Traffic, Origin-Destination & Pedestrian Safety
            </h1>
            <p className="text-gray-400 text-sm max-w-3xl mt-1">
              Edge-estimated vehicle classification, Origin-Destination (OD) pattern modeling, transit route delay estimation, and school-zone vulnerable pedestrian risk monitoring.
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

        {/* Charts Grid: Hourly Volume & Modal Split */}
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

        {/* SECTION A: ORIGIN-DESTINATION (OD) TRAFFIC FLOW & ROUTE DELAYS (BEL PS REQUIREMENT) */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.08)] mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  OD MODELING
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-cyan-400" /> Origin–Destination (OD) Travel Demand & Route Delays
                </h2>
              </div>
              <p className="text-xs text-gray-400">
                Aggregated zone-to-zone mobility patterns estimated by bus-mounted vehicle tracking and schedule variance
              </p>
            </div>
            <div className="text-xs text-gray-400 font-mono bg-gray-900/80 px-3 py-1.5 rounded-xl border border-gray-800">
              Corridor Sample: 5 Major Urban Sectors
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-800/40 border-b border-gray-700 text-gray-400 uppercase tracking-wider font-mono">
                  <th className="p-3">Corridor Pair (Origin → Destination)</th>
                  <th className="p-3">Hourly Volume</th>
                  <th className="p-3">Scheduled Time</th>
                  <th className="p-3">Expected Delay</th>
                  <th className="p-3">Congestion Level</th>
                  <th className="p-3">Primary Delay Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {mockODFlows.map(od => (
                  <tr key={od.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <span className="text-cyan-400">{od.originZone}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      <span className="text-teal-300">{od.destinationZone}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-white">{od.vehicleVolumePerHour} vph</td>
                    <td className="p-3 font-mono text-gray-300">{od.averageTravelTimeMin} mins</td>
                    <td className="p-3">
                      <span className={`font-mono font-bold ${
                        od.expectedDelayMin > 5 ? 'text-red-400' : od.expectedDelayMin > 2 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        +{od.expectedDelayMin} mins
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        od.congestionIndex === 'high'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : od.congestionIndex === 'moderate'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                          : 'bg-green-500/20 text-green-400 border border-green-500/40'
                      }`}>
                        {od.congestionIndex}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 italic">{od.primaryBottleneck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION B: SCHOOL ZONE VULNERABLE PEDESTRIAN RISK (BEL PS REQUIREMENT) */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(234,179,8,0.08)] mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                  CHILD & PEDESTRIAN SAFETY
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <School className="w-5 h-5 text-yellow-400" /> School Zone Vulnerable Pedestrian Situations
                </h2>
              </div>
              <p className="text-xs text-gray-400">
                Real-time edge detection of school children crossing roads, pedestrian risk indices, zebra crossing wear, and bus driver speed advisories
              </p>
            </div>
            <span className="text-xs bg-yellow-950/60 text-yellow-400 border border-yellow-500/40 px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 animate-pulse" /> 2 Active School Crossing Alerts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockSchoolZones.map(zone => (
              <div
                key={zone.id}
                className="bg-gray-900/70 border border-gray-800 hover:border-yellow-500/40 rounded-xl p-4 space-y-3 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800">
                      Route {zone.routeId}
                    </span>
                    {zone.activeCrossingAlert && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                        CROSSING ACTIVE
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-white">{zone.schoolName}</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    {zone.address.split(',')[0]}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Children Observed:</span>
                    <span className="font-mono font-bold text-yellow-400">{zone.vulnerablePedestrianCount} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">School Speed Limit:</span>
                    <span className="font-mono font-bold text-white">{zone.speedLimitKmH} km/h</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-400">Zebra Crossing Condition:</span>
                      <span className={`font-bold ${zone.zebraCrossingVisibility < 50 ? 'text-red-400' : 'text-green-400'}`}>
                        {zone.zebraCrossingVisibility}% Visible ({zone.infrastructureStatus.replace(/_/g, ' ')})
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${zone.zebraCrossingVisibility < 50 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${zone.zebraCrossingVisibility}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSchoolZoneAlert(zone.schoolName, zone.busDriverAdvisory)}
                  className="w-full mt-2 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-lg border border-yellow-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Transmit Driver Safety Advisory
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION C: Congestion Corridor Cards */}
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
