
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  Settings,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

const data = [
  { name: 'Owner Payouts', value: 75, color: '#6366f1' },
  { name: 'Platform Revenue', value: 20, color: '#10b981' },
  { name: 'Taxes & Fees', value: 5, color: '#f59e0b' },
];

const Financials: React.FC = () => {
  const navigate = useNavigate();
  const [commission, setCommission] = useState(20);
  const [advance, setAdvance] = useState(30);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Payments & Commission</h2>
            <p className="text-slate-500">Track revenue, manage payouts, and set platform rules.</p>
          </div>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:scale-95">
          Download Monthly Statement
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <DollarSign size={20} />
            </div>
            <span className="text-emerald-600 flex items-center text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} className="mr-0.5" /> +18%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Merchandise Value</p>
          <h4 className="text-3xl font-bold text-slate-800 mt-1">₹42,85,000</h4>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <TrendingUp size={20} />
            </div>
            <span className="text-emerald-600 flex items-center text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} className="mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Earnings</p>
          <h4 className="text-3xl font-bold text-indigo-600 mt-1">₹8,57,000</h4>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Wallet size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</p>
          <div className="flex items-center gap-3">
            <h4 className="text-3xl font-bold text-slate-800 mt-1">₹12,40,000</h4>
            <span className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">12 Requests</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart View */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">Revenue Breakdown</h3>
          <p className="text-sm text-slate-400 mb-8">Current distribution of all incoming payments.</p>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[280px] w-full md:w-1/2 relative">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-800">100%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Net Volume</span>
                </div>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
                {data.map(item => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                            <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Settings View */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <Settings size={120} />
          </div>
          
          <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Settings className="text-indigo-600" size={20} />
              Global Commission Settings
          </h3>
          
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Platform Commission</label>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-black shadow-md shadow-indigo-200">
                    {commission}%
                </span>
              </div>
              <input 
                type="range" 
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                min="0" 
                max="50" 
                value={commission}
                onChange={(e) => setCommission(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>0% (Free)</span>
                  <span>50% (Max)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Booking Advance %</label>
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-black shadow-md shadow-emerald-200">
                    {advance}%
                </span>
              </div>
              <input 
                type="range" 
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                min="0" 
                max="100" 
                value={advance}
                onChange={(e) => setAdvance(parseInt(e.target.value))}
              />
               <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>No Deposit</span>
                  <span>Full Prepay</span>
              </div>
            </div>

            <div className="p-5 bg-slate-900 rounded-2xl text-white">
              <p className="text-[10px] font-bold text-indigo-300 uppercase mb-3">Live Policy Impact</p>
              <ul className="text-xs space-y-3 opacity-90">
                <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Expected Monthly Profit: ₹{(4285000 * (commission/100)).toLocaleString()}
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    Payout Cycle: Weekly Auto-settle
                </li>
              </ul>
            </div>
            
            <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 group">
              Deploy Policy Changes
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
