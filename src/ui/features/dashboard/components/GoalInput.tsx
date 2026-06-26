import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { Target, Calendar, ArrowRight } from 'lucide-react';

interface GoalInputProps {
  onGenerate: () => void;
}

export const GoalInput: React.FC<GoalInputProps> = ({ onGenerate }) => {
  const { goal, setGoal, isGenerating } = useDashboardStore();

  return (
    <div className="flex flex-col gap-6 p-6 font-sans">
      <div>
        <label htmlFor="goal" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">
          Define Mission Scope
        </label>
        <div className="relative">
          <textarea
            id="goal"
            className="w-full min-h-[140px] p-4 rounded-lg border border-border bg-background/50 text-gray-100 shadow-inner focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none text-sm leading-relaxed transition-all duration-200 placeholder:text-gray-600 focus:bg-background"
            placeholder="e.g., Build and launch the mobile application beta by December 1, establishing payment APIs, configuring push alerts, and passing security audits..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isGenerating}
          />
          <div className="absolute bottom-3 right-3 text-[10px] text-gray-600 font-mono">
            Deterministic Engine
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            Execution Horizon
          </label>
          <div className="relative">
            <input 
              type="text" 
              value="Derived dynamically via CPM"
              className="w-full p-3 rounded-lg border border-border/40 bg-surface/30 text-gray-500 text-xs font-mono select-none cursor-not-allowed"
              disabled
            />
            <span className="absolute right-3 top-3.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary/70"></span>
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5 leading-normal">
            PathForge calculates deadlines mathematically from constraints rather than static guesses.
          </p>
        </div>
      </div>

      <button
        className="mt-2 w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/95 hover:to-blue-600/95 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98] border border-primary/20 group cursor-pointer"
        onClick={onGenerate}
        disabled={!goal.trim() || isGenerating}
      >
        <Target className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
        <span>{isGenerating ? 'AI Command Active...' : 'Save My Deadline'}</span>
        <ArrowRight className="w-4 h-4 ml-0.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

