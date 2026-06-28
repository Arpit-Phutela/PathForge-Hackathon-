import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { Check, ArrowLeft, Clock, Play, Pause, RotateCcw, AlertCircle, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HoverTilt } from '../../../components/HoverTilt';

export const FocusMode: React.FC = () => {
  const { 
    graph, 
    schedule, 
    completedTaskIds, 
    toggleTaskComplete, 
    setExperienceStage 
  } = useDashboardStore();

  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 min default
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer runner
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = () => {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(1500);
  };

  if (!graph || !schedule) return null;

  // Extract all standard nodes
  const workNodes = graph.nodes.filter(n => n.type === 'STANDARD');
  
  // Is executable helper (all predecessor nodes are completed)
  const getIsExecutable = (nodeId: string) => {
    const parentEdges = graph.edges.filter(e => e.targetId === nodeId);
    if (parentEdges.length === 0) return true;
    return parentEdges.every(edge => {
      const parentNode = graph.nodes.find(n => n.id === edge.sourceId);
      if (!parentNode) return true;
      if (parentNode.type === 'VIRTUAL_SOURCE') return true;
      return completedTaskIds.includes(parentNode.id);
    });
  };

  // Executable and not completed yet
  const activeExecutableTasks = workNodes.filter(
    n => !completedTaskIds.includes(n.id) && getIsExecutable(n.id)
  );

  const completedCount = workNodes.filter(n => completedTaskIds.includes(n.id)).length;
  const totalCount = workNodes.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Transition to Mission Complete if progress reaches 100%
  useEffect(() => {
    if (progressPct === 100 && totalCount > 0) {
      setExperienceStage('MISSION_COMPLETE');
    }
  }, [progressPct, totalCount, setExperienceStage]);

  const currentFocusTask = activeExecutableTasks[0];
  const nextUpTask = activeExecutableTasks[1];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.05 }
        }
      }}
      className="min-h-screen bg-transparent text-gray-100 flex flex-col justify-between px-6 py-8 relative overflow-hidden select-none"
    >
      {/* Serene background focus orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <motion.header 
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
        }}
        className="flex items-center justify-between border-b border-zinc-950 pb-4 z-10 max-w-4xl w-full mx-auto"
      >
        <button 
          onClick={() => setExperienceStage('EXECUTION_WORKSPACE')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors cursor-pointer bg-zinc-900/30 px-3 py-1.5 rounded-lg border border-zinc-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Focus Chamber</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            Silent focus Chamber
          </span>
        </div>
      </motion.header>

      {/* Main Focus Split Deck */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 items-center justify-center py-6 z-10 flex-1">
        
        {/* Left Hand: Serene Focused Task Outline */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, x: -15 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="md:col-span-3 space-y-6"
        >
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">
              Active Focus Target
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-200">
              Today's Priority Task
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
              Prerequisites have been satisfied. Direct your cognitive capacity to complete this node.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {currentFocusTask ? (
              <HoverTilt maxRotate={1.5} scale={1.01}>
                <motion.div
                  key={currentFocusTask.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-floating light-edge-top rounded-2xl p-6 space-y-5 relative h-full"
                >
                  {/* Critical indicator banner inside task card */}
                  {schedule.criticalPathIds.includes(currentFocusTask.id) && (
                    <div className="absolute top-4 right-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      CRITICAL ZERO-SLACK
                    </div>
                  )}

                  <div className="space-y-2 pr-20">
                    <h3 className="text-base font-bold text-zinc-100 tracking-tight leading-snug">
                      {currentFocusTask.baseData?.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                      {currentFocusTask.baseData?.description}
                    </p>
                  </div>

                  {/* Next Up indicator inside Left Panel */}
                  {nextUpTask && (
                    <div className="pt-4 border-t border-zinc-950 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span className="uppercase font-bold text-zinc-600">Up Next:</span>
                      <span className="text-zinc-400 truncate max-w-[200px] font-sans font-semibold">
                        {nextUpTask.baseData?.title}
                      </span>
                    </div>
                  )}

                  {/* Giant Check button to mark completed */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleTaskComplete(currentFocusTask.id)}
                    className="w-full py-3.5 btn-material-primary rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                    <span>Mark This Task Completed</span>
                  </motion.button>

                </motion.div>
              </HoverTilt>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 rounded-2xl border border-dashed border-zinc-800/40 glass-card text-center space-y-3"
              >
                <Compass className="w-6 h-6 text-indigo-400 mx-auto animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-300">No active tasks unlocked</h4>
                  <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">
                    All current sequencing dependencies have been completed. Check the workspace DAG to unlock future task routes.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversational AI Coach */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/10 flex items-start gap-3"
          >
            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">Execution Intelligence Coach</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-medium">
                The workspace has been minimized to isolate today's active task. This structural reduction removes peripheral distraction. Mark this task complete to unlock downstream dependencies.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Hand: Minimal Serene Pomodoro surround by Completion Ring */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, x: 15 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="md:col-span-2 flex flex-col items-center justify-center space-y-6 md:border-l border-zinc-950 md:pl-10"
        >
          
          <div className="relative flex items-center justify-center w-48 h-48">
            
            {/* Visual SVG Progress Ring representing Completed Steps ratio */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="72"
                fill="transparent"
                stroke="#0b0b0d"
                strokeWidth="4"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="72"
                fill="transparent"
                stroke="url(#focusProgressGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 72}
                initial={{ strokeDashoffset: 2 * Math.PI * 72 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 72 * (1 - progressPct / 100) }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="focusProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Breathing Ambient Orb inside Ring */}
            <motion.div
              animate={{
                scale: isTimerRunning ? [1, 1.08, 1] : 1,
                opacity: isTimerRunning ? [0.02, 0.05, 0.02] : 0.02
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-36 h-36 bg-indigo-500 rounded-full blur-xl"
            />

            {/* Timer Displays */}
            <div className="absolute flex flex-col items-center justify-center space-y-1">
              <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase">
                {isTimerRunning ? 'FOCUS ACTIVE' : 'FOCUS PAUSED'}
              </span>
              <span className="text-3xl font-extrabold tracking-widest text-zinc-100 font-mono">
                {formatTimer()}
              </span>
              <span className="text-[9px] text-indigo-400 font-mono font-medium">
                {progressPct}% Secured
              </span>
            </div>

          </div>

          {/* Calming Timer Control triggers */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-900 text-zinc-300 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5 text-zinc-500" /> : <Play className="w-3.5 h-3.5 text-zinc-500" />}
              <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetTimer}
              className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-900 text-zinc-500 hover:text-zinc-300 rounded-lg transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </motion.button>
          </div>

        </motion.div>

      </div>

      {/* Footer Metrics Overview */}
      <motion.footer 
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } }
        }}
        className="border-t border-zinc-950 pt-4 z-10 max-w-4xl w-full mx-auto flex items-center justify-between text-[10px] text-zinc-600 font-mono"
      >
        <div className="flex items-center gap-2">
          <span>TASK CAPACITY:</span>
          <span className="text-zinc-400 font-bold">{completedCount} OF {totalCount} STEP(S) COMPLETED</span>
        </div>
        <span>SILENT WORKSPACE ACTIVE</span>
      </motion.footer>
    </motion.div>
  );
};
