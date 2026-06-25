import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';

export const PipelineStatus: React.FC = () => {
  const { proposal, graph, schedule, feasibility, error } = useDashboardStore();

  const steps = [
    { name: '1. AI Planning', status: proposal ? 'complete' : (error && !proposal) ? 'error' : 'pending' },
    { name: '2. Graph Building', status: graph ? 'complete' : (error && proposal && !graph) ? 'error' : 'pending' },
    { name: '3. CPM Scheduling', status: schedule ? 'complete' : (error && graph && !schedule) ? 'error' : 'pending' },
    { name: '4. Analysis & Heuristics', status: feasibility ? 'complete' : (error && schedule && !feasibility) ? 'error' : 'pending' }
  ];

  return (
    <div className="px-6 pb-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Pipeline Status</h3>
      <ul className="space-y-3">
        {steps.map((step) => (
          <li key={step.name} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${
              step.status === 'complete' ? 'bg-green-500' :
              step.status === 'error' ? 'bg-red-500' :
              'bg-gray-200'
            }`} />
            <span className={`text-sm ${
              step.status === 'complete' ? 'text-gray-900 font-medium' :
              step.status === 'error' ? 'text-red-600 font-medium' :
              'text-gray-400'
            }`}>
              {step.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
