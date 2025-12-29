
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bus, 
  AlertTriangle, 
  CreditCard, 
  Settings as SettingsIcon,
  ShieldCheck,
  Gavel
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Owners', icon: Users, path: '/owners' },
    { name: 'Bus Approvals', icon: ShieldCheck, path: '/approvals' },
    { name: 'Conflicts', icon: AlertTriangle, path: '/conflicts' },
    { name: 'Financials', icon: CreditCard, path: '/financials' },
    { name: 'Penalties', icon: Gavel, path: '/penalties' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-full text-slate-300 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bus className="text-indigo-500" />
          Connections Admin
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-x-1' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
            location.pathname === '/settings' 
              ? 'bg-slate-800 text-white' 
              : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <SettingsIcon size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
