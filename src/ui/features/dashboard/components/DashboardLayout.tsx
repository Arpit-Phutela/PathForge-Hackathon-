import React from 'react';

interface DashboardLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ header, sidebar, main }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        {header}
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          {sidebar}
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          {main}
        </main>
      </div>
    </div>
  );
};
