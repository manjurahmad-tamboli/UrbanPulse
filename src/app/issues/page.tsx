'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  issueTypeLabels, 
  severityBgColors, 
  statusColors, 
  statusLabels, 
  issueTypeIcons, 
  IssueType, 
  Severity, 
  IssueStatus,
  UrbanIssue 
} from '@/lib/types';
import { 
  Search, 
  Filter, 
  Info, 
  Eye, 
  AlertTriangle, 
  PlusCircle, 
  X, 
  MapPin, 
  Camera, 
  Upload, 
  Check, 
  Sparkles,
  Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulation } from '@/context/simulation-context';

export default function IssuesPage() {
  const router = useRouter();
  const { issues, addIssue, addToast } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<IssueType | 'All'>('All');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');

  // Report Issue Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newType, setNewType] = useState<IssueType>('pothole');
  const [newAddress, setNewAddress] = useState('');
  const [newLatitude, setNewLatitude] = useState('16.7050');
  const [newLongitude, setNewLongitude] = useState('74.2430');
  const [newSeverity, setNewSeverity] = useState<Severity>('high');
  const [newEstimatedArea, setNewEstimatedArea] = useState('0.75');
  const [newImpact, setNewImpact] = useState<'none' | 'low' | 'moderate' | 'high' | 'severe'>('moderate');
  const [newDepartment, setNewDepartment] = useState('Road Maintenance');
  const [newDescription, setNewDescription] = useState('');
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || issue.type === typeFilter;
    const matchesSeverity = severityFilter === 'All' || issue.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  // Handle Photo Selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewImagePreview(url);
    }
  };

  // Generate Sample Defect Photo
  const handleAttachSamplePhoto = () => {
    const offscreen = document.createElement('canvas');
    offscreen.width = 400;
    offscreen.height = 250;
    const ctx = offscreen.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1e2330';
      ctx.fillRect(0, 0, 400, 250);
      for (let i = 0; i < 1500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)';
        ctx.fillRect(Math.random() * 400, Math.random() * 250, 2, 2);
      }
      // Pothole crater
      ctx.beginPath();
      ctx.ellipse(200, 130, 80, 45, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0e1a';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
      setNewImagePreview(offscreen.toDataURL('image/jpeg'));
    }
  };

  // Autofill Kolhapur GPS
  const handleAutofillKolhapurGPS = () => {
    const kolhapurSpots = [
      { lat: '16.7020', lng: '74.2410', addr: 'Rajarampuri 5th Lane, Kolhapur' },
      { lat: '16.6912', lng: '74.2280', addr: 'Rankala Lake Promenade Road, Kolhapur' },
      { lat: '16.7095', lng: '74.2455', addr: 'College Road, near Cyber Chowk, Kolhapur' },
      { lat: '16.7035', lng: '74.2390', addr: 'Station Road, Railway Overbridge, Kolhapur' }
    ];
    const spot = kolhapurSpots[Math.floor(Math.random() * kolhapurSpots.length)];
    setNewLatitude(spot.lat);
    setNewLongitude(spot.lng);
    if (!newAddress) setNewAddress(spot.addr);
  };

  // Submit New Issue
  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      alert('Please enter a road or landmark address.');
      return;
    }

    const uniqueNum = Math.floor(2050 + Math.random() * 500);
    const newIssueId = `ISS-${uniqueNum}`;

    const createdIssue: UrbanIssue = {
      id: newIssueId,
      type: newType,
      title: `${issueTypeLabels[newType]} at ${newAddress.split(',')[0]}`,
      description: newDescription.trim() || `Citizen/Patrol reported ${issueTypeLabels[newType].toLowerCase()} requiring immediate municipal inspection.`,
      severity: newSeverity,
      status: 'open',
      latitude: parseFloat(newLatitude) || 16.7050,
      longitude: parseFloat(newLongitude) || 74.2430,
      address: newAddress,
      roadSegmentId: 'RS-005',
      confidence: 0.95,
      sightings: 1,
      firstDetected: new Date().toISOString(),
      lastDetected: new Date().toISOString(),
      detectionIds: [`DET-${Math.floor(1000 + Math.random() * 9000)}`],
      assignedDepartment: newDepartment,
      assignedTeam: 'Pending Dispatch',
      estimatedArea: parseFloat(newEstimatedArea) || 0.75,
      impactOnTraffic: newImpact,
      evidenceImages: [newImagePreview || '/images/pothole-detection.jpg'],
      repairVerified: false,
      timeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'detected',
          description: 'Reported via UrbanPulse Citizen & Patrol Portal (Verified by Edge AI)',
          busId: 'PATROL-UNIT-01'
        }
      ]
    };

    addIssue(createdIssue);

    addToast({
      title: 'Issue Logged Successfully',
      message: `${createdIssue.title} (${newIssueId}) added to municipal queue and live map.`,
      type: 'success',
    });

    // Reset and close
    setIsModalOpen(false);
    setNewAddress('');
    setNewDescription('');
    setNewImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto flex flex-col gap-6"
      >
        {/* Header with Title & Action Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 uppercase">
                Municipal Issues Ledger
              </span>
              <span className="text-xs text-gray-500 font-mono">Real-time PWD Dispatch</span>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Detected Urban Issues
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              AI-detected and citizen-reported infrastructure defects requiring municipal maintenance
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Report New Issue
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 shadow-[0_0_15px_rgba(0,212,255,0.05)]">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-4 h-4 mr-1 shrink-0" />
              
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
              >
                <option value="All">All Types</option>
                {Object.entries(issueTypeLabels).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>

              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
              >
                <option value="All">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
              >
                <option value="All">All Statuses</option>
                {Object.entries(statusLabels).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,212,255,0.05)]">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h2 className="font-semibold text-gray-200 text-sm">Results</h2>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full font-mono">
              {filteredIssues.length} issues found
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="px-4 py-3 font-medium">Issue ID</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No issues found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => {
                    const iconEmoji = issueTypeIcons[issue.type] || '⚠️';
                    
                    return (
                      <tr 
                        key={issue.id} 
                        onClick={() => router.push(`/issues/${issue.id}`)}
                        className="border-b border-gray-800/50 hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-4 font-mono text-cyan-400 font-semibold">{issue.id}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-gray-200">
                            <span className="text-sm">{iconEmoji}</span>
                            {issueTypeLabels[issue.type]}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-300 max-w-[220px] truncate" title={issue.address}>
                          {issue.address}
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold text-white", severityBgColors[issue.severity])}>
                            {issue.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300 font-mono text-xs">{(issue.confidence * 100).toFixed(0)}%</span>
                            <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500"
                                style={{ width: `${issue.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[issue.status])}>
                              {statusLabels[issue.status]}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-gray-400 hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-cyan-500/10">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* REPORT NEW ISSUE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111827] border border-cyan-500/30 rounded-2xl w-full max-w-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-5 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                    Citizen & Patrol Portal
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                  Report New Road Infrastructure Defect
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Log an anomaly directly into the UrbanPulse Kolhapur municipal GIS dispatch queue.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitIssue} className="space-y-4 text-xs">
                {/* Defect Type & Severity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">
                      Defect Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => {
                        const t = e.target.value as IssueType;
                        setNewType(t);
                        // Auto-assign department based on type
                        if (t === 'waterlogging') setNewDepartment('Drainage Department');
                        else if (t === 'missing_sign' || t === 'damaged_sign' || t === 'missing_zebra_crossing') setNewDepartment('Traffic Engineering');
                        else setNewDepartment('Road Maintenance');
                      }}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {Object.entries(issueTypeLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">
                      Severity Rating <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['critical', 'high', 'medium', 'low'] as Severity[]).map((sev) => (
                        <button
                          type="button"
                          key={sev}
                          onClick={() => setNewSeverity(sev)}
                          className={cn(
                            'py-2 rounded-lg font-semibold uppercase text-[10px] transition-all cursor-pointer border',
                            newSeverity === sev
                              ? sev === 'critical' ? 'bg-red-600 text-white border-red-500'
                                : sev === 'high' ? 'bg-orange-600 text-white border-orange-500'
                                : sev === 'medium' ? 'bg-yellow-600 text-white border-yellow-500'
                                : 'bg-blue-600 text-white border-blue-500'
                              : 'bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700'
                          )}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location / Address */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-gray-300 font-medium">
                      Road Name / Landmark Address <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutofillKolhapurGPS}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" /> Quick Kolhapur GPS
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-cyan-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajarampuri 5th Lane, near Mahavir Garden, Kolhapur"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                </div>

                {/* GPS Coordinates & Estimated Area */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={newLatitude}
                      onChange={(e) => setNewLatitude(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={newLongitude}
                      onChange={(e) => setNewLongitude(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Est. Defect Area (m²)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={newEstimatedArea}
                      onChange={(e) => setNewEstimatedArea(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                </div>

                {/* Department & Traffic Impact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Assigned Department</label>
                    <select
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Road Maintenance">Road Maintenance (PWD)</option>
                      <option value="Drainage Department">Drainage & Stormwater Department</option>
                      <option value="Traffic Engineering">Traffic Engineering & Signage</option>
                      <option value="Electrical Department">Electrical & Streetlights</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Impact on Traffic</label>
                    <select
                      value={newImpact}
                      onChange={(e) => setNewImpact(e.target.value as any)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="low">Low - Minor Slowdown</option>
                      <option value="moderate">Moderate - Lane Swerving</option>
                      <option value="high">High - Severe Congestion</option>
                      <option value="severe">Severe - Road Blockage / Hazard</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-300 font-medium mb-1.5">Description & Observations</label>
                  <textarea
                    rows={2}
                    placeholder="Provide additional details regarding pothole depth, water accumulation, or safety hazards..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                {/* Photo Evidence Upload */}
                <div>
                  <label className="block text-gray-300 font-medium mb-1.5">Visual Photo Evidence</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="flex-1 w-full border border-dashed border-gray-700 hover:border-cyan-400 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-black/30">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">Upload Defect Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleAttachSamplePhoto}
                      className="w-full sm:w-auto px-3 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Attach Sample Photo
                    </button>
                  </div>

                  {newImagePreview && (
                    <div className="mt-2.5 p-2 bg-black/50 border border-cyan-500/30 rounded-xl flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={newImagePreview}
                        alt="Preview"
                        className="w-16 h-12 rounded object-cover border border-cyan-500/40"
                      />
                      <div className="text-[11px] text-gray-300 flex-1">
                        <p className="font-semibold text-cyan-400">Photo Attached & Geotagged</p>
                        <p className="text-gray-500 font-mono">Simulated defect bounding box applied</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewImagePreview(null)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Log & Dispatch Issue
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
