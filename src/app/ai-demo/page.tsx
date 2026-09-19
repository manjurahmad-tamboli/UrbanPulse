'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, Cpu, Camera, Database, Shield, Sparkles, Play, CheckCircle } from 'lucide-react';
import AIVideoPlayer from '@/components/video/ai-video-player';
import PipelineSteps from '@/components/video/pipeline-steps';
import EvidenceCard from '@/components/video/evidence-card';
import RepairVerification from '@/components/video/repair-verification';

export default function AIDemoPage() {
  const [pipelineActive, setPipelineActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [showEvidence, setShowEvidence] = useState(true); // default visible for immediate judging evaluation
  const [frameCounter, setFrameCounter] = useState(1267);

  // Simulate frame counter
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameCounter(prev => prev + 1);
    }, 1000 / 28);
    return () => clearInterval(interval);
  }, []);

  const handleDetection = () => {
    setPipelineActive(true);
    setCurrentStep(0);
    
    // Animate through pipeline steps
    let step = 0;
    const maxSteps = 9;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= maxSteps) {
        clearInterval(interval);
        setShowEvidence(true);
      }
    }, 700);
  };

  const handleTriggerInstant = () => {
    handleDetection();
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-20 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 uppercase">
              SIH 2026 Core Showcase
            </span>
            <span className="text-xs text-gray-500 font-mono">Problem Statement 26124</span>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            Real-time Edge AI Detection & Verification Engine
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl mt-1">
            Watch UrbanPulse's edge-AI vision system detect, classify, geotag, and verify road infrastructure anomalies in real-time from moving public bus cameras.
          </p>
        </div>

        {/* Quick Demo Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerInstant}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" /> Trigger Live 9-Step Pipeline
          </button>
        </div>
      </header>

      {/* Section 1 & 2: Video Player and Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Video + Stats (65%) */}
        <div className="lg:col-span-2 space-y-6">
          <AIVideoPlayer onDetection={handleDetection} />
          
          {/* Live AI Processing Panel */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Current Frame</div>
              <div className="font-mono text-cyan-400 font-bold text-base">#{frameCounter}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">FPS / Latency</div>
              <div className="font-mono text-gray-300 text-sm">28 fps / <span className="text-green-400 font-bold">42ms</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Edge AI Model</div>
              <div className="text-xs text-gray-200 truncate font-mono">RoadVision-YOLOv8s (INT8)</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Objects Detected</div>
              <div className="text-sm text-gray-300 font-semibold">
                {pipelineActive ? (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    1 Pothole (94%)
                  </span>
                ) : (
                  <span className="text-gray-400">Scanning Road...</span>
                )}
              </div>
            </div>
          </div>

          {/* Telemetry Status Indicators */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <Wifi className="w-3.5 h-3.5 text-gray-400" /> GPS Locked (16.8524, 74.5815)
            </div>
            <div className="flex items-center gap-1.5 bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <Activity className="w-3.5 h-3.5 text-gray-400" /> 5G Connected (-82 dBm)
            </div>
            <div className="flex items-center gap-1.5 bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <Cpu className="w-3.5 h-3.5 text-gray-400" /> Jetson Orin Nano (61°C)
            </div>
            <div className="flex items-center gap-1.5 bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
              <Database className="w-3.5 h-3.5 text-cyan-400" /> Upload: Metadata Only (~15KB)
            </div>
            <div className="flex items-center gap-1.5 bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
              <Shield className="w-3.5 h-3.5 text-green-400" /> Privacy Masking Active
            </div>
          </div>
        </div>

        {/* Right Side: Pipeline Steps (35%) */}
        <div className="lg:col-span-1 h-full min-h-[500px]">
          <PipelineSteps active={pipelineActive} currentStep={currentStep} />
        </div>
      </div>

      {/* Section 3: Evidence and Verification (Centerpiece Showcase) */}
      <div className="space-y-4 pt-4 border-t border-cyan-500/20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-400" />
              Detection Evidence & Repair Verification Flow
            </h2>
            <p className="text-xs text-gray-400">
              Automated issue logging, duplicate clustering, municipal dispatch, and subsequent bus re-scan verification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EvidenceCard />
          <RepairVerification />
        </div>
      </div>
    </div>
  );
}
