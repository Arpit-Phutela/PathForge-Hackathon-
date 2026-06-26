import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { Target, Calendar, ArrowRight } from 'lucide-react';

interface GoalInputProps {
  onGenerate: () => void;
}

export const GoalInput: React.FC<GoalInputProps> = ({ onGenerate }) => {
  const { goal, setGoal, isGenerating } = useDashboardStore();

  return (
    <div className="flex flex-col gap-5 p-6 font-sans">
      <div>
        <label htmlFor="goal" className="block text-xs font-medium text-zinc-400 mb-2">
          Mission Scope
        </label>
        <div className="relative">
          <textarea
            id="goal"
            className="w-full min-h-[150px] p-4 rounded-xl border border-[#1e1e24] bg-[#070708] text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 resize-none text-xs leading-relaxed transition-all duration-200 placeholder:text-zinc-600 focus:bg-[#09090b]"
            placeholder="e.g., Launch mobile application beta by December 1, establishing payment APIs, configuring push notifications, and completing security audits."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isGenerating}
          />
          <div className="absolute bottom-3 right-3 text-[9px] text-zinc-600 font-mono tracking-wider">
            DET-ENGINE
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            Execution Horizon
          </label>
          <div className="relative">
            <input 
              type="text" 
              value="Derived dynamically via CPM"
              className="w-full p-3 rounded-xl border border-[#1e1e24]/60 bg-[#070708] text-zinc-500 text-xs font-mono select-none cursor-not-allowed"
              disabled
            />
            <span className="absolute right-3.5 top-3.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
            PathForge calculates target deadlines mathematically from topological dependency constraints.
          </p>
        </div>
      </div>

      <button
        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-medium tracking-wide shadow-lg shadow-indigo-600/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 group cursor-pointer border border-indigo-500/20"
        onClick={onGenerate}
        disabled={!goal.trim() || isGenerating}
      >
        <Target className="w-3.5 h-3.5 text-white/90 group-hover:scale-105 transition-transform" />
        <span className="font-semibold">{isGenerating ? 'AI Mission Synthesis Active...' : 'Generate Execution Plan'}</span>
        <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

