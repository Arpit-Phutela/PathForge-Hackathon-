import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { StatisticsCard } from './StatisticsCard';

export const AnalysisPanel: React.FC = () => {
  const { graph, schedule, feasibility, confidence, bottlenecks } = useDashboardStore();

  if (!graph || !schedule || !feasibility || !confidence || !bottlenecks) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-base font-semibold text-gray-800">Heuristics & Analysis</h2>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticsCard 
          title="Feasibility Score" 
          value={`${(feasibility.score * 100).toFixed(0)}%`} 
          subtitle={feasibility.scheduleHealth}
          highlight={feasibility.score < 0.6}
        />
        <StatisticsCard 
          title="Confidence Index" 
          value={`${confidence.score.toFixed(0)} / 100`}
          subtitle={`${confidence.penaltiesApplied.length} penalty factors`}
        />
        <StatisticsCard 
          title="Identified Bottlenecks" 
          value={bottlenecks.bottleneckNodes.length}
          subtitle="Requires attention"
          highlight={bottlenecks.bottleneckNodes.length > 0}
        />
      </div>

      {bottlenecks.bottleneckNodes.length > 0 && (
        <div className="px-5 pb-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Top Bottlenecks</h4>
          <div className="space-y-2">
            {bottlenecks.bottleneckNodes.slice(0, 3).map(b => {
               const node = graph.nodes.find(n => n.id === b.nodeId);
               return (
                 <div key={b.nodeId} className="flex justify-between items-center p-3 bg-orange-50 border border-orange-100 rounded-md">
                   <div className="text-sm font-medium text-orange-900">{node?.baseData?.title || b.nodeId}</div>
                   <div className="text-xs text-orange-700">Downstream Impact: {b.downstreamImpactCount}</div>
                 </div>
               )
            })}
          </div>
        </div>
      )}
    </div>
  );
};
