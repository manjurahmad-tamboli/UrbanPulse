'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, RotateCcw, X, Presentation, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '@/context/simulation-context';
import { scenarioSteps } from '@/lib/simulation';

export default function PresentationHUD() {
  const {
    isPresentationMode,
    togglePresentation,
    scenarioActive,
    currentScenarioStep,
    startScenario,
    nextScenarioStep,
    resetScenario,
  } = useSimulation();

  if (!isPresentationMode) return null;

  const currentStepData = scenarioSteps[currentScenarioStep] || scenarioSteps[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-16 left-68 right-6 z-40 bg-[#0d1527]/95 border-2 border-cyan-400/40 backdrop-blur-2xl rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.25)] p-4 text-white"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Header & Mode Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide text-white uppercase">
                  SIH 2026 Judge Presentation Mode
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> BEL PS-26124
                </span>
              </div>
              <p className="text-xs text-gray-400">
                AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet
              </p>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-3 bg-gray-900/80 px-4 py-2 rounded-xl border border-gray-800">
            {scenarioActive ? (
              <div className="flex items-center gap-3">
                <div className="text-xs">
                  <span className="text-cyan-400 font-bold">Step {currentScenarioStep + 1} of 15:</span>{' '}
                  <span className="font-semibold text-white">
                    {currentStepData.icon} {currentStepData.title}
                  </span>
                  <p className="text-[11px] text-gray-400 max-w-sm truncate">{currentStepData.description}</p>
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <button
                    onClick={nextScenarioStep}
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  >
                    Next Step <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={resetScenario}
                    className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                    title="Reset Scenario"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={startScenario}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <Play className="w-4 h-4 fill-current" /> Run Complete UrbanPulse Scenario (15 Steps)
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => togglePresentation(false)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Exit Presentation Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
