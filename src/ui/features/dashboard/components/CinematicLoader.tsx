import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { Check, Loader2, Sparkles, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

interface Step {
  id: number;
  label: string;
  sub: string;
}

const CINEMATIC_STAGES: Step[] = [
  { id: 0, label: 'Mission Accepted', sub: 'Initializing topological campaign orchestrator...' },
  { id: 1, label: 'Understanding Mission', sub: 'Analyzing scope semantic boundaries...' },
  { id: 2, label: 'Extracting Objectives', sub: 'Synthesizing discrete project deliverables...' },
  { id: 3, label: 'Building Dependency Graph', sub: 'Compiling nodes and directional linkages...' },
  { id: 4, label: 'Resolving Task Relationships', sub: 'Validating acyclic graph constraints...' },
  { id: 5, label: 'Running Topological Sort', sub: 'Sequencing execution precedence mathematically...' },
  { id: 6, label: 'Calculating Critical Path', sub: 'Isolating zero-slack scheduling dependencies...' },
  { id: 7, label: 'Computing Slack & Float', sub: 'Quantifying execution buffer tolerances...' },
  { id: 8, label: 'Detecting Bottlenecks', sub: 'Pinpointing cascading critical risk paths...' },
  { id: 9, label: 'Evaluating Schedule Health', sub: 'Determining feasibility coefficients...' },
  { id: 10, label: 'Generating Rescue Intelligence', sub: 'Formulating recovery mitigation vectors...' },
  { id: 11, label: 'Mission Ready', sub: 'Deterministic campaign successfully compiled.' }
];

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  const { isGenerating, proposal, error } = useDashboardStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Staged automatic progress with beautiful timing, pausing at step 10 if backend is still thinking
  useEffect(() => {
    if (error) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        // Step 10 is 'Generating Rescue Intelligence'. We stay here until the backend proposal data is loaded.
        if (prev === 10) {
          if (!isGenerating && proposal) {
            return 11; // Advance to 'Mission Ready'
          }
          return 10; // Stay here and pulse
        }
        
        // At step 11 ('Mission Ready'), once completed, trigger completion reveal
        if (prev === 11) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 11;
        }

        return prev + 1;
      });
    }, 600); // 600ms per step transition for a smooth, readable, cinematic experience

    return () => clearInterval(interval);
  }, [isGenerating, proposal, error, onComplete]);

  // If there's an error, we gracefully let the parent component handle the error view
  if (error) {
    return null;
  }

  const activeStage = CINEMATIC_STAGES[currentStep];

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 font-sans select-none relative overflow-hidden bg-[#070708]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-purple-500/300 opacity-[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full space-y-10 z-10">
        
        {/* Top interactive status HUD */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c0c0e] border border-indigo-500/20 text-indigo-400 font-mono text-[9px] tracking-widest uppercase"
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>Topological Solver Online</span>
          </motion.div>

          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
              PathForge Compilation Engine
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
              Synthesizing objectives and validating scheduling logic against deterministic constraints.
            </p>
          </div>
        </div>

        {/* Premium visual progress timeline */}
        <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle horizontal scanning line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent animate-pulse" />

          {/* Staged vertical list of steps with high-fidelity status triggers */}
          <div className="relative pl-4 border-l border-zinc-800 space-y-4">
            {CINEMATIC_STAGES.map((step) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isRemaining = step.id > currentStep;

              return (
                <div 
                  key={step.id} 
                  className={`transition-all duration-300 relative ${
                    isActive ? 'opacity-100 scale-[1.01]' : isCompleted ? 'opacity-60' : 'opacity-20'
                  }`}
                >
                  {/* Step bullet point */}
                  <div className="absolute -left-[23px] top-1 z-20 flex items-center justify-center">
                    {isCompleted ? (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </motion.div>
                    ) : isActive ? (
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-4 w-4 rounded-full bg-indigo-500/30 animate-ping" />
                        <div className="relative w-4 h-4 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
                    )}
                  </div>

                  {/* Step information */}
                  <div className="pl-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold tracking-tight ${
                        isActive ? 'text-indigo-400 font-bold' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'
                      }`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 animate-pulse">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <motion.p 
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[10px] text-zinc-400 mt-1 font-mono tracking-wide leading-relaxed italic"
                      >
                        {step.sub}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic mathematical ticker mimicking active calculations */}
        <div className="h-6 flex items-center justify-center text-[9px] font-mono text-zinc-600">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span>
                {currentStep === 11 
                  ? 'COMPILATION COMPLETE: FEASIBILITY SECURED' 
                  : `RESOLVING PIPELINE PHASE ${currentStep + 1} / 12...`}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
