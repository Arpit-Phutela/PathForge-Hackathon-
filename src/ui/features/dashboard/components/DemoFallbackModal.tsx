import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, RotateCcw, Play } from 'lucide-react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { samplePlannerProposal, sampleExecutionPlan } from '../../../../demo';

interface DemoFallbackModalProps {
  onRetry: () => void;
}

export const DemoFallbackModal: React.FC<DemoFallbackModalProps> = ({ onRetry }) => {
  const { error, setError, setIsDemo, setIsCinematicLoading, setPipelineData } = useDashboardStore();

  if (!error) return null;

  const handleExploreDemo = () => {
    // 1. Clear error to fade out the modal
    setError(null);
    
    // 2. Set demo mode to true
    setIsDemo(true);
    
    // 3. Populate dashboard store with sample e-commerce data
    setPipelineData({
      proposal: samplePlannerProposal,
      graph: sampleExecutionPlan.roadmap.graph,
      schedule: sampleExecutionPlan.roadmap.schedule,
      feasibility: sampleExecutionPlan.analysis.feasibility,
      confidence: sampleExecutionPlan.analysis.confidence,
      bottlenecks: sampleExecutionPlan.analysis.bottlenecks
    });

    // 4. Trigger cinematic loader
    setIsCinematicLoading(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark blurred glass backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#070708]/85 backdrop-blur-md"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#0c0c0e]/95 border border-zinc-800/80 rounded-2xl max-w-md w-full p-6 shadow-2xl overflow-hidden space-y-6 z-10 font-sans"
        >
          {/* Subtle cosmic mesh background effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Header */}
          <div className="flex items-center gap-4 relative">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block mb-0.5">
                SYSTEM REDIRECT ACTIVE
              </span>
              <h2 className="text-sm font-extrabold text-zinc-100 tracking-tight">
                Live AI Engine Offline
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 relative text-xs text-zinc-400 leading-relaxed">
            <p>
              The PathForge live generative planner is currently offline or experiencing temporary rate limitations.
            </p>
            <p className="bg-[#070708]/50 border border-zinc-800/40 rounded-xl p-3.5 text-zinc-400 italic">
              "PathForge can still demonstrate its complete planning engine and critical path calculations using a fully interactive sample mission."
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 relative">
            <button
              onClick={handleExploreDemo}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-550 hover:to-indigo-650 active:scale-[0.98] text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Explore Demo
            </button>
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 active:scale-[0.98] text-zinc-300 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Live AI
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
