import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { Target, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface GoalInputProps {
  onGenerate: () => void;
}

export const GoalInput: React.FC<GoalInputProps> = ({ onGenerate }) => {
  const { goal, setGoal, isGenerating } = useDashboardStore();

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
      className="flex flex-col gap-6 p-6 font-sans"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
        }}
      >
        <label htmlFor="goal" className="block text-xs font-semibold text-zinc-400 mb-2 tracking-wide uppercase font-mono">
          Mission parameters
        </label>
        <div className="relative group">
          {/* Subtle glow border effect on hover/focus */}
          <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <textarea
            id="goal"
            className="relative w-full min-h-[160px] p-4 rounded-xl border border-zinc-800/80 bg-[#070709] text-zinc-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none text-xs leading-relaxed transition-all duration-300 placeholder:text-zinc-600 focus:bg-[#09090c] outline-none"
            placeholder="Describe your project goal, scope, and target milestones to synthesize a deterministic timeline..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isGenerating}
          />
          <div className="absolute bottom-3 right-3 text-[9px] text-zinc-600 font-mono tracking-widest uppercase">
            det.sys
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-2 tracking-wide uppercase font-mono">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            Execution horizon
          </label>
          <div className="relative">
            <input 
              type="text" 
              value="Derived dynamically via CPM"
              className="w-full p-3 pl-4 rounded-xl border border-zinc-800/40 bg-[#070709] text-zinc-500 text-xs font-mono select-none cursor-not-allowed uppercase tracking-wider"
              disabled
            />
            <span className="absolute right-4 top-3.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500/30 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500/70"></span>
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed font-sans">
            Target dates are modeled from topological dependency constraints.
          </p>
        </div>
      </motion.div>

      <motion.button
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
        }}
        whileHover={{ 
          y: -2, 
          scale: 1.015,
          boxShadow: "0 12px 25px -10px rgba(99,102,241,0.25)",
          borderColor: "rgba(99,102,241,0.45)"
        }}
        whileTap={{ scale: 0.98 }}
        className="mt-2 w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-indigo-500/90 to-indigo-600/90 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 group cursor-pointer border border-indigo-500/25 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onGenerate}
        disabled={!goal.trim() || isGenerating}
      >
        <Target className="w-3.5 h-3.5 text-white/95 group-hover:scale-110 transition-transform" />
        <span>{isGenerating ? 'Synthesizing pipeline...' : 'Synthesize Execution Plan'}</span>
        <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

