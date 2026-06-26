import React from 'react';
import { Target } from 'lucide-react';

export const MissionHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-zinc-800/40 bg-gradient-to-b from-[#0b0b0d] to-[#08080a]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/5 border border-indigo-500/25 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-zinc-100 font-sans">PathForge</h1>
              <span className="text-[8px] bg-indigo-500/5 border border-indigo-500/25 text-indigo-400/90 px-1.5 py-0.5 rounded-md font-mono font-semibold tracking-wider">
                v2.0
              </span>
            </div>
            <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-1">
              Mission Operating System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
