import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { ShieldCheck, AlertTriangle, ArrowRight, Activity, Calendar, Zap, Compass, CheckCircle2, Award, Info, Command } from 'lucide-react';
import { motion } from 'motion/react';
import { HoverTilt } from '../../../components/HoverTilt';

export const MissionBriefing: React.FC = () => {
  const { 
    goal,
    proposal, 
    graph, 
    schedule, 
    feasibility, 
    confidence, 
    bottlenecks,
    setExperienceStage 
  } = useDashboardStore();

  if (!proposal || !schedule || !feasibility || !confidence || !graph) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center text-zinc-500 font-mono text-xs">
        Compiling tactical briefing deck...
      </div>
    );
  }

  // Calculate opening move: first critical path task
  const criticalResults = schedule.cpmResults
    .filter(r => r.isCritical)
    .sort((a, b) => a.earlyStart - b.earlyStart);

  const firstCriticalNodeId = criticalResults[0]?.nodeId;
  const firstCriticalTask = proposal.tasks.find(t => t.taskId === firstCriticalNodeId);

  // Formatting values
  const durationDays = schedule.projectDuration;
  const formattedDuration = durationDays % 1 === 0 ? durationDays : Number(durationDays.toFixed(1));
  const feasibilityScorePct = Math.round(feasibility.score * 100);

  // Identify bottleneck
  const highestBottleneck = bottlenecks && bottlenecks.bottleneckNodes.length > 0 
    ? bottlenecks.bottleneckNodes[0] 
    : null;
  const bottleneckTask = highestBottleneck 
    ? graph.nodes.find(n => n.id === highestBottleneck.nodeId)
    : null;

  // Schedule Health Status Styles
  const healthStyle = {
    ROBUST: {
      label: 'Stable & Robust',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      desc: 'Sufficient task spacing and scheduling buffers detected. Minimal delivery risk.'
    },
    FRAGILE: {
      label: 'Tight Buffers (Fragile)',
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      desc: 'High dependency density with tight margins. Small delays will ripple downstream.'
    },
    UNFEASIBLE: {
      label: 'Sequencing Errors',
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
      desc: 'Logical sequencing issues or circular paths. Reconfiguration suggested.'
    }
  }[feasibility.scheduleHealth] || {
    label: 'Standard',
    color: 'text-zinc-400 border-zinc-800 bg-zinc-900',
    icon: <ShieldCheck className="w-5 h-5 text-zinc-400" />,
    desc: 'Sequence configuration analyzed with neutral parameters.'
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col justify-between px-6 py-8 relative overflow-hidden select-none">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e03_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e03_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-zinc-900/40 z-10">
        <div className="space-y-0.5">
          <div className="text-sm font-extrabold tracking-tight text-white font-sans flex items-center gap-1.5">
            <Command className="w-4 h-4 text-indigo-400" />
            <span>PathForge</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">Executive Mission Briefing</div>
        </div>
        <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900/50 border border-zinc-800/60 px-2.5 py-1 rounded shadow-sm">
          STATUS: READY TO DEPLOY
        </span>
      </header>

      {/* Main content body */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full mx-auto space-y-8 z-10 flex-1 flex flex-col justify-center py-6"
      >
        {/* Mission Statement Row */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
            Mission Overview
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 leading-snug">
            {goal.split(' (Target:')[0]}
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed font-normal">
            {proposal.aiReasoning}
          </p>
        </div>

        {/* CEO Stat Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Estimated Completion */}
          <HoverTilt maxRotate={2.0} scale={1.015}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl p-5 space-y-2 flex flex-col justify-between min-h-[110px] h-full"
            >
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
                Estimated Completion
              </span>
              <div>
                <span className="text-2xl font-extrabold text-zinc-100 font-sans tracking-tight">
                  {formattedDuration}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono ml-1">Days</span>
              </div>
              <span className="text-[9px] text-zinc-600 font-medium">Critical path minimal bounds</span>
            </motion.div>
          </HoverTilt>

          {/* Today's First Priority */}
          <HoverTilt maxRotate={2.0} scale={1.015}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl p-5 space-y-2 flex flex-col justify-between min-h-[110px] h-full"
            >
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
                Today's First Priority
              </span>
              <div className="text-xs font-bold text-zinc-200 truncate pr-1">
                {firstCriticalTask?.title || 'Launch Task'}
              </div>
              <span className="text-[9px] text-indigo-400 font-mono leading-none block">
                {firstCriticalTask ? `${firstCriticalTask.mostLikelyDuration} days remaining` : 'Critical stream opener'}
              </span>
            </motion.div>
          </HoverTilt>

          {/* Dependency Health */}
          <HoverTilt maxRotate={2.0} scale={1.015}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl p-5 space-y-2 flex flex-col justify-between min-h-[110px] h-full"
            >
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
                Dependency Health
              </span>
              <div>
                <span className="text-2xl font-extrabold text-zinc-100 font-sans tracking-tight">
                  {feasibilityScorePct}%
                </span>
                <span className="text-[10px] text-emerald-400 ml-1.5 font-mono">Score</span>
              </div>
              <span className="text-[9px] text-zinc-500 font-medium truncate">
                {healthStyle.label}
              </span>
            </motion.div>
          </HoverTilt>

          {/* AI Confidence */}
          <HoverTilt maxRotate={2.0} scale={1.015}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl p-5 space-y-2 flex flex-col justify-between min-h-[110px] h-full"
            >
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
                AI Confidence
              </span>
              <div>
                <span className="text-2xl font-extrabold text-zinc-100 font-sans tracking-tight">
                  {Math.round(confidence.score)}%
                </span>
                <span className="text-[10px] text-zinc-500 ml-1.5 font-mono">Match</span>
              </div>
              <span className="text-[9px] text-zinc-600 font-medium">Topological alignment fit</span>
            </motion.div>
          </HoverTilt>

        </div>

        {/* Split Grid for Primary Risk and Recommendation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Primary Risk */}
          <HoverTilt maxRotate={1.5} scale={1.01}>
            <motion.div 
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.52, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl p-5 space-y-3.5 h-full"
            >
              <div className="flex items-center gap-1.5 text-zinc-400">
                <AlertTriangle className="w-4 h-4 text-amber-500/80" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Biggest Risk
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-200">
                  {bottleneckTask?.baseData?.title || 'Complex choke-point task'}
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                  This node acts as a central coordination hub with high downstream impact. A delay in completing this task will cause cascading scheduling delays.
                </p>
              </div>
              {highestBottleneck && (
                <div className="text-[9px] font-mono text-zinc-400 bg-zinc-950/40 p-2 rounded border border-zinc-900/40 flex justify-between items-center">
                  <span>Downstream Dependents:</span>
                  <span className="text-amber-400 font-bold">{highestBottleneck.fanOut} tasks waiting</span>
                </div>
              )}
            </motion.div>
          </HoverTilt>

          {/* Primary Recommendation */}
          <HoverTilt maxRotate={1.5} scale={1.01}>
            <motion.div 
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.52, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl p-5 space-y-3.5 h-full"
            >
              <div className="flex items-center gap-1.5 text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Why PathForge Suggested This
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-200">
                  Optimize critical path floats
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                  By decoupling early frontend mock interface layouts from heavy database provisioning scripts, development resources can collaborate in parallel. This avoids linear bottlenecks and maximizes schedule slack.
                </p>
              </div>
              <div className="text-[9px] font-mono text-zinc-400 bg-zinc-950/40 p-2 rounded border border-zinc-900/40 flex justify-between items-center">
                <span>Primary Recovery:</span>
                <span className="text-emerald-400 font-bold">Mock contract integration</span>
              </div>
            </motion.div>
          </HoverTilt>

        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-900/40">
          <p className="text-[10px] text-zinc-600 font-mono">
            Topological constraints verified. Sequence ready.
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setExperienceStage('EXECUTION_WORKSPACE')}
            className="px-5 py-3.5 btn-material-primary rounded-xl cursor-pointer flex items-center gap-2 group shadow-lg"
          >
            <span>Continue to Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>

      </motion.div>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-[10px] text-zinc-700 font-mono text-center pt-4 border-t border-zinc-950">
        PathForge Platform • Mathematically Validated Scheduling Models
      </footer>
    </div>
  );
};
