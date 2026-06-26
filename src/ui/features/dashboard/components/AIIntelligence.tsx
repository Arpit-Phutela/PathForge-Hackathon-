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
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface AIIntelligenceProps {
  selectedNodeId?: string | null;
  onSelectNode?: (id: string | null) => void;
}

export const AIIntelligence: React.FC<AIIntelligenceProps> = ({ selectedNodeId, onSelectNode }) => {
  const { proposal, feasibility, schedule, bottlenecks, graph } = useDashboardStore();

  // Polished Sidebar Empty State (educational / onboarding)
  if (!proposal || !feasibility) {
    return (
      <div className="flex flex-col h-full py-12 px-6 justify-center items-center text-center font-sans space-y-6">
        <div className="relative flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute h-16 w-16 border border-dashed border-[#1e1e24] rounded-full"
          />
          <div className="p-3 bg-[#0c0c0e] border border-[#1e1e24] rounded-2xl text-zinc-500 relative z-10 shadow-sm">
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

        <div className="w-full space-y-2.5 text-left bg-[#070708] border border-[#1e1e24] rounded-xl p-4 text-[10px] font-mono text-zinc-400">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mathematical Schedule Health</span>
          </div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Baseline Confidence Score</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Cascading Dependency Bottlenecks</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>Actionable Rescue Recommendations</span>
          </div>
        </div>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'ROBUST': return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20';
      case 'FRAGILE': return 'text-amber-400 bg-amber-500/5 border-amber-500/20';
      case 'UNFEASIBLE': return 'text-rose-400 bg-rose-500/5 border-rose-500/20';
      default: return 'text-zinc-400 bg-[#0c0c0e] border-[#1e1e24]';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'ROBUST': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'FRAGILE': return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'UNFEASIBLE': return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      default: return null;
    }
  };

  // Find the bottleneck node's title from graph
  const bottleneckNodeData = bottlenecks && bottlenecks.bottleneckNodes.length > 0 
    ? graph?.nodes.find(n => n.id === bottlenecks.bottleneckNodes[0].nodeId)
    : null;

  // Find selected node details for Task Intelligence
  const selectedNode = selectedNodeId && graph
    ? graph.nodes.find(n => n.id === selectedNodeId)
    : null;
  const selectedCpm = selectedNodeId && schedule
    ? schedule.cpmResults.find(r => r.nodeId === selectedNodeId)
    : null;
  const selectedBottleneck = selectedNodeId && bottlenecks
    ? bottlenecks.bottleneckNodes.find(b => b.nodeId === selectedNodeId)
    : null;

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    health: true,
    confidence: true,
    risk: true,
    action: true,
    formulation: false
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Panel title & Task Intelligence HUD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
        {/* Panel title */}
        <div className="pb-3 border-b border-[#1e1e24] flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">
            Mission Intelligence
          </h2>
          <span className="text-[9px] text-zinc-500 font-mono">ANALYSIS ENGINE</span>
        </div>

        {/* Task Intelligence HUD if selected */}
        {selectedNode && selectedCpm && (
          <div className="bg-[#0c0c0e] border border-indigo-500/20 rounded-xl p-5 shadow-lg shadow-indigo-500/5 space-y-4 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <button 
                onClick={() => onSelectNode?.(null)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors text-[9px] font-mono tracking-wider cursor-pointer bg-[#070708] border border-[#1e1e24] px-2 py-1 rounded"
              >
                [CLEAR]
              </button>
            </div>
            <div className="space-y-1.5 pr-14">
              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-semibold">
                Focused Task
              </span>
              <h3 className="text-xs font-semibold text-zinc-100 tracking-tight leading-snug truncate">
                {selectedNode.baseData?.title || (selectedNode.type === 'VIRTUAL_SOURCE' ? 'Start Anchor' : 'End Anchor')}
              </h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic line-clamp-2">
                {selectedNode.baseData?.description || 'Virtual topological anchor node for mathematical CPM computation.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 font-mono text-[9px]">
              <div className="bg-[#070708] border border-[#1e1e24] rounded-lg p-2.5">
                <span className="text-zinc-500 text-[8px] block">CRITICALITY</span>
                <span className={`font-semibold mt-0.5 block ${selectedCpm?.isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedCpm?.isCritical ? '⚠️ CRITICAL' : '✅ ROBUST'}
                </span>
              </div>
              <div className="bg-[#070708] border border-[#1e1e24] rounded-lg p-2.5">
                <span className="text-zinc-500 text-[8px] block">TOTAL FLOAT</span>
                <span className={`font-semibold mt-0.5 block ${selectedCpm && selectedCpm.totalFloat > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
                  {(selectedCpm?.totalFloat ?? 0) % 1 === 0 ? selectedCpm?.totalFloat : selectedCpm?.totalFloat.toFixed(1)} Days
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <h4 className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Why This Task Matters</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  {selectedCpm?.isCritical 
                    ? "This task sits directly on the deterministic critical path. Any delay in this step will cause an immediate, day-for-day delay to your overall deadline."
                    : `This task contains a schedule buffer of ${(selectedCpm?.totalFloat ?? 0) % 1 === 0 ? selectedCpm?.totalFloat : selectedCpm?.totalFloat.toFixed(1)} days. You can delay or extend its execution within this window without impacting the final delivery date.`}
                </p>
              </div>

              {selectedBottleneck && (
                <div className="space-y-1">
                  <h4 className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Cascading Blocker Risk</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    This task represents a key structural choke point. It has <strong className="text-zinc-200 font-normal font-mono">{selectedBottleneck.fanIn}</strong> incoming prerequisites and <strong className="text-zinc-200 font-normal font-mono">{selectedBottleneck.fanOut}</strong> outgoing dependent tasks, directly constraining <strong className="text-amber-400 font-mono">{selectedBottleneck.downstreamImpactCount}</strong> steps.
                  </p>
                </div>
              )}
              
              <div className="space-y-1">
                <h4 className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Temporal Bound Calculations</h4>
                <div className="grid grid-cols-4 gap-1 text-[9px] font-mono bg-[#070708] border border-[#1e1e24] rounded-lg p-2 text-center text-zinc-400">
                  <div>
                    <span className="text-[7px] text-zinc-500 block">ES</span>
                    <span className="text-zinc-200 font-semibold">{(selectedCpm?.earlyStart ?? 0).toFixed(1)}d</span>
                  </div>
                  <div>
                    <span className="text-[7px] text-zinc-500 block">EF</span>
                    <span className="text-zinc-200 font-semibold">{(selectedCpm?.earlyFinish ?? 0).toFixed(1)}d</span>
                  </div>
                  <div>
                    <span className="text-[7px] text-zinc-500 block">LS</span>
                    <span className="text-zinc-200 font-semibold">{(selectedCpm?.lateStart ?? 0).toFixed(1)}d</span>
                  </div>
                  <div>
                    <span className="text-[7px] text-zinc-500 block">LF</span>
                    <span className="text-zinc-200 font-semibold">{(selectedCpm?.lateFinish ?? 0).toFixed(1)}d</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* 1. MISSION HEALTH CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-4 shadow-sm hover:border-zinc-800 transition-all duration-300 flex flex-col relative group"
      >
        <div 
          onClick={() => toggleSection('health')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            {getHealthIcon(feasibility.scheduleHealth) || <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
              Deterministic Schedule Feasibility
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono border ${getHealthColor(feasibility.scheduleHealth)}`}>
              {feasibility.scheduleHealth}
            </span>
            <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${expandedSections.health ? 'rotate-90' : ''}`} />
          </div>
        </div>
        
        <p className="text-[10px] text-zinc-400 mt-2.5 leading-relaxed">
          The proposed campaign workflow possesses a structural feasibility coefficient of <strong className="text-zinc-100 font-semibold font-mono">{(feasibility.score * 100).toFixed(0)}%</strong>.
        </p>

        {expandedSections.health && (
          <div className="pt-3.5 border-t border-[#1e1e24] mt-3.5 space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500">Feasibility Coefficient</span>
                <span className="font-mono text-zinc-300 font-semibold">{(feasibility.score * 100).toFixed(0)}%</span>
              </div>
              <div className="h-[3px] bg-[#070708] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500" 
                  style={{ width: `${feasibility.score * 100}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              This metrics index evaluates prerequisite chain depth, graph fragmentation ratios, and active critical path density to mathematically guarantee project executability under real-world constraints.
            </p>
          </div>
        )}
      </motion.div>

      {/* 2. CONFIDENCE LEVEL CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-4 shadow-sm hover:border-zinc-800 transition-all duration-300 flex flex-col relative group"
      >
        <div 
          onClick={() => toggleSection('confidence')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
              Generative Synthesizer Confidence
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono border border-indigo-500/20 bg-indigo-500/5 text-indigo-400">
              {(proposal.plannerConfidence * 100).toFixed(0)}% TRUST
            </span>
            <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${expandedSections.confidence ? 'rotate-90' : ''}`} />
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 mt-2.5 leading-relaxed">
          Gemini synthesis algorithm has aligned objectives with a generative trust level of <strong className="text-zinc-100 font-semibold font-mono">{(proposal.plannerConfidence * 100).toFixed(0)}%</strong>.
        </p>

        {expandedSections.confidence && (
          <div className="pt-3.5 border-t border-[#1e1e24] mt-3.5 space-y-2">
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Derived dynamically by applying heuristic regression penalties against explicit unresolved assumptions, estimation standard deviations, and topological sequencing complexity.
            </p>
          </div>
        )}
      </motion.div>

      {/* 3. BIGGEST RISK CARD */}
      {bottlenecks && bottlenecks.bottleneckNodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-4 shadow-sm hover:border-zinc-800 transition-all duration-300 flex flex-col relative group"
        >
          <div 
            onClick={() => toggleSection('risk')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
                Topological Blocker Isolation
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono border border-rose-500/20 bg-rose-500/5 text-rose-400">
                CRITICAL CHOKEPOINT
              </span>
              <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${expandedSections.risk ? 'rotate-90' : ''}`} />
            </div>
          </div>

          <p className="text-[10px] text-zinc-400 mt-2.5 leading-relaxed">
            Critical dependency bottleneck isolated at task <span className="font-mono text-zinc-300 font-semibold">'{bottleneckNodeData?.baseData?.title || bottlenecks.bottleneckNodes[0].nodeId}'</span>.
          </p>

          {expandedSections.risk && (
            <div className="pt-3.5 border-t border-[#1e1e24] mt-3.5 space-y-2 text-[10px] text-zinc-500 leading-relaxed">
              <p>
                This node controls <strong className="text-zinc-300 font-normal font-mono">{bottlenecks.bottleneckNodes[0].fanIn}</strong> prerequisite links and directly constrains <strong className="text-zinc-300 font-normal font-mono">{bottlenecks.bottleneckNodes[0].fanOut}</strong> downstream tasks, establishing a cascading impact score of <strong className="text-amber-400 font-semibold font-mono">{bottlenecks.bottleneckNodes[0].downstreamImpactCount}</strong> steps. Any delay will instantly impact final delivery.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* 4. RECOMMENDED NEXT ACTION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-4 shadow-sm hover:border-zinc-800 transition-all duration-300 flex flex-col relative group"
      >
        <div 
          onClick={() => toggleSection('action')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
              Algorithmic Rescue Directives
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono border border-indigo-500/20 bg-indigo-500/5 text-indigo-400">
              ACTION REQUIRED
            </span>
            <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${expandedSections.action ? 'rotate-90' : ''}`} />
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 mt-2.5 leading-relaxed">
          Safeguard resources and execute continuous oversight on the active critical path.
        </p>

        {expandedSections.action && (
          <div className="pt-3.5 border-t border-[#1e1e24] mt-3.5 space-y-2 text-[10px] text-zinc-500 leading-relaxed">
            <p>
              {schedule?.criticalPathIds.length 
                ? `Analyze the ${schedule.criticalPathIds.filter(id => !id.includes('V_SRC') && !id.includes('V_SNK')).length} critical tasks immediately. These nodes represent a mathematical scheduling window of exactly zero flexibility.`
                : 'Initialize first task sequence dependencies to secure primary launch milestones.'}
            </p>
          </div>
        )}
      </motion.div>

      {/* 5. LOGICAL FORMULATION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-4 shadow-sm hover:border-zinc-800 transition-all duration-300 flex flex-col relative group"
      >
        <div 
          onClick={() => toggleSection('formulation')}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
              Campaign Strategy Reasoning
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono border border-zinc-700 bg-zinc-800/10 text-zinc-400">
              MODEL SYNTHESIS
            </span>
            <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${expandedSections.formulation ? 'rotate-90' : ''}`} />
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 mt-2.5 leading-relaxed">
          Overview of the generative model's topological campaign mapping strategy.
        </p>

        {expandedSections.formulation && (
          <div className="pt-3.5 border-t border-[#1e1e24] mt-3.5 space-y-2">
            <p className="text-[10px] text-zinc-500 leading-relaxed font-sans whitespace-pre-wrap">
              {proposal.aiReasoning}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
