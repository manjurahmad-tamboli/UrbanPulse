'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  issueTypeLabels, 
  severityBgColors, 
  statusColors, 
  statusLabels, 
  issueTypeIcons,
} from '@/lib/types';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Camera, 
  Clock, 
  Users, 
  ShieldCheck, 
  Wrench,
  CheckCircle2,
  Info,
  Check,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulation } from '@/context/simulation-context';

const MiniMapComponent = dynamic(
  () => import('@/components/maps/mini-map'),
  { ssr: false, loading: () => <div className="w-full h-full bg-[#111827] rounded-xl animate-pulse" /> }
);

export default function IssueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { issues, assignTeam, markRepaired, verifyRepair, addToast } = useSimulation();

  const issueId = params.id as string;
  const issue = issues.find(i => i.id === issueId) || issues[0];

  const [assigned, setAssigned] = useState(issue.status === 'assigned');
  const [repaired, setRepaired] = useState(issue.status === 'repaired' || issue.status === 'verified');
  const [verified, setVerified] = useState(issue.status === 'verified');

  if (!issue) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">Issue not found</h2>
          <button 
            onClick={() => router.push('/issues')}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Back to Issues
          </button>
        </div>
      </div>
    );
  }

  const issueIcon = issueTypeIcons[issue.type] || '⚠️';

  const handleAssignTeam = () => {
    setAssigned(true);
    assignTeam(issue.id, 'Team Alpha (Pothole Rapid Response)');
  };

  const handleMarkRepaired = () => {
    setRepaired(true);
    markRepaired(issue.id);
  };

  const handleVerifyRepair = () => {
    setVerified(true);
    verifyRepair(issue.id);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/issues')}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 cursor-pointer"
              title="Back to Issues"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                  <span className="text-xl">{issueIcon}</span>
                  {issueTypeLabels[issue.type]}
                </h1>
                <span className="px-2 py-1 rounded bg-white/10 text-gray-400 font-mono text-sm border border-white/5">
                  {issue.id}
                </span>
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {issue.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border uppercase tracking-wider",
              severityBgColors[issue.severity]
            )}>
              {issue.severity} Severity
            </span>
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider",
              statusColors[issue.status]
            )}>
              {statusLabels[issue.status]}
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Evidence & Map */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Visual Evidence Camera Snapshot Frame */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,212,255,0.05)] flex flex-col">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/40">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Camera className="w-4 h-4 text-cyan-400" /> Visual Evidence Frame
                </div>
                <span className="text-xs font-mono text-gray-500">Camera #1 (Front Bus IMX390)</span>
              </div>
              
              <div className="relative aspect-video bg-gray-950 flex items-center justify-center overflow-hidden">
                {/* SVG Road Anomaly Evidence Frame */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center">
                  <div className="w-3/4 h-3/5 border-2 border-red-500 bg-red-950/20 rounded-xl relative flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                    {/* Bounding Box Label */}
                    <div className="absolute -top-3.5 left-4 px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-bold rounded shadow">
                      {issueTypeLabels[issue.type].toUpperCase()}: {(issue.confidence * 100).toFixed(0)}%
                    </div>
                    {/* Simulated Defect */}
                    <div className="w-32 h-16 bg-black/90 rounded-full blur-[2px] border border-gray-700 shadow-inner flex items-center justify-center">
                      <span className="text-[10px] text-gray-500 font-mono">Area: {issue.estimatedArea || 0.82}m²</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Watermark */}
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-cyan-400 border border-cyan-500/30">
                  GPS: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-gray-400 border border-gray-800">
                  Detected by {issue.timeline[0]?.busId || 'BUS-042'}
                </div>
              </div>
            </div>

            {/* Mini Map */}
            <div className="h-[250px] bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,212,255,0.05)] p-1">
              <MiniMapComponent lat={issue.latitude} lng={issue.longitude} />
            </div>
          </div>

          {/* Right Column - Actions & Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Functional Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleAssignTeam}
                disabled={assigned}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm cursor-pointer shadow-lg",
                  assigned
                    ? "bg-blue-950/60 text-blue-400 border border-blue-500/30 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                )}
              >
                {assigned ? <Check className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                {assigned ? 'Team Assigned' : 'Assign Team'}
              </button>

              <button 
                onClick={handleMarkRepaired}
                disabled={repaired}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm cursor-pointer shadow-lg",
                  repaired
                    ? "bg-teal-950/60 text-teal-400 border border-teal-500/30 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/20"
                )}
              >
                {repaired ? <Check className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                {repaired ? 'Repair Logged' : 'Mark Repaired'}
              </button>

              <button 
                onClick={handleVerifyRepair}
                disabled={verified}
                className={cn(
                  "col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium border text-sm cursor-pointer",
                  verified
                    ? "bg-green-950/60 text-green-400 border-green-500/30 cursor-not-allowed"
                    : "bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-500/40"
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                {verified ? 'Repair Verified (Score: 95/100)' : 'Run Bus AI Re-scan & Verify'}
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,212,255,0.05)]">
              <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Info className="w-4 h-4" /> Incident Metadata
              </h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-gray-400">Department</span>
                  <span className="text-gray-200 font-semibold">{issue.assignedDepartment}</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-gray-400">Assigned Team</span>
                  <span className="text-cyan-400 font-semibold">{issue.assignedTeam || 'Pending Dispatch'}</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-cyan-400 font-bold font-mono">{(issue.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-gray-400">Total Sightings</span>
                  <span className="text-gray-200 font-mono bg-white/10 px-2 py-0.5 rounded">{issue.sightings} (PostGIS 10m)</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-gray-400">First Detected</span>
                  <span className="text-gray-200">{new Date(issue.firstDetected).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Detected</span>
                  <span className="text-gray-200">{new Date(issue.lastDetected).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
              <h3 className="text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
                Edge AI Analysis & Impact
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                <p><span className="text-gray-400">Estimated Defect Area:</span> <span className="font-mono text-white font-bold">{issue.estimatedArea || 0.82} m²</span></p>
                <p><span className="text-gray-400">Traffic Impact:</span> <span className="capitalize font-semibold text-orange-400">{issue.impactOnTraffic}</span></p>
                {issue.description && <p className="mt-2 text-gray-400 italic">"{issue.description}"</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Chronological Event Timeline */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,212,255,0.05)] mt-2">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Chronological Lifecycle Timeline
          </h3>
          
          <div className="relative pl-6 border-l border-gray-800 space-y-6">
            {issue.timeline.map((event, index) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-[#0a0e1a] border-2 border-cyan-500 shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 ml-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-200 text-sm">{event.description}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {new Date(event.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {event.busId && (
                    <div className="text-xs text-cyan-400/90 bg-cyan-950/60 border border-cyan-800 inline-block px-2.5 py-0.5 rounded font-mono">
                      Detected via {event.busId}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
