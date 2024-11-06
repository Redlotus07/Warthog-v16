import React, { useState } from 'react';
import { Save, Bell, Key, Shield, Bot, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [notifications, setNotifications] = useState({
    trades: true,
    news: true,
    performance: true,
    risk: true
  });
  const [botSettings, setBotSettings] = useState({
    tradingEnabled: true,
    useML: true,
    useNewsTrading: true,
    maxDrawdown: 5,
    tradingPairs: ['BTC/USD', 'XAU/USD']
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic would go here
  };

  const availablePairs = ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'];

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400">Configure your trading bot preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Key className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">API Configuration</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  placeholder="Enter your API key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  placeholder="Enter your secret key"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Notifications</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notifications.trades}
                  onChange={(e) => setNotifications({ ...notifications, trades: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <span>Trade Executions</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notifications.news}
                  onChange={(e) => setNotifications({ ...notifications, news: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <span>News Events</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notifications.performance}
                  onChange={(e) => setNotifications({ ...notifications, performance: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <span>Performance Updates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notifications.risk}
                  onChange={(e) => setNotifications({ ...notifications, risk: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <span>Risk Alerts</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Bot Configuration</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={botSettings.tradingEnabled}
                  onChange={(e) => setBotSettings({ ...botSettings, tradingEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <span>Enable Automated Trading</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={botSettings.useML}
                  onChange={(e) => setBotSettings({ ...botSettings, useML: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <span>Use ML-powered Analysis</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={botSettings.useNewsTrading}
                  onChange={(e) => setBotSettings({ ...botSettings, useNewsTrading: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <span>Enable News Trading</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Maximum Drawdown (%)
                </label>
                <input
                  type="number"
                  value={botSettings.maxDrawdown}
                  onChange={(e) => setBotSettings({ ...botSettings, maxDrawdown: Number(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Trading Pairs
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePairs.map((pair) => (
                    <label key={pair} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={botSettings.tradingPairs.includes(pair)}
                        onChange={(e) => {
                          const pairs = e.target.checked
                            ? [...botSettings.tradingPairs, pair]
                            : botSettings.tradingPairs.filter(p => p !== pair);
                          setBotSettings({ ...botSettings, tradingPairs: pairs });
                        }}
                        className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
                      />
                      <span>{pair}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Security</h2>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <p className="font-medium text-yellow-500">Security Recommendations</p>
              </div>
              <ul className="mt-2 space-y-2 text-sm text-gray-400">
                <li>• Enable 2FA for additional account security</li>
                <li>• Regularly rotate your API keys</li>
                <li>• Set appropriate IP restrictions</li>
                <li>• Monitor account activity regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;