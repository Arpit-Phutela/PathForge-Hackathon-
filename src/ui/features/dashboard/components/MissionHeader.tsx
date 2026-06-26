import React from 'react';
import { Target, Shield } from 'lucide-react';

export const MissionHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-border bg-surface/40 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-gradient-to-br from-primary/20 to-blue-500/5 border border-primary/30 rounded-xl text-primary shadow-inner">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-gray-100">PathForge</h1>
              <span className="text-[9px] bg-border text-gray-400 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">
                v1.5
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-0.5">
              Execution Intelligence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
