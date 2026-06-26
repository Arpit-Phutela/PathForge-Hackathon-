import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ExecutionOverview: React.FC = () => {
  const { proposal, graph, schedule, isGenerating } = useDashboardStore();

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
      <div className="space-y-12 py-6">
        {/* Welcoming Hero Area */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary mb-2 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight sm:text-4xl">
            PathForge
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            Execution Intelligence for Deadlines
          </p>
          <div className="h-[2px] w-12 bg-primary/60 mx-auto rounded-full" />
          <p className="text-sm text-gray-500 leading-relaxed">
            Standard calendars and task boards let deadlines slip. PathForge is a high-fidelity planning framework that validates generative AI reasoning with deterministic CPM mathematics to ensure milestones are mathematically viable.
          </p>
        </div>

        {/* Modular Workflow Visualizer */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center font-mono">
            How PathForge Saves Your Deadline
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface/40 border border-border/50 rounded-xl p-5 hover:border-gray-700/60 transition-colors group">
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary w-fit mb-4">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
                1. Mission Intake
              </h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Describe your project, ultimate deadline, and parameters. Gemini parses the goal into explicit, structured components.
              </p>
            </div>

            <div className="bg-surface/40 border border-border/50 rounded-xl p-5 hover:border-gray-700/60 transition-colors group">
              <div className="p-2.5 bg-accent/10 rounded-lg text-accent w-fit mb-4">
                <GitBranch className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
                2. Graph Resolving
              </h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                The AI compiles a complete dependency tree. All tasks and milestones are bound as a directed acyclic graph (DAG) to enforce logic.
              </p>
            </div>

            <div className="bg-surface/40 border border-border/50 rounded-xl p-5 hover:border-gray-700/60 transition-colors group">
              <div className="p-2.5 bg-success/10 rounded-lg text-success w-fit mb-4">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
                3. Math Validation
              </h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Deterministic CPM scheduling runs on top of the graph, mathematically calculating early/late bounds, floats, and isolating the exact critical path.
              </p>
            </div>
          </div>
        </div>

        {/* Guided Callout */}
        <div className="bg-[#111115] border border-border/80 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-sm font-semibold text-gray-200">
              Ready to safeguard your delivery date?
            </h4>
            <p className="text-xs text-gray-500">
              Enter your mission details in the input area and press "Save My Deadline".
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold uppercase tracking-wider animate-pulse">
            Awaiting Mission Goal
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  // Active Proposal Strategy View
  return (
    <div className="space-y-8 font-sans">
      {/* Strategy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">
            Active Campaign
          </span>
          <h2 className="text-xl font-bold text-gray-100 tracking-tight mt-1">
            Execution Strategy
          </h2>
        </div>
        <div className="flex gap-2.5">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/80 border border-border rounded-lg text-xs text-gray-300 font-mono">
            <Network className="w-3.5 h-3.5 text-primary" />
            <span>{graph?.nodes.length || 0}</span>
            <span className="text-gray-500 text-[10px]">NODES</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/80 border border-border rounded-lg text-xs text-gray-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-success" />
            <span>{schedule?.projectDuration || 0}</span>
            <span className="text-gray-500 text-[10px]">DAYS</span>
          </span>
        </div>
      </div>

      {/* Grid: Focus Area & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Focus */}
        <div className="bg-surface border border-border/60 hover:border-gray-800 rounded-xl p-6 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
              Today's Focus
            </h3>
            <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-mono">
              ACTIVE
            </span>
          </div>
          <div className="space-y-4">
            {proposal.tasks.slice(0, 3).map((task, i) => (
              <div key={task.taskId || i} className="flex items-start gap-3 p-2 hover:bg-background/40 rounded-lg transition-colors group">
                <div className="mt-1 w-4 h-4 rounded border border-border flex-shrink-0 flex items-center justify-center bg-background group-hover:border-primary/60 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-sm bg-primary scale-0 group-hover:scale-100 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-200 block group-hover:text-gray-100 transition-colors">
                    {task.title}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                    {task.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-surface border border-border/60 hover:border-gray-800 rounded-xl p-6 transition-all duration-300 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
              Upcoming Milestones
            </h3>
            <span className="text-[10px] bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded font-mono">
              TARGETS
            </span>
          </div>
          <div className="space-y-4">
            {(graph?.nodes.filter(t => t.type === 'MILESTONE').slice(0, 3) || []).map((node, i) => (
              <div key={node.id || i} className="flex items-center justify-between border-l-2 border-primary pl-4 py-1.5 hover:bg-background/40 rounded-r-lg transition-all">
                <div>
                  <span className="text-xs font-semibold text-gray-200">
                    {node.baseData?.title || 'Milestone'}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Critical path threshold validation
                  </p>
                </div>
              </div>
            ))}
            {(!graph || graph.nodes.filter(t => t.type === 'MILESTONE').length === 0) && (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <Calendar className="w-6 h-6 text-border mb-2" />
                <p className="text-[10px] font-mono">No intermediate milestones specified</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Canvas Placeholder Card */}
      <div className="bg-surface border border-border/80 hover:border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px] shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="flex gap-4 p-4 bg-background border border-border rounded-full shadow-inner group-hover:scale-105 transition-transform">
          <Network className="w-6 h-6 text-primary animate-pulse" />
          <div className="h-6 w-[1px] bg-border" />
          <GitBranch className="w-6 h-6 text-accent" />
        </div>
        
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono">
          Deterministic Graph Canvas
        </h3>
        <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
          The interactive network topology view, directed acyclic dependency paths, and scheduling timeline will render here in future modules.
        </p>
        <span className="text-[10px] font-mono text-gray-600 bg-background border border-border/60 px-2.5 py-1 rounded-full uppercase tracking-widest">
          React Flow Pipeline Ready
        </span>
      </div>

      {/* Critical Risk Assumptions */}
      {proposal.assumptions && proposal.assumptions.length > 0 && (
        <div className="bg-surface border border-border/60 rounded-xl p-6 shadow-md">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-warning" />
            Critical Risk Assumptions
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {proposal.assumptions.map((a, i) => (
              <li key={i} className="text-xs text-gray-400 bg-background/50 border border-border/40 rounded-lg p-3 leading-relaxed flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
