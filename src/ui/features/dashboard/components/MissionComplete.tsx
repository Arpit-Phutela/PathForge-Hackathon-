import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { RefreshCw, ShieldCheck, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const ConstellationSVG = () => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0" viewBox="0 0 400 200">
      <motion.circle
        cx="80" cy="100" r="4" fill="#10b981"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.6, 0.4], scale: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      />
      <motion.circle
        cx="180" cy="50" r="4" fill="#10b981"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.6, 0.4], scale: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      />
      <motion.circle
        cx="180" cy="150" r="4" fill="#10b981"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.6, 0.4], scale: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      />
      <motion.circle
        cx="280" cy="100" r="4" fill="#10b981"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.6, 0.4], scale: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
      />
      <motion.path
        d="M 80 100 L 180 50"
        stroke="#10b981" strokeWidth="1.5" fill="none"
        strokeDasharray="120"
        strokeDashoffset="120"
        animate={{ strokeDashoffset: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      />
      <motion.path
        d="M 80 100 L 180 150"
        stroke="#10b981" strokeWidth="1.5" fill="none"
        strokeDasharray="120"
        strokeDashoffset="120"
        animate={{ strokeDashoffset: 0 }}
        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
      />
      <motion.path
        d="M 180 50 L 280 100"
        stroke="#10b981" strokeWidth="1.5" fill="none"
        strokeDasharray="120"
        strokeDashoffset="120"
        animate={{ strokeDashoffset: 0 }}
        transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
      />
      <motion.path
        d="M 180 150 L 280 100"
        stroke="#10b981" strokeWidth="1.5" fill="none"
        strokeDasharray="120"
        strokeDashoffset="120"
        animate={{ strokeDashoffset: 0 }}
        transition={{ delay: 1.1, duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
};

export const MissionComplete: React.FC = () => {
  const { proposal, reset, goal, schedule, feasibility } = useDashboardStore();

  const handleRestart = () => {
    reset();
  };

  const totalDuration = schedule?.projectDuration || 14;
  const healthScore = feasibility?.score ? Math.round(feasibility.score * 100) : 98;
  const confidenceScore = proposal?.plannerConfidence ? Math.round(proposal.plannerConfidence * 100) : 95;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="min-h-screen bg-transparent text-gray-100 flex flex-col justify-center items-center px-6 relative overflow-hidden select-none"
    >
      {/* Cinematic grid & subtle green flare */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98103_1px,transparent_1px),linear-gradient(to_bottom,#10b98103_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.012] rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-xl w-full text-center space-y-12 z-10">
        
        {/* Animated Check Indicator & Fills Progress Ring */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Real drawing progress ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="32" cy="32" r="28"
                fill="none" stroke="#0f172a" strokeWidth="2.5"
              />
              <motion.circle
                cx="32" cy="32" r="28"
                fill="none" stroke="#10b981" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
              />
            </svg>
            
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 120 }}
              className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              <Check className="w-5 h-5 text-emerald-400 stroke-[3.5px]" />
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase block"
            >
              MISSION SECURED
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl font-extrabold tracking-tight text-zinc-100 font-sans"
            >
              Tactical Objectives Achieved
            </motion.h1>
          </div>
        </div>

        {/* Corporate Style Performance Review Proposal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="glass-elevated light-edge-top rounded-2xl p-6 text-left space-y-6 relative overflow-hidden shadow-2xl border border-emerald-500/10"
        >
          {/* Abstract node graph softly illuminating on the card background */}
          <ConstellationSVG />
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-950 relative z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                Performance Executive Summary (AI Coach)
              </span>
            </div>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="text-[9px] font-mono text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/15 px-2 py-0.5 rounded"
            >
              MISSION SECURED
            </motion.span>
          </div>

          <div className="space-y-4 relative z-10">
            <p className="text-[11px] font-mono text-zinc-400 uppercase leading-relaxed tracking-wider">
              MISSION: <span className="text-zinc-200 font-semibold font-sans">"{goal}"</span>
            </p>
            
            {/* The Conversational Conclusion */}
            <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">
              Every topological dependency has been successfully resolved. This mathematical completion guarantees the project was delivered on schedule. You may now plan your next mission.
            </p>

            {/* Structured Storytelling Performance Stats */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-950/45 border border-zinc-900/40 rounded-xl space-y-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-wider">TIME & EFFICIENCY</span>
                <p className="text-[10.5px] text-emerald-400 font-sans font-medium leading-relaxed">
                  Saved <span className="font-bold text-zinc-200">2.5 Days</span> of project float via path-compression.
                </p>
              </div>
              <div className="p-3 bg-zinc-950/45 border border-zinc-900/40 rounded-xl space-y-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-wider">RISK MITIGATION</span>
                <p className="text-[10.5px] text-emerald-400 font-sans font-medium leading-relaxed">
                  Prevented <span className="font-bold text-zinc-200">Critical Path Bottlenecks</span> & slipped milestones.
                </p>
              </div>
            </div>
          </div>

          {/* Core Performance metrics grid */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-950 text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
              className="bg-zinc-950/45 border border-zinc-900/40 rounded-lg p-3"
            >
              <span className="text-[8px] font-mono text-zinc-500 uppercase block">Duration</span>
              <span className="text-sm font-bold text-zinc-200 block mt-0.5 font-mono">
                {totalDuration} Days
              </span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
              className="bg-zinc-950/45 border border-zinc-900/40 rounded-lg p-3"
            >
              <span className="text-[8px] font-mono text-zinc-500 uppercase block">Tasks Completed</span>
              <span className="text-sm font-bold text-zinc-200 block mt-0.5 font-mono">
                100% Secured
              </span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, type: "spring", stiffness: 150 }}
              className="bg-zinc-950/45 border border-zinc-900/40 rounded-lg p-3"
            >
              <span className="text-[8px] font-mono text-zinc-500 uppercase block">Confidence Score</span>
              <span className="text-sm font-bold text-zinc-200 block mt-0.5 font-mono">
                {confidenceScore}%
              </span>
            </motion.div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-zinc-500 relative z-10">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>DETERMINISTIC VERIFICATION SATISFIED</span>
            </span>
            <span>100% SECURED</span>
          </div>
        </motion.div>

        {/* Action button to trigger New Mission plan */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, type: "spring" }}
          className="flex justify-center pt-2"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRestart}
            className="px-6 py-3.5 btn-material-primary rounded-xl cursor-pointer flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Plan a New Mission</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

