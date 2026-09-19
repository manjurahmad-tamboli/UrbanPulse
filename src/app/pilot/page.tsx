'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, PlayCircle, Clock, Rocket } from 'lucide-react'
import { pilotPhases } from '@/data/mock-data'

export default function PilotPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">Pilot Deployment & Roadmap</h1>
        <p className="text-gray-400 mb-8">Implementation strategy for Kolhapur city</p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* Phase 1 */}
          <motion.div variants={itemVariants} className="bg-[#111827]/80 backdrop-blur-xl border border-green-500/50 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <CheckCircle2 className="text-green-500" size={28} />
            </div>
            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Completed</span>
            <h2 className="text-2xl font-bold mt-2 mb-4">Phase 1: Validation</h2>
            <ul className="space-y-2 text-gray-300 text-sm mb-6">
              <li>• 5 Public Buses</li>
              <li>• 2 Major Routes</li>
              <li>• Focus: Road Damage Detection</li>
              <li>• Edge AI Hardware Testing</li>
            </ul>
            <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/20">
              <p className="text-xs text-green-400 font-semibold mb-1">Status: Success</p>
              <p className="text-xs text-gray-400">92% accuracy in pothole detection</p>
            </div>
          </motion.div>

          {/* Phase 2 */}
          <motion.div variants={itemVariants} className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            <div className="absolute top-0 right-0 p-3">
              <PlayCircle className="text-cyan-400" size={28} />
            </div>
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">Active Pilot</span>
            <h2 className="text-2xl font-bold mt-2 mb-4">Phase 2: Expansion</h2>
            <ul className="space-y-2 text-gray-300 text-sm mb-6">
              <li>• 20 Public Buses</li>
              <li>• 8 Strategic Routes</li>
              <li>• Focus: Traffic + Infrastructure</li>
              <li>• Citizen Reporting Integration</li>
            </ul>
            <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-500/20">
              <p className="text-xs text-cyan-400 font-semibold mb-1">Status: In Progress</p>
              <p className="text-xs text-gray-400">Scaling backend architecture</p>
            </div>
          </motion.div>

          {/* Phase 3 */}
          <motion.div variants={itemVariants} className="bg-[#111827]/80 backdrop-blur-xl border border-gray-600 rounded-2xl p-6 relative overflow-hidden opacity-70">
            <div className="absolute top-0 right-0 p-3">
              <Clock className="text-gray-400" size={28} />
            </div>
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Planned</span>
            <h2 className="text-2xl font-bold mt-2 mb-4">Phase 3: City-Wide</h2>
            <ul className="space-y-2 text-gray-300 text-sm mb-6">
              <li>• 200+ Buses (Entire Fleet)</li>
              <li>• 45+ Routes (City Coverage)</li>
              <li>• Focus: Comprehensive UrbanPulse</li>
              <li>• Predictive Maintenance AI</li>
            </ul>
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600/50">
              <p className="text-xs text-gray-400 font-semibold mb-1">Status: Q3 2026</p>
              <p className="text-xs text-gray-500">Awaiting Phase 2 evaluation</p>
            </div>
          </motion.div>
        </motion.div>

        {/* KPIs Table */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Active Phase KPIs</h3>
            <span className="px-3 py-1 bg-cyan-900/30 text-cyan-400 text-xs rounded-full border border-cyan-500/30 flex items-center gap-2">
              <Rocket size={14} /> Illustrative Demo Data
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 text-gray-400 font-medium">Metric</th>
                  <th className="p-3 text-gray-400 font-medium">Target</th>
                  <th className="p-3 text-gray-400 font-medium">Current</th>
                  <th className="p-3 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50">
                  <td className="p-3">Edge Detection Accuracy</td>
                  <td className="p-3">90%</td>
                  <td className="p-3">94%</td>
                  <td className="p-3"><span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">Met Target</span></td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="p-3">Data Transmission Saving</td>
                  <td className="p-3">&gt;95%</td>
                  <td className="p-3">98.7%</td>
                  <td className="p-3"><span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">Met Target</span></td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="p-3">Daily Active Edge Devices</td>
                  <td className="p-3">20</td>
                  <td className="p-3">18</td>
                  <td className="p-3"><span className="text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded text-xs">On Track</span></td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="p-3">Issue Verification Latency</td>
                  <td className="p-3">&lt;24 hrs</td>
                  <td className="p-3">36 hrs</td>
                  <td className="p-3"><span className="text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs">At Risk</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
