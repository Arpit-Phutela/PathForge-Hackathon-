import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { Check, Cpu, Sparkles, Network, GitCommit, ShieldAlert } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

interface Step {
  id: number;
  label: string;
  sub: string;
}

const CINEMATIC_STAGES: Step[] = [
  { id: 0, label: 'Understanding mission...', sub: 'Deconstructing user prompt, extracting semantic milestones...' },
  { id: 1, label: 'Building task graph...', sub: 'Generating milestone sequences and directed acyclic structures...' },
  { id: 2, label: 'Checking dependencies...', sub: 'Validating topological continuity and tracing prerequisite rings...' },
  { id: 3, label: 'Calculating critical path...', sub: 'Applying Critical Path Method (CPM) to isolate float constraints...' },
  { id: 4, label: 'Optimizing schedule...', sub: 'Performing resource leveling and safety buffer calculations...' },
  { id: 5, label: 'Preparing execution plan...', sub: 'Assembling briefing deck and compiling tactical workspace...' }
];

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  const { isGenerating, proposal, error } = useDashboardStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Staged automatic progress with beautiful timing, completing in 6.6 seconds
  useEffect(() => {
    if (error) return;

    // We have 6 steps (0 to 5). We spend 400ms per step.
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev === 5) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 5;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [error, onComplete]);

  // Interpolate progress percent smoothly
  useEffect(() => {
    const targetPercent = Math.min(100, Math.round(((currentStep + 1) / CINEMATIC_STAGES.length) * 100));
    const stepDiff = targetPercent - progressPercent;
    if (stepDiff <= 0) return;

    const tickInterval = 400 / stepDiff;
    const ticker = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= targetPercent) {
          clearInterval(ticker);
          return targetPercent;
        }
        return prev + 1;
      });
    }, tickInterval);

    return () => clearInterval(ticker);
  }, [currentStep]);

  if (error) {
    return null;
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-6 font-sans select-none relative overflow-hidden bg-[#070709]">
      {/* Slow pulsing grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e03_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e05_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />
      
      {/* Breathing background glowing spots */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.02, 0.04, 0.02],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-center z-10 relative">
        
        {/* Left Side: Live assembling SVG Graph Constellation */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-48 h-48 rounded-2xl border border-zinc-900 bg-[#0a0a0d]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden shadow-2xl">
            {/* Live scanning line */}
            <motion.div
              animate={{ y: [-100, 100] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent pointer-events-none z-10"
            />
            
            {/* Live SVG Graph Drawing based on Stage Progression */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="glowG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>

              {/* Node 1: Start Anchor */}
              {currentStep >= 0 && (
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  cx="30" cy="100" r="8" fill="url(#glowG)"
                />
              )}

              {/* Edge 1 -> 2 */}
              {currentStep >= 1 && (
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                  x1="38" y1="100" x2="85" y2="60" stroke="#4f46e5" strokeWidth="1.5"
                />
              )}

              {/* Node 2: Milestone A */}
              {currentStep >= 1 && (
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  cx="90" cy="60" r="10" fill="#18181b" stroke="#818cf8" strokeWidth="2"
                />
              )}

              {/* Edge 1 -> 3 */}
              {currentStep >= 2 && (
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                  x1="38" y1="100" x2="85" y2="140" stroke="#4f46e5" strokeWidth="1.5"
                />
              )}

              {/* Node 3: Task B */}
              {currentStep >= 2 && (
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  cx="90" cy="140" r="10" fill="#18181b" stroke="#4f46e5" strokeWidth="1.5"
                />
              )}

              {/* Edge 2 -> 4 (Critical Path part 1) */}
              {currentStep >= 3 && (
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                  x1="100" y1="60" x2="145" y2="100" stroke="#f43f5e" strokeWidth="2.5"
                />
              )}

              {/* Edge 3 -> 4 */}
              {currentStep >= 4 && (
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                  x1="100" y1="140" x2="145" y2="100" stroke="#4f46e5" strokeWidth="1.5"
                />
              )}

              {/* Node 4: Milestone Final Sink */}
              {currentStep >= 3 && (
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  cx="150" cy="100" r="12" fill="#18181b" 
                  stroke={currentStep >= 4 ? '#f43f5e' : '#818cf8'} 
                  strokeWidth="2.5"
                />
              )}

              {/* Active pulsing ring on the latest active node */}
              {currentStep === 0 && <circle cx="30" cy="100" r="14" fill="none" stroke="#818cf8" strokeWidth="1" className="animate-ping opacity-40" />}
              {currentStep === 1 && <circle cx="90" cy="60" r="16" fill="none" stroke="#818cf8" strokeWidth="1" className="animate-ping opacity-40" />}
              {currentStep === 2 && <circle cx="90" cy="140" r="16" fill="none" stroke="#4f46e5" strokeWidth="1" className="animate-ping opacity-40" />}
              {currentStep >= 3 && <circle cx="150" cy="100" r="18" fill="none" stroke="#f43f5e" strokeWidth="1" className="animate-ping opacity-30" />}
            </svg>
          </div>
          
          <div className="text-center">
            <span className="text-3xl font-black font-mono tracking-tighter text-zinc-100 bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
              {progressPercent}%
            </span>
            <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 block mt-0.5">
              Topological Assembly Fit
            </span>
          </div>
        </div>

        {/* Right Side: Step Progress List */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-1">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/15 text-indigo-400 font-mono text-[8px] tracking-widest uppercase"
            >
              <Cpu className="w-3 h-3 animate-spin" />
              <span>COGNITIVE CPM ENGINE ACTIVE</span>
            </motion.div>
            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
              Synthesizing Critical Path
            </h2>
            <p className="text-[11px] text-zinc-500 max-w-sm">
              Formulating dependency coordinates and calculating slack multipliers.
            </p>
          </div>

          {/* Steps Timeline Container */}
          <div className="bg-[#0b0b0d]/70 border border-zinc-900 rounded-2xl p-5 space-y-3.5 shadow-xl relative">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent animate-pulse" />
            
            <div className="relative pl-3 border-l border-zinc-900 space-y-3">
              {CINEMATIC_STAGES.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;
                
                return (
                  <div 
                    key={step.id} 
                    className={`transition-all duration-300 relative ${
                      isActive ? 'opacity-100 scale-[1.01]' : isCompleted ? 'opacity-50' : 'opacity-15'
                    }`}
                  >
                    {/* Circle Bullet */}
                    <div className="absolute -left-[19px] top-1 z-20 flex items-center justify-center">
                      {isCompleted ? (
                        <motion.div 
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-3.5 h-3.5 rounded-full bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center"
                        >
                          <Check className="w-2 h-2 text-indigo-400" />
                        </motion.div>
                      ) : isActive ? (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-indigo-500/25 animate-ping" />
                          <div className="relative w-3.5 h-3.5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-750" />
                      )}
                    </div>

                    {/* Stage Info */}
                    <div className="pl-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold tracking-tight ${
                          isActive ? 'text-indigo-400 font-bold' : 'text-zinc-300'
                        }`}>
                          {step.label}
                        </span>
                        {isActive && (
                          <span className="text-[6px] font-mono font-extrabold px-1 py-0.25 rounded bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      {isActive && (
                        <motion.p 
                          initial={{ opacity: 0, y: 2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[9px] text-zinc-500 mt-0.5 font-mono leading-normal"
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

        </div>

      </div>
    </div>
  );
};

