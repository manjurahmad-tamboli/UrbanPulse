'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Presentation, Play, RotateCcw, ChevronRight,
  X, AlertTriangle, CheckCircle, Info, Bus, Wifi,
  Maximize2, Minimize2, Menu, Activity,
} from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import { scenarioSteps } from '@/lib/simulation';
import { useSimulation } from '@/context/simulation-context';

export default function Header() {
  const {
    isSimulating,
    isPresentationMode,
    scenarioActive,
    currentScenarioStep,
    notifications,
    toggleSimulation,
    togglePresentation,
    startScenario,
    nextScenarioStep,
    resetScenario,
    toggleMobileMenu,
  } = useSimulation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const markAllRead = () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const severityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-400" />;
      default: return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-30 h-14 bg-[#0d1117]/90 backdrop-blur-xl border-b border-cyan-500/10 flex items-center justify-between px-3 sm:px-5">
      {/* Left section - Hamburger & Scenario controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Mobile Brand Logo */}
        {!scenarioActive && (
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Urban<span className="text-cyan-400">Pulse</span>
            </span>
          </div>
        )}

        {scenarioActive && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 max-w-[200px] sm:max-w-none truncate"
          >
            <span className="text-[11px] sm:text-xs text-cyan-400 font-medium whitespace-nowrap">
              {currentScenarioStep + 1}/{scenarioSteps.length}:
            </span>
            <span className="text-[11px] sm:text-xs text-white truncate">
              {scenarioSteps[currentScenarioStep]?.icon} {scenarioSteps[currentScenarioStep]?.title}
            </span>
            <button
              onClick={nextScenarioStep}
              className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors flex items-center gap-0.5 sm:gap-1"
            >
              <span className="hidden sm:inline">{currentScenarioStep < scenarioSteps.length - 1 ? 'Next' : 'Finish'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={resetScenario}
              className="px-1 py-0.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Right section - Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Run Scenario Button */}
        {!scenarioActive && (
          <button
            onClick={startScenario}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
            title="Run Scenario"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Run Scenario</span>
          </button>
        )}

        {/* Live Simulation Toggle */}
        <button
          onClick={() => toggleSimulation()}
          className={cn(
            'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer',
            isSimulating
              ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
              : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:border-gray-500/40'
          )}
          title={isSimulating ? 'Simulation Live' : 'Start Simulation'}
        >
          <div className={cn('w-2 h-2 rounded-full', isSimulating ? 'bg-green-400 pulse-glow' : 'bg-gray-500')} />
          <span className="hidden sm:inline">{isSimulating ? 'Simulation Live' : 'Start Simulation'}</span>
        </button>

        {/* Presentation Mode */}
        <button
          onClick={() => togglePresentation()}
          className={cn(
            'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer',
            isPresentationMode
              ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:border-gray-500/40'
          )}
          title="Presentation Mode"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Presentation Mode</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-12 w-96 max-h-[70vh] bg-[#111827] border border-cyan-500/20 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-cyan-500/10 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllRead}
                      className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      Mark all read
                    </button>
                    <button onClick={() => setShowNotifications(false)} className="cursor-pointer">
                      <X className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[60vh]">
                  {localNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'p-3 border-b border-gray-800/50 hover:bg-white/5 transition-colors cursor-pointer',
                        !notif.read && 'bg-cyan-500/5'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {severityIcon(notif.severity)}
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-medium', !notif.read ? 'text-white' : 'text-gray-300')}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-gray-600 mt-1" suppressHydrationWarning>
                            {formatTime(notif.timestamp)}
                          </p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
