import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { AlertOctagon, HelpCircle } from 'lucide-react';

export const ErrorPanel: React.FC = () => {
  const { error } = useDashboardStore();

  if (!error) return null;

  return (
    <div className="bg-gradient-to-r from-critical/15 via-critical/5 to-transparent border border-critical/30 rounded-xl p-5 shadow-lg shadow-critical/5 font-sans">
      <div className="flex gap-4">
        <div className="p-2 bg-critical/20 border border-critical/30 rounded-lg text-critical h-fit">
          <AlertOctagon className="h-5 w-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-gray-200 tracking-tight">Execution Blocked</h3>
            <span className="text-[9px] bg-critical/10 border border-critical/30 text-critical px-2 py-0.5 rounded-full font-mono uppercase tracking-widest font-bold">
              Audit Failure
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-medium">
            {error}
          </p>
          <div className="pt-2 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Please refine your goal parameters on the left and re-submit the mission.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
