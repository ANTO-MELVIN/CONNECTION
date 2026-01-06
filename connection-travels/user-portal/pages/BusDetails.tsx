
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_BUSES, ICONS } from '../constants';

const BusDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bus = MOCK_BUSES.find(b => b.id === id);

  if (!bus) {
    return <div className="p-20 text-center font-bold">Bus not found</div>;
  }

  const facilities = [
    "DJ Booth",
    "Laser Lights",
    "Premium Audio",
    "Dance Floor",
    "Air Conditioning"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {['Verified Bus', 'Matches your budget', 'Admin assisted'].map((tag) => (
              <span key={tag} className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">{bus.name}</h1>
          <p className="text-slate-500 flex items-center gap-2 text-sm md:text-base">
            <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Premium boutique experience with state-of-the-art systems
          </p>
        </div>
      </div>

      {/* Gallery - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 h-auto md:h-[500px] mb-12">
        <div className="col-span-2 row-span-1 md:row-span-2 rounded-2xl md:rounded-[2rem] overflow-hidden group aspect-[16/10] md:aspect-auto">
          <img src={bus.image} alt="Bus main" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        </div>
        {bus.gallery.length > 0 ? (
          bus.gallery.slice(0, 4).map((img, i) => (
            <div key={i} className={`rounded-2xl md:rounded-[2rem] overflow-hidden group ${i > 1 ? 'hidden md:block' : 'block'}`}>
              <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 aspect-square" />
            </div>
          ))
        ) : (
          [...Array(4)].map((_, i) => (
            <div key={i} className={`rounded-2xl md:rounded-[2rem] overflow-hidden bg-slate-100 flex items-center justify-center text-slate-300 font-black uppercase tracking-widest text-[10px] aspect-square ${i > 1 ? 'hidden md:block' : 'block'}`}>
              IMG {i+1}
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {/* Guaranteed Section */}
          <section className="mb-12 bg-blue-50 border border-blue-200 p-8 rounded-[2rem] shadow-sm">
             <div className="flex items-center gap-4 mb-4 text-blue-900">
               <svg className="w-10 h-10 fill-current opacity-80" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
               <h2 className="text-2xl md:text-3xl font-black italic">Bus Guaranteed</h2>
             </div>
             <p className="text-blue-800 text-base md:text-lg leading-relaxed font-medium">Inventory locked upon booking. Same or better replacement provided in case of rare technical issues.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              Facilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {facilities.map((facility, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:translate-y-[-2px] transition-transform">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="font-bold text-slate-800 tracking-tight">{facility}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capacity</p>
                <p className="text-xl font-black text-slate-900">{bus.capacity} Seats</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Year</p>
                <p className="text-xl font-black text-slate-900">{bus.year}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Condition</p>
                <p className="text-xl font-black text-slate-900">{bus.condition}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Systems</p>
                <p className="text-xl font-black text-slate-900">High-End</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              Experience
            </h2>
            <p className="text-slate-600 leading-loose text-lg font-light max-w-2xl">
              {bus.description} This premium boutique vehicle features a state-of-the-art lighting and sound system designed to create an unforgettable atmosphere. Perfect for exclusive celebrations, music tours, or corporate retreats where excellence is required.
            </p>
          </section>
        </div>

        {/* Right Column: Booking Card */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-24 bg-white p-8 rounded-[2.5rem] border shadow-2xl shadow-slate-200/50 space-y-8">
            <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pricing Guidance</p>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                Final price depends on your route, dates, and optional packages. Our admin team will confirm the best fit and share the final quote with you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] flex gap-3">
                <span className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <ICONS.Calendar />
                </span>
                <div>
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Availability</p>
                  <p className="text-sm font-bold text-emerald-800">Open • Admin managed</p>
                  <p className="text-xs text-emerald-700 mt-1">Calendar holds are applied only after owner confirmation.</p>
                </div>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">What happens next?</p>
                <ul className="text-xs text-slate-600 font-semibold space-y-2">
                  <li>• Submit your route and requirements</li>
                  <li>• Concierge coordinates confirmations privately</li>
                  <li>• Owner payout locked after confirmation</li>
                </ul>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/booking/${bus.id}`)}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all transform active:scale-95 text-lg uppercase tracking-widest hover:bg-blue-600"
            >
              Request Quote
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Our team will contact you within minutes
            </p>

            <div className="p-5 bg-blue-50 border border-blue-100 rounded-[1.5rem] text-sm text-blue-800">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Concierge Promise</p>
              <p>Owner never sees your discussions. We manage every detail discreetly from start to finish.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
