'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, ShieldAlert, ChevronRight } from 'lucide-react';
import { useSimulation, ToastItem } from '@/context/simulation-context';

export default function ToastContainer() {
  const { toasts, removeToast } = useSimulation();
  const router = useRouter();

  const getIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />;
      case 'warning':
        return <ShieldAlert className="w-5 h-5 text-orange-400 flex-shrink-0" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastItem['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-500/40 bg-[#160b0e]/95 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
      case 'warning':
        return 'border-orange-500/40 bg-[#170e0a]/95 shadow-[0_0_20px_rgba(249,115,22,0.2)]';
      case 'success':
        return 'border-green-500/40 bg-[#0a1711]/95 shadow-[0_0_20px_rgba(34,197,94,0.2)]';
      default:
        return 'border-cyan-500/40 bg-[#0c1524]/95 shadow-[0_0_20px_rgba(6,182,212,0.2)]';
    }
  };

  const handleToastClick = (toast: ToastItem) => {
    if (toast.actionUrl) {
      router.push(toast.actionUrl);
      removeToast(toast.id);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={() => handleToastClick(toast)}
            className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-xl flex items-start gap-3 text-white transition-all ${
              toast.actionUrl
                ? 'cursor-pointer hover:scale-[1.02] hover:border-cyan-400/50 group'
                : ''
            } ${getBorderColor(toast.type)}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 truncate group-hover:text-cyan-400 transition-colors">
                  {toast.title}
                </h4>
                <span className="text-[10px] text-gray-500 font-mono">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{toast.message}</p>
              {toast.actionUrl && (
                <div className="flex items-center gap-1 mt-2 text-[10px] font-medium text-cyan-400">
                  <span>View details</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="text-gray-500 hover:text-white transition-colors p-1 -mr-1 -mt-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
