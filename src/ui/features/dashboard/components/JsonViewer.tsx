import React, { useState } from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';

export const JsonViewer: React.FC = () => {
  const { proposal, graph, schedule, feasibility, confidence, bottlenecks } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<'proposal' | 'graph' | 'schedule' | 'analysis'>('proposal');

  const dataMap = {
    proposal,
    graph,
    schedule,
    analysis: { feasibility, confidence, bottlenecks }
  };

  const currentData = dataMap[activeTab];
  if (!proposal && !graph && !schedule && !feasibility) return null;

  return (
    <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden mb-6 flex flex-col">
      <div className="px-5 py-3 border-b border-gray-700 bg-gray-800 flex gap-4">
        {(Object.keys(dataMap) as Array<keyof typeof dataMap>).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
            disabled={!dataMap[tab]}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
        <pre className="text-xs text-green-400 font-mono">
          {currentData ? JSON.stringify(currentData, null, 2) : 'No data available'}
        </pre>
      </div>
    </div>
  );
};
