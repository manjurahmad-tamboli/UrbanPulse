'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Truck, ShieldAlert, CheckCircle, ExternalLink, Calendar, Map, Check, Users } from 'lucide-react';
import { useSimulation } from '@/context/simulation-context';
import type { UrbanIssue, Detection } from '@/lib/types';
import { urbanIssues } from '@/data/mock-data';

interface EvidenceCardProps {
  issue?: UrbanIssue;
  detection?: Detection;
  onViewOnMap?: () => void;
  onAssignTeam?: () => void;
  onMarkVerified?: () => void;
}

export default function EvidenceCard({
  issue: propIssue,
  detection,
  onViewOnMap,
  onAssignTeam,
  onMarkVerified,
}: EvidenceCardProps) {
  const router = useRouter();
  const { assignTeam, verifyRepair, addToast } = useSimulation();

  // Find issue or fallback
  const defaultIssue = urbanIssues.find(i => i.id === 'PH-2048') || urbanIssues[0];
  const issue = propIssue || defaultIssue;

  const [currentStatus, setCurrentStatus] = useState<'pending' | 'assigned' | 'verified'>('pending');
  const [assignedTeamName, setAssignedTeamName] = useState<string | null>(null);

  const handleViewOnMap = () => {
    if (onViewOnMap) {
      onViewOnMap();
    } else {
      addToast({
        title: `Locating ${issue.id} on Road Map`,
        message: `Navigating to Road Health Map for ${issue.address}...`,
        type: 'info',
      });
      router.push('/road-health');
    }
  };

  const handleAssignTeam = () => {
    const team = 'Team Alpha (Road Works)';
    setCurrentStatus('assigned');
    setAssignedTeamName(team);
    assignTeam(issue.id, team);
    if (onAssignTeam) onAssignTeam();
  };

  const handleMarkVerified = () => {
    setCurrentStatus('verified');
    verifyRepair(issue.id);
    if (onMarkVerified) onMarkVerified();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden h-full flex flex-col shadow-[0_0_20px_rgba(6,182,212,0.1)]"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">DETECTION EVIDENCE</span>
          <div className="text-lg font-mono font-bold text-white flex items-center gap-2">
            {issue.id}
            <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase font-semibold">
              {issue.severity} Severity
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">STATUS</span>
          <div className="text-xs font-semibold flex items-center gap-1 justify-end">
            {currentStatus === 'verified' ? (
              <span className="text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                <CheckCircle className="w-3 h-3" /> Repair Verified
              </span>
            ) : currentStatus === 'assigned' ? (
              <span className="text-cyan-400 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                <Users className="w-3 h-3" /> {assignedTeamName || 'Assigned'}
              </span>
            ) : (
              <span className="text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
                <Clock className="w-3 h-3" /> Pending Verif.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Snapshot Thumbnail Preview */}
      <div className="relative h-28 bg-[#0a0e1a] border-b border-gray-800 overflow-hidden group">
        {/* Simulated Road Camera Snapshot */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-950 flex items-center justify-center">
          <div className="w-3/4 h-16 border-2 border-dashed border-red-500/80 bg-red-950/20 rounded-lg flex items-center justify-center relative">
            <span className="absolute -top-3 left-2 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-mono font-bold rounded">
              YOLO: POTHOLE 94%
            </span>
            <div className="w-16 h-8 bg-black/80 rounded-full blur-[2px] border border-gray-700 shadow-inner"></div>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur text-[10px] font-mono text-cyan-400 rounded">
          GPS: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur text-[10px] font-mono text-gray-400 rounded">
          1920x1080 @ 28fps
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-4 flex-1 grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
        <div>
          <div className="text-gray-500 mb-0.5 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-cyan-400" /> Category
          </div>
          <div className="text-gray-200 font-medium capitalize">{issue.type.replace('_', ' ')}</div>
        </div>
        <div>
          <div className="text-gray-500 mb-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-400" /> Detected
          </div>
          <div className="text-gray-200 font-medium">{new Date(issue.lastDetected).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
        <div>
          <div className="text-gray-500 mb-0.5 flex items-center gap-1">
            <Truck className="w-3 h-3 text-cyan-400" /> Source Bus
          </div>
          <div className="text-gray-200 font-medium">{issue.timeline[0]?.busId || 'BUS-042'} (Route R07)</div>
        </div>
        <div>
          <div className="text-gray-500 mb-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" /> Location
          </div>
          <div className="text-gray-200 font-mono text-[11px] truncate" title={issue.address}>
            {issue.address.split(',')[0]}
          </div>
        </div>
        <div>
          <div className="text-gray-500 mb-0.5">AI Confidence</div>
          <div className="text-sm font-bold text-cyan-400">{(issue.confidence * 100).toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-gray-500 mb-0.5">Repeat Sightings</div>
          <div className="text-sm font-bold text-white">
            {issue.sightings} <span className="text-[10px] text-gray-500 font-normal">(PostGIS 10m Clustered)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-gray-900/40 border-t border-gray-800 grid grid-cols-3 gap-2">
        <button
          onClick={handleViewOnMap}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-200 text-xs transition-colors cursor-pointer border border-gray-700"
        >
          <Map className="w-4 h-4 text-cyan-400" /> View on Map
        </button>

        <button
          onClick={handleAssignTeam}
          disabled={currentStatus === 'assigned' || currentStatus === 'verified'}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-xs transition-all cursor-pointer ${
            currentStatus === 'assigned' || currentStatus === 'verified'
              ? 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-500 opacity-80 cursor-not-allowed'
              : 'bg-cyan-600/20 border border-cyan-500/40 hover:bg-cyan-600/30 text-cyan-300'
          }`}
        >
          {currentStatus === 'assigned' ? (
            <>
              <Check className="w-4 h-4 text-cyan-400" /> Assigned
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" /> Assign Team
            </>
          )}
        </button>

        <button
          onClick={handleMarkVerified}
          disabled={currentStatus === 'verified'}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-xs transition-all cursor-pointer ${
            currentStatus === 'verified'
              ? 'bg-green-950/40 border border-green-500/30 text-green-400 opacity-80 cursor-not-allowed'
              : 'bg-green-600/20 border border-green-500/40 hover:bg-green-600/30 text-green-300'
          }`}
        >
          {currentStatus === 'verified' ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" /> Verified
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Mark Verified
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
