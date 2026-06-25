import React from 'react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, subtitle, highlight = false }) => {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
};
