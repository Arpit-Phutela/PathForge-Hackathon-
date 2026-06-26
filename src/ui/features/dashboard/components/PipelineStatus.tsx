import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const PipelineStatus: React.FC = () => {
  const { proposal, graph, schedule, feasibility, error, isGenerating } = useDashboardStore();

  const steps = [
    { 
      name: 'AI Mission Synthesis', 
      desc: 'Formulating core milestones from goal',
      status: proposal ? 'complete' : (error && !proposal) ? 'error' : isGenerating ? 'active' : 'pending' 
    },
    { 
      name: 'Dependency Graph Resolver', 
      desc: 'Compiling Directed Acyclic Graph structure',
      status: graph ? 'complete' : (error && proposal && !graph) ? 'error' : (isGenerating && proposal) ? 'active' : 'pending' 
    },
    { 
      name: 'Deterministic CPM Engine', 
      desc: 'Calculating critical path & float bounds',
      status: schedule ? 'complete' : (error && graph && !schedule) ? 'error' : (isGenerating && graph) ? 'active' : 'pending' 
    },
    { 
      name: 'Safety & Bottleneck Audit', 
      desc: 'Isolating cascading structural risks',
      status: feasibility ? 'complete' : (error && schedule && !feasibility) ? 'error' : (isGenerating && schedule) ? 'active' : 'pending' 
    }
  ];

  return (
    <div className="px-6 pb-8 font-sans">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
          Orchestration Pipeline
        </h3>
        {isGenerating && (
          <span className="text-[8px] bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-mono animate-pulse uppercase tracking-wider font-semibold">
            Synthesizing
          </span>
        )}
      </div>

      <div className="relative pl-3 border-l border-zinc-800/60 space-y-6">
        {steps.map((step, idx) => {
          const isComplete = step.status === 'complete';
          const isError = step.status === 'error';
          const isActive = step.status === 'active';

          return (
            <motion.div 
              key={step.name} 
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="relative group"
            >
              {/* Timeline Bullet Anchor */}
              <div className="absolute -left-[19px] top-1 bg-[#0c0c0e] z-10 flex items-center justify-center">
                {isComplete ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/5 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="w-2 h-2 text-emerald-400" />
                  </div>
                ) : isError ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/5 border border-red-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                  </div>
                ) : isActive ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-indigo-500/5 border border-indigo-500/30 flex items-center justify-center animate-spin">
                    <Loader2 className="w-2 h-2 text-indigo-400" />
                  </div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full border border-zinc-800 bg-[#0c0c0e] group-hover:border-zinc-700 transition-colors" />
                )}
              </div>

              {/* Step Info */}
              <div className="pl-4">
                <span className={`text-xs font-semibold flex items-center gap-2 ${
                  isComplete ? 'text-zinc-200' :
                  isError ? 'text-red-400' :
                  isActive ? 'text-indigo-400' :
                  'text-zinc-500'
                }`}>
                  {step.name}
                </span>
                <p className={`text-[10px] mt-0.5 leading-relaxed ${
                  isComplete ? 'text-zinc-500' :
                  isActive ? 'text-zinc-400' :
                  'text-zinc-600'
                }`}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

