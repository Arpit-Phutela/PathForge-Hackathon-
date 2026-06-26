import React from 'react';
import { Target } from 'lucide-react';

export const MissionHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-[#1e1e24] bg-gradient-to-b from-[#0e0e11] to-[#0c0c0e]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 shadow-sm">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-gray-100">PathForge</h1>
              <span className="text-[9px] bg-[#1e1e24] text-gray-400 px-1.5 py-0.5 rounded font-mono tracking-wider">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mt-0.5">
              Execution Intelligence OS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
