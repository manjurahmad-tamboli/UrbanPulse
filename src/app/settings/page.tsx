'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, Cpu, Bell, Key, Info } from 'lucide-react'

export default function SettingsPage() {
  const [confidence, setConfidence] = useState(80)
  const [radius, setRadius] = useState(10)
  const [privacyMode, setPrivacyMode] = useState(true)
  const [notifications, setNotifications] = useState({
    critical: true,
    warnings: true,
    system: false
  })

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">System Configuration</h1>

        {/* Detection Settings */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-3">
            <Sliders className="text-cyan-400" />
            <h2 className="text-xl font-semibold">Detection Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-300">AI Confidence Threshold</label>
                <span className="text-cyan-400 font-mono">{confidence}%</span>
              </div>
              <input 
                type="range" min="50" max="99" value={confidence} 
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <p className="text-xs text-gray-500 mt-1">Detections below this confidence will be discarded.</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-300">Spatial Clustering Radius (meters)</label>
                <span className="text-cyan-400 font-mono">{radius}m</span>
              </div>
              <input 
                type="range" min="1" max="50" value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <p className="text-xs text-gray-500 mt-1">Radius for grouping nearby detections into a single issue.</p>
            </div>
          </div>
        </div>

        {/* Edge Device Config */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-3">
            <Cpu className="text-teal-400" />
            <h2 className="text-xl font-semibold">Edge Device Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Target Model Version</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500">
                <option>YOLOv8s - Urban v2.1 (Current)</option>
                <option>YOLOv8n - Fast v1.4</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Processing Target (FPS)</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500">
                <option>15 FPS (Balanced)</option>
                <option>30 FPS (Performance)</option>
              </select>
            </div>
            <div className="flex items-center justify-between col-span-1 md:col-span-2 p-4 bg-gray-800/50 rounded-xl">
              <div>
                <p className="font-semibold text-white">Edge Privacy Engine</p>
                <p className="text-sm text-gray-400">Mask faces and license plates at the edge before transmission.</p>
              </div>
              <button 
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${privacyMode ? 'bg-cyan-500' : 'bg-gray-600'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${privacyMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & API (Grid layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-3">
              <Bell className="text-orange-400" />
              <h2 className="text-xl font-semibold">Alerts</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize text-gray-300">{key} Alerts</span>
                  <button 
                    onClick={() => setNotifications({...notifications, [key]: !value})}
                    className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-cyan-500' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-3">
              <Key className="text-purple-400" />
              <h2 className="text-xl font-semibold">API Connectivity</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Server Endpoint</label>
                <input type="text" value="wss://api.urbanpulse.dev/v1/stream" readOnly className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-300 mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-400">API Key</label>
                <input type="password" value="sk_test_1234567890abcdef" readOnly className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-300 mt-1" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm text-green-400">WebSocket Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 text-center">
          <Info className="mx-auto text-gray-400 mb-2" size={24} />
          <h2 className="text-lg font-semibold text-gray-200">UrbanPulse Platform v1.0.0</h2>
          <p className="text-sm text-gray-500 mt-2">Developed for Smart India Hackathon 2026</p>
        </div>
      </motion.div>
    </div>
  )
}
