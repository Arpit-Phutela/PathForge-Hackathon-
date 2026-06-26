import React from 'react';
import { MissionHeader } from './MissionHeader';
import { GoalInput } from './GoalInput';
import { PipelineStatus } from './PipelineStatus';
import { useDashboardStore } from '../../../state/useDashboardStore';

interface MissionControlProps {
  onGenerate: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({ onGenerate }) => {
  return (
    <div className="flex flex-col h-full divide-y divide-border">
      <MissionHeader />
      <GoalInput onGenerate={onGenerate} />
      <div className="pt-6">
        <PipelineStatus />
      </div>
    </div>
  );
};
