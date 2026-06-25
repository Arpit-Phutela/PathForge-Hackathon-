import React from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { GoalInput } from './components/GoalInput';
import { PipelineStatus } from './components/PipelineStatus';
import { CriticalPathPanel } from './components/CriticalPathPanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { JsonViewer } from './components/JsonViewer';
import { ErrorPanel } from './components/ErrorPanel';
import { LoadingOverlay } from './components/LoadingOverlay';
import { useDashboardStore } from '../../state/useDashboardStore';
import { usePipeline } from '../../hooks/usePipeline';

export function Dashboard() {
  const { goal } = useDashboardStore();
  const { mutate } = usePipeline();

  const handleGenerate = () => {
    mutate(goal);
  };

  const header = (
    <div className="px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">PathForge Developer Console</h1>
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Milestone 5A (Internal)</span>
    </div>
  );

  const sidebar = (
    <div className="flex flex-col h-full divide-y divide-gray-200">
      <GoalInput onGenerate={handleGenerate} />
      <div className="pt-6">
        <PipelineStatus />
      </div>
    </div>
  );

  const main = (
    <div className="max-w-5xl mx-auto">
      <ErrorPanel />
      <AnalysisPanel />
      <CriticalPathPanel />
      <JsonViewer />
    </div>
  );

  return (
    <>
      <DashboardLayout header={header} sidebar={sidebar} main={main} />
      <LoadingOverlay />
    </>
  );
}
