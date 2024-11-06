// src/components/MobileNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, TrendingUp, Shield, History, Settings } from 'lucide-react';

const MobileNav = () => {
  return (
    <nav className="bg-gray-800 border-t border-gray-700 px-2 py-3">
      <div className="flex justify-around items-center">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-1 ${
              isActive ? 'text-purple-400' : 'text-gray-400'
            }`
          }
        >
          <Activity className="w-6 h-6" />
          <span className="text-xs">Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/trading"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-1 ${
              isActive ? 'text-purple-400' : 'text-gray-400'
            }`
          }
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs">Trading</span>
        </NavLink>
        
        <NavLink
          to="/risk"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-1 ${
              isActive ? 'text-purple-400' : 'text-gray-400'
            }`
          }
        >
          <Shield className="w-6 h-6" />
          <span className="text-xs">Risk</span>
        </NavLink>
        
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-1 ${
              isActive ? 'text-purple-400' : 'text-gray-400'
            }`
          }
        >
          <History className="w-6 h-6" />
          <span className="text-xs">History</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center space-y-1 ${
              isActive ? 'text-purple-400' : 'text-gray-400'
            }`
          }
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileNav;
