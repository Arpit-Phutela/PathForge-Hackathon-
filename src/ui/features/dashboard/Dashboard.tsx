import React from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { MissionControl } from './components/MissionControl';
import { ExecutionOverview } from './components/ExecutionOverview';
import { AIIntelligence } from './components/AIIntelligence';
import { ErrorPanel } from './components/ErrorPanel';
import { CinematicLoader } from './components/CinematicLoader';
import { DemoFallbackModal } from './components/DemoFallbackModal';
import { useDashboardStore } from '../../state/useDashboardStore';
import { usePipeline } from '../../hooks/usePipeline';

export function Dashboard() {
  const { goal, error, isCinematicLoading, setIsCinematicLoading } = useDashboardStore();
  const { mutate } = usePipeline();
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

  const handleGenerate = () => {
    setSelectedNodeId(null); // Reset selection on new generation
    mutate(goal);
  };

  return (
    <>
      <DashboardLayout 
        left={<MissionControl onGenerate={handleGenerate} />}
        center={
          isCinematicLoading ? (
            <CinematicLoader onComplete={() => setIsCinematicLoading(false)} />
          ) : (
            <>
              {error && <ErrorPanel />}
              <ExecutionOverview selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
            </>
          )
        }
        right={isCinematicLoading ? null : (
          <AIIntelligence selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
        )}
      />
      {error && <DemoFallbackModal onRetry={handleGenerate} />}
    </>
  );
}
