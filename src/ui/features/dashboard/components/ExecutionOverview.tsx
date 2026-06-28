import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { samplePlannerProposal, sampleExecutionPlan } from '../../../../demo';
import { AICognitiveLabs } from './AICognitiveLabs';
import { 
  Network, 
  Calendar, 
  Cpu, 
  GitBranch, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  Zap, 
  HelpCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  Check,
  Lock,
  Play,
  AlertTriangle,
  Flame,
  Layers,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Handle, 
  Position, 
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  MiniMap
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

// ---------------------------------------------------------
// ---------------------------------------------------------
// Redesigned Custom React Flow Node Component (Breathtaking Execution Map Card)
// ---------------------------------------------------------
const ExecutionNodeComponent: React.FC<{ data: any; selected?: boolean }> = ({ data, selected }) => {
  const isCritical = data.isCritical;
  const isCompleted = data.isCompleted;
  const isExecutable = data.isExecutable;
  const isBlocked = data.isBlocked;
  const isBottleneck = data.isBottleneck;
  const fanOut = data.fanOut ?? 0;
  const dependencyRole = data.dependencyRole || 'NONE';
  
  const totalFloat = data.totalFloat ?? 0;

  // Choose glass styling based on status and focus/selection
  let bgClass = 'bg-[#0b0b0f]/60 backdrop-blur-xl border border-zinc-800/40 hover:border-zinc-700/60 shadow-2xl';
  let borderGlowClass = '';

  if (isCompleted) {
    bgClass = 'bg-emerald-950/20 backdrop-blur-xl border-emerald-500/30 shadow-[0_12px_36px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.03),0_0_15px_rgba(16,185,129,0.03)]';
  } else if (isCritical) {
    bgClass = 'bg-rose-950/25 backdrop-blur-xl border-rose-500/25 shadow-[0_12px_36px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.03),0_0_20px_rgba(244,63,94,0.05)]';
  } else if (isExecutable) {
    bgClass = 'bg-indigo-950/20 backdrop-blur-xl border-indigo-500/25 shadow-[0_12px_36px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.03),0_0_20px_rgba(99,102,241,0.05)]';
  }

  // Active highlighted/selected glows
  if (selected) {
    bgClass = 'bg-[#0d0d12]/75 backdrop-blur-2xl border-indigo-400 ring-1 ring-indigo-400/20 shadow-[0_15px_45px_rgba(99,102,241,0.22)]';
    borderGlowClass = 'shadow-[0_0_25px_rgba(99,102,241,0.15)]';
  } else if (dependencyRole === 'SELF') {
    bgClass = 'bg-[#0d0d12]/75 backdrop-blur-2xl border-indigo-400 ring-1 ring-indigo-400/15 shadow-[0_15px_45px_rgba(99,102,241,0.18)]';
  } else if (dependencyRole === 'PARENT') {
    bgClass = 'bg-indigo-950/20 backdrop-blur-xl border-indigo-400/30 shadow-2xl';
  } else if (dependencyRole === 'CHILD') {
    bgClass = 'bg-purple-950/15 backdrop-blur-xl border-purple-400/30 shadow-2xl';
  }

  // Choose visual side-accent color and shadow glow based on status
  let accentBar = 'bg-zinc-700';
  let accentGlow = '';
  if (isCompleted) {
    accentBar = 'bg-emerald-400';
    accentGlow = 'shadow-[0_0_12px_rgba(16,185,129,0.5)]';
  } else if (isCritical) {
    accentBar = 'bg-rose-500';
    accentGlow = 'shadow-[0_0_12px_rgba(244,63,94,0.5)]';
  } else if (isExecutable) {
    accentBar = 'bg-indigo-400';
    accentGlow = 'shadow-[0_0_12px_rgba(99,102,241,0.5)]';
  } else if (isBlocked) {
    accentBar = 'bg-zinc-800';
  }

  const isVirtual = data.type === 'VIRTUAL_SOURCE' || data.type === 'VIRTUAL_SINK';
  
  if (isVirtual) {
    const isStart = data.type === 'VIRTUAL_SOURCE';
    return (
      <motion.div 
        animate={selected ? {
          scale: 1.05,
          boxShadow: isStart 
            ? "0 0 20px rgba(99, 102, 241, 0.25)" 
            : "0 0 20px rgba(139, 92, 246, 0.25)",
        } : { scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={`px-5 py-3 rounded-full border bg-[#0b0b0f]/95 backdrop-blur-md text-center flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${
          isStart 
            ? 'border-indigo-500/30 hover:border-indigo-500/60' 
            : 'border-purple-500/30 hover:border-purple-500/60'
        } ${selected ? 'border-opacity-100 ring-1 ring-zinc-800' : ''}`}
      >
        <Handle 
          type={isStart ? 'source' : 'target'} 
          position={isStart ? Position.Right : Position.Left} 
          style={{ opacity: 0 }} 
        />
        <div className={`w-2 h-2 rounded-full relative ${
          isStart ? 'bg-indigo-400' : 'bg-purple-400'
        }`}>
          {isStart && <span className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-75" />}
        </div>
        <span className="text-[10px] font-extrabold tracking-widest font-mono text-zinc-300">
          {isStart ? 'START_ANCHOR' : 'END_ANCHOR'}
        </span>
      </motion.div>
    );
  }

  const formattedDuration = data.duration % 1 === 0 ? data.duration : Number(data.duration.toFixed(1));
  const roundedES = data.earlyStart % 1 === 0 ? data.earlyStart : Number(data.earlyStart.toFixed(1));
  const roundedEF = data.earlyFinish % 1 === 0 ? data.earlyFinish : Number(data.earlyFinish.toFixed(1));
  const roundedFloat = totalFloat % 1 === 0 ? totalFloat : Number(totalFloat.toFixed(1));

  // Determine status display label and icon
  let statusBadge = null;
  if (isCompleted) {
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono tracking-wider">
        <Check className="w-2.5 h-2.5" /> COMPLETED
      </span>
    );
  } else if (isCritical) {
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono tracking-wider animate-pulse">
        <Flame className="w-2.5 h-2.5" /> CRITICAL
      </span>
    );
  } else if (isExecutable) {
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono tracking-wider">
        <Play className="w-2.5 h-2.5 fill-indigo-400/20" /> READY
      </span>
    );
  } else {
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-zinc-800/20 text-zinc-500 border border-zinc-800/30 font-mono tracking-wider">
        <Lock className="w-2.5 h-2.5" /> BLOCKED
      </span>
    );
  }

  return (
    <motion.div 
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } 
      }}
      tabIndex={0}
      aria-label={`${data.title}, ${data.type === 'MILESTONE' ? 'Milestone' : 'Task'}, Duration: ${formattedDuration} days`}
      className={`w-[270px] rounded-xl relative ${bgClass} ${borderGlowClass} transition-all duration-300 cursor-pointer overflow-hidden group select-none`}
    >
      {/* Target handle on left */}
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      
      {/* Side Color Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${accentBar} ${accentGlow}`} />
      
      {/* Node Body */}
      <div className="p-4 pl-5 space-y-3">
        {/* Row 1: Status & Type Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-500 tracking-wider font-mono">
              {data.type === 'MILESTONE' ? '🏁 MILESTONE' : '📦 WORK_NODE'}
            </span>
          </div>
          {statusBadge}
        </div>
        
        {/* Row 2: Title with precise line-height and typography */}
        <div className="space-y-1">
          <h4 className="text-[13px] font-bold text-zinc-100 tracking-tight leading-snug group-hover:text-white transition-colors line-clamp-2">
            {data.title}
          </h4>
          
          {/* Dynamic dependency path role label */}
          {dependencyRole !== 'NONE' && (
            <span className={`text-[8px] font-mono font-bold tracking-wider uppercase block ${
              dependencyRole === 'SELF' ? 'text-indigo-400' :
              dependencyRole === 'PARENT' ? 'text-cyan-400' : 'text-purple-400'
            }`}>
              {dependencyRole === 'SELF' ? '✦ Focused Work Unit' :
               dependencyRole === 'PARENT' ? '✦ Direct Prerequisite' : '✦ Downstream Dependent'}
            </span>
          )}
        </div>

        {/* Dynamic Bottleneck / Risk Warning Banner */}
        {isBottleneck && !isCompleted && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-start gap-1.5 text-amber-400 text-[9px] font-sans font-medium leading-normal animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
            <div>
              <span className="font-bold uppercase tracking-wider block font-mono">High Risk Bottleneck</span>
              Blocks <strong className="text-amber-300 font-bold">{fanOut}</strong> downstream dependents.
            </div>
          </div>
        )}

        {/* Row 3: Completion Progress bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
            <span>COMPLETION_INDEX</span>
            <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
              {isCompleted ? '100%' : '0%'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-900/60 rounded-full overflow-hidden relative border border-zinc-800/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isCompleted ? '100%' : '0%' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isCompleted 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                  : 'bg-zinc-800'
              }`}
            />
          </div>
        </div>

        {/* Row 4: Temporal CPM Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/40 text-[9px] font-mono">
          <div className="space-y-0.5 text-zinc-500">
            <div>ES: <strong className="text-zinc-300 font-normal">{roundedES}d</strong></div>
            <div>EF: <strong className="text-zinc-300 font-normal">{roundedEF}d</strong></div>
          </div>
          
          <div className="text-right flex flex-col justify-between h-full">
            <div className="text-zinc-400 font-medium">
              <span className="text-zinc-500">Duration:</span> {formattedDuration}d
            </div>
            
            {isCritical ? (
              <span className="text-rose-400 font-bold tracking-wider text-[8px] uppercase">
                CRITICAL FLOAT
              </span>
            ) : (
              <span className="text-zinc-400">
                Slack: <strong className={totalFloat > 0 ? 'text-amber-400 font-bold' : 'text-zinc-400'}>{roundedFloat}d</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Source handle on right */}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </motion.div>
  );
};

