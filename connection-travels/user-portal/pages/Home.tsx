
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, MOCK_BUSES } from '../constants';
import { BusFeature } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    navigate(`/search?pickup=${pickup}&drop=${drop}&date=${date}`);
  };

  const quickFilters = [
    { label: 'DJ Bus', feature: BusFeature.DJ_BUS, color: 'bg-purple-100 text-purple-700' },
    { label: 'LED Lights', feature: BusFeature.LED_LIGHTS, color: 'bg-pink-100 text-pink-700' },
    { label: 'Sleeper', feature: BusFeature.SLEEPER, color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Luxury', feature: BusFeature.LUXURY, color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center gradient-bg overflow-hidden px-4 md:px-6">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1600" 
            alt="Bus background" 
            className="w-full h-full object-cover grayscale" 
          />
        </div>
        
        <div className="relative z-10 max-w-6xl w-full text-center py-12 md:py-20">
          <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full text-white text-xs md:text-sm font-black mb-8 shadow-xl shadow-blue-500/40 animate-pulse">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Bus Guaranteed
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
            Premium Boutique Buses<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">CONNECTIONS</span>
          </h1>
          <p className="text-blue-100 text-base md:text-xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed opacity-90">
            State-of-the-art lighting and sound systems for an unparalleled experience. Same or better replacement provided in case of rare technical issues.
          </p>

          {/* Search Box - Professional Desktop Layout */}
          <div className="glass p-2 md:p-3 rounded-[2rem] md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-0 max-w-5xl mx-auto backdrop-blur-2xl border border-white/30 bg-white/10">
            <div className="flex-1 flex flex-col text-left px-6 py-4 md:py-2">
              <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Pickup</label>
              <input 
                type="text" 
                placeholder="From where?" 
                className="bg-transparent border-none text-white placeholder-blue-200/50 focus:ring-0 text-base font-bold w-full"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-white/20 mx-2"></div>
            <div className="flex-1 flex flex-col text-left px-6 py-4 md:py-2">
              <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Drop</label>
              <input 
                type="text" 
                placeholder="To where?" 
                className="bg-transparent border-none text-white placeholder-blue-200/50 focus:ring-0 text-base font-bold w-full"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-white/20 mx-2"></div>
            <div className="flex-1 flex flex-col text-left px-6 py-4 md:py-2 min-w-[180px]">
              <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Date</label>
              <input 
                type="date" 
                className="bg-transparent border-none text-white focus:ring-0 text-base font-bold w-full [color-scheme:dark]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="p-2">
              <button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white font-black h-14 md:h-16 w-full md:px-10 rounded-[1.5rem] md:rounded-full flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-blue-500/40 uppercase tracking-widest text-sm"
              >
                <ICONS.Search />
                <span>Find Bus</span>
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-12">
            <span className="text-blue-200/70 text-[10px] font-black uppercase tracking-widest self-center mr-2 hidden md:block">Popular:</span>
            {quickFilters.map((filter, i) => (
              <button 
                key={i}
                onClick={() => navigate(`/search?feature=${filter.feature}`)}
                className={`${filter.color} px-5 py-2.5 rounded-full text-xs md:text-sm font-bold hover:brightness-90 transition flex items-center gap-2 shadow-sm border border-white/10`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Buses */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Popular Buses Near You</h2>
            <p className="text-slate-500 text-base font-medium">Boutique collection with state-of-the-art facilities.</p>
          </div>
          <button onClick={() => navigate('/search')} className="text-blue-600 font-black uppercase tracking-widest text-xs flex items-center gap-2 group self-start sm:self-auto hover:text-blue-800 transition-colors">
            View all collections <ICONS.ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {MOCK_BUSES.slice(0, 3).map((bus) => (
            <div 
              key={bus.id} 
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:translate-y-[-4px] transition-all border border-slate-100 cursor-pointer flex flex-col group"
              onClick={() => navigate(`/bus/${bus.id}`)}
            >
              <div className="h-64 md:h-72 relative overflow-hidden">
                <img src={bus.image} alt={bus.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl shadow-blue-500/30">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    Guaranteed
                  </div>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{bus.name}</h3>
                  <div className="flex items-center gap-1.5 font-black text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <ICONS.Star /> {bus.rating}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-10">
                  {bus.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">From</p>
                    <p className="text-3xl font-black text-slate-900">₹{bus.pricePerDay.toLocaleString()}</p>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-1">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-20">
            <h2 className="text-xl sm:text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 underline decoration-blue-500 decoration-[6px] underline-offset-[12px] whitespace-nowrap">
              Why Book With CONNECTIONS?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            <div className="group">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-blue-100">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black mb-4 italic">Bus Guaranteed</h4>
              <p className="text-slate-500 text-base leading-relaxed max-w-[320px] mx-auto font-medium">Inventory locked upon booking. Same or better replacement provided in case of rare technical issues.</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-purple-100">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h4 className="text-2xl font-black mb-4 italic">Boutique Experience</h4>
              <p className="text-slate-500 text-base leading-relaxed max-w-[320px] mx-auto font-medium">State-of-the-art lighting, sound systems, and DJ booths tailored for high-end events.</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-amber-100">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black mb-4 italic">24/7 Support</h4>
              <p className="text-slate-500 text-base leading-relaxed max-w-[320px] mx-auto font-medium">Our dedicated concierge team ensures your event or journey runs perfectly without hitches.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
