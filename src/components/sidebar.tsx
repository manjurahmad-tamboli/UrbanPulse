'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Bus, Brain, Map, AlertTriangle,
  BarChart3, Car, Settings, Layers, Rocket, Monitor,
  Wifi, Server, Database, Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { systemStatus } from '@/data/mock-data';

const navItems = [
  { href: '/', label: 'Command Center', icon: LayoutDashboard },
  { href: '/live-monitor', label: 'Live Bus Monitor', icon: Bus },
  { href: '/ai-demo', label: 'AI Detection Demo', icon: Brain },
  { href: '/road-health', label: 'Road Health Map', icon: Map },
  { href: '/issues', label: 'Detected Issues', icon: AlertTriangle },
  { href: '/traffic', label: 'Traffic Intelligence', icon: Car },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/fleet', label: 'Fleet Management', icon: Monitor },
  { href: '/architecture', label: 'System Architecture', icon: Layers },
  { href: '/pilot', label: 'Pilot & Deployment', icon: Rocket },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0d1117]/95 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-cyan-500/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Urban<span className="text-cyan-400">Pulse</span>
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">City Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative',
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300')} />
              <span className="truncate">{item.label}</span>
              {item.href === '/ai-demo' && (
                <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                  DEMO
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-cyan-500/10 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
          <span className="text-xs text-gray-400">
            Edge Nodes: <span className="text-green-400 font-medium">{systemStatus.edgeNodesOnline}/{systemStatus.edgeNodesTotal}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            systemStatus.serverStatus === 'connected' ? 'bg-green-400 pulse-glow' : 'bg-red-400'
          )} />
          <span className="text-xs text-gray-400">
            Server: <span className={systemStatus.serverStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{systemStatus.serverStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
          <span className="text-xs text-gray-400">
            AI Processing: <span className="text-green-400 font-medium">Online</span>
          </span>
        </div>
        <div className="pt-2 border-t border-cyan-500/10">
          <p className="text-[10px] text-gray-600 text-center">
            SIH 2026 • PS-26124 • BEL
          </p>
        </div>
      </div>
    </aside>
  );
}
