'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Circle, Sparkles, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { detectionPipelineSteps } from '@/lib/simulation';

interface PipelineStepsProps {
  active: boolean;
  currentStep: number;
}

export default function PipelineSteps({ active, currentStep }: PipelineStepsProps) {
  const steps = detectionPipelineSteps;
  const completedCount = !active ? 0 : Math.min(currentStep + 1, steps.length);
  const percent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 h-full flex flex-col shadow-[0_0_20px_rgba(6,182,212,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Edge-to-Cloud AI Pipeline
            </h3>
            <p className="text-[11px] text-gray-500">Autonomous 9-Stage Detection Workflow</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-cyan-400">{percent}%</span>
          <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
        {steps.map((step, index) => {
          const status = !active
            ? 'pending'
            : index < currentStep
            ? 'completed'
            : index === currentStep
            ? 'processing'
            : 'pending';

          const isCurrent = active && index === currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex items-start gap-3 relative p-2 rounded-xl transition-colors',
                isCurrent ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-white/5'
              )}
            >
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-[19px] top-8 bottom-[-14px] w-[2px] transition-colors',
                    status === 'completed' ? 'bg-green-500/60' : 'bg-gray-800'
                  )}
                />
              )}

              {/* Status Indicator Icon */}
              <div className="relative z-10 mt-0.5">
                {status === 'completed' && (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                {status === 'processing' && (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                )}
                {status === 'pending' && (
                  <div className="w-6 h-6 rounded-full bg-gray-800/80 flex items-center justify-center border border-gray-700 text-gray-500">
                    <Circle className="w-2.5 h-2.5 fill-current" />
                  </div>
                )}
              </div>

              {/* Step Info */}
              <div className={cn('flex-1 min-w-0', status === 'pending' ? 'opacity-40' : '')}>
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'text-xs font-semibold',
                      status === 'processing'
                        ? 'text-cyan-300 font-bold'
                        : status === 'completed'
                        ? 'text-gray-200'
                        : 'text-gray-400'
                    )}
                  >
                    Stage {step.id}: {step.title}
                  </div>
                  {status === 'completed' && (
                    <span className="text-[10px] text-green-400 font-mono">Done</span>
                  )}
                  {status === 'processing' && (
                    <span className="text-[10px] text-cyan-400 font-mono animate-pulse">Running</span>
                  )}
                </div>

                {/* Structured Step Details */}
                <div className="text-[11px] text-gray-400 mt-1 leading-snug">
                  {typeof step.details === 'object' ? (
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-gray-400">
                      {Object.entries(step.details).map(([k, v]) => (
                        <span key={k} className="inline-block font-mono text-[10px]">
                          <span className="text-gray-500">{k}:</span>{' '}
                          <span className={status === 'processing' ? 'text-cyan-300' : 'text-gray-300'}>{v}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span>{step.details}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
