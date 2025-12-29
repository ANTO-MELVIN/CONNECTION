
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Gavel, UserX, TrendingDown, Clock, ArrowLeft } from 'lucide-react';

const FLAG_REASONS = [
  { owner: 'Verma Volvos', company: 'VV Ltd', status: 'Probation', violations: 4, fine: '₹20,000', risk: 'High' },
  { owner: 'Metro Rides', company: 'Metro Express', status: 'Flagged', violations: 1, fine: '₹5,000', risk: 'Low' },
  { owner: 'Highland Tours', company: 'HT Pvt', status: 'Warning', violations: 2, fine: '₹10,000', risk: 'Medium' },
];

const PenaltyBoard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
            <h2 className="text-2xl font-bold text-slate-800">Penalty Review Board</h2>
            <p className="text-slate-500">Monitor misconduct and enforce platform rules.</p>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl flex items-center gap-3">
            <UserX className="text-rose-600" size={20} />
            <div>
                <p className="text-[10px] font-black text-rose-400 uppercase leading-none">Total Suspended</p>
                <p className="text-xl font-bold text-rose-600 leading-tight">14 Owners</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <ShieldAlert size={18} className="text-rose-500" />
                  Active Violation Records
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 border-b">
                          <tr>
                              <th className="px-6 py-4 text-[10px] font-bold uppercase">Owner</th>
                              <th className="px-6 py-4 text-[10px] font-bold uppercase">Violations</th>
                              <th className="px-6 py-4 text-[10px] font-bold uppercase">Fine Total</th>
                              <th className="px-6 py-4 text-[10px] font-bold uppercase text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {FLAG_REASONS.map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-6 py-4">
                                      <div className="font-bold text-slate-800">{row.owner}</div>
                                      <div className="text-xs text-slate-400">{row.company}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                          <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                                              <div className="bg-rose-500 h-full" style={{width: `${(row.violations/5)*100}%`}} />
                                          </div>
                                          <span className="text-xs font-bold text-slate-600">{row.violations}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 font-black text-rose-600 text-sm">{row.fine}</td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="text-indigo-600 font-bold text-xs hover:underline">Review Details</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="space-y-6">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Gavel size={18} className="text-indigo-500" />
                  Quick Rules Control
              </h3>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="p-4 bg-indigo-50 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-700">Late Cancellation Fee</span>
                        <span className="text-sm font-black text-indigo-900">₹5,000</span>
                      </div>
                      <p className="text-[10px] text-indigo-500 uppercase font-bold">Standard Platform Policy</p>
                  </div>
                  
                  <div className="space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Suspension Logic</p>
                      <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                              <div className="text-xs">
                                  <p className="font-bold text-slate-800">Auto-Suspend @ 3 Violations</p>
                                  <p className="text-slate-400 text-[10px]">Instant profile hide from users</p>
                              </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                              <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
                              <div className="text-xs">
                                  <p className="font-bold text-slate-800">Require Manual Re-Verify</p>
                                  <p className="text-slate-400 text-[10px]">After every suspension lift</p>
                              </div>
                          </label>
                      </div>
                  </div>

                  <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                      Update Rule Engine
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default PenaltyBoard;
