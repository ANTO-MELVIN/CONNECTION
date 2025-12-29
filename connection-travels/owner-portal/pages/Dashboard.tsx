
import React, { useState, useEffect } from 'react';
import { 
  Bus as BusIcon, 
  CalendarCheck, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { OwnerProfile } from '../types';
import { ensureOwnerSession } from '../services/session';
import { fetchOwnerBuses } from '../services/api';

const data = [
  { name: 'Mon', earnings: 4000 },
  { name: 'Tue', earnings: 3000 },
  { name: 'Wed', earnings: 2000 },
  { name: 'Thu', earnings: 2780 },
  { name: 'Fri', earnings: 1890 },
  { name: 'Sat', earnings: 6390 },
  { name: 'Sun', earnings: 5490 },
];

const StatCard = ({ icon, label, value, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <p className="text-sm text-slate-500 font-medium">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [busCount, setBusCount] = useState(0);

  useEffect(() => {
    async function hydrate() {
      const session = await ensureOwnerSession();
      const ownerProfile = session.user.ownerProfile as OwnerProfile;
      setProfile(ownerProfile);
      const buses = await fetchOwnerBuses(ownerProfile.id, session.token);
      setBusCount(buses.length);
    }

    hydrate();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {profile?.companyName || 'Travel Agency'} Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1 text-slate-500 font-medium">
            <MapPin size={16} className="text-indigo-500" />
            <span>Primary Hub: {profile?.city || 'Select City'}</span>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${profile?.verifiedByAdmin ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
            <span className={`text-sm font-bold ${profile?.verifiedByAdmin ? 'text-green-600' : 'text-amber-600'}`}>
              {profile?.verifiedByAdmin ? 'Verified Partner' : 'Verification Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<BusIcon size={24} />} 
          label="Total Buses" 
          value={busCount.toString()} 
          color="indigo"
          trend="+2 New"
        />
        <StatCard 
          icon={<CalendarCheck size={24} />} 
          label="Today's Bookings" 
          value="5" 
          color="green"
        />
        <StatCard 
          icon={<Clock size={24} />} 
          label="Upcoming" 
          value="18" 
          color="amber"
        />
        <StatCard 
          icon={<TrendingUp size={24} />} 
          label="Monthly Earnings" 
          value="₹1,24,500" 
          color="blue"
          trend="12%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Revenue Performance</h2>
            <select className="text-sm bg-slate-50 border-none rounded-lg px-3 py-1 text-slate-600 outline-none font-bold">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
                  itemStyle={{color: '#4f46e5', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Alerts for {profile?.city || 'Your Area'}</h2>
          <div className="space-y-4">
            {!profile?.isVerified && (
              <div className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-amber-600 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900 leading-none">Complete Verification</p>
                  <p className="text-[10px] text-amber-700 mt-1 uppercase tracking-wider font-bold">Action Required</p>
                  <p className="text-xs text-amber-700 mt-2">Upload your GST certificate to start taking public bookings.</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-blue-600 shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 leading-none">High Demand in {profile?.city || 'Local Area'}</p>
                <p className="text-xs text-blue-700 mt-1">User searches for {profile?.city} trips increased by 40% today.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="text-green-600 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-green-900 leading-none">New Feature Approved</p>
                <p className="text-xs text-green-700 mt-1">AC installation request for Voyager 01 approved.</p>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors border-t border-slate-50 pt-6">
            View All Notifications <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
