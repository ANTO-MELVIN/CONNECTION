
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import OwnerManagement from '../components/OwnerManagement';
import BusApprovalCenter from '../components/BusApprovalCenter';
import ConflictManagement from '../components/ConflictManagement';
import Financials from '../components/Financials';
import PenaltyBoard from '../components/PenaltyBoard';
import Settings from '../components/Settings';
import Login from '../components/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('adminToken'));

  useEffect(() => {
    if (!isAuthenticated && localStorage.getItem('adminToken')) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/owners" element={<OwnerManagement />} />
            <Route path="/approvals" element={<BusApprovalCenter />} />
            <Route path="/conflicts" element={<ConflictManagement />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/penalties" element={<PenaltyBoard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
