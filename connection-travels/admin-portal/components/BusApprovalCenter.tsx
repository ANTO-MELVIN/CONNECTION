
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  ShieldAlert, 
  Eye, 
  Info, 
  Trash2, 
  AlertCircle, 
  ArrowLeft, 
  Play, 
  Image as ImageIcon,
  ShieldCheck,
  Lock,
  ChevronRight
} from 'lucide-react';

const MOCK_PENDING_BUSES = [
  {
    id: 'B1',
    name: 'Neon Party Cruiser',
    ownerName: 'Apex Rentals',
    capacity: 25,
    features: ['DJ Booth', 'LED Ceiling', 'Smoke Machine', 'Luxury Seating'],
    price: 15000,
    images: ['https://picsum.photos/seed/bus1/800/600', 'https://picsum.photos/seed/bus1-2/800/600'],
    videoUrl: '#',
    desc: 'High-end party bus with professional sound system and lighting. Ideal for weddings and corporate events.'
  },
  {
    id: 'B2',
    name: 'Executive Sprinter',
    ownerName: 'Elite Transports',
    capacity: 12,
    features: ['WiFi', 'Reclining Seats', 'Privacy Glass', 'Mini Bar'],
    price: 8000,
    images: ['https://picsum.photos/seed/bus2/800/600'],
    videoUrl: '#',
    desc: 'Luxury corporate transport for small teams. Includes executive lounge seating.'
  }
];

