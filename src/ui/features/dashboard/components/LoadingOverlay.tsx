import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';

export const LoadingOverlay: React.FC = () => {
  const { isGenerating } = useDashboardStore();

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center max-w-sm w-full mx-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Executing Pipeline</h3>
        <p className="text-sm text-gray-500 text-center">Processing graph algorithms and heuristic analysis...</p>
      </div>
    </div>
  );
};
