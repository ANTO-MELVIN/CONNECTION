
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ensureAdminSession } from '../src/services/session';
import { fetchDashboardSummary } from '../src/services/api';
import type { DashboardSummary } from '../src/types';

const data = [
  { name: 'Mon', revenue: 4000, bookings: 24 },
  { name: 'Tue', revenue: 3000, bookings: 13 },
  { name: 'Wed', revenue: 2000, bookings: 98 },
  { name: 'Thu', revenue: 2780, bookings: 39 },
  { name: 'Fri', revenue: 1890, bookings: 48 },
  { name: 'Sat', revenue: 2390, bookings: 38 },
  { name: 'Sun', revenue: 3490, bookings: 43 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const session = await ensureAdminSession();
        const data = await fetchDashboardSummary(session.token);
        setSummary(data);
      } catch (err) {
        console.error('Failed to load admin summary', err);
        setError('Unable to load live metrics. Showing defaults.');
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
            <p className="text-slate-500">Welcome back, Super Admin.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
            <TrendingUp size={14} /> +12.5% Today
          </span>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Owners" value={summary?.owners ?? 0} icon={Users} color="bg-blue-500" loading={loading} />
        <MetricCard title="Active Buses" value={summary?.buses ?? 0} icon={CheckCircle2} color="bg-emerald-500" loading={loading} />
        <MetricCard title="Total Users" value={summary?.users ?? 0} icon={TrendingUp} color="bg-indigo-500" loading={loading} />
        <MetricCard title="Total Bookings" value={summary?.bookings ?? 0} icon={AlertCircle} color="bg-rose-500" loading={loading} />
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Platform Revenue (Weekly)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Recent Alerts</h3>
          <div className="space-y-4">
            <AlertItem 
              type="danger" 
              title="Conflict Detected" 
              desc="Bus #XJ-102 has overlapping bookings for Dec 12-15." 
              time="2m ago" 
            />
            <AlertItem 
              type="warning" 
              title="Approval Pending" 
              desc="Owner 'Luxury Travels' uploaded 5 new bus photos." 
              time="15m ago" 
            />
            <AlertItem 
              type="success" 
              title="Replacement Complete" 
              desc="Booking #5291 successfully moved to Bus #KL-04." 
              time="1h ago" 
            />
            <AlertItem 
              type="info" 
              title="Large Withdrawal" 
              desc="Owner 'Raj Travels' requested ₹1,50,000 payout." 
              time="3h ago" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, loading }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`${color} p-3 rounded-lg text-white`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800">
        {loading ? <span className="inline-flex h-5 w-16 bg-slate-200 rounded animate-pulse" /> : value}
      </h4>
    </div>
  </div>
);

const AlertItem = ({ type, title, desc, time }: any) => {
  const colors = {
    danger: "bg-rose-50 border-rose-100 text-rose-700",
    warning: "bg-amber-50 border-amber-100 text-amber-700",
    success: "bg-emerald-50 border-emerald-100 text-emerald-700",
    info: "bg-indigo-50 border-indigo-100 text-indigo-700",
  };
  return (
    <div className={`p-4 border rounded-lg ${colors[type as keyof typeof colors]}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-[10px] opacity-70">{time}</span>
      </div>
      <p className="text-xs opacity-90 leading-tight">{desc}</p>
    </div>
  );
}

export default Dashboard;
