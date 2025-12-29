
import React, { useState, useEffect } from 'react';
import { BusStatus, OwnerProfile } from '../types';
import { Edit2, Eye, Calendar, Settings, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchOwnerBuses } from '../services/api';
import { ensureOwnerSession } from '../services/session';

const MyBuses: React.FC = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const session = await ensureOwnerSession();
        const ownerProfile = session.user.ownerProfile;
        setProfile(ownerProfile);
        const data = await fetchOwnerBuses(ownerProfile.id, session.token);
        setBuses(data);
      } catch (err) {
        console.error('Failed to load owner buses', err);
        setError('Unable to load fleet data.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const getStatusColor = (status: BusStatus) => {
    switch (status) {
      case BusStatus.APPROVED: return 'bg-green-100 text-green-700';
      case BusStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case BusStatus.REJECTED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manage Fleet</h1>
          <div className="flex items-center gap-2 mt-1 text-slate-500 font-medium">
            <MapPin size={16} className="text-indigo-500" />
            <span>Active in {profile?.city || 'Your Operating Area'}</span>
          </div>
        </div>
        <Link 
          to="/add-bus" 
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} /> Add New Bus
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="bg-white rounded-[2rem] p-10 text-center col-span-full">
            <p className="text-sm font-semibold text-slate-500">Loading your buses...</p>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 col-span-full">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}
        {!loading && !error && buses.map((bus) => (
          <div key={bus.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="relative h-56 overflow-hidden">
              <img src={bus.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80'} alt={bus.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-5 left-5">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg backdrop-blur-md ${getStatusColor(bus.status || BusStatus.APPROVED)}`}>
                  {bus.status || BusStatus.APPROVED}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div className="flex gap-3 w-full">
                  <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                    <Eye size={16} /> View
                  </button>
                  <button className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                    <Edit2 size={16} /> Edit
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{bus.title}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{bus.registrationNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Base Rate</p>
                  <p className="text-lg font-black text-indigo-600">₹{bus.basePrice ?? '—'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">Capacity</p>
                  <p className="text-sm font-bold text-slate-700">{bus.capacity} Seats</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">Category</p>
                  <p className="text-sm font-bold text-slate-700">Luxury</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                <Link to="/availability" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                  <Calendar size={16} /> Availability
                </Link>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                  <Settings size={16} /> Features
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-10 text-center min-h-[450px] group hover:border-indigo-200 transition-all">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200 text-slate-300 mb-6 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-500">
            <Plus size={40} strokeWidth={3} />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Expand Your Fleet</h3>
          <p className="text-sm text-slate-500 mt-2 mb-8 max-w-[220px] font-medium leading-relaxed">List more buses in <b>{profile?.city || 'your area'}</b> to capture increasing demand.</p>
          <Link to="/add-bus" className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
            Add Bus Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyBuses;
