'use client'

import { motion } from 'framer-motion'
import { Server, Cpu, Bus, Wifi, LayoutDashboard, Shield, ShieldAlert, ArrowDown } from 'lucide-react'

export default function ArchitecturePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">System Architecture & Data Flow</h1>
        <p className="text-gray-400 mb-10">Edge AI computing framework for urban monitoring</p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col items-center gap-4"
        >
          {/* Layer 1 */}
          <motion.div variants={itemVariants} className="w-full bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
            <div className="flex items-center gap-4 mb-4 border-b border-gray-700 pb-2">
              <Bus className="text-cyan-400" />
              <h2 className="text-xl font-semibold">1. PUBLIC BUS (Data Acquisition)</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Front Camera</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Side Camera</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">GPS Module</span>
            </div>
          </motion.div>

          <ArrowDown className="text-cyan-500/50 animate-bounce" />

          {/* Layer 2 */}
          <motion.div variants={itemVariants} className="w-full bg-[#111827]/80 backdrop-blur-xl border border-teal-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
            <div className="flex items-center gap-4 mb-4 border-b border-gray-700 pb-2">
              <Cpu className="text-teal-400" />
              <h2 className="text-xl font-semibold">2. EDGE AI (Processing)</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-teal-500/30">YOLO Detection</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-teal-500/30">OpenCV Processing</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-teal-500/30">Object Tracking</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-teal-500/30">Face/Plate Redaction</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-teal-500/30">Severity Estimation</span>
            </div>
          </motion.div>

          <ArrowDown className="text-cyan-500/50 animate-bounce" />

          {/* Layer 3 */}
          <motion.div variants={itemVariants} className="w-full bg-[#111827]/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <div className="flex items-center gap-4 mb-4 border-b border-gray-700 pb-2">
              <Wifi className="text-blue-400" />
              <h2 className="text-xl font-semibold">3. COMMUNICATION (Transport)</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">4G/5G Network</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Offline Queue</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Secure API</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">End-to-End Encryption</span>
            </div>
          </motion.div>

          <ArrowDown className="text-cyan-500/50 animate-bounce" />

          {/* Layer 4 */}
          <motion.div variants={itemVariants} className="w-full bg-[#111827]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <div className="flex items-center gap-4 mb-4 border-b border-gray-700 pb-2">
              <Server className="text-purple-400" />
              <h2 className="text-xl font-semibold">4. BACKEND (Central Server)</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">FastAPI</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">PostgreSQL / PostGIS</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Issue Deduplication</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Analytics Engine</span>
            </div>
          </motion.div>

          <ArrowDown className="text-cyan-500/50 animate-bounce" />

          {/* Layer 5 */}
          <motion.div variants={itemVariants} className="w-full bg-[#111827]/80 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
            <div className="flex items-center gap-4 mb-4 border-b border-gray-700 pb-2">
              <LayoutDashboard className="text-pink-400" />
              <h2 className="text-xl font-semibold">5. CITY DASHBOARD (User Interface)</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Interactive Map</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Issue Management</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Traffic Intelligence</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Verification Workflow</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Privacy Section */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-green-400" size={32} />
            <h2 className="text-2xl font-bold text-white">Edge AI Privacy Engine</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-red-400">
                <ShieldAlert />
                <h3 className="text-lg font-semibold">Traditional Systems</h3>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>• Continuous Video Upload</li>
                <li>• High Bandwidth (144 GB/day per bus)</li>
                <li>• High Storage Requirements</li>
                <li>• Severe Privacy Risks (citizens recorded)</li>
              </ul>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-green-400">
                <Shield />
                <h3 className="text-lg font-semibold">UrbanPulse Solution</h3>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>• On-device Edge Processing</li>
                <li>• Metadata Only (1.8 GB/day per bus)</li>
                <li>• Short Evidence Clips Only</li>
                <li>• Privacy Aware (Faces & plates masked at edge)</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Privacy Workflow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-center">
              <div className="bg-gray-800 p-3 rounded-xl flex-1">Bus Cameras</div>
              <ArrowDown className="md:-rotate-90 text-gray-500" />
              <div className="bg-cyan-900/40 border border-cyan-500/50 p-3 rounded-xl flex-1">Edge AI Processing</div>
              <ArrowDown className="md:-rotate-90 text-gray-500" />
              <div className="bg-green-900/40 border border-green-500/50 p-3 rounded-xl flex-1 font-semibold text-green-400">Privacy Filtering<br/><span className="text-xs font-normal">Face/Plate Masking</span></div>
              <ArrowDown className="md:-rotate-90 text-gray-500" />
              <div className="bg-purple-900/40 border border-purple-500/50 p-3 rounded-xl flex-1">Metadata + Masked Evidence</div>
              <ArrowDown className="md:-rotate-90 text-gray-500" />
              <div className="bg-gray-800 p-3 rounded-xl flex-1">Cloud Servers</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
