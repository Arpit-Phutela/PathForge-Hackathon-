import React from 'react';
import { Target, Command } from 'lucide-react';
import { useDashboardStore } from '../../../state/useDashboardStore';

export const MissionHeader: React.FC = () => {
  const { isDemo } = useDashboardStore();

  return (
    <div className="p-6 border-b border-zinc-900 bg-[#08080a]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-indigo-400">
            <Command className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-white font-sans">PathForge</h1>
              {isDemo && (
                <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-semibold tracking-wider uppercase">
                  Demo Mission
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-tight mt-0.5 leading-none">
              Plan smarter.<br />
              Execute with confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
