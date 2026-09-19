'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bus, Map as MapIcon, AlertTriangle, ShieldAlert, Zap, 
  Activity, ActivitySquare, Server, Camera, Eye, 
  MapPin, CheckCircle, Search, Settings, Filter, ArrowRight,
  ShieldCheck, Wrench, Sparkles, Radio
} from 'lucide-react';
import { dashboardStats } from '@/data/mock-data';
import { useSimulation } from '@/context/simulation-context';

const CityMap = dynamic(() => import('@/components/maps/city-map'), { ssr: false });

const AnimatedCounter = ({ value, duration = 2 }: { value: number | string, duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const isNumber = typeof value === 'number';
    const targetValue = isNumber ? value : parseFloat(value as string);
    
    if (isNaN(targetValue)) {
      setCount(targetValue);
      return;
    }

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setCount(Math.floor(progress * targetValue));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(targetValue);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  const isNumber = typeof value === 'number';
  const suffix = isNumber ? '' : String(value).replace(/[0-9.]/g, '');
  
  return <span>{count}{suffix}</span>;
};

export default function Home() {
  const router = useRouter();
  const { buses, issues: urbanIssues, isSimulating } = useSimulation();
  const [filter, setFilter] = useState('all');

  const filteredIssues = filter === 'all' 
    ? urbanIssues 
    : urbanIssues.filter(issue => issue.severity === filter);

  const activeBusesCount = buses.filter(b => b.isActive).length;
  const criticalIssuesCount = urbanIssues.filter(i => i.severity === 'critical').length;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-x-hidden pt-16">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28 flex flex-col items-center text-center max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Floating Badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-12 -left-32 md:-left-48 bg-[#111827]/90 border border-red-500/30 text-red-400 text-xs py-1 px-3 rounded-full flex items-center gap-2 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Pothole Detected (94%)
          </motion.div>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute top-20 -right-32 md:-right-48 bg-[#111827]/90 border border-orange-500/30 text-orange-400 text-xs py-1 px-3 rounded-full flex items-center gap-2 backdrop-blur-md hidden sm:flex"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Traffic Density: High
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 leading-tight pb-2">
            Turning Every Public Bus Into a<br />Mobile Urban Intelligence Unit
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-3xl mb-10"
        >
          UrbanPulse uses Edge AI and existing public transport cameras to continuously identify road damage, congestion, infrastructure issues and urban risks while buses travel through the city.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-cyan-400/50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Activity className="w-5 h-5" />
            Launch Command Center
          </button>
          <Link 
            href="/ai-demo" 
            className="bg-[#111827]/80 hover:bg-[#1f2937]/90 text-white px-8 py-3 rounded-xl font-medium transition-all border border-gray-600 flex items-center justify-center gap-2 backdrop-blur-xl hover:border-cyan-400/40"
          >
            <Eye className="w-5 h-5 text-cyan-400" />
            Watch AI Demo
          </Link>
        </motion.div>

        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 4.5, delay: 1 }}
          className="absolute bottom-6 -left-20 bg-[#111827]/90 border border-green-500/30 text-green-400 text-xs py-1 px-3 rounded-full items-center gap-2 backdrop-blur-md hidden lg:flex"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Road Health: 72%
        </motion.div>
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
          className="absolute bottom-28 -right-10 bg-[#111827]/90 border border-blue-500/30 text-blue-400 text-xs py-1 px-3 rounded-full items-center gap-2 backdrop-blur-md hidden lg:flex"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          GPS Synced: 12 Sats
        </motion.div>
      </section>

      {/* Main Dashboard Area */}
      <section id="dashboard" className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <ActivitySquare className="text-cyan-400" />
              UrbanPulse City Intelligence Command Center
            </h2>
            <p className="text-gray-400">Turning Public Transport into Mobile Urban Sensing Infrastructure</p>
          </div>
          {isSimulating && (
            <div className="flex items-center gap-2 bg-green-950/60 border border-green-500/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-green-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live Fleet Telemetry Active
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {[
            { label: 'Active Buses', value: activeBusesCount * 4, icon: Bus, color: 'text-cyan-400' },
            { label: 'Routes Monitored', value: dashboardStats?.routesMonitored || 12, icon: MapIcon, color: 'text-blue-400' },
            { label: 'Issues Detected Today', value: urbanIssues.length * 11 + 5, icon: AlertTriangle, color: 'text-yellow-400' },
            { label: 'Critical Issues', value: criticalIssuesCount, icon: ShieldAlert, color: 'text-red-400' },
            { label: 'Road Segments Scanned', value: dashboardStats?.roadSegmentsScanned || 428, icon: Activity, color: 'text-teal-400' },
            { label: 'AI Processing', value: 'Online', icon: Zap, color: 'text-green-400' },
            { label: 'Avg AI Confidence', value: `${dashboardStats?.aiConfidence || 91.7}%`, icon: CheckCircle, color: 'text-cyan-300' },
            { label: 'Data Uploaded', value: `${dashboardStats?.dataUploadedToday || 1.8} GB`, icon: Server, color: 'text-blue-300' }
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              key={i}
              className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 flex flex-col shadow-[0_0_15px_rgba(0,212,255,0.05)] hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</span>
              </div>
              <div className={`text-xl lg:text-2xl font-bold ${stat.color}`}>
                <AnimatedCounter value={stat.value} duration={2} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map and Side Panel */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16">
          <div className="w-full lg:w-[60%] h-[500px] lg:h-[700px] rounded-2xl relative">
            <CityMap buses={buses} urbanIssues={filteredIssues} />
            {/* Overlay Map Severity Filters */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1.5">
              {['critical', 'high', 'medium', 'low', 'all'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize backdrop-blur-md transition-all cursor-pointer ${
                    filter === level 
                      ? 'bg-cyan-600/90 text-white border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                      : 'bg-[#111827]/80 text-gray-300 border border-gray-700 hover:bg-[#1f2937]/90'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 flex-grow flex flex-col shadow-[0_0_15px_rgba(0,212,255,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="text-yellow-400 w-4 h-4" />
                  Recent Detected Urban Issues
                </h3>
                <span className="text-xs bg-cyan-900/50 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-700/50 font-mono">
                  Live Stream
                </span>
              </div>
              
              <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar h-[350px]">
                <AnimatePresence>
                  {filteredIssues.slice(0, 10).map((issue, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.05 }}
                      key={issue.id}
                      onClick={() => router.push(`/issues/${issue.id}`)}
                      className="bg-gray-800/50 border border-gray-700 hover:border-cyan-500/40 rounded-xl p-3 flex gap-3 hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className={`w-2 h-full min-h-[40px] rounded-full flex-shrink-0 ${
                        issue.severity === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                        issue.severity === 'high' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' :
                        issue.severity === 'medium' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-sm capitalize text-gray-200 truncate">{issue.title || issue.type.replace('_', ' ')}</h4>
                          <span className="text-[11px] text-gray-400 font-mono">{new Date(issue.lastDetected).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1 font-mono text-cyan-300">
                            <Bus className="w-3 h-3 text-cyan-400" /> {issue.timeline[0]?.busId || 'BUS-042'}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Zap className="w-3 h-3 text-yellow-400" /> {(issue.confidence * 100).toFixed(0)}%
                          </span>
                          <span className="text-gray-500 truncate">{issue.address.split(',')[0]}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredIssues.length === 0 && (
                  <div className="text-center text-gray-500 py-8 text-sm">No issues found for this filter.</div>
                )}
              </div>
            </div>

            {/* Active Bus Fleet Status */}
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bus className="text-cyan-400 w-4 h-4" />
                  Active Bus Fleet Telemetry
                </h3>
                <Link href="/fleet" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {buses.slice(0, 4).map(bus => (
                  <Link
                    key={bus.id}
                    href="/live-monitor"
                    className="bg-gray-800/40 hover:bg-gray-800/70 rounded-xl p-3 border border-gray-700/50 flex flex-col transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-xs text-cyan-300">{bus.id}</span>
                      <span className={`w-2 h-2 rounded-full ${bus.isActive ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-yellow-500'}`}></span>
                    </div>
                    <span className="text-[11px] text-gray-400">Route {bus.routeId} • {bus.speed} km/h</span>
                    <span className="text-[10px] text-gray-500 font-mono mt-1">{bus.detectionsToday} detections today</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow Visual (Section 12 of spec) */}
        <div className="bg-[#111827]/60 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 mb-12 shadow-[0_0_25px_rgba(6,182,212,0.05)]">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-1">
              Autonomous Edge-to-Municipal Verification Lifecycle
            </h3>
            <p className="text-xs text-gray-400">
              Complete end-to-end flow from bus camera detection to municipal repair and automated re-scan verification
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 lg:gap-4 text-sm text-center">
            {[
              { icon: Camera, label: 'BUS CAMERA', color: 'text-gray-300' },
              { icon: Zap, label: 'EDGE AI', color: 'text-cyan-400' },
              { icon: Search, label: 'POTHOLE DETECTION', color: 'text-blue-400' },
              { icon: MapPin, label: 'GPS + TIME', color: 'text-teal-400' },
              { icon: Filter, label: 'SEVERITY ANALYSIS', color: 'text-orange-400' },
              { icon: Eye, label: 'EVIDENCE', color: 'text-yellow-400' },
              { icon: Server, label: 'CLOUD PLATFORM', color: 'text-blue-500' },
              { icon: MapIcon, label: 'ROAD HEALTH MAP', color: 'text-purple-400' },
              { icon: Settings, label: 'AUTHORITY ACTION', color: 'text-pink-400' },
              { icon: Wrench, label: 'REPAIR', color: 'text-teal-300' },
              { icon: ShieldCheck, label: 'RE-VERIFICATION', color: 'text-green-400' }
            ].map((step, i, arr) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex items-center gap-1.5 md:gap-2.5"
              >
                <div className="flex flex-col items-center gap-1.5 w-16 md:w-20">
                  <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gray-800/90 border border-gray-700/80 flex items-center justify-center ${step.color} shadow-md`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-semibold text-gray-400 uppercase leading-tight">
                    {step.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 mb-4 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center pb-8">
          <p className="text-xs text-gray-600 font-mono">
            Prototype demonstration using simulated/illustrative data for Smart India Hackathon 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
