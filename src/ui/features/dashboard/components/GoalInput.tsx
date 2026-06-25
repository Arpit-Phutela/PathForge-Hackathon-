import React from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';

interface GoalInputProps {
  onGenerate: () => void;
}

export const GoalInput: React.FC<GoalInputProps> = ({ onGenerate }) => {
  const { goal, setGoal, isGenerating } = useDashboardStore();

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <label htmlFor="goal" className="block text-sm font-semibold text-gray-700 mb-2">
          Project Goal
        </label>
        <textarea
          id="goal"
          className="w-full min-h-[120px] p-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y text-sm"
          placeholder="e.g., Launch a new React Native application with social login..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          disabled={isGenerating}
        />
      </div>
      <button
        className="self-end px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={onGenerate}
        disabled={!goal.trim() || isGenerating}
      >
        {isGenerating ? 'Executing Pipeline...' : 'Run Pipeline'}
      </button>
    </div>
  );
};
