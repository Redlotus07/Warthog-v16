import React, { useState, useEffect } from 'react';
import { Power, AlertTriangle, Activity, Shield, Bot } from 'lucide-react';
import useStore from '../store/useStore';
import { tradingService } from '../services/tradingService';

const BotControls = () => {
  const { isActive, toggleBot, settings } = useStore();
  const [status, setStatus] = useState({
    uptime: '0:00:00',
    tradesExecuted: 0,
    lastAction: '',
    cpuUsage: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        // Update bot statistics
        setStatus(prev => ({
          ...prev,
          uptime: calculateUptime(Date.now()),
          cpuUsage: Math.random() * 30 + 10, // Mock CPU usage
          memoryUsage: Math.random() * 20 + 5 // Mock memory usage
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const calculateUptime = (startTime: number) => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleBot = () => {
    if (!isActive) {
      tradingService.startBot();
    } else {
      tradingService.stopBot();
    }
    toggleBot();
  };

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">Bot Controls</h2>
        </div>
        <button
          onClick={handleToggleBot}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isActive 
              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
              : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
          }`}
        >
          <Power className="w-5 h-5" />
          <span>{isActive ? 'Stop Bot' : 'Start Bot'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center space-x-2 text-purple-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium">Status</span>
          </div>
          <div className={`text-lg font-bold ${isActive ? 'text-green-400' : 'text-gray-400'}`}>
            {isActive ? 'Running' : 'Stopped'}
          </div>
          <div className="text-sm text-gray-400">Uptime: {status.uptime}</div>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center space-x-2 text-blue-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium">Performance</span>
          </div>
          <div className="text-lg font-bold">{status.tradesExecuted}</div>
          <div className="text-sm text-gray-400">Trades Today</div>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center space-x-2 text-yellow-400 mb-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">System</span>
          </div>
          <div className="text-lg font-bold">{status.cpuUsage.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">CPU Usage</div>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center space-x-2 text-green-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium">Memory</span>
          </div>
          <div className="text-lg font-bold">{status.memoryUsage.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Memory Usage</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
          <h3 className="font-semibold mb-2">Active Trading Pairs</h3>
          <div className="flex flex-wrap gap-2">
            {settings.tradingPairs.map((pair) => (
              <span
                key={pair}
                className="px-3 py-1 bg-purple-500/10 rounded-full text-purple-400 text-sm"
              >
                {pair}
              </span>
            ))}
          </div>
        </div>

        {isActive && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <p className="font-medium text-yellow-500">Active Trading Session</p>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              The bot is currently running and executing trades based on your settings.
              Monitor the dashboard for real-time updates and performance metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotControls;