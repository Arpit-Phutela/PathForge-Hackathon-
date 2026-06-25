import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';

export const CriticalPathPanel: React.FC = () => {
  const { schedule, graph } = useDashboardStore();

  if (!schedule || !graph) return null;

  const criticalTasks = schedule.criticalPathIds
    .filter(id => id !== 'VIRTUAL_SOURCE' && id !== 'VIRTUAL_SINK')
    .map(id => {
      const node = graph.nodes.find(n => n.id === id);
      const metrics = schedule.cpmResults.find(m => m.nodeId === id);
      return { id, name: node?.baseData?.title || id, metrics };
    });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800">Critical Path Analysis</h2>
        <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          Project Duration: {schedule.projectDuration.toFixed(2)} days
        </span>
      </div>
      <div className="p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 text-left">Task</th>
              <th className="px-5 py-3 text-right">Duration (E)</th>
              <th className="px-5 py-3 text-right">Early Start</th>
              <th className="px-5 py-3 text-right">Early Finish</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {criticalTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{task.name}</td>
                <td className="px-5 py-3 text-right text-gray-500">{task.metrics?.pertDuration.toFixed(2)}</td>
                <td className="px-5 py-3 text-right text-gray-500">{task.metrics?.earlyStart.toFixed(2)}</td>
                <td className="px-5 py-3 text-right text-gray-500">{task.metrics?.earlyFinish.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