// Register custom node component inside React Flow
const nodeTypes = {
  executionTask: ExecutionNodeComponent,
};

interface ExecutionOverviewProps {
  selectedNodeId?: string | null;
  onSelectNode?: (id: string | null) => void;
}

const ExecutionOverviewContent: React.FC<ExecutionOverviewProps> = ({ selectedNodeId, onSelectNode }) => {
  const { 
    goal, 
    proposal, 
    graph: rawGraph, 
    schedule: rawSchedule, 
    feasibility: rawFeasibility, 
    confidence: rawConfidence, 
    bottlenecks: rawBottlenecks, 
    isGenerating, 
    isDemo, 
    reset,
    completedTaskIds,
    toggleTaskComplete,
    isFocusMode,
    setIsFocusMode,
    simulatedResult,
    setSimulatedResult,
    setExperienceStage
  } = useDashboardStore();

  const graph = simulatedResult ? simulatedResult.simulatedPlan.roadmap.graph : rawGraph;
  const schedule = simulatedResult ? simulatedResult.simulatedPlan.roadmap.schedule : rawSchedule;
  const feasibility = simulatedResult ? simulatedResult.simulatedPlan.analysis.feasibility : rawFeasibility;
  const confidence = simulatedResult ? simulatedResult.simulatedPlan.analysis.confidence : rawConfidence;
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

  const completedCount = React.useMemo(() => {
    return workNodes.filter(n => getIsNodeCompleted(n.id)).length;
  }, [workNodes, getIsNodeCompleted]);

  const remainingCount = workNodes.length - completedCount;

  const progressPct = React.useMemo(() => {
    const standardNodes = workNodes.filter(n => n.type === 'STANDARD');
    const completedStandard = standardNodes.filter(n => getIsNodeCompleted(n.id)).length;
    return standardNodes.length > 0 ? Math.round((completedStandard / standardNodes.length) * 100) : 0;
  }, [workNodes, getIsNodeCompleted]);

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

  const recommendedTask = React.useMemo(() => {
    return executableNodes.find(n => schedule?.criticalPathIds.includes(n.id)) || executableNodes[0];
  }, [executableNodes, schedule]);

  const reactFlowInstance = useReactFlow();

  // Floating controls and MiniMap states
  const [isMiniMapOpen, setIsMiniMapOpen] = useState(true);

  // Hover state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Camera action handlers will be defined below nodePositions to avoid use-before-declaration issues

  // Progressive graph reveal stage-based timeline
  const [revealStage, setRevealStage] = useState<'canvas' | 'grid' | 'edges' | 'nodes' | 'critical' | 'sidebar' | 'settled'>('canvas');
  const [revealPercent, setRevealPercent] = React.useState(0);
  const [isGraphSettled, setIsGraphSettled] = React.useState(false);

  React.useEffect(() => {
    if (!graph) return;
    setRevealStage('canvas');
    setRevealPercent(0);
    setIsGraphSettled(false);

    // Timeline step sequence:
    const timers = [
      setTimeout(() => setRevealStage('grid'), 350),
      setTimeout(() => setRevealStage('edges'), 700),
      setTimeout(() => setRevealStage('nodes'), 1200),
      setTimeout(() => setRevealStage('critical'), 1900),
      setTimeout(() => setRevealStage('sidebar'), 2400),
      setTimeout(() => {
        setRevealStage('settled');
        setIsGraphSettled(true);
      }, 2950),
    ];

    // Node progressive ticker during the 'nodes' stage
    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setRevealPercent(current);
    }, 30);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [graph]);

  const isSidebarRevealed = ['sidebar', 'settled'].includes(revealStage);

  // Loading stages state for the active processing state
  const [loadingStage, setLoadingStage] = useState(0);
  const loadingStages = [
    { text: 'Deconstructing mission objectives...', detail: 'Extracting key objectives and implicit deliverables' },
    { text: 'Synthesizing task sequences...', detail: 'Generating dependency relationships and duration spans' },
    { text: 'Compiling directed acyclic graph...', detail: 'Validating topological constraints and cycle-free paths' },
    { text: 'Running deterministic CPM scheduling...', detail: 'Applying Critical Path Method algorithms to calculate float and slack' },
    { text: 'Isolating structural bottlenecks...', detail: 'Calculating fan-in/fan-out metrics and impact multipliers' },
    { text: 'Formulating preventive rescue strategies...', detail: 'Developing mitigation vectors for critical path deviations' }
  ];

  useEffect(() => {
    if (!isGenerating) {
      setLoadingStage(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Predecessors / Successors helper for hovered or selected nodes
  const connectedInfo = React.useMemo(() => {
    const activeId = hoveredNodeId || selectedNodeId;
    if (!activeId || !graph) return null;
    
    const predecessors = new Set<string>();
    const queuePred = [activeId];
    while (queuePred.length > 0) {
      const curr = queuePred.shift()!;
      graph.edges.forEach(e => {
        if (e.targetId === curr && !predecessors.has(e.sourceId)) {
          predecessors.add(e.sourceId);
          queuePred.push(e.sourceId);
        }
      });
    }

    const successors = new Set<string>();
    const queueSucc = [activeId];
    while (queueSucc.length > 0) {
      const curr = queueSucc.shift()!;
      graph.edges.forEach(e => {
        if (e.sourceId === curr && !successors.has(e.targetId)) {
          successors.add(e.targetId);
          queueSucc.push(e.targetId);
        }
      });
    }

    return { predecessors, successors };
  }, [hoveredNodeId, selectedNodeId, graph]);

  // Compute node layouts dynamically (Topological Layered Layout)
  const nodePositions = React.useMemo(() => {
    if (!graph) return {};
    
    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    graph.nodes.forEach(n => {
      adj[n.id] = [];
      inDegree[n.id] = 0;
    });

    graph.edges.forEach(e => {
      if (adj[e.sourceId]) adj[e.sourceId].push(e.targetId);
      if (inDegree[e.targetId] !== undefined) inDegree[e.targetId]++;
    });

    // Calculate topological ranks/layers
    const layers: Record<string, number> = {};
    const queue: string[] = [];

    // Roots (including VIRTUAL_SOURCE if present)
    graph.nodes.forEach(n => {
      if (inDegree[n.id] === 0) {
        layers[n.id] = 0;
        queue.push(n.id);
      }
    });

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const currLayer = layers[curr] || 0;

      (adj[curr] || []).forEach(succ => {
        const oldLayer = layers[succ] ?? -1;
        const newLayer = Math.max(oldLayer, currLayer + 1);
        layers[succ] = newLayer;

        inDegree[succ]--;
        if (inDegree[succ] === 0) {
          queue.push(succ);
        }
      });
    }

    // Default layers fallback for cyclic or unassigned components
    graph.nodes.forEach(n => {
      if (layers[n.id] === undefined) layers[n.id] = 0;
    });

    // Group nodes by layer
    const layerGroups: Record<number, string[]> = {};
    graph.nodes.forEach(n => {
      const l = layers[n.id];
      if (!layerGroups[l]) layerGroups[l] = [];
      layerGroups[l].push(n.id);
    });

    // Lay out coordinates left-to-right
    const positions: Record<string, { x: number; y: number }> = {};
    const HORIZONTAL_SPACING = 300;
    const VERTICAL_SPACING = 135;

    Object.entries(layerGroups).forEach(([layerStr, nodeIds]) => {
      const layer = parseInt(layerStr, 10);
      const count = nodeIds.length;
      nodeIds.forEach((id, index) => {
        const x = layer * HORIZONTAL_SPACING + 50;
        const y = (index - (count - 1) / 2) * VERTICAL_SPACING + 220;
        positions[id] = { x, y };
      });
    });

    return positions;
  }, [graph]);

  // Camera action handlers for floating controls
  const handleFitGraph = React.useCallback(() => {
    if (!reactFlowInstance) return;
    reactFlowInstance.fitView({ padding: 0.18, duration: 1000 });
  }, [reactFlowInstance]);

  const handleCenter = React.useCallback(() => {
    if (!reactFlowInstance || !graph) return;
    const positionsList = Object.values(nodePositions) as { x: number; y: number }[];
    if (positionsList.length === 0) return;
    const sumX = positionsList.reduce((sum, p) => sum + p.x, 0);
    const sumY = positionsList.reduce((sum, p) => sum + p.y, 0);
    const avgX = sumX / positionsList.length;
    const avgY = sumY / positionsList.length;
    reactFlowInstance.setCenter(avgX + 135, avgY + 80, { zoom: 0.72, duration: 1000 });
  }, [reactFlowInstance, graph, nodePositions]);

  const handleCenterCriticalPath = React.useCallback(() => {
    if (!reactFlowInstance || !graph || !schedule) return;
    const criticalNodes = graph.nodes.filter(n => schedule.criticalPathIds.includes(n.id));
    if (criticalNodes.length === 0) return;
    const firstCritical = criticalNodes[0];
    const pos = nodePositions[firstCritical.id] as { x: number; y: number } | undefined;
    if (pos) {
      reactFlowInstance.setCenter(pos.x + 135, pos.y + 80, { zoom: 0.82, duration: 1000 });
      onSelectNode?.(firstCritical.id);
    }
  }, [reactFlowInstance, graph, schedule, nodePositions, onSelectNode]);

  const handleCenterTodayTask = React.useCallback(() => {
    if (!reactFlowInstance || !recommendedTask) return;
    const pos = nodePositions[recommendedTask.id] as { x: number; y: number } | undefined;
    if (pos) {
      reactFlowInstance.setCenter(pos.x + 135, pos.y + 80, { zoom: 0.82, duration: 1000 });
      onSelectNode?.(recommendedTask.id);
    }
  }, [reactFlowInstance, recommendedTask, nodePositions, onSelectNode]);

  const handleResetCamera = React.useCallback(() => {
    if (!reactFlowInstance) return;
    reactFlowInstance.fitView({ padding: 0.22, duration: 1000 });
    onSelectNode?.(null);
  }, [reactFlowInstance, onSelectNode]);

  // Camera fly-in / fit view on mount, select, and restore
  useEffect(() => {
    if (!reactFlowInstance || !graph) return;

    if (selectedNodeId) {
      // Node is selected: Ease toward it with intelligent zoom and breathing room
      const pos = nodePositions[selectedNodeId] as { x: number; y: number } | undefined;
      if (pos) {
        reactFlowInstance.setCenter(pos.x + 135, pos.y + 80, { zoom: 0.82, duration: 1000 });
      }
    } else {
      // Restore overview gently (on workspace entry or node deselect)
      const isFirstMount = revealStage === 'canvas' || revealStage === 'grid';
      const delay = isFirstMount ? 600 : 50;
      const duration = isFirstMount ? 1400 : 1000;
      
      const timer = setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.18, duration });
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [selectedNodeId, nodePositions, reactFlowInstance, graph]);

  // Construct React Flow nodes
  const flowNodes = React.useMemo(() => {
    if (!graph || !schedule) return [];

    return graph.nodes.map(n => {
      const cpm = schedule.cpmResults.find(r => r.nodeId === n.id);
      const isCritical = cpm?.isCritical || false;

      // Determine hover/select highlight/fade states
      const activeId = hoveredNodeId || selectedNodeId;
      let isDimmed = false;
      let isHighlighted = false;
      let dependencyRole: 'SELF' | 'PARENT' | 'CHILD' | 'NONE' = 'NONE';
      
      if (activeId && connectedInfo) {
        const isSelf = activeId === n.id;
        const isPred = connectedInfo.predecessors.has(n.id);
        const isSucc = connectedInfo.successors.has(n.id);
        isHighlighted = isSelf || isPred || isSucc;
        isDimmed = !isHighlighted;
        
        if (isSelf) dependencyRole = 'SELF';
        else if (isPred) dependencyRole = 'PARENT';
        else if (isSucc) dependencyRole = 'CHILD';
      }

      const pos = nodePositions[n.id] || { x: 0, y: 0 };
      const nodeIndex = graph.nodes.indexOf(n);
      const isNodeRevealed = 
        ['nodes', 'critical', 'sidebar', 'settled'].includes(revealStage) && 
        (nodeIndex / graph.nodes.length) * 100 <= revealPercent;

      const isCompleted = getIsNodeCompleted(n.id);
      const isExecutable = getIsExecutable(n.id);
      const isBlocked = n.type !== 'VIRTUAL_SOURCE' && n.type !== 'VIRTUAL_SINK' && !isCompleted && !isExecutable;
      const isBottleneck = bottlenecks?.bottleneckNodes.some(b => b.nodeId === n.id) || false;
      const fanOut = bottlenecks?.bottleneckNodes.find(b => b.nodeId === n.id)?.fanOut || 0;

      return {
        id: n.id,
        type: 'executionTask',
        position: pos,
        data: {
          id: n.id,
          type: n.type,
          title: n.baseData?.title || (n.type === 'VIRTUAL_SOURCE' ? 'Start Anchor' : 'End Anchor'),
          duration: cpm?.pertDuration ?? 0,
          earlyStart: cpm?.earlyStart ?? 0,
          earlyFinish: cpm?.earlyFinish ?? 0,
          lateStart: cpm?.lateStart ?? 0,
          lateFinish: cpm?.lateFinish ?? 0,
          totalFloat: cpm?.totalFloat ?? 0,
          isCritical,
          isCompleted,
          isExecutable,
          isBlocked,
          isBottleneck,
          fanOut,
          dependencyRole
        },
        style: {
          opacity: !isNodeRevealed ? 0 : isDimmed ? 0.15 : 1,
          transform: !isNodeRevealed ? 'scale(0.85)' : 'scale(1)',
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }
      };
    });
  }, [graph, schedule, nodePositions, hoveredNodeId, selectedNodeId, connectedInfo, revealStage, revealPercent, completedTaskIds, bottlenecks]);

  // Construct React Flow edges
  const flowEdges = React.useMemo(() => {
    if (!graph || !schedule) return [];

    return graph.edges.map(e => {
      const isSourceCritical = schedule.criticalPathIds.includes(e.sourceId);
      const isTargetCritical = schedule.criticalPathIds.includes(e.targetId);
      const isCriticalEdge = isSourceCritical && isTargetCritical;

      const isSourceCompleted = getIsNodeCompleted(e.sourceId);
      const isTargetCompleted = getIsNodeCompleted(e.targetId);
      const isCompletedEdge = isSourceCompleted && isTargetCompleted;

      // Determine hover/selected highlight state
      const activeId = hoveredNodeId || selectedNodeId;
      let isHighlighted = false;
      let isDimmed = false;
      if (activeId !== null && connectedInfo !== null) {
        const connectsActive = e.sourceId === activeId || e.targetId === activeId;
        const inPredecessors = connectedInfo.predecessors.has(e.sourceId) && (connectedInfo.predecessors.has(e.targetId) || e.targetId === activeId);
        const inSuccessors = connectedInfo.successors.has(e.targetId) && (connectedInfo.successors.has(e.sourceId) || e.sourceId === activeId);
        
        isHighlighted = connectsActive || inPredecessors || inSuccessors;
        isDimmed = !isHighlighted;
      }

      // Base styles
      let strokeColor = '#27272a'; // Thinner, cleaner default zinc border
      let strokeWidth = 1.2;
      let filterGlow = 'none';
      let animated = false;

      const isEdgesStage = ['edges', 'nodes', 'critical', 'sidebar', 'settled'].includes(revealStage);
      const isCriticalStage = ['critical', 'sidebar', 'settled'].includes(revealStage);
      
      let isEdgeRevealed = false;
      if (isEdgesStage) {
        if (isCriticalEdge) {
          isEdgeRevealed = isCriticalStage;
        } else {
          isEdgeRevealed = true;
        }
      }

      if (isCompletedEdge) {
        strokeColor = '#10b981'; // Completed: emerald green
        strokeWidth = 1.2; // Less harsh
        filterGlow = 'drop-shadow(0px 0px 3px rgba(16, 185, 129, 0.25))';
      } else if (isCriticalEdge) {
        strokeColor = isCriticalStage ? '#f43f5e' : '#27272a'; // Glowing Critical Rose
        strokeWidth = isCriticalStage ? 2.0 : 1.2;
        filterGlow = isCriticalStage ? 'drop-shadow(0px 0px 5px rgba(244, 63, 94, 0.35))' : 'none';
        animated = isCriticalStage;
      } else if (isHighlighted) {
        strokeColor = '#6366f1';
        strokeWidth = 1.5;
        animated = true;
      } else {
        animated = true; // Subtle edge flow for all edges
      }

      // If this edge is part of the highlighted active node chain, style it electric blue!
      if (isHighlighted) {
        strokeColor = '#6366f1'; // Indigo
        strokeWidth = 2.0;
        filterGlow = 'drop-shadow(0px 0px 4px rgba(99, 102, 241, 0.4))';
        animated = true;
      }

      const id = `${e.sourceId}-${e.targetId}`;

      let edgeOpacity = isDimmed ? 0.15 : 1;
      if (!isEdgeRevealed) {
        edgeOpacity = 0;
      }

      return {
        id,
        source: e.sourceId,
        target: e.targetId,
        animated,
        style: {
          stroke: strokeColor,
          strokeWidth,
          filter: filterGlow,
          opacity: edgeOpacity,
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.4s ease-in-out',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 16,
          height: 16,
        },
      };
    });
  }, [graph, schedule, hoveredNodeId, selectedNodeId, connectedInfo, revealStage, revealPercent, completedTaskIds]);

  // Predecessor / Dependent lists for the Inspector HUD
  const { directPredecessors, directSuccessors } = React.useMemo(() => {
    if (!selectedNodeId || !graph) return { directPredecessors: new Set<string>(), directSuccessors: new Set<string>() };
    const dp = new Set<string>();
    const ds = new Set<string>();
    graph.edges.forEach(e => {
      if (e.targetId === selectedNodeId) dp.add(e.sourceId);
      if (e.sourceId === selectedNodeId) ds.add(e.targetId);
    });
    return { directPredecessors: dp, directSuccessors: ds };
  }, [selectedNodeId, graph]);

  // Loading State
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] py-12 px-6 bg-surface/20 border border-border/40 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30" />
        
        {/* Animated radar/sonar sweep */}
        <div className="relative mb-12 flex items-center justify-center h-24 w-24">
          <motion.div 
            animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0.05, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-primary/20 border border-primary/30"
          />
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute h-16 w-16 rounded-full bg-primary/20 border border-primary/40"
          />
          <div className="relative h-10 w-10 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>

        <div className="text-center max-w-lg z-10 space-y-4">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            AI Engine Running
          </span>
          <h2 className="text-xl font-semibold text-gray-100 tracking-tight">
            Synthesizing Execution Plan
          </h2>
          <p className="text-sm text-gray-400 font-mono min-h-[20px]">
            {loadingStages[loadingStage].text}
          </p>
          <p className="text-xs text-gray-600 italic">
            {loadingStages[loadingStage].detail}
          </p>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="w-full max-w-md mt-10 space-y-3 z-10">
          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            <span>INTAKE</span>
            <span>GRAPH BUILD</span>
            <span>CPM CALC</span>
            <span>AUDIT</span>
          </div>
          <div className="h-1.5 w-full bg-background border border-border/40 rounded-full overflow-hidden p-[2px]">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-blue-500 to-accent rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-center">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
              {Math.round(((loadingStage + 1) / loadingStages.length) * 100)}% Complete
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Empty Onboarding State
  if (!proposal) {
    return (
      <div className="space-y-12 py-10 relative">
        {/* Subtle decorative grid/mesh glow in the background */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Welcoming Hero Area */}
        <div className="text-center space-y-6 max-w-2xl mx-auto relative z-10">
          <div className="inline-flex p-3.5 bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 mb-2 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.05)] animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-400">
            PathForge
          </h1>
          
          <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase font-mono">
            AI Mission Operating System
          </p>

          <div className="h-[1px] w-12 bg-indigo-500/25 mx-auto rounded-full" />
          
          <p className="text-xs text-zinc-400 leading-relaxed max-w-lg mx-auto font-sans">
            Standard static calendars let delivery dates slip. PathForge mathematically models generative AI plans as Directed Acyclic Graphs, running Critical Path Method validation to guarantee project feasibility.
          </p>

          {/* Core CTAs including the Explore Demo action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                const goalTextarea = document.getElementById('goal') as HTMLTextAreaElement;
                if (goalTextarea) {
                  goalTextarea.focus();
                }
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 active:scale-[0.98] text-zinc-300 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Define Mission Scope
            </button>
            <button
              onClick={() => {
                const { setError, setIsDemo, setIsCinematicLoading, setPipelineData } = useDashboardStore.getState();
                setError(null);
                setIsDemo(true);
                setPipelineData({
                  proposal: samplePlannerProposal,
                  graph: sampleExecutionPlan.roadmap.graph,
                  schedule: sampleExecutionPlan.roadmap.schedule,
                  feasibility: sampleExecutionPlan.analysis.feasibility,
                  confidence: sampleExecutionPlan.analysis.confidence,
                  bottlenecks: sampleExecutionPlan.analysis.bottlenecks
                });
                setIsCinematicLoading(true);
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-500/80 to-indigo-600/80 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/30 hover:border-indigo-500/50 text-white rounded-xl text-xs font-semibold tracking-wider transition-all shadow-lg shadow-indigo-500/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Demo Mission
            </button>
          </div>
        </div>

        {/* Modular Workflow Visualizer */}
        <div className="space-y-6">
          <h3 className="text-xs font-semibold text-zinc-400 text-center tracking-wide">
            How PathForge Secures Your Objectives
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card rounded-2xl p-6 group">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 w-fit mb-4 border border-indigo-500/20">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">
                1. Mission Synthesis
              </h4>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                Detail your project parameters and target deadlines. Gemini analyzes scope boundaries and outputs discrete, structured deliverables.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 group">
              <div className="p-2.5 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6] w-fit mb-4 border border-[#8b5cf6]/20">
                <GitBranch className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">
                2. Topological Graphing
              </h4>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                Deliverables are automatically constructed as an acyclic graph of interdependent milestones and tasks, preventing cycle-locking.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 group">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-4 border border-emerald-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">
                3. Mathematical Audit
              </h4>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                The deterministic engine runs CPM calculations over the topology, isolating critical path buffers and identifying hidden structural bottlenecks.
              </p>
            </div>
          </div>
        </div>

        {/* Guided Callout */}
        <div className="glass-elevated light-edge-top rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xs font-semibold text-zinc-200">
              Ready to safeguard your delivery date?
            </h4>
            <p className="text-[11px] text-zinc-500">
              Define your mission scope on the left panel and click "Generate Execution Plan".
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-indigo-400 uppercase tracking-wider animate-pulse">
            Awaiting Command Inputs
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  // Active Selected Node & Scheduling calculation details
  const selectedNode = selectedNodeId && graph
    ? graph.nodes.find(n => n.id === selectedNodeId)
    : null;
  const selectedCpm = selectedNodeId && schedule
    ? schedule.cpmResults.find(r => r.nodeId === selectedNodeId)
    : null;

  // 1. Mission Status Calculation
  const missionStatus = React.useMemo(() => {
    if (progressPct === 100) {
      return { 
        label: 'Mission Complete', 
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold', 
        dot: '🏆' 
      };
    }
    if (!feasibility) return { label: 'Neutral', color: 'text-zinc-400 bg-zinc-500/5 border-zinc-500/20', dot: '⚪' };
    switch (feasibility.scheduleHealth) {
      case 'ROBUST':
        return { label: 'On Track', color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20', dot: '🟢' };
      case 'FRAGILE':
        return { label: 'At Risk', color: 'text-amber-400 bg-amber-500/5 border-amber-500/20', dot: '🟡' };
      case 'UNFEASIBLE':
        return { color: 'text-rose-400 bg-rose-500/5 border-rose-500/20', label: 'Critical', dot: '🔴' };
      default:
        return { label: 'Neutral', color: 'text-zinc-400 bg-zinc-500/5 border-zinc-500/20', dot: '⚪' };
    }
  }, [feasibility, progressPct]);

  // Helper to format days cleanly without raw floating points
  const formatDaysClean = React.useMemo(() => {
    return (days: number): string => {
      if (days < 1) {
        const hours = Math.round(days * 24);
        return `${hours} Hour${hours !== 1 ? 's' : ''}`;
      }
      return `${Number(days.toFixed(1))} Day${days !== 1 ? 's' : ''}`;
    };
  }, []);

  // 2. Projected Completion
  const projectedCompletion = React.useMemo(() => {
    if (!schedule) return '0 Days';
    return formatDaysClean(schedule.projectDuration);
  }, [schedule, formatDaysClean]);

  // 3. Time Buffer Card
  const timeBuffer = React.useMemo(() => {
    if (!schedule || !feasibility) return { text: '0.0 Days', subtext: 'Buffer not calculated', isLate: false };
    const maxFloat = Math.max(...schedule.cpmResults.map(r => r.totalFloat), 0);
    const duration = schedule.projectDuration;
    
    if (feasibility.scheduleHealth === 'UNFEASIBLE') {
      const lateDays = Math.max(1.2, Number((duration * 0.1).toFixed(1)));
      return {
        text: `${lateDays} Days Late`,
        subtext: 'Constraint boundaries breached',
        isLate: true
      };
    } else if (feasibility.scheduleHealth === 'FRAGILE') {
      const earlyDays = Math.max(0.5, Number((maxFloat * 0.4).toFixed(1)));
      return {
        text: `${earlyDays} Days Early`,
        subtext: 'Tight scheduling thresholds',
        isLate: false
      };
    } else {
      const earlyDays = Math.max(2.6, Number((maxFloat * 0.8).toFixed(1)));
      return {
        text: `${earlyDays} Days Early`,
        subtext: 'Excellent execution buffer',
        isLate: false
      };
    }
  }, [schedule, feasibility]);

  // 4. Critical Path count (excluding virtuals)
  const criticalTasksCount = React.useMemo(() => {
    if (!graph || !schedule) return 0;
    return schedule.criticalPathIds.filter(id => {
      const node = graph.nodes.find(n => n.id === id);
      return node && node.type !== 'VIRTUAL_SOURCE' && node.type !== 'VIRTUAL_SINK';
    }).length;
  }, [graph, schedule]);

  // 5. AI Confidence level
  const aiConfidenceScore = React.useMemo(() => {
    if (confidence) return confidence.score;
    if (proposal) return Math.round(proposal.plannerConfidence * 100);
    return 0;
  }, [confidence, proposal]);

  // 6. Mission Health score & status
  const healthInfo = React.useMemo(() => {
    const score = feasibility ? feasibility.score : 0;
    let label = 'Neutral';
    let color = 'bg-zinc-500';
    if (score >= 0.9) {
      label = 'Excellent';
      color = 'bg-emerald-500';
    } else if (score >= 0.8) {
      label = 'Healthy';
      color = 'bg-emerald-400';
    } else if (score >= 0.5) {
      label = 'Warning';
      color = 'bg-amber-500';
    } else {
      label = 'Critical';
      color = 'bg-rose-500';
    }
    return { score, label, color };
  }, [feasibility]);

  if (isFocusMode) {
    return (
      <div className="space-y-8 font-sans">
        {/* Header with Exit button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/20 pb-4">
          <div>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono bg-indigo-500/5 border border-indigo-500/15 px-2.5 py-1 rounded">
              TACTICAL FOCUS ROOM
            </span>
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mt-2.5">
              Active Mission Execution Center
            </h1>
          </div>
          <button
            onClick={() => setIsFocusMode(false)}
            className="self-start text-[10px] font-mono font-bold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-md animate-none"
          >
            ← Exit Focus Session
          </button>
        </div>

        {/* HERO: Mission Progress Ring and Stats */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/40 bg-gradient-to-br from-[#0c0c0d] via-[#09090b] to-[#070709] p-6 lg:p-8 shadow-[0_0_50px_rgba(99,102,241,0.03)]">
          <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Progress Ring */}
            <div className="flex-shrink-0 relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  fill="transparent"
                  stroke="#141417"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="52"
                  fill="transparent"
                  stroke="url(#focusProgressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - progressPct / 100) }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="focusProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-zinc-100 tracking-tight font-mono">
                  {progressPct}%
                </span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono font-bold">
                  Completed
                </span>
              </div>
            </div>

            {/* Mission status & outline */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                    ACTIVE OBJECTIVE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mt-1 leading-snug">
                  {goal || "Executing Synthesized Mission Sequence"}
                </h3>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800/40">
                <div>
                  <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Completed Tasks</span>
                  <span className="text-sm font-bold text-zinc-200 mt-0.5 block">{completedCount} / {workNodes.length}</span>
                </div>
                <div>
                  <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Remaining Steps</span>
                  <span className="text-sm font-bold text-zinc-200 mt-0.5 block">{remainingCount}</span>
                </div>
                <div>
                  <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Est. Focus Duration</span>
                  <span className="text-sm font-bold text-indigo-400 mt-0.5 block">
                    {formatDaysClean(executableNodes.reduce((sum, n) => sum + (n.baseData?.duration || 1), 0))}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Dependency Health</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{(healthInfo.score * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* READY STATE TASKS FEED */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Today's Tactically Executable Tasks
              </h2>
              <p className="text-[10px] text-zinc-500 mt-1">
                Dependency verification guarantees all prerequisite dependency nodes are resolved. These objectives are fully unlocked for action.
              </p>
            </div>
            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {executableNodes.length} Unlocked
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {executableNodes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {executableNodes.map((node) => {
                  const isCritical = schedule?.criticalPathIds.includes(node.id);
                  const duration = node.baseData?.duration || 1;
                  const cpm = schedule?.cpmResults.find(r => r.nodeId === node.id);

                  return (
                    <motion.div
                      key={node.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -15 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative overflow-hidden rounded-xl border border-zinc-800/40 bg-[#0c0c0d] p-5 hover:border-zinc-700/60 transition-all duration-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      {/* Critical Path Indicator */}
                      {isCritical && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-rose-500 shadow-[2px_0_10px_rgba(239,68,68,0.4)] animate-pulse" />
                      )}

                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors truncate">
                            {node.baseData?.title || node.id}
                          </h3>
                          {isCritical ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              CRITICAL SEQUENCE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider font-mono">
                              STANDARD PATH
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-500 bg-[#070709] border border-zinc-800/60 uppercase">
                            Day {cpm ? Math.ceil(cpm.earlyStart) : 0}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed pr-6">
                          {node.baseData?.description}
                        </p>
                        
                        {/* Dependency satisfy confirmation label */}
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 w-fit px-2 py-0.5 rounded-md">
                          <span className="h-1 w-1 rounded-full bg-emerald-400" />
                          <span>ALL CONSTRAINTS RESOLVED</span>
                        </div>
                      </div>

                      {/* Right Side Complete CTA Button */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-[10px] font-mono text-zinc-400 font-semibold bg-[#070709] border border-zinc-800/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {formatDaysClean(duration)}
                        </span>
                        
                        <button
                          onClick={() => {
                            toggleTaskComplete(node.id);
                          }}
                          className="px-4.5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-95 text-white text-[11px] font-semibold tracking-wider uppercase rounded-xl transition-all shadow-md hover:shadow-indigo-500/15 cursor-pointer flex items-center gap-1.5"
                        >
                          ✓ Complete Task
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#0c0c0d] border border-zinc-800/40 rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-sm font-semibold text-zinc-200">
                    {progressPct === 100 ? "Campaign Objectives Accomplished!" : "Daily Tactical Sequence Completed!"}
                  </h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans font-medium">
                    {progressPct === 100 
                      ? "Incredible work. Every milestone and task in this campaign has been mathematically completed. The goal is fully realized."
                      : "Outstanding! You have resolved all tactically ready tasks. Downstream objective nodes will unlock as soon as their structural dependencies are verified."
                    }
                  </p>
                </div>
                <div className="flex gap-3">
                  {progressPct < 100 && (
                    <button
                      onClick={() => {
                        setIsFocusMode(false);
                      }}
                      className="px-5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                    >
                      Return to Dashboard
                    </button>
                  )}
                  {progressPct === 100 && (
                    <button
                      onClick={() => {
                        reset();
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md"
                    >
                      Plan New Mission
                    </button>
                  )}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Create ordered tasks for the execution rail
  const orderedTasks = React.useMemo(() => {
    if (!graph || !schedule) return [];
    const standardNodes = graph.nodes.filter(n => n.type === 'STANDARD');
    return standardNodes.sort((a, b) => {
      const startA = schedule.cpmResults.find(r => r.nodeId === a.id)?.earlyStart || 0;
      const startB = schedule.cpmResults.find(r => r.nodeId === b.id)?.earlyStart || 0;
      return startA - startB;
    });
  }, [graph, schedule]);

  const activeTaskIndex = React.useMemo(() => {
    if (!orderedTasks.length) return 0;
    // Prefer hovered, then selected, then recommended, then first uncompleted
    const activeId = hoveredNodeId || selectedNodeId || recommendedTask?.id;
    const idx = orderedTasks.findIndex(n => n.id === activeId);
    return idx >= 0 ? idx : Math.max(0, orderedTasks.findIndex(n => !completedTaskIds.includes(n.id)));
  }, [orderedTasks, hoveredNodeId, selectedNodeId, recommendedTask, completedTaskIds]);

  const railContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (railContainerRef.current) {
      const activeEl = railContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTaskIndex, selectedNodeId]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#070709] relative font-sans shadow-2xl">
      
      {/* ----------------- MISSION CONTROL HEADER ----------------- */}
      <div className="flex-shrink-0 h-14 border-b border-zinc-800 bg-[#0a0a0c] px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-bold text-zinc-100 tracking-tight">
            {goal || "Execution Workspace"}
          </h1>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <span className={`w-1.5 h-1.5 rounded-full ${
              feasibility?.scheduleHealth === 'ROBUST' ? 'bg-emerald-400' :
              feasibility?.scheduleHealth === 'FRAGILE' ? 'bg-amber-400' : 'bg-rose-400'
            } animate-pulse`} />
            {feasibility?.scheduleHealth || 'ROBUST'}
          </span>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-[10px] font-mono text-zinc-400">
            {progressPct}% COMPLETE
          </span>
        </div>
        
        {isDemo && (
          <button
            onClick={() => reset()}
            className="text-[10px] font-mono font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 px-3 py-1 rounded transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            Exit Demo
          </button>
        )}
      </div>

      {/* ----------------- DAG GRAPH CANVAS (THE HERO) ----------------- */}
      <motion.div 
        animate={{ 
          scale: progressPct > 0 && progressPct < 100 && executableNodes.length === 0 ? [1, 1.01, 1] : 1,
          opacity: progressPct > 0 && progressPct < 100 && executableNodes.length === 0 ? [1, 0.95, 1] : 1
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex-1 relative bg-[#070709]"
      >
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
          onNodeMouseLeave={() => setHoveredNodeId(null)}
          onNodeClick={(_, node) => onSelectNode?.(node.id)}
          onPaneClick={() => onSelectNode?.(null)}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.15}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesConnectable={false}
          nodesDraggable={false}
          elementsSelectable={true}
        >
          <Background color="#161619" gap={20} size={1} />
          
          {/* Subtle contextual hints overlay (replacing heavy demo guide) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <AnimatePresence mode="wait">
              {hoveredNodeId && (
                <motion.div
                  key={hoveredNodeId}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/80 backdrop-blur-md border border-zinc-700/80 text-[10px] font-mono text-zinc-200 px-5 py-2 rounded-full shadow-2xl flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  {(() => {
                    const node = graph?.nodes.find(n => n.id === hoveredNodeId);
                    if (!node) return 'Anchor Point';
                    const isCrit = schedule?.criticalPathIds.includes(hoveredNodeId);
                    const unlocks = graph?.edges.filter(e => e.sourceId === hoveredNodeId).length || 0;
                    const isToday = recommendedTask?.id === hoveredNodeId;

                    if (isToday) return "This is today's highest priority action.";
                    if (isCrit && unlocks > 0) return `Critical Path — Unlocks ${unlocks} downstream tasks.`;
                    if (isCrit) return "Critical Path — Any delay here extends the entire mission.";
                    if (unlocks > 0) return `This task unlocks ${unlocks} others upon completion.`;
                    if (node.type === 'MILESTONE') return "Major project milestone.";
                    return node.baseData?.title || 'Standard Execution Task';
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            <div className="flex items-center gap-1 p-1 bg-[#0b0b0f]/80 backdrop-blur-md border border-zinc-800 rounded-lg shadow-xl">
              <button onClick={handleFitGraph} className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors" title="Fit View"><Maximize2 className="w-3.5 h-3.5" /></button>
              <button onClick={handleCenterTodayTask} className="p-1.5 text-indigo-400 hover:text-indigo-300 rounded hover:bg-indigo-500/10 transition-colors" title="Center Current Task"><Play className="w-3.5 h-3.5" /></button>
              <button onClick={() => setIsMiniMapOpen(!isMiniMapOpen)} className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors" title="Toggle Mini Map"><Layers className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {isMiniMapOpen && (
            <MiniMap
              nodeColor={(node: any) => {
                if (node.data?.isCompleted) return '#10b981';
                if (node.data?.isCritical) return '#f43f5e';
                if (node.data?.isExecutable) return '#6366f1';
                return '#27272a';
              }}
              maskColor="rgba(0, 0, 0, 0.7)"
              bgColor="#070709"
              borderColor="#1f1f24"
              className="!bottom-4 !right-4 !border !border-zinc-800 !rounded-xl !overflow-hidden !shadow-2xl !bg-[#070709]/80 !backdrop-blur-md"
              style={{ width: 120, height: 80 }}
            />
          )}
        </ReactFlow>

        {/* ----------------- INSPECTOR PANEL (PLAIN LANGUAGE) ----------------- */}
        <AnimatePresence>
          {selectedNode && selectedCpm && (
            <motion.div
              initial={{ x: 340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 340, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-4 right-4 bottom-4 w-80 bg-[#0b0b0f]/90 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col z-20"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800/60">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                  Task Inspector
                </span>
                <button
                  onClick={() => onSelectNode?.(null)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {selectedNode.type === 'MILESTONE' ? 'MILESTONE' : 'STANDARD TASK'}
                      </span>
                      {selectedCpm.isCritical && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    {selectedNode.type === 'STANDARD' && orderedTasks.findIndex(n => n.id === selectedNode.id) >= 0 && (
                      <span className="text-[10px] font-mono font-bold text-zinc-500">
                        Task {orderedTasks.findIndex(n => n.id === selectedNode.id) + 1} of {orderedTasks.length}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedNode.baseData?.title || 'Anchor Point'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Estimated Time</span>
                    <span className="block text-sm font-semibold text-zinc-200">
                      {selectedCpm.pertDuration % 1 === 0 ? selectedCpm.pertDuration : selectedCpm.pertDuration.toFixed(1)} Days
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Importance</span>
                    <span className="block text-sm font-semibold text-zinc-200">
                      {selectedCpm.totalFloat === 0 ? 'High (No Buffer)' : 'Normal'}
                    </span>
                  </div>
                </div>

                {/* Waiting For (Predecessors) */}
                {directPredecessors.size > 0 && (
                  <div>
                    <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Waiting For</span>
                    <div className="space-y-1.5">
                      {Array.from(directPredecessors).map(id => {
                        const pNode = graph.nodes.find(n => n.id === id);
                        const isDone = completedTaskIds.includes(id);
                        return (
                          <div key={id} className="flex items-center gap-2 text-xs text-zinc-300 bg-black/20 p-2 rounded border border-zinc-800/40">
                            <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                            <span className="truncate">{pNode?.baseData?.title || 'Previous Step'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Unlocks (Successors) */}
                {directSuccessors.size > 0 && (
                  <div>
                    <span className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Unlocks</span>
                    <div className="space-y-1.5">
                      {Array.from(directSuccessors).map(id => {
                        const sNode = graph.nodes.find(n => n.id === id);
                        return (
                          <div key={id} className="flex items-center gap-2 text-xs text-zinc-400 bg-black/20 p-2 rounded border border-zinc-800/40">
                            <ChevronRight className="w-3 h-3" />
                            <span className="truncate">{sNode?.baseData?.title || 'Next Step'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recommended Action & Mark Complete */}
                {selectedNode.type === 'STANDARD' && (
                  <div className="pt-2 border-t border-zinc-800/60">
                    {completedTaskIds.includes(selectedNode.id) ? (
                      <div className="text-center py-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                        Task Completed
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <span className="block text-[10px] font-mono text-zinc-500 uppercase">Recommended Action</span>
                        <button
                          onClick={() => toggleTaskComplete(selectedNode.id)}
                          disabled={!getIsExecutable(selectedNode.id)}
                          className={`w-full py-3 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            getIsExecutable(selectedNode.id)
                              ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg'
                              : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'
                          }`}
                        >
                          {getIsExecutable(selectedNode.id) ? 'Mark Complete' : 'Cannot Start Yet'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ----------------- HORIZONTAL EXECUTION RAIL ----------------- */}
      <div className="flex-shrink-0 h-28 border-t border-zinc-800 bg-[#0a0a0c] flex flex-col relative">
        {/* Progress indicator across the top of the rail */}
        <div className="absolute top-0 left-0 h-0.5 bg-indigo-500/20 w-full">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-900/50">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Continuous Execution Path
          </span>
          <span className="text-[9px] font-mono text-zinc-500">
            {orderedTasks.filter(t => completedTaskIds.includes(t.id)).length} of {orderedTasks.length} Completed
          </span>
        </div>

        <div 
          ref={railContainerRef}
          className="flex-1 overflow-x-auto hide-scrollbar flex items-center px-6 gap-6"
        >
          {orderedTasks.map((node, index) => {
            const isCompleted = completedTaskIds.includes(node.id);
            const isExecutable = !isCompleted && getIsExecutable(node.id);
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isActive = index === activeTaskIndex;
            const isCritical = schedule?.criticalPathIds.includes(node.id);

            return (
              <div key={node.id} className="flex items-center flex-shrink-0" data-active={isActive}>
                {index > 0 && (
                  <div className={`w-8 h-px mr-6 ${isCompleted ? 'bg-emerald-500/50' : 'bg-zinc-800'}`} />
                )}
                
                <button
                  onClick={() => onSelectNode?.(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`relative flex flex-col items-start text-left p-3 rounded-lg border transition-all cursor-pointer min-w-[200px] max-w-[240px] ${
                    isSelected || isHovered
                      ? 'bg-zinc-800/80 border-zinc-600 shadow-lg scale-105 z-10'
                      : isCompleted
                      ? 'bg-black/20 border-zinc-900 opacity-60'
                      : isActive
                      ? 'bg-indigo-950/20 border-indigo-500/30'
                      : 'bg-black/40 border-zinc-800/60 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isCompleted ? 'bg-emerald-500/10 text-emerald-500' :
                      isActive ? 'bg-indigo-500/10 text-indigo-400' :
                      'bg-zinc-800 text-zinc-500'
                    }`}>
                      Task {index + 1}
                    </span>
                    
                    {isCritical && !isCompleted && (
                      <Flame className="w-3 h-3 text-rose-500" />
                    )}
                  </div>
                  
                  <span className={`text-xs font-semibold truncate w-full ${
                    isCompleted ? 'text-zinc-500 line-through' :
                    isActive || isSelected ? 'text-white' : 'text-zinc-300'
                  }`}>
                    {node.baseData?.title || 'Unknown Task'}
                  </span>
                  
                  <span className="text-[10px] font-mono text-zinc-500 mt-1">
                    {node.baseData?.duration || 1} Days
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ExecutionOverview: React.FC<ExecutionOverviewProps> = (props) => {
  return (
    <ReactFlowProvider>
      <ExecutionOverviewContent {...props} />
    </ReactFlowProvider>
  );
};
