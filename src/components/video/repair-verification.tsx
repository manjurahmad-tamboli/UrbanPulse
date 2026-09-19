'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface RepairVerificationProps {
  issueId?: string;
  beforeScore?: number;
  afterScore?: number;
  beforeDate?: string;
  afterDate?: string;
  verifiedBy?: string;
}

export default function RepairVerification({
  issueId = 'PH-2048',
  beforeScore = 42,
  afterScore = 95,
  beforeDate = '12 Sep 2026',
  afterDate = '18 Sep 2026',
  verifiedBy = 'BUS-042 (Re-scan)',
}: RepairVerificationProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden h-full flex flex-col shadow-[0_0_20px_rgba(6,182,212,0.1)]"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Before & After Repair Verification</h3>
            <p className="text-[11px] text-gray-400">Autonomous Re-scan Confirmation • {issueId}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/40 font-semibold flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
          <CheckCircle2 className="w-3.5 h-3.5" /> REPAIR VERIFIED
        </span>
      </div>

      {/* Interactive Split-Screen View */}
      <div
        className="relative w-full h-52 bg-gray-950 cursor-ew-resize overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* BEFORE ROAD VIEW (Full background) */}
        <div className="absolute inset-0 bg-[#171b24] flex items-center justify-center overflow-hidden">
          {/* Asphalt Texture & Cracks */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Damaged Pothole Graphic */}
          <div className="relative flex flex-col items-center">
            {/* Crack lines radiating */}
            <div className="w-48 h-28 relative">
              <svg className="w-full h-full" viewBox="0 0 200 120">
                {/* Cracks */}
                <path d="M 40 60 Q 70 50 100 55 T 160 40" stroke="#475569" strokeWidth="2" fill="none" />
                <path d="M 100 55 Q 120 80 140 100" stroke="#475569" strokeWidth="2" fill="none" />
                <path d="M 80 70 Q 50 85 30 95" stroke="#475569" strokeWidth="2" fill="none" />
                {/* Pothole Crater */}
                <ellipse cx="100" cy="65" rx="45" ry="24" fill="#090d16" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                {/* Water/depth shadow */}
                <ellipse cx="98" cy="67" rx="34" ry="16" fill="#030712" />
              </svg>
              {/* YOLO Tag */}
              <div className="absolute -top-3 left-6 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-mono font-bold rounded shadow">
                POTHOLE: HIGH (0.82m²)
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 left-2 bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-bold px-2 py-1 rounded backdrop-blur">
            BEFORE: 12 SEP (HEALTH: {beforeScore})
          </div>
        </div>

        {/* AFTER ROAD VIEW (Clipped overlay) */}
        <div
          className="absolute inset-0 bg-[#1e2330] flex items-center justify-center overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          {/* Fresh Bitumen Texture */}
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:6px_6px]" />

          {/* Repaired Fresh Asphalt Patch */}
          <div className="relative flex flex-col items-center">
            <div className="w-48 h-28 border-2 border-green-500/60 bg-[#141822] rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.15)] flex items-center justify-center relative">
              {/* Fresh yellow road line marking */}
              <div className="w-full h-2 bg-yellow-400/90 shadow-[0_0_8px_rgba(250,204,21,0.5)] rounded" />
              <div className="absolute -top-3 right-4 px-2 py-0.5 bg-green-600 text-white text-[9px] font-mono font-bold rounded shadow flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> REPAIRED PATCH
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 bg-green-950/80 border border-green-500/40 text-green-300 text-[10px] font-bold px-2 py-1 rounded backdrop-blur">
            AFTER: 18 SEP (HEALTH: {afterScore})
          </div>
        </div>

        {/* Vertical Divider Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)]"
          style={{ left: `calc(${sliderPos}% - 2px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg pointer-events-none border-2 border-white">
            <div className="w-0.5 h-3 bg-gray-950 mx-[1px]" />
            <div className="w-0.5 h-3 bg-gray-950 mx-[1px]" />
          </div>
        </div>
      </div>

      {/* Health Score Jump & Metadata */}
      <div className="p-4 bg-gray-900/40 flex-1 flex flex-col justify-between">
        {/* Road Health Score Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400 font-medium">Road Health Recovery</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-red-400 font-bold">{beforeScore}/100</span>
              <ArrowRight className="w-3 h-3 text-gray-500" />
              <span className="text-green-400 font-bold text-sm">{afterScore}/100</span>
              <span className="text-green-400 text-[10px] bg-green-500/20 px-1.5 py-0.2 rounded font-semibold">
                +{afterScore - beforeScore} pts
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden relative border border-gray-700">
            <div
              className="absolute top-0 bottom-0 left-0 bg-red-500/60"
              style={{ width: `${beforeScore}%` }}
            />
            <motion.div
              initial={{ width: `${beforeScore}%` }}
              animate={{ width: `${afterScore}%` }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-teal-500 to-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
            />
          </div>
        </div>

        {/* Verification Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-gray-800">
          <div>
            <div className="text-gray-500 text-[10px]">Initial Sighting</div>
            <div className="text-gray-200 font-medium">{beforeDate}</div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px]">Verification Date</div>
            <div className="text-gray-200 font-medium">{afterDate}</div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px]">Turnaround Time</div>
            <div className="text-cyan-400 font-medium">6 Days</div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px]">Verified By</div>
            <div className="text-green-400 font-medium truncate">{verifiedBy}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
