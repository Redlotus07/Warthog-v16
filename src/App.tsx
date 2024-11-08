// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Trading from './components/Trading';
import RiskManagement from './components/RiskManagement';
import History from './components/History';
import Settings from './components/Settings';
import MobileNav from './components/MobileNav';
import LoadingPage from './components/LoadingPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/risk" element={<RiskManagement />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <MobileNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
