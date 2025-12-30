
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bus as BusIcon, 
  Calendar, 
  BookText, 
  Wallet, 
  UserCircle, 
  LifeBuoy, 
  LogOut, 
  PlusCircle, 
  Bell,
  Menu,
  ShieldCheck,
  Clock
} from 'lucide-react';

import Dashboard from '../pages/Dashboard';
import MyBuses from '../pages/MyBuses';
import AddBus from '../pages/AddBus';
import Availability from '../pages/Availability';
import Bookings from '../pages/Bookings';
import Earnings from '../pages/Earnings';
import Profile from '../pages/Profile';
import Support from '../pages/Support';
import Login from '../pages/Login';
import { OwnerProfile, OwnerUser } from '../types';

const Sidebar = ({
  isOpen,
  onClose,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'My Buses', path: '/buses', icon: <BusIcon size={20} /> },
    { name: 'Add New Bus', path: '/add-bus', icon: <PlusCircle size={20} /> },
    { name: 'Availability', path: '/availability', icon: <Calendar size={20} /> },
    { name: 'Bookings', path: '/bookings', icon: <BookText size={20} /> },
    { name: 'Earnings', path: '/earnings', icon: <Wallet size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
    { name: 'Support', path: '/support', icon: <LifeBuoy size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('ownerProfile');
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerUser');
    onLogout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
              <BusIcon size={32} className="text-indigo-600 fill-indigo-100" />
              <span>CONNECTIONS</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Travel Owner Portal</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path 
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({
  onMenuOpen,
  profile,
  ownerUser,
}: {
  onMenuOpen: () => void;
  profile: OwnerProfile | null;
  ownerUser: OwnerUser | null;
}) => {
  const ownerName = `${ownerUser?.firstName || ''} ${ownerUser?.lastName || ''}`.trim();
  const avatarFallback = (ownerName || ownerUser?.email || profile?.companyName || 'T').charAt(0).toUpperCase();
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 flex items-center justify-between lg:px-8">
      <div className="flex items-center gap-4">
        <button onClick={onMenuOpen} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-slate-800">Welcome Back, {ownerName || ownerUser?.email?.split('@')[0] || profile?.companyName || 'Travel Owner'}</h1>
          <p className="text-xs text-slate-500">Manage your fleet and bookings with ease</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-none">{profile?.companyName || ownerName || 'Travel Agency'}</p>
            {profile?.verifiedByAdmin ? (
              <p className="text-[10px] text-green-600 flex items-center justify-end gap-1 mt-1">
                <ShieldCheck size={10} /> Verified
              </p>
            ) : (
              <p className="text-[10px] text-amber-600 flex items-center justify-end gap-1 mt-1 font-bold">
                <Clock size={10} /> Pending Verification
              </p>
            )}
          </div>
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
            {avatarFallback}
          </div>
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [ownerUser, setOwnerUser] = useState<OwnerUser | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      const storedProfile = localStorage.getItem('ownerProfile');
      const storedUser = localStorage.getItem('ownerUser');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
      if (storedUser) {
        try {
          setOwnerUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse owner user from storage', error);
        }
      }
    }
  }, [isLoggedIn]);

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <div className="flex">
                  <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={() => {
                      setIsLoggedIn(false);
                      setProfile(null);
                      setOwnerUser(null);
                    }}
                  />
                  <main className="flex-1 lg:ml-64 min-h-screen">
                    <Header onMenuOpen={() => setIsSidebarOpen(true)} profile={profile} ownerUser={ownerUser} />
                    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/buses" element={<MyBuses />} />
                        <Route path="/add-bus" element={<AddBus />} />
                        <Route path="/availability" element={<Availability />} />
                        <Route path="/bookings" element={<Bookings />} />
                        <Route path="/earnings" element={<Earnings />} />
                        <Route path="/profile" element={<Profile profile={profile} ownerUser={ownerUser} />} />
                        <Route path="/support" element={<Support />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
