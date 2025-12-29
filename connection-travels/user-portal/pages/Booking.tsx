
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_BUSES } from '../constants';

const Booking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bus = MOCK_BUSES.find(b => b.id === id);

  const [formData, setFormData] = useState({
    pickup: '',
    drop: '',
    startDate: '',
    endDate: '',
    phone: '',
    special: ''
  });

  const total = bus?.pricePerDay || 0;
  const advance = total * 0.2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/payment', { state: { total, advance, busName: bus?.name } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Confirm Reservation</h1>
        <p className="text-slate-500">Your inventory will be locked upon advance payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8 bg-white p-8 rounded-3xl border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pickup Location</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" 
                placeholder="Ex: Mumbai Airport"
                value={formData.pickup}
                onChange={e => setFormData({...formData, pickup: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Drop Location</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" 
                placeholder="Ex: Pune City Center"
                value={formData.drop}
                onChange={e => setFormData({...formData, drop: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trip Start Date</label>
              <input 
                type="date"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" 
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Number</label>
              <input 
                type="tel"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" 
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Special Requirements</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500" 
              placeholder="Ex: DJ requests, lighting preferences, etc."
              value={formData.special}
              onChange={e => setFormData({...formData, special: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition transform active:scale-95"
          >
            Lock Inventory & Pay Advance
          </button>
        </form>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-lg font-bold mb-6 text-blue-400">Reservation Summary</h3>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="text-white font-medium">{bus?.name}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-800 text-base">
                <span className="text-slate-400">Total Fare</span>
                <span className="text-white font-black">₹{total.toLocaleString()}</span>
              </div>
              <div className="bg-blue-900/40 p-4 rounded-xl mt-4 border border-blue-800">
                <p className="text-[10px] uppercase font-black text-blue-300 mb-1">Advance Amount Due Now</p>
                <p className="text-2xl font-black text-white">₹{advance.toLocaleString()}</p>
                <p className="text-[10px] text-blue-400 mt-1 italic">Remaining ₹{(total-advance).toLocaleString()} to be paid at boarding.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-blue-800 text-xs">
            <div className="flex gap-3">
               <svg className="w-5 h-5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
               <p><strong>CONNECTIONS Guarantee:</strong> Your booking is backed by our boutique replacement promise.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
