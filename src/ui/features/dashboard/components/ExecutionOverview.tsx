import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { samplePlannerProposal, sampleExecutionPlan } from '../../../../demo';
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
  Maximize2
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
  useReactFlow
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

// ---------------------------------------------------------
// Custom React Flow Node Component
// ---------------------------------------------------------
const ExecutionNodeComponent: React.FC<{ data: any; selected?: boolean }> = ({ data, selected }) => {
  const isCritical = data.isCritical;
  const isCompleted = data.status === 'COMPLETED';
  const totalFloat = data.totalFloat ?? 0;
  
  // Choose border color and glowing rings based on status and selection
  let borderClass = 'border-[#1e1e24] hover:border-zinc-800 bg-[#0c0c0e]/95';
  let glowClass = 'shadow-sm';
  
  if (isCritical) {
    borderClass = 'border-rose-500/20 hover:border-rose-500/40 bg-gradient-to-br from-[#0c0c0e] to-rose-950/5';
    glowClass = 'shadow-[0_0_12px_rgba(244,63,94,0.06)]';
  } else if (isCompleted) {
    borderClass = 'border-emerald-500/20 hover:border-emerald-500/40 bg-gradient-to-br from-[#0c0c0e] to-emerald-950/5';
    glowClass = 'shadow-[0_0_12px_rgba(16,185,129,0.06)]';
  }
  
  if (selected) {
    borderClass = 'border-indigo-500 bg-[#0e0e11]';
    glowClass = 'shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20';
  }

  // Choose visual side-accent color based on node type and criticality
  let accentBar = 'bg-zinc-700';
  if (isCritical) accentBar = 'bg-rose-500';
  else if (data.type === 'MILESTONE') accentBar = 'bg-amber-500';
  else if (isCompleted) accentBar = 'bg-emerald-500';
  else if (data.type === 'VIRTUAL_SOURCE') accentBar = 'bg-indigo-500';
  else if (data.type === 'VIRTUAL_SINK') accentBar = 'bg-purple-500';

  const isVirtual = data.type === 'VIRTUAL_SOURCE' || data.type === 'VIRTUAL_SINK';
  
  if (isVirtual) {
    return (
      <motion.div 
        animate={selected ? {
          boxShadow: [
            "0 0 0 0px rgba(99, 102, 241, 0.4)",
            "0 0 0 6px rgba(99, 102, 241, 0)",
            "0 0 0 0px rgba(99, 102, 241, 0.4)"
          ],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`px-4 py-2 rounded-full border bg-[#0c0c0e]/95 backdrop-blur-md text-center ${borderClass} ${glowClass} transition-all duration-200 cursor-pointer flex items-center gap-2 max-w-[190px]`}
      >
        <Handle 
          type={data.type === 'VIRTUAL_SOURCE' ? 'source' : 'target'} 
          position={data.type === 'VIRTUAL_SOURCE' ? Position.Right : Position.Left} 
          style={{ opacity: 0 }} 
        />
        <span className={`w-1.5 h-1.5 rounded-full ${data.type === 'VIRTUAL_SOURCE' ? 'bg-indigo-400 animate-pulse' : 'bg-purple-400'}`} />
        <span className="text-[9px] font-semibold tracking-wider font-mono text-zinc-400">
          {data.type === 'VIRTUAL_SOURCE' ? 'START' : 'END'}
        </span>
      </motion.div>
    );
  }

  const formattedDuration = data.duration % 1 === 0 ? data.duration : Number(data.duration.toFixed(1));
  const roundedES = data.earlyStart % 1 === 0 ? data.earlyStart : Number(data.earlyStart.toFixed(1));
  const roundedEF = data.earlyFinish % 1 === 0 ? data.earlyFinish : Number(data.earlyFinish.toFixed(1));
  const roundedFloat = totalFloat % 1 === 0 ? totalFloat : Number(totalFloat.toFixed(1));

  return (
    <motion.div 
      animate={selected ? {
        boxShadow: [
          "0 0 0 0px rgba(99, 102, 241, 0.4)",
          "0 0 0 6px rgba(99, 102, 241, 0)",
          "0 0 0 0px rgba(99, 102, 241, 0.4)"
        ],
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`w-[240px] rounded-xl border bg-[#0c0c0e]/95 backdrop-blur-md text-left ${borderClass} ${glowClass} transition-all duration-200 cursor-pointer overflow-hidden relative group`}
    >
      {/* Target handle on left */}
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      
      {/* Side Color Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${accentBar}`} />
      
      {/* Node Body */}
      <div className="p-4 pl-4.5 space-y-2">
        <div className="flex items-center justify-between text-[9px] font-mono font-medium tracking-wider text-zinc-500">
          <span className="truncate max-w-[120px]">
            {data.type === 'MILESTONE' ? '🏁 MILESTONE' : '📦 TASK'}
          </span>
          <span className="text-zinc-400">
            {formattedDuration} Day{formattedDuration !== 1 ? 's' : ''}
          </span>
        </div>
        
        <h4 className="text-xs font-semibold text-zinc-200 tracking-tight leading-snug group-hover:text-zinc-100 transition-colors truncate">
          {data.title}
        </h4>

        {/* Temporal CPM Metadata Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1e1e24] text-[9px] font-mono text-zinc-500">
          <div className="flex gap-2">
            <span>ES: <strong className="text-zinc-300 font-normal">{roundedES}</strong></span>
            <span>EF: <strong className="text-zinc-300 font-normal">{roundedEF}</strong></span>
          </div>
          
          {isCritical ? (
            <span className="text-rose-400 font-semibold flex items-center gap-0.5">
              CRITICAL
            </span>
          ) : (
            <span className="text-zinc-500">
              Slack: <strong className={totalFloat > 0 ? 'text-amber-400' : 'text-zinc-500'}>{roundedFloat}d</strong>
            </span>
          )}
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
    graph, 
    schedule, 
    feasibility, 
    confidence, 
    bottlenecks, 
    isGenerating, 
    isDemo, 
    reset,
    completedTaskIds,
    toggleTaskComplete,
    isFocusMode,
    setIsFocusMode
  } = useDashboardStore();

  const workNodes = React.useMemo(() => {
    if (!graph) return [];
    return graph.nodes.filter(n => n.type === 'STANDARD' || n.type === 'MILESTONE');
  }, [graph]);

  const completedCount = React.useMemo(() => {
    return workNodes.filter(n => completedTaskIds.includes(n.id)).length;
  }, [workNodes, completedTaskIds]);

  const remainingCount = workNodes.length - completedCount;

  const progressPct = React.useMemo(() => {
    return workNodes.length > 0 ? Math.round((completedCount / workNodes.length) * 100) : 0;
  }, [workNodes, completedCount]);

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

  const getIsNodeCompleted = React.useCallback((nodeId: string) => {
    if (completedTaskIds.includes(nodeId)) return true;
    if (!graph) return false;
    const parentEdges = graph.edges.filter(e => e.targetId === nodeId);
    if (parentEdges.length === 0) return false;
    return parentEdges.every(edge => {
      const parentNode = graph.nodes.find(n => n.id === edge.sourceId);
      if (!parentNode) return true;
      if (parentNode.type === 'VIRTUAL_SOURCE') return true;
      return completedTaskIds.includes(parentNode.id);
    });
  }, [graph, completedTaskIds]);

  const reactFlowInstance = useReactFlow();

  // Hover state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

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

  // Predecessors / Successors helper for hovered nodes
  const connectedInfo = React.useMemo(() => {
    if (!hoveredNodeId || !graph) return null;
    
    const predecessors = new Set<string>();
    const queuePred = [hoveredNodeId];
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
    const queueSucc = [hoveredNodeId];
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
  }, [hoveredNodeId, graph]);

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

  // Smoothly center the viewport on the selected node
  useEffect(() => {
    if (selectedNodeId && nodePositions[selectedNodeId] && reactFlowInstance) {
      const pos = nodePositions[selectedNodeId];
      reactFlowInstance.setCenter(pos.x + 120, pos.y + 60, { zoom: 0.95, duration: 800 });
    }
  }, [selectedNodeId, nodePositions, reactFlowInstance]);

  // Construct React Flow nodes
  const flowNodes = React.useMemo(() => {
    if (!graph || !schedule) return [];

    return graph.nodes.map(n => {
      const cpm = schedule.cpmResults.find(r => r.nodeId === n.id);
      const isCritical = cpm?.isCritical || false;

      // Determine hover highlight/fade states
      let isDimmed = false;
      let isHighlighted = false;
      if (hoveredNodeId !== null && connectedInfo !== null) {
        const isSelf = hoveredNodeId === n.id;
        const isPred = connectedInfo.predecessors.has(n.id);
        const isSucc = connectedInfo.successors.has(n.id);
        isHighlighted = isSelf || isPred || isSucc;
        isDimmed = !isHighlighted;
      }

      const pos = nodePositions[n.id] || { x: 0, y: 0 };

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
        },
        style: {
          opacity: isDimmed ? 0.35 : 1,
          transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
        }
      };
    });
  }, [graph, schedule, nodePositions, hoveredNodeId, connectedInfo]);

  // Construct React Flow edges
  const flowEdges = React.useMemo(() => {
    if (!graph || !schedule) return [];

    return graph.edges.map(e => {
      const isSourceCritical = schedule.criticalPathIds.includes(e.sourceId);
      const isTargetCritical = schedule.criticalPathIds.includes(e.targetId);
      const isCriticalEdge = isSourceCritical && isTargetCritical;

      // Determine hover highlight state
      let isHighlighted = false;
      let isDimmed = false;
      if (hoveredNodeId !== null && connectedInfo !== null) {
        const connectsHovered = e.sourceId === hoveredNodeId || e.targetId === hoveredNodeId;
        const inPredecessors = connectedInfo.predecessors.has(e.sourceId) && (connectedInfo.predecessors.has(e.targetId) || e.targetId === hoveredNodeId);
        const inSuccessors = connectedInfo.successors.has(e.targetId) && (connectedInfo.successors.has(e.sourceId) || e.sourceId === hoveredNodeId);
        
        isHighlighted = connectsHovered || inPredecessors || inSuccessors;
        isDimmed = !isHighlighted;
      }

      // Base styles
      let strokeColor = '#1e1e24'; // Thinner, cleaner default slate border
      let strokeWidth = 1.2;
      let filterGlow = 'none';
      let animated = false;

      if (isCriticalEdge) {
        strokeColor = '#f43f5e'; // Glowing Critical Rose
        strokeWidth = 2.0;
        filterGlow = 'drop-shadow(0px 0px 4px rgba(244, 63, 94, 0.35))';
        animated = true;
      }

      if (isHighlighted) {
        if (hoveredNodeId === e.sourceId || hoveredNodeId === e.targetId) {
          strokeColor = '#6366f1'; // Direct Connections: Violet-indigo
          strokeWidth = 2.2;
          filterGlow = 'drop-shadow(0px 0px 5px rgba(99, 102, 241, 0.45))';
        } else {
          strokeColor = '#8b5cf6'; // Transitive Predecessors/Successors: Purple
          strokeWidth = 1.8;
          filterGlow = 'drop-shadow(0px 0px 3px rgba(139, 92, 246, 0.35))';
        }
        animated = true;
      }

      const id = `${e.sourceId}-${e.targetId}`;

      return {
        id,
        source: e.sourceId,
        target: e.targetId,
        animated,
        style: {
          stroke: strokeColor,
          strokeWidth,
          filter: filterGlow,
          opacity: isDimmed ? 0.25 : 1,
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease, opacity 0.2s ease',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 16,
          height: 16,
        },
      };
    });
  }, [graph, schedule, hoveredNodeId, connectedInfo]);

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
            <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-2xl p-6 hover:border-zinc-800 transition-all duration-300 group">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 w-fit mb-4">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">
                1. Mission Synthesis
              </h4>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                Detail your project parameters and target deadlines. Gemini analyzes scope boundaries and outputs discrete, structured deliverables.
              </p>
            </div>

            <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-2xl p-6 hover:border-zinc-800 transition-all duration-300 group">
              <div className="p-2.5 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6] w-fit mb-4">
                <GitBranch className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">
                2. Topological Graphing
              </h4>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                Deliverables are automatically constructed as an acyclic graph of interdependent milestones and tasks, preventing cycle-locking.
              </p>
            </div>

            <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-2xl p-6 hover:border-zinc-800 transition-all duration-300 group">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-4">
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
        <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
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
    if (!feasibility) return { label: 'Neutral', color: 'text-zinc-400 bg-zinc-500/5 border-zinc-500/20', dot: '⚪' };
    switch (feasibility.scheduleHealth) {
      case 'ROBUST':
        return { label: 'On Track', color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20', dot: '🟢' };
      case 'FRAGILE':
        return { label: 'At Risk', color: 'text-amber-400 bg-amber-500/5 border-amber-500/20', dot: '🟡' };
      case 'UNFEASIBLE':
        return { label: 'Critical', color: 'text-rose-400 bg-rose-500/5 border-rose-500/20', dot: '🔴' };
      default:
        return { label: 'Neutral', color: 'text-zinc-400 bg-zinc-500/5 border-zinc-500/20', dot: '⚪' };
    }
  }, [feasibility]);

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
                  <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Topological Score</span>
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
                Topological verification guarantees all prerequisite dependency nodes are resolved. These objectives are fully unlocked for action.
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

  return (
    <div className="space-y-8 font-sans">
      {/* ----------------- LAYER 1: HERO (MISSION & EXECUTIVE OUTLOOK) ----------------- */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6 pb-2"
      >
        {/* Sub-Header & Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono bg-indigo-500/5 border border-indigo-500/15 px-2.5 py-1 rounded">
              Campaign Execution Synthesis
            </span>
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mt-2.5">
              Executive Mission Operating System
            </h1>
          </div>
          {isDemo ? (
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                Demo Mission | Sample Data
              </span>
              <button
                onClick={() => reset()}
                className="text-[10px] font-mono font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1 active:scale-95"
              >
                Return to Live AI
              </button>
            </div>
          ) : (
            <div className="text-[11px] font-mono text-zinc-500 bg-[#070709] border border-zinc-800/40 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>TOPOLOGICAL DECISION GRID ACTIVE</span>
            </div>
          )}
        </div>

        {/* Majestic Hero Card - Impeccable negative space & display typography */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/40 bg-gradient-to-br from-[#0c0c0d] via-[#09090b] to-[#070709] p-6 lg:p-8 shadow-[0_0_50px_rgba(99,102,241,0.03)]">
          {/* Ambient visual gradient accent */}
          <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
            {/* Completion Ring Left Side */}
            <div className="flex-shrink-0 relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  fill="transparent"
                  stroke="#141417"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="38"
                  fill="transparent"
                  stroke="url(#dashboardProgressGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 38}
                  initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - progressPct / 100) }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="dashboardProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-black text-zinc-100 font-mono">
                  {progressPct}%
                </span>
                <span className="text-[7px] text-zinc-500 uppercase font-mono font-bold tracking-wider">
                  Progress
                </span>
              </div>
            </div>

            {/* Content & Stats Row Right Side */}
            <div className="flex-1 space-y-6 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800/20 pb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                    Active Mission Scope
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span>OUTLOOK:</span>
                    <span className={`font-semibold ${
                      feasibility?.scheduleHealth === 'ROBUST' ? 'text-emerald-400' :
                      feasibility?.scheduleHealth === 'FRAGILE' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {feasibility?.scheduleHealth || 'ROBUST'}
                    </span>
                  </div>
                  <div className="h-3 w-[1px] bg-zinc-800" />
                  <div className="flex items-center gap-1.5">
                    <span>AI CONCORDANCE:</span>
                    <span className="text-indigo-400 font-semibold">{aiConfidenceScore}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-w-4xl">
                <h2 className="text-xl lg:text-2xl font-bold text-zinc-100 tracking-tight leading-snug">
                  {goal || "Synthesized Mission Execution Framework"}
                </h2>
                <p className="text-[11px] lg:text-xs text-zinc-400 leading-relaxed font-sans font-medium">
                  {feasibility?.scheduleHealth === 'ROBUST' && (
                    <span>The topological execution intelligence engine has certified this mission plan as <strong className="text-emerald-400 font-semibold">ROBUST (On Track)</strong>. Standard deviations in critical path estimates suggest ample scheduling slack, ensuring delivery objectives can be met without structural risks.</span>
                  )}
                  {feasibility?.scheduleHealth === 'FRAGILE' && (
                    <span>The critical path calculations have isolated <strong className="text-amber-400 font-semibold">FRAGILE TOLERANCES (At Risk)</strong>. Multiple task boundaries intersect with zero flexibility. Minor localized slippages will immediately cascade to jeopardize final completion.</span>
                  )}
                  {feasibility?.scheduleHealth === 'UNFEASIBLE' && (
                    <span>The mathematical schedule engine has determined this structure is <strong className="text-rose-400 font-semibold">UNFEASIBLE (Critical Error)</strong>. Multiple prerequisites are cycle-locked or scheduled late, guaranteeing constraint breaches. Mitigation required immediately.</span>
                  )}
                </p>
              </div>

              {/* Structured quick metrics summary row inside Hero */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-zinc-800/40">
                <div>
                  <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Projected Completion</span>
                  <span className="text-sm font-bold text-zinc-200 mt-1 block font-sans">{projectedCompletion}</span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Temporal Buffer</span>
                  <span className={`text-sm font-bold mt-1 block font-sans ${timeBuffer.isLate ? 'text-rose-400' : 'text-emerald-400'}`}>{timeBuffer.text}</span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Completed Steps</span>
                  <span className="text-sm font-bold text-zinc-200 mt-1 block font-sans">{completedCount} / {workNodes.length}</span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Topological Score</span>
                  <span className="text-sm font-bold text-zinc-200 mt-1 block font-sans">{(healthInfo.score * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ----------------- LAYER 2: SUPPORTING INFORMATION (TODAY'S PRIORITY & TIMELINES) ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Active Mission Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-[#0c0c0d] via-[#09090b] to-[#070709] border border-indigo-500/20 rounded-xl p-5 hover:border-indigo-500/30 transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.02)] flex flex-col justify-between min-h-[360px] relative overflow-hidden"
        >
          {/* Subtle glowing focus circle */}
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/40">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                  Today's Active Mission
                </h3>
              </div>
              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                TACTICAL UNIT
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Today's Objective</span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium">
                  {executableNodes.length > 0 
                    ? `Resolve the remaining ${executableNodes.length} executable tasks to satisfy upcoming prerequisites and unlock down-line workflows.`
                    : "All current tasks have been successfully completed. Monitor the network graph for newly unlocked down-line objectives."
                  }
                </p>
              </div>

              {/* Focus stats grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="bg-[#070709]/60 border border-zinc-800/40 rounded-lg p-2.5">
                  <span className="text-[8px] text-zinc-500 font-mono block uppercase">Est. Focus Time</span>
                  <span className="text-xs font-bold text-indigo-400 mt-1 block">
                    {formatDaysClean(executableNodes.reduce((sum, n) => sum + (n.baseData?.duration || 1), 0))}
                  </span>
                </div>
                <div className="bg-[#070709]/60 border border-zinc-800/40 rounded-lg p-2.5">
                  <span className="text-[8px] text-zinc-500 font-mono block uppercase">Critical Pathways</span>
                  <span className="text-xs font-bold text-rose-400 mt-1 block">
                    {executableNodes.filter(n => schedule?.criticalPathIds.includes(n.id)).length} Critical Step(s)
                  </span>
                </div>
              </div>

              {recommendedTask && (
                <div className="p-3 bg-[#070709] border border-zinc-800/40 rounded-lg space-y-1">
                  <span className="text-[8px] text-zinc-500 font-mono block uppercase">Recommended First Objective</span>
                  <span className="text-xs font-bold text-zinc-200 block truncate">
                    {recommendedTask.baseData?.title || recommendedTask.id}
                  </span>
                  <p className="text-[10px] text-zinc-500 italic font-sans leading-relaxed">
                    "Executing this item first ensures the active critical path remains fully optimized with zero scheduler slippage."
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-auto">
            <button
              onClick={() => setIsFocusMode(true)}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-98 text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-[0_4px_20px_rgba(99,102,241,0.15)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2 cursor-pointer border border-indigo-500/10"
            >
              Start Today's Mission
              <span className="text-sm">→</span>
            </button>
          </div>
        </motion.div>

        {/* Milestones timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-[#0c0c0d] to-[#09090b] border border-zinc-800/40 rounded-xl p-5 hover:border-zinc-750/60 transition-all duration-300 shadow-md flex flex-col"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800/40">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                Upcoming Milestones
              </h3>
            </div>
            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-semibold">
              MILESTONE TRACKING
            </span>
          </div>

          <div className="relative pl-4 space-y-4 flex-1">
            {/* Timeline track line */}
            <div className="absolute left-1.5 top-2 bottom-6 w-[1px] bg-gradient-to-b from-indigo-500/40 via-zinc-800/40 to-transparent" />

            {(graph?.nodes.filter(t => t.type === 'MILESTONE').slice(0, 3) || []).map((node, i) => {
              const isSelected = selectedNodeId === node.id;
              const cpm = schedule?.cpmResults.find(r => r.nodeId === node.id);
              const isCritical = cpm?.isCritical || false;
              
              // Predecessors count
              const preds = graph?.edges.filter(e => e.targetId === node.id) || [];
              const totalPredecessors = preds.length;

              return (
                <div 
                  key={node.id || i} 
                  onClick={() => onSelectNode?.(node.id)}
                  className={`group relative flex items-start gap-3 pl-3 py-0.5 cursor-pointer transition-all ${
                    isSelected ? 'translate-x-1' : 'hover:translate-x-1'
                  }`}
                >
                  {/* Timeline point */}
                  <span className={`absolute -left-3.5 top-1.5 w-2 h-2 rounded-full border transition-all duration-200 ${
                    getIsNodeCompleted(node.id)
                      ? 'bg-emerald-500 border-emerald-400 ring-4 ring-emerald-500/20 scale-110'
                      : isSelected 
                      ? 'bg-indigo-500 border-indigo-400 ring-4 ring-indigo-500/20 scale-125' 
                      : isCritical 
                      ? 'bg-rose-500 border-rose-400' 
                      : 'bg-[#070709] border-zinc-800/60 group-hover:border-indigo-400'
                  }`} />

                  <div className={`flex-1 p-3 rounded-xl border transition-all duration-200 ${
                    isSelected 
                      ? 'bg-indigo-500/10 border-indigo-500/40 shadow-sm' 
                      : 'bg-[#070709]/40 border-zinc-800/30 hover:border-zinc-700/60'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
                        {node.baseData?.title || 'Milestone'}
                      </span>
                      
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {getIsNodeCompleted(node.id) ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider font-mono">
                            ✓ ACHIEVED
                          </span>
                        ) : isCritical ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider font-mono">
                            CRITICAL
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider font-mono">
                            BUFFERED
                          </span>
                        )}
                        
                        <span className="text-[10px] font-mono text-zinc-400 font-semibold bg-[#0c0c0d] border border-zinc-800/40 px-1.5 py-0.5 rounded">
                          Day {cpm ? Math.ceil(cpm.earlyStart) : 0}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                      <span>Prerequisites Required: {totalPredecessors}</span>
                      <span>Target Day: Day {cpm ? cpm.earlyStart.toFixed(1) : '0'}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {(!graph || graph.nodes.filter(t => t.type === 'MILESTONE').length === 0) && (
              <div className="flex flex-col items-center justify-center py-6 text-zinc-500">
                <Calendar className="w-5 h-5 text-zinc-800/40 mb-2" />
                <p className="text-[10px] font-mono">No intermediate milestones specified</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ----------------- LAYER 3: EVIDENCE (DAG WORKSPACE CANVAS) ----------------- */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
              Mission Execution Path (DAG)
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[9px] font-mono text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1.5 rounded-sm bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
              <span>Critical Path (Zero Slack)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1.5 rounded-sm bg-indigo-500" />
              <span>Standard Paths</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1.5 rounded-sm bg-amber-500" />
              <span>Milestones</span>
            </span>
          </div>
        </div>

        {/* Outer Border Frame representing a High-Fidelity Workspace */}
        <div className="relative border border-zinc-800/40 bg-[#070709] rounded-2xl overflow-hidden shadow-2xl h-[650px] flex flex-col md:flex-row group">
          
          {/* Main Flow Canvas */}
          <div className="flex-1 h-full relative min-h-[300px]">
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
              onNodeMouseLeave={() => setHoveredNodeId(null)}
              onNodeClick={(_, node) => onSelectNode?.(node.id)}
              onPaneClick={() => onSelectNode?.(null)}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.15}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
              nodesConnectable={false}
              nodesDraggable={false}
              elementsSelectable={true}
            >
              <Background color="#161619" gap={16} size={1} />
              <Controls className="!bg-[#111114] !border !border-zinc-800/40 !rounded-lg !shadow-xl !text-gray-300" />
            </ReactFlow>
          </div>

          {/* Slide-out Node Inspector Panel inside the Canvas Container */}
          <AnimatePresence>
            {selectedNode && selectedCpm && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 310, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="border-t md:border-t-0 md:border-l border-zinc-800/40 bg-[#111114]/95 backdrop-blur-md h-full overflow-y-auto flex flex-col relative z-20 flex-shrink-0"
              >
                <div className="p-5 space-y-5 flex-1 select-none">
                  <div className="flex items-center justify-between border-b border-zinc-800/20 pb-3">
                    <span className="text-[9px] font-mono font-extrabold text-gray-500 uppercase tracking-widest">
                      Task Inspector
                    </span>
                    <button
                      onClick={() => onSelectNode?.(null)}
                      className="p-1 text-gray-500 hover:text-gray-300 hover:bg-background/60 rounded-md transition-all cursor-pointer text-sm font-semibold"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-primary font-bold">
                      {selectedNode.type === 'MILESTONE' ? '🏁 MILESTONE' : '📦 STANDARD TASK'}
                    </div>
                    <h4 className="text-xs font-bold text-gray-100 tracking-tight leading-snug">
                      {selectedNode.baseData?.title || (selectedNode.type === 'VIRTUAL_SOURCE' ? 'Start Anchor' : 'End Anchor')}
                    </h4>
                  </div>

                  {/* Task Execution Controller */}
                  {selectedNode.type === 'STANDARD' && (
                    <div className="pt-1.5">
                      {completedTaskIds.includes(selectedNode.id) ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase">
                          <span>✓ Task Completed & Secured</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleTaskComplete(selectedNode.id)}
                          disabled={!getIsExecutable(selectedNode.id)}
                          className={`w-full py-2.5 rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 active:scale-97 cursor-pointer ${
                            getIsExecutable(selectedNode.id)
                              ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                              : 'bg-[#141417]/40 border border-zinc-800/60 text-zinc-500 cursor-not-allowed'
                          }`}
                        >
                          {getIsExecutable(selectedNode.id) ? '✓ Mark Task Completed' : 'Prerequisites Outstanding'}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="space-y-3.5 pt-1">
                    {/* Duration / PERT detail */}
                    <div className="bg-[#070709]/60 border border-zinc-800/40 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[9px] text-zinc-500 font-mono block">PERT EXPECTED TIMING</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-extrabold text-zinc-200 font-mono">
                          {selectedCpm.pertDuration % 1 === 0 ? selectedCpm.pertDuration : selectedCpm.pertDuration.toFixed(1)} Days
                        </span>
                        {selectedNode.baseData && (
                          <span className="text-[9px] text-zinc-500 font-mono">
                            ({selectedNode.baseData.optimisticDuration} / {selectedNode.baseData.mostLikelyDuration} / {selectedNode.baseData.pessimisticDuration})
                          </span>
                        )}
                      </div>
                      <p className="text-[8px] text-zinc-500 leading-normal font-mono">
                        Expected $T_E = (O + 4M + P) / 6$
                      </p>
                    </div>

                    {/* Critical vs. Float */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#070709]/60 border border-zinc-800/40 rounded-lg p-2.5">
                        <span className="text-[8px] text-zinc-500 font-mono block">CRITICAL PATH</span>
                        <span className={`text-[10px] font-bold mt-1 block ${selectedCpm.isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {selectedCpm.isCritical ? '⚠️ YES' : '✅ NO'}
                        </span>
                      </div>
                      <div className="bg-[#070709]/60 border border-zinc-800/40 rounded-lg p-2.5">
                        <span className="text-[8px] text-zinc-500 font-mono block">TOTAL FLOAT</span>
                        <span className={`text-[10px] font-mono font-bold mt-1 block ${selectedCpm.totalFloat > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
                          {selectedCpm.totalFloat % 1 === 0 ? selectedCpm.totalFloat : selectedCpm.totalFloat.toFixed(1)} Days
                        </span>
                      </div>
                    </div>

                    {/* Predecessors / Dependents lists */}
                    <div className="space-y-3.5 pt-1">
                      {/* Predecessors */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono block">
                          Direct Prerequisites ({directPredecessors.size})
                        </span>
                        <div className="space-y-1 max-h-[100px] overflow-y-auto">
                          {Array.from(directPredecessors).map((id) => {
                            const pNode = graph.nodes.find(n => n.id === id);
                            if (!pNode) return null;
                            return (
                              <button
                                key={id}
                                onClick={() => onSelectNode?.(id)}
                                className="w-full text-left p-2 bg-background/30 hover:bg-background border border-zinc-800/40 rounded-lg text-[10px] text-gray-300 font-medium truncate flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <ChevronRight className="w-3 h-3 text-primary flex-shrink-0" />
                                <span className="truncate">{pNode.baseData?.title || (pNode.type === 'VIRTUAL_SOURCE' ? 'Start Anchor' : 'End Anchor')}</span>
                              </button>
                            );
                          })}
                          {directPredecessors.size === 0 && (
                            <span className="text-[10px] text-gray-600 font-mono block italic">No prerequisites</span>
                          )}
                        </div>
                      </div>

                      {/* Successors / Dependents */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono block">
                          Downstream Dependents ({directSuccessors.size})
                        </span>
                        <div className="space-y-1 max-h-[100px] overflow-y-auto">
                          {Array.from(directSuccessors).map((id) => {
                            const sNode = graph.nodes.find(n => n.id === id);
                            if (!sNode) return null;
                            return (
                              <button
                                key={id}
                                onClick={() => onSelectNode?.(id)}
                                className="w-full text-left p-2 bg-background/30 hover:bg-background border border-zinc-800/40 rounded-lg text-[10px] text-gray-300 font-medium truncate flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <ChevronRight className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                <span className="truncate">{sNode.baseData?.title || (sNode.type === 'VIRTUAL_SINK' ? 'End Anchor' : 'End Anchor')}</span>
                              </button>
                            );
                          })}
                          {directSuccessors.size === 0 && (
                            <span className="text-[10px] text-gray-600 font-mono block italic">No dependents</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ----------------- LAYER 4: DETAILS (CRITICAL RISK ASSUMPTIONS) ----------------- */}
      {proposal.assumptions && proposal.assumptions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-[#0c0c0d] to-[#09090b] border border-zinc-800/40 rounded-xl p-6 shadow-md"
        >
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Critical Risk Assumptions & Boundaries
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {proposal.assumptions.map((a, i) => (
              <li key={i} className="text-xs text-zinc-400 bg-[#070709] border border-zinc-800/40 rounded-lg p-3 leading-relaxed flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
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
