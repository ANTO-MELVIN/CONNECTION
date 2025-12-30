
import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowDownToLine, 
  FileText, 
  Download,
  Calendar,
  CreditCard
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { month: 'Jan', total: 45000 },
  { month: 'Feb', total: 52000 },
  { month: 'Mar', total: 38000 },
  { month: 'Apr', total: 65000 },
  { month: 'May', total: 72000 },
];

const Earnings: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Earnings & Payouts</h1>
        <p className="text-slate-500">Track your revenue and platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-2xl shadow-xl shadow-indigo-100 text-white">
          <div className="flex justify-between mb-6">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-bold bg-indigo-500 px-2 py-1 rounded">Withdrawal Ready</span>
          </div>
          <p className="text-indigo-100 text-sm font-medium">Net Payout Amount</p>
          <p className="text-3xl font-black mt-1">₹84,200.00</p>
          <button className="w-full mt-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
            <ArrowDownToLine size={20} /> Request Payout
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between mb-6">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-green-600">+18.5%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Lifetime Earnings</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">₹4,12,500.00</p>
          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-xs font-semibold">
            <span className="text-slate-400 text-[10px] uppercase">This Month</span>
            <span className="text-slate-700">₹72,000</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between mb-6">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
              <CreditCard size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Platform Commission (5%)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">₹6,225.00</p>
          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-xs font-semibold">
            <span className="text-slate-400 text-[10px] uppercase">Projected Tax</span>
            <span className="text-slate-700">₹1,120</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Monthly Revenue</h2>
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4f46e5' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { id: 'TXN1024', date: 'May 18, 2024', amount: 15000, type: 'Booking Advance', status: 'Credited' },
              { id: 'TXN1023', date: 'May 15, 2024', amount: -24000, type: 'Payout to Bank', status: 'Processed' },
              { id: 'TXN1022', date: 'May 12, 2024', amount: 10000, type: 'Booking Advance', status: 'Credited' },
              { id: 'TXN1021', date: 'May 10, 2024', amount: 12000, type: 'Balance Received', status: 'Credited' },
            ].map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                    {tx.amount > 0 ? <ArrowDownToLine size={18} /> : <ArrowDownToLine className="rotate-180" size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{tx.type}</p>
                    <p className="text-xs text-slate-400">{tx.date} • {tx.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              <Download size={14} /> Download GST Monthly Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
