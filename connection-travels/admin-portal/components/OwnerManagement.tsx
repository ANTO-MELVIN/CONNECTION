
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Star, 
  MessageSquare, 
  X, 
  Mail, 
  Phone, 
  Calendar,
  IndianRupee,
  MapPin,
  ArrowLeft
} from 'lucide-react';

const MOCK_OWNERS = [
  { id: '1', name: 'Rahul Sharma', company: 'Sharma Travels', email: 'rahul@sharma.com', phone: '+91 98765 43210', buses: 12, rating: 4.8, status: 'VERIFIED', joined: 'Jan 2023', earnings: '₹12.5L' },
  { id: '2', name: 'Vikram Singh', company: 'Royal Expeditions', email: 'vikram@royal.in', phone: '+91 88776 55443', buses: 5, rating: 3.2, status: 'PENDING', joined: 'May 2024', earnings: '₹4.2L' },
  { id: '3', name: 'Anita Desai', company: 'Pink City Bus Co.', email: 'anita@pinkcity.com', phone: '+91 77665 55443', buses: 8, rating: 4.9, status: 'VERIFIED', joined: 'Sep 2022', earnings: '₹22.1L' },
  { id: '4', name: 'Kunal Verma', company: 'Verma Volvos', email: 'kunal@verma.com', phone: '+91 99988 77766', buses: 3, rating: 2.1, status: 'SUSPENDED', joined: 'Feb 2024', earnings: '₹1.8L' },
];

const OwnerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOwner, setSelectedOwner] = useState<typeof MOCK_OWNERS[0] | null>(null);

  return (
    <div className="space-y-6 relative overflow-x-hidden">
      <header className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Owner Management</h2>
            <p className="text-slate-500">Verify, monitor, and manage bus owners.</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search owners..." 
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner / Company</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reputation</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_OWNERS.map((owner) => (
              <tr key={owner.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedOwner(owner)}
                    className="text-left group-hover:translate-x-1 transition-transform"
                  >
                    <div className="font-bold text-slate-800 hover:text-indigo-600 transition-colors">{owner.name}</div>
                    <div className="text-xs text-slate-500 uppercase">{owner.company}</div>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    owner.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                    owner.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {owner.status === 'VERIFIED' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                    {owner.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                  {owner.buses} Active Buses
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-slate-700">{owner.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                      <MessageSquare size={18} />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-indigo-900 rounded-2xl text-white flex items-center justify-between shadow-xl shadow-indigo-900/20">
        <div className="max-w-md">
            <h3 className="text-xl font-bold mb-2">Flagged for Misconduct?</h3>
            <p className="text-indigo-200 text-sm">Owners who repeatedly block availability and cause conflicts are automatically moved to the penalty review board.</p>
        </div>
        <button 
          onClick={() => navigate('/penalties')}
          className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shrink-0"
        >
            Open Penalty Board
        </button>
      </div>

      {/* Detail SlidePanel */}
      <div className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 ${selectedOwner ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedOwner && (
          <div className="h-full flex flex-col">
            <header className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Owner Details</h3>
              <button onClick={() => setSelectedOwner(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section className="text-center">
                <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  {selectedOwner.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-2xl font-bold text-slate-800">{selectedOwner.name}</h4>
                <p className="text-indigo-600 font-semibold">{selectedOwner.company}</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded">ID: {selectedOwner.id}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded uppercase ${selectedOwner.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {selectedOwner.status}
                    </span>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
                    <p className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
                      <IndianRupee size={14} /> {selectedOwner.earnings}
                    </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Average Rating</p>
                    <p className="text-lg font-bold text-amber-500 flex items-center justify-center gap-1">
                      <Star size={16} fill="currentColor" /> {selectedOwner.rating}
                    </p>
                </div>
              </section>

              <section className="space-y-4">
                <h5 className="font-bold text-slate-800 flex items-center gap-2">Contact Information</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" /> {selectedOwner.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" /> {selectedOwner.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar size={16} className="text-slate-400" /> Joined {selectedOwner.joined}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h5 className="font-bold text-slate-800">Fleet Preview ({selectedOwner.buses} Buses)</h5>
                <div className="grid grid-cols-2 gap-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-24 bg-slate-100 rounded-lg overflow-hidden relative">
                            <img src={`https://picsum.photos/seed/${selectedOwner.id}${i}/200`} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-2">
                                <span className="text-[9px] font-bold text-white uppercase">Bus-00{i}</span>
                            </div>
                        </div>
                    ))}
                </div>
              </section>
            </div>

            <footer className="p-6 border-t bg-slate-50 flex gap-3">
                <button className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors text-sm">Suspend Account</button>
                <button className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm">Edit Profile</button>
            </footer>
          </div>
        )}
      </div>

      {/* Overlay */}
      {selectedOwner && <div onClick={() => setSelectedOwner(null)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity" />}
    </div>
  );
};

export default OwnerManagement;
