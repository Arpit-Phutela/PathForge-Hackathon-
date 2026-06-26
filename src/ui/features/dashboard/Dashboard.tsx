import React from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { MissionControl } from './components/MissionControl';
import { ExecutionOverview } from './components/ExecutionOverview';
import { AIIntelligence } from './components/AIIntelligence';
import { ErrorPanel } from './components/ErrorPanel';
import { useDashboardStore } from '../../state/useDashboardStore';
import { usePipeline } from '../../hooks/usePipeline';

export function Dashboard() {
  const { goal, error } = useDashboardStore();
  const { mutate } = usePipeline();

  const handleGenerate = () => {
    mutate(goal);
  };

  return (
    <DashboardLayout 
      left={<MissionControl onGenerate={handleGenerate} />}
      center={
        <>
          {error && <ErrorPanel />}
          <ExecutionOverview />
        </>
      }
      right={<AIIntelligence />}
    />
  );
}
