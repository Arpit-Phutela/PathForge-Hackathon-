import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { 
  AlertCircle, 
  ShieldAlert, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  Maximize2
} from 'lucide-react';
import { motion } from 'motion/react';

export const AIIntelligence: React.FC = () => {
  const { proposal, feasibility, schedule, bottlenecks, graph } = useDashboardStore();

  // Polished Sidebar Empty State (educational / onboarding)
  if (!proposal || !feasibility) {
    return (
      <div className="flex flex-col h-full py-12 px-6 justify-center items-center text-center font-sans space-y-6">
        <div className="relative flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute h-16 w-16 border border-dashed border-border rounded-full"
          />
          <div className="p-3 bg-surface border border-border rounded-2xl text-gray-500 relative z-10 shadow-sm">
            <BrainCircuit className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-200">
            Awaiting Mission Scope
          </h3>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            Enter your mission goal to initialize real-time execution analysis. PathForge will generate:
          </p>
        </div>

        <div className="w-full space-y-2 text-left bg-background/50 border border-border/40 rounded-xl p-4 text-[10px] font-mono text-gray-400">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Mathematical Schedule Health</span>
          </div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
            <span>AI Baseline Confidence Score</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-3.5 h-3.5 text-warning" />
            <span>Cascading Dependency Bottlenecks</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-3.5 h-3.5 text-success" />
            <span>Actionable Rescue Recommendations</span>
          </div>
        </div>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'ROBUST': return 'text-success bg-success/10 border-success/25';
      case 'FRAGILE': return 'text-warning bg-warning/10 border-warning/25';
      case 'UNFEASIBLE': return 'text-critical bg-critical/10 border-critical/25';
      default: return 'text-gray-400 bg-surface border-border';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'ROBUST': return <ShieldCheck className="w-4 h-4 text-success" />;
      case 'FRAGILE': return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'UNFEASIBLE': return <ShieldAlert className="w-4 h-4 text-critical" />;
      default: return null;
    }
  };

  // Find the bottleneck node's title from graph
  const bottleneckNodeData = bottlenecks && bottlenecks.bottleneckNodes.length > 0 
    ? graph?.nodes.find(n => n.id === bottlenecks.bottleneckNodes[0].nodeId)
    : null;

  return (
    <div className="space-y-6 font-sans">
      {/* Panel title */}
      <div className="pb-2 border-b border-border/40">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
          Mission Intelligence
        </h2>
      </div>

      {/* Mission Health Card */}
      <div className="bg-surface border border-border/60 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
            Mission Health
          </h3>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getHealthColor(feasibility.scheduleHealth)}`}>
            {getHealthIcon(feasibility.scheduleHealth)}
            <span>{feasibility.scheduleHealth}</span>
          </span>
        </div>
        
        {feasibility.score < 1 && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Feasibility Coefficient</span>
              <span className="font-mono text-gray-200 font-bold">{(feasibility.score * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-background rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-primary" 
                style={{ width: `${feasibility.score * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Success Probability Card */}
      <div className="bg-surface border border-border/60 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
          Confidence Level
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-gray-100 font-mono">
            {(proposal.plannerConfidence * 100).toFixed(0)}%
          </span>
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            AI Baseline
          </span>
        </div>
        <p className="text-[10px] text-gray-500 leading-normal">
          Calculated from task complexity and structural density of dependencies.
        </p>
      </div>

      {/* Biggest Risk Card */}
      {bottlenecks && bottlenecks.bottleneckNodes.length > 0 && (
        <div className="bg-surface border border-border/60 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono text-warning">
            Biggest Risk
          </h3>
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-200">
                Structural Bottleneck
              </p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Node <span className="font-mono text-gray-300 font-semibold">'{bottleneckNodeData?.baseData?.title || bottlenecks.bottleneckNodes[0].nodeId}'</span> has {bottlenecks.bottleneckNodes[0].downstreamImpactCount} downstream dependencies. Delays here will cascade.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Next Action */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary animate-pulse" /> Recommended Action
        </h3>
        <p className="text-xs text-gray-200 leading-relaxed">
          {schedule?.criticalPathIds.length 
            ? `Review the ${schedule.criticalPathIds.length} tasks on the critical path. Any delay in these will immediately delay the project.`
            : 'Initialize the first task to begin execution.'}
        </p>
      </div>

      {/* Why PathForge Thinks This / Reasoning */}
      <div className="bg-surface border border-border/60 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
          Why PathForge Thinks This
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          {proposal.aiReasoning}
        </p>
      </div>
    </div>
  );
};
