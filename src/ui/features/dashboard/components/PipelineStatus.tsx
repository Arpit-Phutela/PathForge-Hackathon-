import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { CheckCircle2, CircleAlert, Disc } from 'lucide-react';
import { motion } from 'motion/react';

export const PipelineStatus: React.FC = () => {
  const { proposal, graph, schedule, feasibility, error, isGenerating } = useDashboardStore();

  const steps = [
    { 
      name: 'AI Mission Synthesis', 
      desc: 'Formulates tasks & milestones from goal',
      status: proposal ? 'complete' : (error && !proposal) ? 'error' : isGenerating ? 'active' : 'pending' 
    },
    { 
      name: 'Dependency Graph Resolver', 
      desc: 'Builds acyclic execution structure',
      status: graph ? 'complete' : (error && proposal && !graph) ? 'error' : (isGenerating && proposal) ? 'active' : 'pending' 
    },
    { 
      name: 'Deterministic CPM Engine', 
      desc: 'Calculates float, slack & critical paths',
      status: schedule ? 'complete' : (error && graph && !schedule) ? 'error' : (isGenerating && graph) ? 'active' : 'pending' 
    },
    { 
      name: 'Safety & Bottleneck Audit', 
      desc: 'Determines feasibility score & cascading risks',
      status: feasibility ? 'complete' : (error && schedule && !feasibility) ? 'error' : (isGenerating && schedule) ? 'active' : 'pending' 
    }
  ];

  return (
    <div className="px-6 pb-8 font-sans">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
          AI Command Center
        </h3>
        {isGenerating && (
          <span className="text-[10px] bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 rounded-full font-mono animate-pulse">
            COMPUTING
          </span>
        )}
      </div>

      <div className="relative pl-3 border-l border-border/60 space-y-6">
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
              <div className="absolute -left-[19px] top-1 bg-background z-10 flex items-center justify-center">
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-success bg-background" />
                ) : isError ? (
                  <CircleAlert className="w-4 h-4 text-critical bg-background" />
                ) : isActive ? (
                  <Disc className="w-4 h-4 text-primary bg-background animate-spin duration-3000" />
                ) : (
                  <div className="w-3 h-3 rounded-full border-2 border-border/60 bg-background group-hover:border-gray-500 transition-colors" />
                )}
              </div>

              {/* Step Info */}
              <div className="pl-4">
                <span className={`text-xs font-semibold flex items-center gap-2 ${
                  isComplete ? 'text-gray-200' :
                  isError ? 'text-critical' :
                  isActive ? 'text-primary' :
                  'text-gray-500'
                }`}>
                  {step.name}
                </span>
                <p className={`text-[10px] mt-0.5 leading-relaxed ${
                  isComplete ? 'text-gray-400' :
                  isActive ? 'text-gray-300' :
                  'text-gray-600'
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

