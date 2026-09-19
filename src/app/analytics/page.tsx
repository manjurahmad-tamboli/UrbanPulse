'use client';

import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, AlertCircle, Clock, CheckCircle, ArrowRight, MapPin, AlertTriangle, Cpu, ShieldCheck } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  issuesOverTime, severityDistribution, issuesByRoute, roadHealthTrend, aiConfidenceDistribution, bandwidthComparison,
  urbanIssues, roadSegments, departments, routes
} from '@/data/mock-data';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

export default function AnalyticsPage() {
  // 1. Dynamic calculation of Most Affected Route
  const routeCounts: Record<string, number> = {};
  urbanIssues.forEach(issue => {
    const rId = issue.timeline[0]?.busId === 'BUS-042' ? 'R07' : 'R03';
    routeCounts[rId] = (routeCounts[rId] || 0) + 1;
  });
  const topRouteId = Object.entries(routeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'R07';
  const topRoute = routes.find(r => r.id === topRouteId);

  // 2. Dynamic calculation of Most Common Issue
  const typeCounts: Record<string, number> = {};
  urbanIssues.forEach(i => {
    typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
  });
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0] || ['pothole', 0];
  const topTypePercent = Math.round((topType[1] / urbanIssues.length) * 100);

  // 3. Dynamic Critical Hotspot (lowest health segment)
  const worstSegment = [...roadSegments].sort((a, b) => a.healthScore - b.healthScore)[0];

  // 4. Dynamic Avg Resolution Days
  const avgResolution = (
    departments.reduce((acc, d) => acc + d.avgResolutionDays, 0) / departments.length
  ).toFixed(1);

  // 5. Dynamic Repeat Detection Rate
  const repeatSightingsCount = urbanIssues.filter(i => i.sightings > 1).length;
  const repeatRate = Math.round((repeatSightingsCount / urbanIssues.length) * 100);

  // 6. Dynamic Repair Verification Rate
  const verifiedCount = urbanIssues.filter(i => i.repairVerified || i.status === 'verified').length;
  const verifiedRate = Math.round((verifiedCount / (urbanIssues.filter(i => i.status === 'repaired' || i.status === 'verified').length || 1)) * 100);

  const dynamicStats = [
    { label: 'Most Affected Route', value: `${topRouteId} (${topRoute?.name.split(' - ')[1] || 'Station Road'})`, icon: MapPin },
    { label: 'Most Common Issue', value: `Potholes (${topTypePercent}%)`, icon: AlertCircle },
    { label: 'Critical Hotspot', value: worstSegment?.name || 'Station Road', icon: AlertTriangle },
    { label: 'Avg Municipal Resolution', value: `${avgResolution} days`, icon: Clock },
    { label: 'Repeat Detection Rate', value: `${repeatRate}%`, icon: TrendingUp },
    { label: 'Repair Verification Rate', value: `${verifiedRate}%`, icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-20 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-1">UrbanPulse Analytics Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Longitudinal urban telemetry, road degradation trends, and edge computing efficiency metrics
            </p>
          </div>
          <div className="text-xs text-gray-400 font-mono bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
            Data Sample: 137 Detections • 7 Bus Fleets
          </div>
        </div>
        
        {/* Top Derived KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {dynamicStats.map((stat, i) => (
            <div key={i} className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
              <div className="p-3 rounded-xl bg-gray-800 text-cyan-400 border border-cyan-500/20">
                <stat.icon size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold text-white truncate">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Chart 1: Issues Over Time */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Issues Detected Over Time (Last 18 Days)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={issuesOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(6,182,212,0.3)', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="potholes" name="Potholes" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="waterlogging" name="Waterlogging" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="infrastructure" name="Infrastructure" stroke="#eab308" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="traffic" name="Traffic Congestion" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Bandwidth Saved Comparison (Traditional vs UrbanPulse) */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Cellular Bandwidth Efficiency
                </h2>
                <p className="text-xs text-gray-400">Continuous 1080p Stream vs UrbanPulse Edge Metadata</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 font-bold border border-green-500/30">
                98.7% Bandwidth Saved
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bandwidthComparison || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} unit=" GB" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(6,182,212,0.3)', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="value" name="Data (GB/day/bus)" radius={[6, 6, 0, 0]}>
                    {(bandwidthComparison || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={String(entry.color || '#00d4ff')} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Severity Distribution */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <h2 className="text-base font-semibold text-white mb-4">Severity Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${(((percent || 0) * 100)).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={String(entry.color || '#ef4444')} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(6,182,212,0.3)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Road Health Trend */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <h2 className="text-base font-semibold text-white mb-4">City Road Health Index Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={roadHealthTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(6,182,212,0.3)', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="avgScore" name="Avg Road Health Score" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
