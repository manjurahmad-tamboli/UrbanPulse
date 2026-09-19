'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { urbanIssues } from '@/data/mock-data';
import { issueTypeLabels, severityBgColors, statusColors, statusLabels, issueTypeIcons, IssueType, Severity, IssueStatus } from '@/lib/types';
import { Search, Filter, Info, Eye, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IssuesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<IssueType | 'All'>('All');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');

  const filteredIssues = urbanIssues.filter(issue => {
    const matchesSearch = issue.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || issue.type === typeFilter;
    const matchesSeverity = severityFilter === 'All' || issue.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto flex flex-col gap-6"
      >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Detected Urban Issues
            </h1>
            <p className="text-gray-400 mt-1">AI-detected infrastructure problems requiring attention</p>
          </div>
          <div className="text-xs text-gray-500 italic flex items-center gap-2">
            <Info className="w-4 h-4" />
            Prototype demonstration using simulated/illustrative data.
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 shadow-[0_0_15px_rgba(0,212,255,0.05)]">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-4 h-4 mr-1 shrink-0" />
              
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="All">All Types</option>
                {Object.entries(issueTypeLabels).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>

              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="All">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="All">All Statuses</option>
                {Object.entries(statusLabels).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,212,255,0.05)]">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h2 className="font-semibold text-gray-200">Results</h2>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
              {filteredIssues.length} found
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="px-4 py-3 font-medium">Issue ID</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No issues found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => {
                    const iconEmoji = issueTypeIcons[issue.type] || '⚠️';
                    
                    return (
                      <tr 
                        key={issue.id} 
                        onClick={() => router.push(`/issues/${issue.id}`)}
                        className="border-b border-gray-800/50 hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-4 font-mono text-cyan-400/80">{issue.id}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-gray-200">
                            <span className="text-sm">{iconEmoji}</span>
                            {issueTypeLabels[issue.type]}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-300 max-w-[200px] truncate" title={issue.address}>
                          {issue.address}
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium text-white", severityBgColors[issue.severity])}>
                            {issue.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">{(issue.confidence * 100).toFixed(0)}%</span>
                            <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500"
                                style={{ width: `${issue.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[issue.status])}>
                              {statusLabels[issue.status]}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-gray-400 hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-cyan-500/10">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
