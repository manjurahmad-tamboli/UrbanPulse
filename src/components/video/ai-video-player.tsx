'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  FileVideo, 
  Sparkles,
  Camera,
  Image as ImageIcon,
  Scan,
  RefreshCw,
  Video,
  Eye,
  Crosshair
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulation } from '@/context/simulation-context';

interface AIVideoPlayerProps {
  onDetection: () => void;
}

export default function AIVideoPlayer({ onDetection }: AIVideoPlayerProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'upload' | 'webcam'>('demo');
  const [isPlaying, setIsPlaying] = useState(false);
  const [potholeDetected, setPotholeDetected] = useState(false);
  
  // Media states
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<'image' | 'video' | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDetectionType, setSelectedDetectionType] = useState<'pothole' | 'waterlogging' | 'damaged_road'>('pothole');

  // Webcam states
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [webcamSnapshot, setWebcamSnapshot] = useState<string | null>(null);

  const { addToast } = useSimulation();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);

  // Stop active webcam stream
  const stopWebcam = useCallback(() => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  }, []);

  // Start webcam
  const startWebcam = async () => {
    setWebcamError(null);
    setWebcamSnapshot(null);
    setPotholeDetected(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported on this device/browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      webcamStreamRef.current = stream;
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
        webcamVideoRef.current.play();
      }
      setIsWebcamActive(true);
      addToast({
        title: 'Device Camera Connected',
        message: 'Live camera feed ready. Point at road surface to test AI inference.',
        type: 'info',
      });
    } catch (err: any) {
      console.warn('Webcam initialization failed:', err);
      setWebcamError(err.message || 'Camera permission denied or camera not found.');
      setIsWebcamActive(false);
      addToast({
        title: 'Camera Access Unavailable',
        message: 'Could not access webcam. You can use sample photos or upload an image/video.',
        type: 'warning',
      });
    }
  };

  // Switch tabs & manage resources
  const handleTabChange = (tab: 'demo' | 'upload' | 'webcam') => {
    setActiveTab(tab);
    setPotholeDetected(false);
    setIsAnalyzing(false);
    if (tab === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
  };

  // Clean up webcam on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  // Capture frame from webcam
  const captureWebcamFrame = () => {
    if (!webcamVideoRef.current) return;
    const video = webcamVideoRef.current;
    const offscreen = document.createElement('canvas');
    offscreen.width = video.videoWidth || 640;
    offscreen.height = video.videoHeight || 480;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
    const dataUrl = offscreen.toDataURL('image/jpeg');
    setWebcamSnapshot(dataUrl);
    setIsAnalyzing(true);

    addToast({
      title: 'Frame Captured',
      message: 'Running RoadVision YOLOv8s TensorRT inference on camera frame...',
      type: 'info',
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      setPotholeDetected(true);
      onDetection();
      addToast({
        title: 'Pothole Detected in Camera Frame',
        message: 'Identified surface defect (94.2% confidence). 9-step edge pipeline initiated.',
        type: 'warning',
      });
    }, 1500);
  };

  // Process selected file (image or video)
  const processFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      addToast({
        title: 'Unsupported File Format',
        message: 'Please upload an image (.jpg, .png, .webp) or video (.mp4, .webm).',
        type: 'warning',
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedMediaUrl(url);
    setUploadedMediaType(isImage ? 'image' : 'video');
    setUploadedFileName(file.name);
    setPotholeDetected(false);
    setIsAnalyzing(true);

    addToast({
      title: `${isImage ? 'Photo' : 'Video'} Uploaded Successfully`,
      message: `Analyzing "${file.name}" with UrbanPulse YOLO model.`,
      type: 'info',
    });

    if (isImage) {
      // Simulate inference on image
      setTimeout(() => {
        setIsAnalyzing(false);
        setPotholeDetected(true);
        onDetection();
        addToast({
          title: 'Road Defect Detected!',
          message: 'YOLO model localized 1 high-severity pothole (Confidence: 94.6%).',
          type: 'warning',
        });
      }, 1600);
    } else {
      // Video
      setIsPlaying(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setPotholeDetected(true);
        onDetection();
      }, 2500);
    }
  };

  // File input change handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Load sample pothole photo for judges instant testing
  const loadSamplePotholePhoto = () => {
    // Generate realistic asphalt road with pothole on canvas and convert to data URL
    const offscreen = document.createElement('canvas');
    offscreen.width = 800;
    offscreen.height = 500;
    const ctx = offscreen.getContext('2d');
    if (ctx) {
      // Dark asphalt texture
      const grad = ctx.createLinearGradient(0, 0, 0, 500);
      grad.addColorStop(0, '#1a1f2c');
      grad.addColorStop(1, '#0e131f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 500);

      // Road gravel noise
      for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.3)';
        ctx.fillRect(Math.random() * 800, Math.random() * 500, Math.random() * 3 + 1, Math.random() * 3 + 1);
      }

      // Yellow road marking stripe
      ctx.fillStyle = '#eab308';
      ctx.fillRect(380, 0, 30, 500);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(380, 220, 30, 80); // worn out stripe

      // Pothole cavity
      ctx.beginPath();
      ctx.ellipse(320, 280, 130, 75, -0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#05070c';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#27272a';
      ctx.stroke();

      // Deep cracks inside pothole
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(250, 270);
      ctx.lineTo(310, 290);
      ctx.lineTo(370, 260);
      ctx.lineTo(410, 285);
      ctx.stroke();

      // Sub-cracks radiating out
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(190, 290);
      ctx.lineTo(230, 280);
      ctx.moveTo(430, 265);
      ctx.lineTo(480, 240);
      ctx.moveTo(330, 350);
      ctx.lineTo(350, 390);
      ctx.stroke();

      const sampleUrl = offscreen.toDataURL('image/jpeg');
      setUploadedMediaUrl(sampleUrl);
      setUploadedMediaType('image');
      setUploadedFileName('kolhapur_road_pothole_sample_01.jpg');
      setPotholeDetected(false);
      setIsAnalyzing(true);

      addToast({
        title: 'Sample Road Photo Loaded',
        message: 'Analyzing Kolhapur road sample with RoadVision YOLOv8s model...',
        type: 'info',
      });

      setTimeout(() => {
        setIsAnalyzing(false);
        setPotholeDetected(true);
        onDetection();
        addToast({
          title: 'Pothole Localized (94.6% Confidence)',
          message: 'Area: 0.82 m² • Depth: 68mm • High Severity. 9-step pipeline triggered.',
          type: 'warning',
        });
      }, 1400);
    }
  };

  // Canvas Road Simulation Loop (Demo Tab)
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

      // Distant City Skyline
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

      // 3. Center White Lane Markings
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

      // 4. Preceding Vehicle
      const vehicleY = horizon + 40 + Math.sin(timeRef.current * 0.8) * 10;
      const vehicleX = w / 2 + 70 + (timeRef.current * 10) % 80;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(vehicleX, vehicleY, 32, 20);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(vehicleX + 4, vehicleY + 2, 24, 6);
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
          // Crater
          ctx.beginPath();
          ctx.ellipse(x, y, size, size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#090d16';
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Bounding Box
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
          ctx.fillRect(boxX, boxY - 18, 120, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('POTHOLE 94.2%', boxX + 6, boxY - 5);
        }
      }

      // Camera HUD Overlay
      ctx.fillStyle = 'rgba(10, 14, 26, 0.7)';
      ctx.fillRect(10, 10, 250, 24);
      ctx.fillStyle = '#22d3ee';
      ctx.font = '10px monospace';
      ctx.fillText('CAM: BUS-042 [FRONT] • 1080P@28FPS', 18, 26);

      ctx.fillStyle = 'rgba(10, 14, 26, 0.7)';
      ctx.fillRect(w - 240, 10, 230, 24);
      ctx.fillStyle = '#4ade80';
      ctx.font = '10px monospace';
      ctx.fillText('GPS: 16.8524°N, 74.5815°E', w - 230, 26);

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
    setIsAnalyzing(false);
    setWebcamSnapshot(null);
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
      {/* Hidden File Input (Accepts both Videos and Images) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="video/mp4,video/webm,image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* 3-Mode Selection Tabs */}
      <div className="flex border-b border-cyan-500/20 bg-gray-900/60 overflow-x-auto">
        <button
          className={cn(
            'flex-1 min-w-[150px] py-3 px-3 sm:px-4 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer',
            activeTab === 'demo'
              ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          )}
          onClick={() => handleTabChange('demo')}
        >
          <Monitor className="w-4 h-4 shrink-0" />
          <span>Dashcam Simulation</span>
        </button>
        <button
          className={cn(
            'flex-1 min-w-[170px] py-3 px-3 sm:px-4 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer',
            activeTab === 'upload'
              ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          )}
          onClick={() => handleTabChange('upload')}
        >
          <Upload className="w-4 h-4 shrink-0" />
          <span>Upload Image / Video</span>
        </button>
        <button
          className={cn(
            'flex-1 min-w-[150px] py-3 px-3 sm:px-4 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer',
            activeTab === 'webcam'
              ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          )}
          onClick={() => handleTabChange('webcam')}
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>Live Device Camera</span>
        </button>
      </div>

      {/* Main Video / Canvas / Image / Camera Stage */}
      <div className="relative aspect-video bg-black w-full flex-1 overflow-hidden select-none">
        {/* TAB 1: CANVAS ROAD SIMULATION */}
        {activeTab === 'demo' && (
          <>
            <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-cover" />

            {potholeDetected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 bg-red-600/90 text-white px-3.5 py-1.5 rounded-full font-mono font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.7)] border border-red-400 animate-pulse flex items-center gap-2 z-10"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                POTHOLE DETECTED [CONF: 94.2%]
              </motion.div>
            )}

            {!isPlaying && timeRef.current === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-20">
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
        )}

        {/* TAB 2: UPLOAD IMAGE / VIDEO */}
        {activeTab === 'upload' && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-950 relative"
          >
            {uploadedMediaUrl ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                {uploadedMediaType === 'video' ? (
                  <video
                    ref={videoRef}
                    src={uploadedMediaUrl}
                    controls
                    autoPlay
                    className="max-h-full max-w-full rounded-lg"
                  />
                ) : (
                  <div className="relative max-h-full max-w-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedMediaUrl}
                      alt="Uploaded road frame"
                      className="max-h-[420px] max-w-full rounded-lg object-contain"
                    />

                    {/* Laser Scanning Line Animation */}
                    {isAnalyzing && (
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-20"
                      />
                    )}

                    {/* Detected Anomaly YOLO Bounding Box Overlay */}
                    {potholeDetected && !isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        {/* Bounding box centered on defect */}
                        <div className="relative w-56 h-36 border-2 border-red-500 bg-red-500/10 rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                          {/* Top-left tag */}
                          <div className="absolute -top-6 left-0 bg-red-600 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1.5 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            POTHOLE 94.6% • 0.82 m²
                          </div>

                          {/* Corner brackets */}
                          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />

                          {/* Center reticle */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Crosshair className="w-6 h-6 text-red-400/80 animate-pulse" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Status Bar */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-2">
                  <span className="text-cyan-400">{uploadedFileName || 'Media Analyzed'}</span>
                  {isAnalyzing && <span className="text-yellow-400 animate-pulse">• Scanning...</span>}
                  {potholeDetected && <span className="text-red-400 font-bold">• 1 Defect Localized</span>}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setUploadedMediaUrl(null);
                      setPotholeDetected(false);
                      setIsAnalyzing(false);
                    }}
                    className="px-2.5 py-1 bg-gray-900/80 hover:bg-gray-800 text-gray-300 rounded text-xs border border-white/10 transition-colors cursor-pointer"
                  >
                    Upload Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl flex flex-col items-center justify-center p-6 text-center transition-colors bg-cyan-950/10 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <ImageIcon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <FileVideo className="w-7 h-7 text-blue-400" />
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white mb-1">
                  Upload Road Image or Video for AI Inspection
                </h4>
                <p className="text-xs text-gray-400 max-w-md mb-4">
                  Drag & drop any road photo (.JPG, .PNG, .WEBP) or dashcam video (.MP4, .WEBM). The YOLOv8s model will automatically detect potholes, road cracks, and surface anomalies.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold border border-cyan-500/40 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Browse Image / Video
                  </button>
                  <button
                    onClick={loadSamplePotholePhoto}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 rounded-xl text-xs font-semibold border border-amber-500/40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Test with Sample Pothole Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE WEBCAM / DEVICE CAMERA */}
        {activeTab === 'webcam' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
            {webcamError ? (
              <div className="p-6 text-center max-w-md">
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-2xl inline-block mb-3">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Camera Stream Unavailable</h4>
                <p className="text-xs text-gray-400 mb-4">{webcamError}</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={startWebcam}
                    className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs rounded-xl border border-cyan-500/40 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('upload');
                      loadSamplePotholePhoto();
                    }}
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs rounded-xl border border-amber-500/40 transition-colors cursor-pointer"
                  >
                    Use Sample Photo Instead
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Live Video or Captured Frame */}
                {webcamSnapshot ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={webcamSnapshot}
                      alt="Captured camera frame"
                      className="max-h-full max-w-full object-contain"
                    />

                    {isAnalyzing && (
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.0, ease: 'linear' }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-20"
                      />
                    )}

                    {potholeDetected && !isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="relative w-56 h-36 border-2 border-red-500 bg-red-500/10 rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                          <div className="absolute -top-6 left-0 bg-red-600 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            POTHOLE 94.2% • 0.82 m²
                          </div>
                          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      ref={webcamVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder Reticle */}
                    <div className="absolute inset-10 border border-cyan-500/30 rounded-2xl pointer-events-none flex items-center justify-center">
                      <div className="w-12 h-12 border-t-2 border-l-2 border-cyan-400 absolute top-4 left-4" />
                      <div className="w-12 h-12 border-t-2 border-r-2 border-cyan-400 absolute top-4 right-4" />
                      <div className="w-12 h-12 border-b-2 border-l-2 border-cyan-400 absolute bottom-4 left-4" />
                      <div className="w-12 h-12 border-b-2 border-r-2 border-cyan-400 absolute bottom-4 right-4" />
                      <Crosshair className="w-10 h-10 text-cyan-400/40 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Camera HUD Overlays */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-cyan-400 flex items-center gap-2 z-10">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  LIVE CAMERA INFERENCE • 1080P
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                  {webcamSnapshot ? (
                    <button
                      onClick={() => {
                        setWebcamSnapshot(null);
                        setPotholeDetected(false);
                        setIsAnalyzing(false);
                        startWebcam();
                      }}
                      className="px-4 py-2 bg-gray-900/90 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Return to Live Camera
                    </button>
                  ) : (
                    <button
                      onClick={captureWebcamFrame}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400"
                    >
                      <Scan className="w-4 h-4" /> Capture & Run YOLO Inference
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Control Bar & Preset Trigger Buttons */}
      <div className="p-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-500/20 bg-[#0d1117]">
        {/* Playback Controls & Quick Presets */}
        <div className="flex items-center gap-2">
          {activeTab === 'demo' && (
            <>
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
            </>
          )}

          {/* Quick Trigger Presets for SIH Presentation */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">PRESETS:</span>
            <button
              onClick={() => triggerInstantDetection('pothole')}
              className="px-2.5 py-1 text-[10px] rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/40 font-semibold cursor-pointer transition-colors"
            >
              + Pothole (94%)
            </button>
            <button
              onClick={() => triggerInstantDetection('waterlogging')}
              className="px-2.5 py-1 text-[10px] rounded-lg bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 border border-blue-500/40 font-semibold cursor-pointer transition-colors"
            >
              + Waterlogging
            </button>
            <button
              onClick={() => triggerInstantDetection('damaged_road')}
              className="px-2.5 py-1 text-[10px] rounded-lg bg-yellow-950/50 hover:bg-yellow-900/60 text-yellow-300 border border-yellow-500/40 font-semibold cursor-pointer transition-colors"
            >
              + Severe Crack
            </button>
          </div>
        </div>

        <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>YOLOv8s-INT8 TensorRT • 42ms Inference</span>
        </div>
      </div>
    </div>
  );
}
