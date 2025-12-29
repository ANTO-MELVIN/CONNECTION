
import React, { useState } from 'react';
import { MOCK_BOOKINGS } from '../constants';
import { BookingStatus, Booking } from '../types';
import { Phone, MessageSquare, MapPin, Calendar, CheckCircle, Clock, X, Info, ShieldCheck, Bus } from 'lucide-react';

const Bookings: React.FC = () => {
  const [confirmingBooking, setConfirmingBooking] = useState<Booking | null>(null);

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.UPCOMING: return 'bg-blue-50 text-blue-600 border-blue-100';
      case BookingStatus.ONGOING: return 'bg-green-50 text-green-600 border-green-100';
      case BookingStatus.COMPLETED: return 'bg-slate-50 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const handleConfirmReady = () => {
    alert(`Success: Booking ${confirmingBooking?.id} is marked as READY FOR DISPATCH!`);
    setConfirmingBooking(null);
  };

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Booking Management</h1>
          <p className="text-slate-500 text-sm">Track and manage your customer trips</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none shadow-sm">
            <option>All Bookings</option>
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_BOOKINGS.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row">
              <div className="p-5 sm:p-6 lg:w-2/3 border-b lg:border-b-0 lg:border-r border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Booking #{booking.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-6">{booking.customerName}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="mt-1 text-slate-400">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup Location</p>
                        <p className="text-sm font-semibold text-slate-700">{booking.pickup}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 text-slate-400">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Destination</p>
                        <p className="text-sm font-semibold text-slate-700">{booking.drop}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="mt-1 text-slate-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Journey Dates</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {new Date(booking.dates[0]).toLocaleDateString()} 
                          {booking.dates.length > 1 && ` - ${new Date(booking.dates[booking.dates.length-1]).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 text-slate-400">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Report Time</p>
                        <p className="text-sm font-semibold text-slate-700">07:30 AM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <button className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] sm:text-xs font-bold flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                    <Phone size={14} /> Contact
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-slate-50 text-slate-600 text-[11px] sm:text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                    <MessageSquare size={14} /> Message
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:w-1/3 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest text-center sm:text-left">Payment Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-500">Total Fare</span>
                      <span className="font-bold text-slate-800">₹{booking.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-green-600">Advance Paid</span>
                      <span className="font-bold text-green-600">₹{booking.advance.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">Due on Trip</span>
                      <span className="text-base sm:text-lg font-black text-indigo-600">₹{booking.balance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  {booking.status === BookingStatus.UPCOMING && (
                    <button 
                      onClick={() => setConfirmingBooking(booking)}
                      className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                    >
                      <CheckCircle size={18} /> Confirm Readiness
                    </button>
                  )}
                  {booking.status === BookingStatus.ONGOING && (
                    <button className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all">
                      Mark Completed
                    </button>
                  )}
                  {booking.status === BookingStatus.COMPLETED && (
                    <p className="text-center text-xs font-bold text-slate-400 py-2 border-2 border-dashed border-slate-200 rounded-xl">Trip Finished</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmingBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-indigo-600 text-white relative">
              <button 
                onClick={() => setConfirmingBooking(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-full"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <Bus size={28} />
                <h3 className="text-xl font-bold">Ready for Dispatch?</h3>
              </div>
              <p className="text-indigo-100 text-xs">Confirming for Booking #{confirmingBooking.id}</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Readiness Checklist</p>
                
                <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                  <div>
                    <p className="text-sm font-bold text-slate-700">Vehicle Cleanliness</p>
                    <p className="text-[10px] text-slate-500">Interior and exterior are professionally cleaned.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                  <div>
                    <p className="text-sm font-bold text-slate-700">Driver & Staff Ready</p>
                    <p className="text-[10px] text-slate-500">Staff briefed on route and customer location.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                  <div>
                    <p className="text-sm font-bold text-slate-700">Fuel & Tech Check</p>
                    <p className="text-[10px] text-slate-500">AC, Lights, and DJ System are fully functional.</p>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                  Confirming readiness will notify the customer that their bus is being prepared for dispatch at the scheduled report time.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setConfirmingBooking(null)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-800"
              >
                Back
              </button>
              <button 
                onClick={handleConfirmReady}
                className="flex-[2] py-4 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} /> Dispatch Confirmed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
