import React from 'react';

interface DashboardLayoutProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ left, center, right }) => {
  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans selection:bg-primary/30">
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Column: Mission Control */}
        <aside className="w-full lg:w-80 bg-surface border-b lg:border-b-0 lg:border-r border-border flex-shrink-0 overflow-y-auto">
          {left}
        </aside>

        {/* Center Column: Execution Overview */}
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {center}
          </div>
        </main>

        {/* Right Column: AI Intelligence */}
        <aside className="w-full lg:w-96 bg-surface border-t lg:border-t-0 lg:border-l border-border flex-shrink-0 overflow-y-auto p-4 lg:p-6 space-y-6">
          {right}
        </aside>
      </div>
    </div>
  );
};
