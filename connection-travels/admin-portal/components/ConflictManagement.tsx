
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Search, RefreshCcw, Check, Eye, ArrowLeft } from 'lucide-react';

const MOCK_CONFLICTS = [
  {
    id: 'C-001',
    bookingId: 'BK-9912',
    busId: 'B-PARTY-01',
    busName: 'Neon Maharaja',
    dates: 'Dec 12 - Dec 15',
    ownerReason: 'Blocked by relative for private wedding',
    severity: 'HIGH'
  }
];

const REPLACEMENT_OPTIONS = [
  { id: 'B-REP-01', name: 'Star Cruiser XL', capacity: 30, price: 16000, features: ['DJ', 'LED', 'Toilet'], rating: 4.8 },
  { id: 'B-REP-02', name: 'Elite Disco Bus', capacity: 25, price: 15500, features: ['DJ', 'LED', 'Open Top'], rating: 4.5 }
];

const ConflictManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedConflict, setSelectedConflict] = useState<any>(MOCK_CONFLICTS[0]);
  const [showReplacements, setShowReplacements] = useState(false);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Conflict Management</h2>
            <p className="text-slate-500">Detecting availability overlaps and finding alternatives.</p>
          </div>
        </div>
        <div className="bg-rose-100 text-rose-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold animate-pulse">
          <AlertTriangle size={20} />
          7 ACTIVE CONFLICTS
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conflict Details */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border-l-4 border-rose-500 border-y border-r border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
              <AlertTriangle className="text-rose-500" />
              Overlapping Dates Detected
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Original Booking</span>
                <p className="text-sm font-semibold text-slate-700">Dec 12, 2024 - Dec 15, 2024</p>
                <p className="text-xs text-indigo-600 font-medium">Platform ID: {selectedConflict.bookingId}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Owner Override</span>
                <p className="text-sm font-semibold text-rose-700">Dec 10, 2024 - Dec 20, 2024</p>
                <p className="text-xs text-rose-500 font-medium">Reason: {selectedConflict.ownerReason}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50 mb-6">
              <div className="w-16 h-16 rounded bg-slate-200 overflow-hidden">
                <img src="https://picsum.photos/seed/bus1/100" alt="Bus" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{selectedConflict.busName}</p>
                <p className="text-xs text-slate-500">25 Seater • DJ Console • LED Lighting</p>
                <p className="text-xs font-semibold text-slate-600 mt-1">Fault: Owner Over-blocked</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowReplacements(true)}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} />
                Search for Replacement Bus
              </button>
              <button className="w-full border border-slate-300 text-slate-600 font-semibold py-3 rounded-lg hover:bg-slate-50 transition-colors">
                Initiate Penalty Process (₹5,000)
              </button>
            </div>
          </div>
        </div>

        {/* Replacement Engine */}
        {showReplacements && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Search className="text-indigo-600" />
              Suggested Replacements
            </h3>
            <div className="space-y-4">
              {REPLACEMENT_OPTIONS.map(opt => (
                <div key={opt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                         <img src={`https://picsum.photos/seed/${opt.id}/100`} alt="Bus" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600">{opt.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">MATCH</span>
                          <span className="text-xs text-slate-400">Cap: {opt.capacity} | Rating: {opt.rating}★</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {opt.features.map(f => (
                            <span key={f} className="text-[8px] border px-1 rounded uppercase font-bold text-slate-400">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">₹{opt.price}</p>
                      <p className="text-[10px] text-rose-500 font-bold">+₹500 Diff</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                      {/* Fixed: Added missing Check icon import */}
                      <Check size={14} /> Assign & Notify User
                    </button>
                    <button className="px-3 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                      {/* Fixed: Added missing Eye icon import */}
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!showReplacements && (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center text-slate-400">
          <RefreshCcw size={48} className="mb-4 opacity-20" />
          <p>Click "Search for Replacement" to load suggestions.</p>
        </div>
      )}
    </div>
  );
};

export default ConflictManagement;