const BusApprovalCenter: React.FC = () => {
  const navigate = useNavigate();
  const [pendingBuses, setPendingBuses] = useState(MOCK_PENDING_BUSES);
  const [approvedBuses, setApprovedBuses] = useState<typeof MOCK_PENDING_BUSES>([]);
  const [confirmReject, setConfirmReject] = useState<string | null>(null);
  const [approvingBusId, setApprovingBusId] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<typeof MOCK_PENDING_BUSES[0] | null>(null);

  const handleApprove = (id: string) => {
    const bus = pendingBuses.find(b => b.id === id);
    if (bus) {
      setApprovedBuses([bus, ...approvedBuses]);
      setPendingBuses(pendingBuses.filter(b => b.id !== id));
      setApprovingBusId(null);
    }
  };

  const handleReject = (id: string) => {
    setPendingBuses(pendingBuses.filter(b => b.id !== id));
    setConfirmReject(null);
  };

  return (
    <div className="space-y-12">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Connection Approval Center</h2>
          <p className="text-slate-500">Carefully review new fleet submissions for Connections Platform.</p>
        </div>
      </header>

      {/* Pending Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Info size={18} className="text-amber-500" />
            Pending Review ({pendingBuses.length})
        </h3>
        
        {pendingBuses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">No pending submissions at this time.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
            {pendingBuses.map(bus => (
                <div key={bus.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row animate-in fade-in duration-300">
                    <div className="md:w-72 shrink-0 relative group">
                        <img src={bus.images[0]} alt={bus.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => setSelectedBus(bus)}
                              className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors"
                            >
                                <Eye size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{bus.name}</h3>
                                <p className="text-sm text-slate-500">Owner: {bus.ownerName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-indigo-600">₹{bus.price}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-tighter">per day</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 my-4">
                        {bus.features.map(f => (
                            <span key={f} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {f}
                            </span>
                        ))}
                        </div>

                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{bus.desc}</p>
                    </div>

                    <div className="flex gap-3 mt-4 border-t pt-4">
                        <button 
                          onClick={() => setSelectedBus(bus)}
                          className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                        >
                            View Media & Details
                        </button>
                        <button 
                            onClick={() => setConfirmReject(bus.id)}
                            className="px-6 bg-rose-50 text-rose-600 font-bold py-2 rounded-lg hover:bg-rose-100 transition-colors text-sm flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Reject
                        </button>
                        <button 
                            onClick={() => setApprovingBusId(bus.id)}
                            className="px-8 bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm shadow-md"
                        >
                            Approve
                        </button>
                    </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Approved Section */}
      <div className="space-y-6 pt-12 border-t border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Check size={18} className="text-emerald-500" />
            Recently Approved Fleet
        </h3>
        {approvedBuses.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Approved buses will appear here in the current session.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedBuses.map(bus => (
                    <div key={bus.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 animate-in slide-in-from-bottom-2 duration-500">
                        <img src={bus.images[0]} className="w-16 h-16 rounded-lg object-cover grayscale-[50%]" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 truncate">{bus.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{bus.ownerName}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">Live</span>
                                <span className="text-[9px] font-bold text-indigo-600">₹{bus.price}/day</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Detail SlidePanel */}
      <div className={`fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 ${selectedBus ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedBus && (
          <div className="h-full flex flex-col">
            <header className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Bus Specification Details</h3>
              <button onClick={() => setSelectedBus(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto">
              {/* Media Section */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {selectedBus.images.map((img, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden relative group">
                        <img src={img} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon size={24} className="text-white" />
                        </div>
                      </div>
                    ))}
                    <div className="aspect-video rounded-xl bg-slate-900 flex items-center justify-center relative group overflow-hidden">
                        <Play size={32} className="text-white fill-white" />
                        <div className="absolute bottom-2 left-2 text-[10px] text-white/70 font-bold uppercase tracking-widest">
                            Video Tour Available
                        </div>
                    </div>
                </div>
              </div>

              {/* Textual Details */}
              <div className="p-6 space-y-8">
                  <section>
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <h4 className="text-2xl font-bold text-slate-800">{selectedBus.name}</h4>
                          <p className="text-indigo-600 font-semibold">{selectedBus.ownerName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-slate-800">₹{selectedBus.price}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Daily Platform Rate</p>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {selectedBus.desc}
                      </p>
                  </section>

                  <section className="space-y-4">
                      <h5 className="font-bold text-slate-800 flex items-center gap-2">
                          <Check size={18} className="text-indigo-500" />
                          Claimed Features
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                          {selectedBus.features.map(f => (
                              <div key={f} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-700">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                  {f}
                              </div>
                          ))}
                      </div>
                  </section>

                  <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                          <ShieldAlert size={18} className="text-amber-500" />
                          Owner Verification Info
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                              <p className="text-slate-400 uppercase font-bold tracking-tighter mb-1">Bus Reg. No</p>
                              <p className="font-bold text-slate-700">KA-01-MJ-9912</p>
                          </div>
                          <div>
                              <p className="text-slate-400 uppercase font-bold tracking-tighter mb-1">Seating Capacity</p>
                              <p className="font-bold text-slate-700">{selectedBus.capacity} Persons</p>
                          </div>
                          <div className="col-span-2">
                              <p className="text-slate-400 uppercase font-bold tracking-tighter mb-1">Insurance Validity</p>
                              <p className="font-bold text-emerald-600">Verified until Oct 2025</p>
                          </div>
                      </div>
                  </section>
              </div>
            </div>

            <footer className="p-6 border-t bg-slate-50 flex gap-3">
                <button 
                  onClick={() => setConfirmReject(selectedBus.id)}
                  className="flex-1 bg-rose-50 text-rose-600 font-bold py-4 rounded-2xl hover:bg-rose-100 transition-colors"
                >
                    Reject Bus
                </button>
                <button 
                  onClick={() => {
                    setApprovingBusId(selectedBus.id);
                    setSelectedBus(null);
                  }}
                  className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-600/20"
                >
                    Quick Approve
                </button>
            </footer>
          </div>
        )}
      </div>

      {/* Two-Step Approval Modal */}
      {approvingBusId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-in-center overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 text-center mb-2">Final Verification</h4>
                <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
                    Step 2: Please confirm that you have manually verified the registration papers and images for this connection.
                </p>
                <div className="space-y-3">
                    <button 
                      onClick={() => handleApprove(approvingBusId)}
                      className="w-full py-4 font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={20} /> Verify & Approve
                    </button>
                    <button 
                      onClick={() => setApprovingBusId(null)}
                      className="w-full py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancel Verification
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Rejection Modal (Existing) */}
      {confirmReject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl scale-in-center">
                  <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 text-center mb-2">Confirm Rejection?</h4>
                  <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
                      Are you sure you want to reject this bus? The owner will be notified and the submission will be permanently removed.
                  </p>
                  <div className="flex gap-3">
                      <button 
                        onClick={() => setConfirmReject(null)}
                        className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={() => handleReject(confirmReject)}
                        className="flex-1 py-3 font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/20 transition-all"
                      >
                          Confirm Reject
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Overlay for slide-over */}
      {selectedBus && <div onClick={() => setSelectedBus(null)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity" />}
    </div>
  );
};

export default BusApprovalCenter;
