import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { 
  AlertCircle, 
  ShieldAlert, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Compass,
  CornerDownRight,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const end = Math.round(value);
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const duration = 0.8;
    const totalFrames = 30;
    const increment = (end - start) / totalFrames;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      start += increment;
      if (frame >= totalFrames) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(start));
      }
    }, (duration * 1000) / totalFrames);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
};

interface AIIntelligenceProps {
  selectedNodeId?: string | null;
  onSelectNode?: (id: string | null) => void;
}

export const AIIntelligence: React.FC<AIIntelligenceProps> = ({ selectedNodeId, onSelectNode }) => {
  const { 
    proposal, 
    feasibility: rawFeasibility, 
    schedule: rawSchedule, 
    bottlenecks: rawBottlenecks, 
    graph: rawGraph, 
    completedTaskIds, 
    toggleTaskComplete,
    isFocusMode, 
    simulatedResult 
  } = useDashboardStore();

  const graph = simulatedResult ? simulatedResult.simulatedPlan.roadmap.graph : rawGraph;
  const schedule = simulatedResult ? simulatedResult.simulatedPlan.roadmap.schedule : rawSchedule;
  const feasibility = simulatedResult ? simulatedResult.simulatedPlan.analysis.feasibility : rawFeasibility;
  const bottlenecks = simulatedResult ? simulatedResult.simulatedPlan.analysis.bottlenecks : rawBottlenecks;

  const workNodes = React.useMemo(() => {
    if (!graph) return [];
    return graph.nodes.filter(n => n.type === 'STANDARD' || n.type === 'MILESTONE');
  }, [graph]);

  const getIsNodeCompleted = React.useCallback((nodeId: string): boolean => {
    const node = graph?.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    
    if (node.type === 'STANDARD') {
      return completedTaskIds.includes(nodeId);
    }
    
    if (node.type === 'MILESTONE') {
      if (!graph) return false;
      const parentEdges = graph.edges.filter(e => e.targetId === nodeId);
      if (parentEdges.length === 0) return true;
      return parentEdges.every(edge => getIsNodeCompleted(edge.sourceId));
    }
    
    return false;
  }, [graph, completedTaskIds]);

  const getIsExecutable = React.useCallback((nodeId: string) => {
    if (!graph) return false;
    const parentEdges = graph.edges.filter(e => e.targetId === nodeId);
    if (parentEdges.length === 0) return true;
    
    return parentEdges.every(edge => {
      const parentNode = graph.nodes.find(n => n.id === edge.sourceId);
      if (!parentNode) return true;
      if (parentNode.type === 'VIRTUAL_SOURCE') return true;
      return completedTaskIds.includes(parentNode.id);
    });
  }, [graph, completedTaskIds]);

  const executableNodes = React.useMemo(() => {
    return workNodes.filter(n => !completedTaskIds.includes(n.id) && getIsExecutable(n.id) && n.type === 'STANDARD');
  }, [workNodes, completedTaskIds, getIsExecutable]);

  const recommendedTaskNode = React.useMemo(() => {
    return executableNodes.find(n => schedule?.criticalPathIds.includes(n.id)) || executableNodes[0];
  }, [executableNodes, schedule]);

  // If no proposal or feasibility, show beautiful await state
  if (!proposal || !feasibility || !graph || !schedule) {
    return (
      <div className="flex flex-col h-full py-12 px-6 justify-center items-center text-center font-sans space-y-6 bg-[#08080a]">
        <div className="relative flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute h-16 w-16 border border-dashed border-zinc-800/60 rounded-full"
          />
          <div className="p-3 bg-[#0c0c0d] border border-zinc-800/40 rounded-2xl text-zinc-500 relative z-10 shadow-sm">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-200">
            Awaiting Command Formulation
          </h3>
          <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
            Specify a mission scope and execute the pipeline to generate advanced topological intelligence metrics.
          </p>
        </div>
      </div>
    );
  }

  // Active Task Focus Selection
  const activeTaskNode = selectedNodeId 
    ? graph.nodes.find(n => n.id === selectedNodeId)
    : recommendedTaskNode;

  const activeCpm = activeTaskNode
    ? schedule.cpmResults.find(r => r.nodeId === activeTaskNode.id)
    : null;

  const activeBottleneck = activeTaskNode && bottlenecks
    ? bottlenecks.bottleneckNodes.find(b => b.nodeId === activeTaskNode.id)
    : null;

  // Find overall bottleneck title
  const mainBottleneckNode = bottlenecks && bottlenecks.bottleneckNodes.length > 0
    ? graph.nodes.find(n => n.id === bottlenecks.bottleneckNodes[0].nodeId)
    : null;

  const isCompleted = activeTaskNode ? getIsNodeCompleted(activeTaskNode.id) : false;
  const isExecutable = activeTaskNode ? getIsExecutable(activeTaskNode.id) : false;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
      }}
      className="p-5 space-y-6 font-sans select-none bg-[#08080a] h-full flex flex-col justify-between overflow-y-auto"
    >
      
      {/* SECTION 1: HEADER & FOCUS CARD */}
      <div className="space-y-6">
        
        {/* Title Indicator */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: -5 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
          }}
          className="pb-3 border-b border-zinc-900 flex items-center justify-between"
        >
          <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
            Mission Overview
          </h2>
          <span className="text-[9px] text-indigo-400 font-mono tracking-wider">INTELLIGENCE</span>
        </motion.div>
 
        {/* Dynamic Highlighted Task Card */}
        {activeTaskNode ? (
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="bg-gradient-to-br from-[#0c0c0d] via-[#09090b] to-[#070709] border border-zinc-850 rounded-xl p-5 space-y-4 shadow-sm relative overflow-hidden"
          >
            
            {/* Context/Focus Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/5 border border-indigo-500/15 px-2 py-0.5 rounded">
                {selectedNodeId ? 'Selected Focus' : 'Next Priority'}
              </span>
              {selectedNodeId && (
                <motion.button 
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectNode?.(null)}
                  className="text-[9px] text-zinc-500 hover:text-zinc-300 transition-colors font-mono uppercase bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 cursor-pointer"
                >
                  Clear Selection
                </motion.button>
              )}
            </div>
 
            {/* Task Name & Description */}
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-zinc-100 tracking-tight leading-snug">
                {activeTaskNode.baseData?.title || (activeTaskNode.type === 'VIRTUAL_SOURCE' ? 'Start Anchor' : 'End Anchor')}
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {activeTaskNode.baseData?.description || 'Virtual topological anchor node for mathematical CPM computation.'}
              </p>
            </div>
 
            {/* Micro Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1 font-mono text-[9px] text-zinc-400">
              <div className="bg-[#070709] border border-zinc-900 rounded-lg p-2.5 space-y-0.5">
                <span className="text-zinc-500 text-[8px] uppercase tracking-wider block">Duration</span>
                <span className="font-bold text-zinc-200">
                  {activeCpm ? (
                    <AnimatedCounter value={activeCpm.pertDuration} suffix=" Days" />
                  ) : 'N/A'}
                </span>
              </div>
              <div className="bg-[#070709] border border-zinc-900 rounded-lg p-2.5 space-y-0.5">
                <span className="text-zinc-500 text-[8px] uppercase tracking-wider block">Critical Path</span>
                <span className={`font-bold ${activeCpm?.isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeCpm?.isCritical ? 'Yes (Zero Slack)' : 'No (Flexible)'}
                </span>
              </div>
            </div>
 
            {/* Why This Task Matters (Dynamic Explanation) */}
            <div className="space-y-1 pt-1.5 border-t border-zinc-900">
              <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-widest font-mono block">Why This Matters</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-medium">
                {activeCpm?.isCritical 
                  ? "Sits directly on the zero-slack critical path. Any disruption here will cause an immediate, day-for-day delay on the target deadline."
                  : `Possesses a flexible timing buffer of ${activeCpm?.totalFloat.toFixed(1)} days. Execution can shift within this window without delaying downstream milestones.`}
              </p>
            </div>
 
            {/* Dynamic Action Trigger / Next Move */}
            <div className="pt-2">
              {activeTaskNode.type === 'STANDARD' && (
                <div className="space-y-2">
                  {isCompleted ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium justify-center font-sans"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Task Completed Successfully</span>
                    </motion.div>
                  ) : isExecutable ? (
                    <motion.button
                      whileHover={{ 
                        y: -1.5, 
                        scale: 1.01,
                        boxShadow: "0 8px 20px -6px rgba(255,255,255,0.08)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleTaskComplete(activeTaskNode.id)}
                      className="w-full py-3 bg-zinc-100 hover:bg-white text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-sans active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>Mark Objective Completed</span>
                    </motion.button>
                  ) : (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Prerequisites Locked</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                        Resolve preceding tasks in the network graph before marking this task as active.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
 
          </motion.div>
        ) : (
          <div className="bg-[#0c0c0d] border border-zinc-900 rounded-xl p-5 text-center text-zinc-500 text-[11px] font-sans">
            No active tasks remain in this pipeline.
          </div>
        )}
 
        {/* SECTION 2: CLEAN INTEGRITY METRICS */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="bg-gradient-to-br from-[#0c0c0d] via-[#09090b] to-[#070709] border border-zinc-850 rounded-xl p-5 space-y-4 shadow-sm"
        >
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
            Mission Integrity
          </h3>
 
          <div className="space-y-3 font-sans text-xs">
            {/* Health Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">Prerequisite Feasibility</span>
                <span className="font-mono text-zinc-300 font-semibold">
                  <AnimatedCounter value={feasibility.score * 100} suffix="%" />
                </span>
              </div>
              <div className="h-[4px] bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${feasibility.score * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>
 
            {/* AI Fit */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">AI Alignment Accuracy</span>
                <span className="font-mono text-indigo-400 font-semibold">
                  <AnimatedCounter value={proposal.plannerConfidence * 100} suffix="%" />
                </span>
              </div>
              <div className="h-[4px] bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${proposal.plannerConfidence * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                  className="h-full bg-indigo-500" 
                />
              </div>
            </div>
 
            {/* Top Bottleneck Task */}
            {mainBottleneckNode && (
              <div className="pt-3.5 border-t border-zinc-900 space-y-1.5">
                <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-widest font-mono block">Biggest Risk</span>
                <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                  <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="truncate font-semibold">{mainBottleneckNode.baseData?.title || 'Sequence bottleneck'}</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Controls <strong className="text-zinc-400 font-normal">{bottlenecks.bottleneckNodes[0].fanOut}</strong> downstream dependents. Delaying this node risks cascading delays.
                </p>
              </div>
            )}
          </div>
        </motion.div>
 
      </div>
 
      {/* FOOTER METADATA */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } }
        }}
        className="pt-4 border-t border-zinc-900 flex justify-between items-center text-[9px] font-mono text-zinc-600"
      >
        <span>SCHEDULER: CPM VERIFIED</span>
        <span>REASONER: V4</span>
      </motion.div>
 
    </motion.div>
  );
};
