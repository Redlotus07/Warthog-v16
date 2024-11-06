// src/components/Dashboard.tsx
import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import PerformanceMetrics from './PerformanceMetrics';
import TradeHistory from './TradeHistory';
import ActiveTrades from './ActiveTrades';
import BotControls from './BotControls';

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Warthog v16
          </h1>
          <p className="text-sm md:text-base text-gray-400">Advanced Metals & Crypto Trading Bot</p>
        </div>
      </header>

      <BotControls />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Profit"
          value="$24,521.34"
          change="+12.5%"
          isPositive={true}
          icon={<TrendingUp className="w-6 h-6 text-green-400" />}
        />
        <MetricCard
          title="Win Rate"
          value="76.2%"
          change="+2.1%"
          isPositive={true}
          icon={<Activity className="w-6 h-6 text-blue-400" />}
        />
        <MetricCard
          title="Active Positions"
          value="4"
          change="-1"
          isPositive={false}
          icon={<TrendingUp className="w-6 h-6 text-yellow-400" />}
        />
        <MetricCard
          title="Daily ROI"
          value="3.2%"
          change="+0.8%"
          isPositive={true}
          icon={<Activity className="w-6 h-6 text-purple-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ActiveTrades />
        <PerformanceMetrics />
      </div>

      <TradeHistory />
    </div>
  );
};

// ```jsx
const MetricCard = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        {icon}
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xl font-bold">{value}</p>
          <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
