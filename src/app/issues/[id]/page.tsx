'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertTriangle,
  FileText,
  Printer,
  X,
  Building2,
  QrCode,
  Download
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
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

  const [assigned, setAssigned] = useState(issue?.status === 'assigned');
  const [repaired, setRepaired] = useState(issue?.status === 'repaired' || issue?.status === 'verified');
  const [verified, setVerified] = useState(issue?.status === 'verified');
  const [showWorkOrder, setShowWorkOrder] = useState(false);

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

  const handlePrint = () => {
    window.print();
  };

  // Calculate SLA based on severity
  const slaDeadline = issue.severity === 'critical' 
    ? '24 Hours (Emergency SLA)' 
    : issue.severity === 'high' 
    ? '48 Hours (High Priority SLA)' 
    : '7 Days (Standard SLA)';

  // Estimated repair cost in INR based on defect area
  const estimatedCost = Math.round((issue.estimatedArea || 0.82) * 10500 + 1500);

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

          <div className="flex flex-wrap items-center gap-3">
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

            {/* Export Work Order Button in Header */}
            <button
              onClick={() => setShowWorkOrder(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Work Order</span>
            </button>
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
                  GPS: {issue.latitude.toFixed(4)}°N, {issue.longitude.toFixed(4)}°E
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

              {/* Export Official Work Order Button */}
              <button
                onClick={() => setShowWorkOrder(true)}
                className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium border text-sm cursor-pointer bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Export Official PWD Work Order (PDF / Print)</span>
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,212,255,0.05)]">
              <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Info className="w-4 h-4" /> Incident Metadata
              </h3>
              
              <div className="space-y-3 text-xs">
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
                  <span className="text-gray-200" suppressHydrationWarning>{formatDate(issue.firstDetected)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Detected</span>
                  <span className="text-gray-200" suppressHydrationWarning>{formatDate(issue.lastDetected)}</span>
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
                    <span className="text-xs text-gray-400 flex items-center gap-1" suppressHydrationWarning>
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {formatDate(event.timestamp)}
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

      {/* OFFICIAL PWD WORK ORDER MODAL (PRINTABLE / PDF EXPORT) */}
      <AnimatePresence>
        {showWorkOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white text-gray-900 rounded-2xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl relative my-8 print:p-0 print:m-0 print:shadow-none"
            >
              {/* Modal Top Control Bar (Hidden in Print) */}
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200 print:hidden">
                <div className="flex items-center gap-2 text-gray-600 text-xs font-mono">
                  <Building2 className="w-4 h-4 text-cyan-600" />
                  <span>KMC PWD Work Order Generator • Official Gov Document</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print / Save as PDF
                  </button>
                  <button
                    onClick={() => setShowWorkOrder(false)}
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PRINTABLE WORK ORDER DOCUMENT CONTAINER */}
              <div id="work-order-document" className="space-y-6 text-gray-900 font-sans">
                {/* Government Header */}
                <div className="text-center border-b-2 border-gray-900 pb-4">
                  <div className="text-xs font-bold tracking-widest text-gray-600 uppercase mb-1">
                    Government of Maharashtra • Urban Development Department
                  </div>
                  <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">
                    KOLHAPUR MUNICIPAL CORPORATION
                  </h1>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mt-0.5">
                    PUBLIC WORKS DEPARTMENT (ROAD MAINTENANCE & INFRASTRUCTURE CELL)
                  </h2>
                  <div className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 rounded font-mono text-xs font-bold text-gray-800 mt-2">
                    OFFICIAL EMERGENCY ROAD REPAIR WORK ORDER
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-500 block uppercase text-[10px] font-semibold">Work Order No:</span>
                    <span className="font-mono font-bold text-gray-900 text-sm">WO-KMC-2026-{issue.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase text-[10px] font-semibold">Issue Reference:</span>
                    <span className="font-mono font-bold text-gray-900 text-sm">{issue.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase text-[10px] font-semibold">Date of Issuance:</span>
                    <span className="font-semibold text-gray-900" suppressHydrationWarning>{formatDate(issue.firstDetected)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase text-[10px] font-semibold">SLA Repair Deadline:</span>
                    <span className="font-bold text-red-600">{slaDeadline}</span>
                  </div>
                </div>

                {/* Defect & Engineering Specifications */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1 mb-3">
                    1. Defect & Engineering Specifications
                  </h3>
                  <table className="w-full text-xs text-left border border-gray-200">
                    <tbody>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <td className="p-2.5 font-semibold text-gray-600 w-1/3">Defect Classification:</td>
                        <td className="p-2.5 font-bold text-gray-900 uppercase">{issueTypeLabels[issue.type]}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 font-semibold text-gray-600">Road / Ward Landmark:</td>
                        <td className="p-2.5 text-gray-900 font-medium">{issue.address}</td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <td className="p-2.5 font-semibold text-gray-600">GIS Coordinates:</td>
                        <td className="p-2.5 font-mono text-gray-900">{issue.latitude.toFixed(4)}°N, {issue.longitude.toFixed(4)}°E (PostGIS Verified)</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 font-semibold text-gray-600">Estimated Defect Area / Depth:</td>
                        <td className="p-2.5 font-bold text-gray-900 font-mono">{issue.estimatedArea || 0.82} m² (Avg Depth: 65mm)</td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <td className="p-2.5 font-semibold text-gray-600">Repair Standard Code:</td>
                        <td className="p-2.5 text-gray-900">IRC:SP:98-2020 Hot Mix Bituminous Patch Repair with Emulsion Tack Coat</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-gray-600">Sanctioned Estimate Cost:</td>
                        <td className="p-2.5 font-bold text-gray-900">₹{estimatedCost.toLocaleString('en-IN')} INR (PWD Schedule of Rates 2025-26)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Execution & Contractor Assignment */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1 mb-3">
                    2. Assigned Execution Agency & Verification
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <span className="text-gray-500 text-[10px] block uppercase font-semibold">Assigned Contractor:</span>
                      <span className="font-bold text-gray-900 block mt-0.5">
                        {issue.assignedTeam || 'Shree Sai Infrastructure Ltd.'}
                      </span>
                      <span className="text-[10px] text-gray-500">Contractor ID: PWD-MH09-402</span>
                    </div>

                    <div className="p-3 border border-gray-200 rounded-lg">
                      <span className="text-gray-500 text-[10px] block uppercase font-semibold">Inspecting Surveillance Unit:</span>
                      <span className="font-bold text-gray-900 block mt-0.5">
                        {issue.timeline[0]?.busId || 'BUS-042'} (KMT City Bus)
                      </span>
                      <span className="text-[10px] text-gray-500">AI Confidence: {(issue.confidence * 100).toFixed(0)}%</span>
                    </div>

                    <div className="p-3 border border-gray-200 rounded-lg">
                      <span className="text-gray-500 text-[10px] block uppercase font-semibold">Verification Requirement:</span>
                      <span className="font-bold text-blue-700 block mt-0.5">
                        Mandatory Bus AI Re-scan
                      </span>
                      <span className="text-[10px] text-gray-500">Post-repair target score ≥ 90/100</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Photo Slots */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1 mb-3">
                    3. Photographic Evidence & Audit Trail
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-center">
                      <span className="text-[10px] font-bold text-gray-600 uppercase block mb-2">
                        Before Repair (AI Dashcam Evidence Frame)
                      </span>
                      <div className="h-28 bg-gray-900 rounded flex flex-col items-center justify-center text-white text-[10px] font-mono relative overflow-hidden">
                        <div className="w-24 h-12 border-2 border-red-500 rounded bg-red-950/40 flex items-center justify-center">
                          <span className="text-red-400 font-bold">{issueTypeLabels[issue.type]}</span>
                        </div>
                        <span className="absolute bottom-1 left-2 text-[8px] text-gray-400">
                          GPS: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center flex flex-col items-center justify-center min-h-[140px]">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                        After Repair Inspection Photo Slot
                      </span>
                      <span className="text-[9px] text-gray-400 italic max-w-xs">
                        (To be photographed by Contractor & verified by Municipal AI bus pass before bill processing)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signatures & Certification Blocks */}
                <div className="pt-4 border-t border-gray-300 grid grid-cols-3 gap-6 text-xs text-center">
                  <div className="space-y-8">
                    <div className="border-b border-gray-400 h-10" />
                    <span className="font-semibold text-gray-800 block">Junior Engineer (Field)</span>
                    <span className="text-[10px] text-gray-500 block">KMC PWD Ward No. 14</span>
                  </div>

                  <div className="space-y-8">
                    <div className="border-b border-gray-400 h-10" />
                    <span className="font-semibold text-gray-800 block">Authorized Contractor</span>
                    <span className="text-[10px] text-gray-500 block">Acceptance of SLA & Terms</span>
                  </div>

                  <div className="space-y-8">
                    <div className="border-b border-gray-400 h-10" />
                    <span className="font-bold text-gray-900 block">Executive Engineer</span>
                    <span className="text-[10px] text-gray-500 block">Kolhapur Municipal Corporation</span>
                  </div>
                </div>

                {/* Security Footer & Digital Hash */}
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-gray-700" />
                    <span>DIGITALLY SIGNED & DISPATCHED VIA URBANPULSE SMART CITY ENGINE</span>
                  </div>
                  <div>
                    HASH: SHA256:{issue.id.replace('-', '')}9f82c4
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
