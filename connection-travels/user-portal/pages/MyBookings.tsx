
import React from 'react';
import { MOCK_BUSES } from '../constants';

const MyBookings: React.FC = () => {
  const mockBookings = [
    {
      id: 'BP-774921',
      bus: MOCK_BUSES[0],
      date: 'Dec 24, 2024',
      status: 'Confirmed',
      total: 85000,
      paid: 17000
    },
    {
      id: 'BP-661209',
      bus: MOCK_BUSES[1],
      date: 'Jan 15, 2025',
      status: 'Pending Payment',
      total: 72000,
      paid: 0
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-500">Manage your trips and download receipts.</p>
      </div>

      <div className="space-y-6">
        {mockBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-3xl border shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
              <img src={booking.bus.image} alt={booking.bus.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {booking.status}
                </span>
                <span className="text-xs font-bold text-slate-400">ID: {booking.id}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{booking.bus.name}</h3>
              <p className="text-sm text-slate-500">Trip Date: <span className="text-slate-900 font-semibold">{booking.date}</span></p>
            </div>
            <div className="w-full md:w-auto text-center md:text-right space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Total Price</p>
                <p className="text-xl font-black text-slate-900">₹{booking.total.toLocaleString()}</p>
              </div>
              <div className="flex gap-2 justify-center md:justify-end">
                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition">Receipt</button>
                <button className="bg-white border text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition">Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 border-t pt-10 text-center">
        <h4 className="text-slate-400 uppercase font-bold tracking-widest text-xs mb-6">Need help with a booking?</h4>
        <button className="text-blue-600 font-bold hover:underline">Contact 24/7 Support Team</button>
      </div>
    </div>
  );
};

export default MyBookings;
