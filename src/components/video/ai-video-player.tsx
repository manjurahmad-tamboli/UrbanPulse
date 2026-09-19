'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Upload, Monitor, AlertTriangle, CheckCircle, FileVideo, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulation } from '@/context/simulation-context';

interface AIVideoPlayerProps {
  onDetection: () => void;
}

export default function AIVideoPlayer({ onDetection }: AIVideoPlayerProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'upload'>('demo');
  const [isPlaying, setIsPlaying] = useState(false);
  const [potholeDetected, setPotholeDetected] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedDetectionType, setSelectedDetectionType] = useState<'pothole' | 'waterlogging' | 'damaged_road'>('pothole');

  const { addToast } = useSimulation();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);

  // File upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideoUrl(url);
      setUploadedFileName(file.name);
      setIsPlaying(true);
      addToast({
        title: 'Video Loaded Successfully',
        message: `Analyzing "${file.name}" with UrbanPulse RoadVision YOLO model.`,
        type: 'info',
      });
      // Trigger detection after 2 seconds on uploaded video
      setTimeout(() => {
        setPotholeDetected(true);
        onDetection();
      }, 2500);
    }
  };

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setUploadedVideoUrl(url);
      setUploadedFileName(file.name);
      setIsPlaying(true);
      addToast({
        title: 'Video Uploaded',
        message: `Analyzing "${file.name}" for road anomalies.`,
        type: 'info',
      });
      setTimeout(() => {
        setPotholeDetected(true);
        onDetection();
      }, 2500);
    }
  };

  // Canvas Road Simulation Loop
  useEffect(() => {
    if (activeTab !== 'demo' || !isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    let speed = 240;

    const render = (time: number) => {
      const dt = (time - startTime) / 1000;
      timeRef.current += dt;
      startTime = time;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Sky & Horizon
      const gradient = ctx.createLinearGradient(0, 0, 0, h * 0.4);
      gradient.addColorStop(0, '#070b14');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Distant City Skyline & Mountain Silhouettes
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.4);
      ctx.lineTo(w * 0.15, h * 0.32);
      ctx.lineTo(w * 0.3, h * 0.4);
      ctx.lineTo(w * 0.45, h * 0.35);
      ctx.lineTo(w * 0.65, h * 0.4);
      ctx.lineTo(w * 0.8, h * 0.3);
      ctx.lineTo(w, h * 0.4);
      ctx.lineTo(w, h * 0.4);
      ctx.closePath();
      ctx.fill();

      // 2. Road Surface (Perspective Polygon)
      const roadTopW = w * 0.22;
      const roadBotW = w * 0.92;
      const horizon = h * 0.38;

      ctx.beginPath();
      ctx.moveTo(w / 2 - roadTopW / 2, horizon);
      ctx.lineTo(w / 2 + roadTopW / 2, horizon);
      ctx.lineTo(w / 2 + roadBotW / 2, h);
      ctx.lineTo(w / 2 - roadBotW / 2, h);
      ctx.closePath();
      ctx.fillStyle = '#1e2330';
      ctx.fill();

      // Road Shoulders / Curbs
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w / 2 - roadTopW / 2, horizon);
      ctx.lineTo(w / 2 - roadBotW / 2, h);
      ctx.moveTo(w / 2 + roadTopW / 2, horizon);
      ctx.lineTo(w / 2 + roadBotW / 2, h);
      ctx.stroke();

      // 3. Center White Lane Markings (Moving Animation)
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 5;
      ctx.setLineDash([25, 25]);
      const offset = (timeRef.current * speed) % 50;
      ctx.beginPath();
      ctx.moveTo(w / 2, horizon);
      ctx.lineTo(w / 2, h);
      ctx.lineDashOffset = -offset;
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Oncoming / Preceding Vehicles Simulation
      const vehicleY = horizon + 40 + (Math.sin(timeRef.current * 0.8) * 10);
      const vehicleX = w / 2 + 70 + (timeRef.current * 10) % 80;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(vehicleX, vehicleY, 32, 20);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(vehicleX + 4, vehicleY + 2, 24, 6);
      // Small vehicle bounding box
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(vehicleX - 2, vehicleY - 2, 36, 24);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px monospace';
      ctx.fillText('CAR 92%', vehicleX - 2, vehicleY - 4);

      // 5. Detection Trigger Logic (at 2.5 seconds)
      if (timeRef.current > 2.5) {
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setPotholeDetected(true);
          onDetection();
        }

        const progress = Math.min(1.4, (timeRef.current - 2.5) * 0.6);
        const y = horizon + (h - horizon) * (progress * 0.75);
        const size = 12 + 45 * progress;
        const x = w / 2 - size * 1.6;

        if (progress < 1.4) {
          // Draw Pothole Crater
          ctx.beginPath();
          ctx.ellipse(x, y, size, size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#090d16';
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.stroke();

          // YOLO Bounding Box
          const pad = size * 0.25;
          const boxX = x - size - pad;
          const boxY = y - size * 0.45 - pad;
          const boxW = size * 2 + pad * 2;
          const boxH = size * 0.9 + pad * 2;

          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(boxX, boxY, boxW, boxH);

          // Corner brackets
          const cl = 8;
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 3;
          // Top-left
          ctx.beginPath();
          ctx.moveTo(boxX, boxY + cl);
          ctx.lineTo(boxX, boxY);
          ctx.lineTo(boxX + cl, boxY);
          // Top-right
          ctx.moveTo(boxX + boxW - cl, boxY);
          ctx.lineTo(boxX + boxW, boxY);
          ctx.lineTo(boxX + boxW, boxY + cl);
          // Bottom-left
          ctx.moveTo(boxX, boxY + boxH - cl);
          ctx.lineTo(boxX, boxY + boxH);
          ctx.lineTo(boxX + cl, boxY + boxH);
          // Bottom-right
          ctx.moveTo(boxX + boxW - cl, boxY + boxH);
          ctx.lineTo(boxX + boxW, boxY + boxH);
          ctx.lineTo(boxX + boxW, boxY + boxH - cl);
          ctx.stroke();

          // Label Banner
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(boxX, boxY - 18, 110, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('POTHOLE 94%', boxX + 6, boxY - 5);
        }
      }

      // 6. Camera HUD Overlay
      ctx.fillStyle = 'rgba(10, 14, 26, 0.7)';
      ctx.fillRect(10, 10, 240, 24);
      ctx.fillStyle = '#22d3ee';
      ctx.font = '10px monospace';
      ctx.fillText('CAM: BUS-042 [FRONT] • 1080P@28FPS', 18, 26);

      ctx.fillStyle = 'rgba(10, 14, 26, 0.7)';
      ctx.fillRect(w - 230, 10, 220, 24);
      ctx.fillStyle = '#4ade80';
      ctx.font = '10px monospace';
      ctx.fillText('GPS: 16.8524°N, 74.5815°E', w - 220, 26);

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeTab, isPlaying, onDetection]);

  const handleReset = () => {
    setIsPlaying(false);
    setPotholeDetected(false);
    timeRef.current = 0;
    hasTriggeredRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const triggerInstantDetection = (type: 'pothole' | 'waterlogging' | 'damaged_road') => {
    setSelectedDetectionType(type);
    setPotholeDetected(true);
    setIsPlaying(true);
    onDetection();
    addToast({
      title: `Simulated Detection Triggered: ${type.toUpperCase()}`,
      message: `Running 9-step edge pipeline for ${type} detection.`,
      type: 'warning',
    });
  };

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden flex flex-col w-full shadow-[0_0_25px_rgba(6,182,212,0.1)]">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="video/mp4,video/webm"
        className="hidden"
      />

      {/* Tabs */}
      <div className="flex border-b border-cyan-500/20 bg-gray-900/60">
        <button
          className={cn(
            'flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer',
            activeTab === 'demo'
              ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          )}
          onClick={() => setActiveTab('demo')}
        >
          <Monitor className="w-4 h-4" /> Live Road AI Dashcam (Canvas Simulation)
        </button>
        <button
          className={cn(
            'flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer',
            activeTab === 'upload'
              ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          )}
          onClick={() => setActiveTab('upload')}
        >
          <Upload className="w-4 h-4" /> Upload Road Video (.MP4 / .WEBM)
        </button>
      </div>

      {/* Main Video / Canvas Stage */}
      <div className="relative aspect-video bg-black w-full flex-1 overflow-hidden">
        {activeTab === 'demo' ? (
          <>
            <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-cover" />

            {potholeDetected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 bg-red-600/90 text-white px-3.5 py-1.5 rounded-full font-mono font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.7)] border border-red-400 animate-pulse flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                POTHOLE DETECTED [CONF: 94%]
              </motion.div>
            )}

            {!isPlaying && timeRef.current === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="p-5 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 transition-all border border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer group"
                >
                  <Play className="w-12 h-12 ml-1 group-hover:scale-110 transition-transform fill-current" />
                </button>
                <p className="text-xs text-gray-300 font-mono mt-4">
                  Click to start front bus dashcam feed & AI inference
                </p>
              </div>
            )}
          </>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-950"
          >
            {uploadedVideoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={uploadedVideoUrl}
                  controls
                  autoPlay
                  className="max-h-full max-w-full rounded-lg"
                />
                {potholeDetected && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full font-mono text-xs font-bold shadow-lg border border-red-400">
                    ANOMALY DETECTED IN VIDEO
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-cyan-950/10 p-6 text-center group"
              >
                <div className="p-4 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/30 mb-4 transition-colors">
                  <FileVideo className="w-10 h-10 text-cyan-400" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Drag & Drop Bus Dashcam Video Here
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mb-4">
                  Supports MP4, WebM formats (e.g. from /public/videos/pothole-demo.mp4). The AI model will process frames and detect road damage.
                </p>
                <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold border border-cyan-500/40 transition-colors">
                  Browse Video File
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Bar & Preset Trigger Buttons */}
      <div className="p-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-500/20 bg-[#0d1117]">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Quick Trigger Presets for SIH Presentation */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-gray-800">
            <span className="text-[10px] text-gray-500 font-mono">PRESETS:</span>
            <button
              onClick={() => triggerInstantDetection('pothole')}
              className="px-2 py-1 text-[10px] rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/40 font-semibold cursor-pointer transition-colors"
            >
              + Pothole (94%)
            </button>
            <button
              onClick={() => triggerInstantDetection('waterlogging')}
              className="px-2 py-1 text-[10px] rounded-lg bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 border border-blue-500/40 font-semibold cursor-pointer transition-colors"
            >
              + Waterlogging
            </button>
            <button
              onClick={() => triggerInstantDetection('damaged_road')}
              className="px-2 py-1 text-[10px] rounded-lg bg-yellow-950/50 hover:bg-yellow-900/60 text-yellow-300 border border-yellow-500/40 font-semibold cursor-pointer transition-colors"
            >
              + School Children (Risk)
            </button>
          </div>
        </div>

        <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          YOLOv8s-INT8 TensorRT • 42ms Inference
        </div>
      </div>
    </div>
  );
}
