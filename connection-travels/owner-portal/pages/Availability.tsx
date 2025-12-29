
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Lock, Unlock, Clock, AlertTriangle, X, Check } from 'lucide-react';

type DateStatus = 'available' | 'booked' | 'maintenance' | 'blocked';

interface DayData {
  day: number;
  status: DateStatus;
  reason?: string;
}

const Availability: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState('BUS001');
  const [editingDate, setEditingDate] = useState<number | null>(null);
  
  // State for calendar days
  const [calendarData, setCalendarData] = useState<Record<string, DayData>>({
    '20': { day: 20, status: 'booked', reason: 'Customer Booking' },
    '21': { day: 21, status: 'booked', reason: 'Customer Booking' },
    '22': { day: 22, status: 'booked', reason: 'Customer Booking' },
    '25': { day: 25, status: 'maintenance', reason: 'Oil Change' },
    '28': { day: 28, status: 'blocked', reason: 'Owner Private Trip' }
  });

  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleUpdateStatus = (day: number, status: DateStatus, reason?: string) => {
    setCalendarData(prev => ({
      ...prev,
      [day.toString()]: { day, status, reason }
    }));
    setEditingDate(null);
  };

  const getDayStatus = (day: number): DateStatus => {
    return calendarData[day.toString()]?.status || 'available';
  };

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Availability Manager</h1>
          <p className="text-slate-500 text-sm">Update bus availability in real-time</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 border border-slate-100 rounded-xl shadow-sm self-start">
          <button className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-600 shadow-sm">Calendar</button>
          <button className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50">List View</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <label className="text-sm font-bold text-slate-700 block mb-3 uppercase tracking-wider">Select Bus</label>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedBus('BUS001')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedBus === 'BUS001' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Royal Voyager (BUS001)
              </button>
              <button 
                disabled
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed flex items-center justify-between"
              >
                Neon Party (BUS002)
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Pending</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hidden sm:block">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Status Colors</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-green-500"></div> Available
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Booked Trip
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div> Maintenance
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div> Blocked / Private
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="text-indigo-600" size={20} /> May 2024
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6">
              <div className="grid grid-cols-7 gap-px mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                  <div key={d} className="text-center py-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
                <div className="aspect-square bg-slate-50/30 rounded-lg sm:rounded-xl"></div>
                <div className="aspect-square bg-slate-50/30 rounded-lg sm:rounded-xl"></div>
                {days.map(day => {
                  const status = getDayStatus(day);
                  const data = calendarData[day.toString()];
                  return (
                    <button 
                      key={day}
                      onClick={() => setEditingDate(day)}
                      className={`relative aspect-square rounded-lg sm:rounded-xl p-1 sm:p-2 text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all border-2 group ${
                        status === 'booked' ? 'bg-red-50 border-red-100 text-red-600' :
                        status === 'maintenance' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        status === 'blocked' ? 'bg-slate-100 border-slate-200 text-slate-500' :
                        'bg-white border-slate-50 text-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {day}
                      {status === 'available' && <div className="absolute bottom-1 sm:bottom-2 w-1 sm:h-1 sm:w-1 h-1 rounded-full bg-green-500"></div>}
                      {data?.reason && <span className="hidden sm:block text-[8px] font-medium opacity-60 mt-0.5 truncate max-w-full">{data.reason}</span>}
                      
                      <div className="absolute inset-0 bg-indigo-600/90 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold">
                        EDIT
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg hidden sm:block">
                  <AlertTriangle size={18} />
                </div>
                <p className="text-[10px] sm:text-xs text-slate-600 text-center sm:text-left">
                  Blocking dates will remove this bus from customer search results immediately. Use this for maintenance or private offline bookings.
                </p>
              </div>
              <button className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                <Lock size={16} /> Bulk Block
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Edit Modal */}
      {editingDate !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <div>
                <h3 className="text-xl font-bold">Manage Date</h3>
                <p className="text-indigo-100 text-xs">May {editingDate}, 2024</p>
              </div>
              <button onClick={() => setEditingDate(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">Select Status</p>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => handleUpdateStatus(editingDate, 'available')}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-green-50 hover:border-green-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check size={18} /></div>
                    <span className="font-bold text-slate-700">Available</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleUpdateStatus(editingDate, 'maintenance', 'Regular Service')}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-amber-50 hover:border-amber-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Clock size={18} /></div>
                    <span className="font-bold text-slate-700">Maintenance</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleUpdateStatus(editingDate, 'booked', 'Customer Booking')}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-red-50 hover:border-red-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><CalendarIcon size={18} /></div>
                    <span className="font-bold text-slate-700">Trip Booked</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleUpdateStatus(editingDate, 'blocked', 'Private Trip')}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center"><Lock size={18} /></div>
                    <span className="font-bold text-slate-700">Private Block</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setEditingDate(null)}
                className="text-sm font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;
