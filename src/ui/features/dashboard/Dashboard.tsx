import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboardStore } from '../../state/useDashboardStore';
import { usePipeline } from '../../hooks/usePipeline';

// Components
import { MissionIntake } from './components/MissionIntake';
import { MissionBriefing } from './components/MissionBriefing';
import { FocusMode } from './components/FocusMode';
import { MissionComplete } from './components/MissionComplete';
import { CinematicLoader } from './components/CinematicLoader';
import { ExecutionOverview } from './components/ExecutionOverview';
import { MissionControl } from './components/MissionControl';
import { AIIntelligence } from './components/AIIntelligence';
import { AICognitiveLabs } from './components/AICognitiveLabs';
import { ErrorPanel } from './components/ErrorPanel';
import { DemoFallbackModal } from './components/DemoFallbackModal';


// Icons
import { Columns, Compass, Cpu, Target, Eye, EyeOff } from 'lucide-react';

// Subtle breathing gradient mesh background
type HealthState = 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'COMPLETE';

interface BackgroundGlowProps {
  mousePos: { x: number; y: number };
  health: HealthState;
}

function BackgroundGlow({ mousePos, health }: BackgroundGlowProps) {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  // Check for prefers-reduced-motion to maintain standard compliance
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const particles = React.useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 18 + Math.random() * 15,
      delay: Math.random() * 4,
      rangeX: Math.random() * 24 - 12,
      rangeY: -Math.random() * 40 - 20,
    }));
  }, []);

  // Multipliers for subtle parallax depth levels
  const depthMultiplierGrid = reducedMotion ? 0 : 6;
  const depthMultiplierL1 = reducedMotion ? 0 : -25;
  const depthMultiplierL2 = reducedMotion ? 0 : 20;
  const depthMultiplierL3 = reducedMotion ? 0 : -12;

  // Determine ambient light colors depending on HealthState
  const colors = React.useMemo(() => {
    return {
      c1: 'bg-zinc-700',
      c2: 'bg-zinc-800',
      c3: 'bg-slate-800',
      op1: 0.02, op2: 0.02, op3: 0.01
    };
  }, [health]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* 1. Ambient Radial Light (Deep blurs with mouse parallax offsets) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.9],
          x: [0, 40, -20],
          y: [0, -30, 20],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `translate3d(${mousePos.x * depthMultiplierL1}px, ${mousePos.y * depthMultiplierL1}px, 0)`,
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: colors.op1,
        }}
        className={`absolute top-[-10%] left-[10%] w-[700px] h-[700px] rounded-full blur-[140px] transition-all duration-1000 ${colors.c1}`}
      />
      
      <motion.div
        animate={{
          scale: [1, 0.9, 1.1],
          x: [0, -40, 30],
          y: [0, 30, -30],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `translate3d(${mousePos.x * depthMultiplierL2}px, ${mousePos.y * depthMultiplierL2}px, 0)`,
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: colors.op2,
        }}
        className={`absolute bottom-[-10%] right-[10%] w-[650px] h-[650px] rounded-full blur-[130px] transition-all duration-1000 ${colors.c2}`}
      />

      <motion.div
        animate={{
          scale: [0.95, 1.1, 0.95],
          x: [15, -15, 0],
          y: [-15, 20, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `translate3d(${mousePos.x * depthMultiplierL3}px, ${mousePos.y * depthMultiplierL3}px, 0)`,
          transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: colors.op3,
        }}
        className={`absolute top-[35%] left-[30%] w-[500px] h-[500px] rounded-full blur-[150px] transition-all duration-1000 ${colors.c3}`}
      />

      {/* Deep Crimson Active Edge Glow for CRITICAL stage */}
      {health === 'CRITICAL' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 border-[3px] border-rose-500/10 rounded-none shadow-[inset_0_0_80px_rgba(244,63,94,0.12)] z-10 pointer-events-none"
        />
      )}

      {/* 2. Slow Animated Subtle Grid (Reacts subtly to mouse movement) */}
      <motion.div 
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px"],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transform: `translate3d(${mousePos.x * depthMultiplierGrid}px, ${mousePos.y * depthMultiplierGrid}px, 0)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"
      />

      {/* 3. Soft Realistic Film Grain Noise (SVG Filter) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.012] pointer-events-none mix-blend-overlay">
        <filter id="grainNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainNoise)" />
      </svg>

      {/* 4. Tiny Floating Particles (With slight parallax lag) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${health === 'CRITICAL' ? 'bg-rose-400/20' : health === 'AT_RISK' ? 'bg-amber-400/20' : 'bg-indigo-400/20'}`}
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            transform: `translate3d(${mousePos.x * (depthMultiplierL3 * 0.5)}px, ${mousePos.y * (depthMultiplierL3 * 0.5)}px, 0)`,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          animate={{
            x: [0, p.rangeX, 0],
            y: [0, p.rangeY, 0],
            opacity: [0.1, 0.35, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export function Dashboard() {
  const { 
    goal, 
    error, 
    experienceStage, 
    setExperienceStage,
    proposal,
    graph,
    schedule,
    feasibility,
    confidence,
    bottlenecks,
    simulatedResult,
    setSimulatedResult,
    completedTaskIds
  } = useDashboardStore();

  const { mutate } = usePipeline();
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

  // Sidebar collapse states for Workspace layout
  const [isLeftCollapsed, setIsLeftCollapsed] = React.useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = React.useState(false);

  // Mouse coordinate tracking for Living Background Parallax depth
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  // 12. DYNAMIC HEALTH SYSTEM COMMUNICATING PROJECT HEALTH DETECTED FROM THE SCHEDULE DAG
  const healthState = React.useMemo<HealthState>(() => {
    if (experienceStage === 'MISSION_COMPLETE') return 'COMPLETE';
    if (!schedule || !graph) return 'HEALTHY';
    
    // Total executable tasks excluding virtual ones
    const totalNodes = graph.nodes.filter(n => n.type !== 'VIRTUAL_SOURCE' && n.type !== 'VIRTUAL_SINK');
    const remainingNodes = totalNodes.filter(n => !completedTaskIds.includes(n.id));
    
    // Remaining critical tasks
    const remainingCritical = remainingNodes.filter(n => schedule.criticalPathIds.includes(n.id));
    
    // Risk triggers
    if (remainingCritical.length > 3) {
      return 'CRITICAL'; // Deep crimson edge glow (uncompleted critical path items)
    } else if (remainingCritical.length > 0 || (bottlenecks?.bottleneckNodes?.length ?? 0) > 1) {
      return 'AT_RISK'; // Amber ambient lighting (approaching critical stages or bottleneck exists)
    }
    
    return 'HEALTHY'; // Soft emerald ambient lighting (campaign on track)
  }, [experienceStage, schedule, graph, completedTaskIds, bottlenecks]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -0.5 to 0.5 coordinate bounds
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGenerate = () => {
    setSelectedNodeId(null);
    setExperienceStage('AI_ANALYSIS');
    mutate(goal);
  };

  // Floating Navigation Bar for active workspace stages
  const renderFloatingNav = () => {
    return (
      <div className="flex items-center justify-center pt-6 pb-3 z-40 relative bg-[#070709]/40 backdrop-blur-xl border-b border-zinc-900/40">
        <div className="flex items-center gap-1.5 p-1.5 bg-[#0b0b0f]/50 border border-white/5 rounded-full shadow-2xl backdrop-blur-lg relative">
          {[
            { stage: 'EXECUTION_WORKSPACE', label: 'Campaign DAG', icon: Target },
            { stage: 'OPTIMIZATION_LAB', label: 'Optimization Lab', icon: Cpu },
            { stage: 'FOCUS_MODE', label: 'Focus Chamber', icon: Compass }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = experienceStage === item.stage;
            return (
              <button
                key={item.stage}
                onClick={() => setExperienceStage(item.stage as any)}
                className={`relative px-4 py-2 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5 z-10 ${
                  isActive ? 'text-black font-bold font-sans' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFloatingTabIndicator"
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 relative overflow-hidden select-none">
      {/* Background system that subtly breathes and communicates project health */}
      <BackgroundGlow mousePos={mousePos} health={experienceStage === 'EXECUTION_WORKSPACE' || experienceStage === 'OPTIMIZATION_LAB' ? 'HEALTHY' : healthState} />

      <AnimatePresence mode="wait">
        {experienceStage === 'MISSION_INTAKE' && (
          <motion.div
            key="MISSION_INTAKE"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <MissionIntake onGenerate={handleGenerate} />
          </motion.div>
        )}

        {experienceStage === 'AI_ANALYSIS' && (
          <motion.div
            key="AI_ANALYSIS"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <CinematicLoader onComplete={() => setExperienceStage('MISSION_BRIEFING')} />
          </motion.div>
        )}

        {experienceStage === 'MISSION_BRIEFING' && (
          <motion.div
            key="MISSION_BRIEFING"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <MissionBriefing />
          </motion.div>
        )}

        {experienceStage === 'FOCUS_MODE' && (
          <motion.div
            key="FOCUS_MODE"
            initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.96 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.04 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <FocusMode />
          </motion.div>
        )}

        {experienceStage === 'MISSION_COMPLETE' && (
          <motion.div
            key="MISSION_COMPLETE"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <MissionComplete />
          </motion.div>
        )}

        {(experienceStage === 'EXECUTION_WORKSPACE' || experienceStage === 'OPTIMIZATION_LAB') && (
          <motion.div
            key="WORKSPACE_OR_LAB"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen bg-transparent text-gray-100 flex flex-col overflow-x-hidden relative"
          >
            {renderFloatingNav()}
            
            {experienceStage === 'OPTIMIZATION_LAB' ? (
              <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6 relative z-10">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono bg-indigo-500/5 border border-indigo-500/15 px-2.5 py-1 rounded">
                    Simulation Sandbox
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                    Cognitive Simulation & Optimization Lab
                  </h1>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Run hypothetical schedule delays, evaluate trade-offs, and run AI scenario modeling to optimize critical path floats.
                  </p>
                </div>

                <AICognitiveLabs
                  proposal={proposal}
                  rawGraph={graph}
                  rawSchedule={schedule}
                  rawFeasibility={feasibility}
                  rawConfidence={confidence}
                  rawBottlenecks={bottlenecks}
                  simulatedResult={simulatedResult}
                  onSetSimulatedResult={setSimulatedResult}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col relative z-10 w-full">
                <main className="flex-1 px-6 py-6 space-y-4">
                  {error && <ErrorPanel />}
                  <ExecutionOverview selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
                </main>
              </div>
            )}
            {error && <DemoFallbackModal onRetry={handleGenerate} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
