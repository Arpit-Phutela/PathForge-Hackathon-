import React from 'react';

interface DashboardLayoutProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ left, center, right }) => {
  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 flex flex-col font-sans selection:bg-primary/20 antialiased overflow-hidden">
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row h-screen">
        {/* Left Column: Mission Control */}
        <aside className="w-full lg:w-[350px] bg-[#0c0c0d] border-b lg:border-b-0 lg:border-r border-zinc-800/40 flex-shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {left}
        </aside>

        {/* Center Column: Execution Overview */}
        <main className="flex-1 overflow-y-auto bg-[#070709] p-6 lg:p-10 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="max-w-[1400px] mx-auto w-full space-y-8 pb-12">
            {center}
          </div>
        </main>

        {/* Right Column: AI Intelligence */}
        {right && (
          <aside className="w-full lg:w-[380px] bg-[#0c0c0d] border-t lg:border-t-0 lg:border-l border-zinc-800/40 flex-shrink-0 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {right}
          </aside>
        )}
      </div>
    </div>
  );
};
