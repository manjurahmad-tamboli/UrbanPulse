'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, Car, AlertTriangle, Radio, Download, Send, CheckCircle2,
  Clock, MapPin, Gauge, Eye, Search, Filter, ShieldCheck, ArrowRight, Bus
} from 'lucide-react';
import { mockIncidents } from '@/data/mock-data';
import { useSimulation } from '@/context/simulation-context';
import type { Incident, IncidentType } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function IncidentsPage() {
  const { addToast } = useSimulation();
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(mockIncidents[0].id);
  const [typeFilter, setTypeFilter] = useState<IncidentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const filteredIncidents = incidents.filter(i => {
    const matchesType = typeFilter === 'all' || i.type === typeFilter;
    const matchesSearch =
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDispatchPolice = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(i => {
        if (i.id === incidentId) {
          return { ...i, status: 'alert_dispatched' };
        }
        return i;
      })
    );

    addToast({
      title: `Police & RTO Alert Dispatched — ${incidentId}`,
      message: `Forensic telemetry for ${selectedIncident.licensePlate} transmitted to Kolhapur City Police Control Room.`,
      type: 'critical',
    });
  };

  const handleExportForensic = (incident: Incident) => {
    const forensicReport = {
      reportType: 'URBANPULSE_LAW_ENFORCEMENT_INCIDENT_DOSSIER',
      generatedAt: new Date().toISOString(),
      caseId: incident.id,
      incidentType: incident.type,
      location: {
        address: incident.address,
        latitude: incident.latitude,
        longitude: incident.longitude,
      },
      offendingVehicle: incident.offendingVehicle,
      anprTelemetry: {
        extractedRegistrationPlate: incident.licensePlate,
        ocrModelConfidence: `${(incident.ocrConfidence * 100).toFixed(1)}%`,
        plateStandard: 'IND High-Security Registration Plate (HSRP)',
      },
      sensingChain: {
        primaryDetectingNode: incident.reportingBusId,
        secondaryHandoffNode: incident.collaboratingBusId || 'N/A',
        trackingDuration: `${incident.trackingDurationSec} seconds`,
      },
      evidenceIntegrity: {
        cryptographicHash: incident.sha256EvidenceHash,
        hashAlgorithm: 'SHA-256 (Tamper-Evident Chain)',
      },
      narrative: incident.summary,
    };

    const blob = new Blob([JSON.stringify(forensicReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${incident.id}-Police-Forensic-Evidence.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      title: 'Forensic Package Exported',
      message: `Downloaded evidence docket for ${incident.id} with SHA-256 hash.`,
      type: 'info',
    });
  };

  const getTypeBadge = (type: IncidentType) => {
    switch (type) {
      case 'hit_and_run':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'rash_driving':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'signal_jump':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-20 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 uppercase">
                BEL PS-26124 Mandatory Feature
              </span>
              <span className="text-xs text-gray-500 font-mono">Automated Law Enforcement & ANPR</span>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">
              Incident Review & ANPR Investigation Hub
            </h1>
            <p className="text-gray-400 text-sm max-w-3xl mt-1">
              Onboard Edge AI detection of hit-and-run collisions, rash driving, high-speed tracking, automatic number plate recognition (ANPR), and multi-bus collaborative tracking handoff.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/80 px-3.5 py-2 rounded-xl border border-gray-800 text-xs font-mono text-cyan-300">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            Police Central Gateway: CONNECTED
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(239,68,68,0.08)]">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
              <ShieldAlert size={26} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Active Hit-and-Run</p>
              <p className="text-2xl font-bold text-red-400">1 Case</p>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Car size={26} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">ANPR Plate Accuracy</p>
              <p className="text-2xl font-bold text-cyan-400">95.1%</p>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(249,115,22,0.08)]">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Gauge size={26} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Speed Violations</p>
              <p className="text-2xl font-bold text-orange-400">3 Flagged</p>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-teal-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(20,184,166,0.08)]">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Bus size={26} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Multi-Bus Handoffs</p>
              <p className="text-2xl font-bold text-teal-400">75% Tracked</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-gray-900/80 px-3 py-2 rounded-xl border border-gray-800">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by license plate (e.g. MH-09-CV-8821), address, or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500 mr-1" />
            {(['all', 'hit_and_run', 'rash_driving', 'signal_jump', 'wrong_way'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  typeFilter === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {type.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Left List (45%) & Right Dossier (55%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Incident List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredIncidents.map(incident => {
              const isSelected = selectedIncidentId === incident.id;

              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected
                      ? 'bg-gray-800/80 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-[#111827]/80 border-gray-800 hover:border-gray-700 hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeBadge(incident.type)}`}>
                        {incident.type.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono text-xs text-gray-400">{incident.id}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{incident.title}</h4>

                  {/* ANPR Plate Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/80">
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded bg-yellow-400 text-gray-950 font-mono font-extrabold text-xs tracking-wider border border-yellow-300 shadow-sm flex items-center gap-1.5">
                        <span className="text-[9px] bg-blue-900 text-white px-1 rounded">IND</span>
                        {incident.licensePlate}
                      </div>
                      <span className="text-[11px] text-green-400 font-mono font-bold">
                        {(incident.ocrConfidence * 100).toFixed(0)}% OCR
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-red-400">
                        {incident.offendingVehicle.estimatedSpeed} km/h
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        Limit: {incident.offendingVehicle.speedLimit} km/h
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    {incident.address}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Forensic Dossier */}
          <div className="lg:col-span-7 bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.1)] flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Dossier Top Bar */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-cyan-400 font-bold">CASE FILE: {selectedIncident.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeBadge(selectedIncident.type)}`}>
                      {selectedIncident.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedIncident.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedIncident.address}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block">CASE STATUS</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40 inline-block mt-1">
                    {selectedIncident.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* ANPR Extracted Plate Graphic & Crop Frame */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Simulated ANPR License Plate Crop */}
                <div className="bg-gray-950 p-4 rounded-xl border border-cyan-500/30 flex flex-col items-center justify-center space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> Edge AI License Plate Crop (LPR)
                  </span>
                  
                  {/* High-Security Indian License Plate Box */}
                  <div className="w-full max-w-[260px] bg-yellow-400 text-gray-950 p-2.5 rounded-lg border-2 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] bg-blue-900 text-white px-1.5 py-0.5 rounded font-bold font-mono">
                      🇮🇳 IND
                    </div>
                    <span className="font-mono font-black text-xl tracking-widest text-gray-950">
                      {selectedIncident.licensePlate}
                    </span>
                    <span className="text-[9px] font-bold text-gray-700">HSRP</span>
                  </div>

                  <div className="flex items-center justify-between w-full text-xs font-mono pt-1 text-gray-400">
                    <span>Confidence: <strong className="text-green-400">{(selectedIncident.ocrConfidence * 100).toFixed(1)}%</strong></span>
                    <span>Class: <strong className="text-white">{selectedIncident.offendingVehicle.vehicleClass.split('/')[0]}</strong></span>
                  </div>
                </div>

                {/* Offending Vehicle Speed & Telemetry */}
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-orange-400" /> Speed & Trajectory Telemetry
                  </span>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">Estimated Velocity</span>
                      <p className="text-2xl font-bold font-mono text-red-400">
                        {selectedIncident.offendingVehicle.estimatedSpeed} <span className="text-xs text-gray-400 font-normal">km/h</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">Zone Limit</span>
                      <p className="text-xl font-bold font-mono text-gray-300">
                        {selectedIncident.offendingVehicle.speedLimit} <span className="text-xs text-gray-500 font-normal">km/h</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-300 pt-1 border-t border-gray-800/80 space-y-1">
                    <p><span className="text-gray-500">Vehicle Description:</span> {selectedIncident.offendingVehicle.makeModel} ({selectedIncident.offendingVehicle.color})</p>
                    <p><span className="text-gray-500">Tracking Duration:</span> {selectedIncident.trackingDurationSec}s via ByteTrack algorithm</p>
                  </div>
                </div>
              </div>

              {/* Multi-Bus Collaborative Tracking Handoff Graphic */}
              <div className="bg-gray-900/40 p-4 rounded-xl border border-teal-500/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Bus className="w-4 h-4" /> Multi-Bus Fleet Collaborative Handoff
                  </span>
                  <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800 font-mono">
                    Swarm Intelligence
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs bg-black/40 p-3 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg font-mono font-bold text-xs">
                      {selectedIncident.reportingBusId}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Initial Sighting</span>
                      <span className="text-[10px] text-gray-400">Incident Detected & Tagged</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-2">
                    <span className="text-[10px] text-teal-300 font-mono mb-1">650m Corridor Handoff</span>
                    <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-green-500 relative flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-green-400 absolute" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="font-semibold text-white block">Downstream Confirmation</span>
                      <span className="text-[10px] text-gray-400">Escape Trajectory Verified</span>
                    </div>
                    <div className="p-2 bg-green-950 text-green-400 rounded-lg font-mono font-bold text-xs">
                      {selectedIncident.collaboratingBusId || 'BUS-103'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Narrative Summary & Cryptographic Proof */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Forensic Narrative</h5>
                <p className="text-xs text-gray-300 bg-gray-900/50 p-3 rounded-xl border border-gray-800 leading-relaxed">
                  "{selectedIncident.summary}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1">
                  <span>SHA-256 Tamper Proof Hash:</span>
                  <span className="text-cyan-400 truncate max-w-[280px]">{selectedIncident.sha256EvidenceHash}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleExportForensic(selectedIncident)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl border border-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-400" /> Export Forensic Dossier (.JSON)
              </button>

              <button
                onClick={() => handleDispatchPolice(selectedIncident.id)}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Dispatch Secure Police & RTO Alert
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
