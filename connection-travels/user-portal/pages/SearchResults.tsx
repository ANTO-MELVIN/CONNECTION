
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_BUSES, ICONS } from '../constants';
import { Bus, BusFeature } from '../types';
import { fetchBuses } from '../src/services/api';

type SearchBus = Bus & { isAvailable: boolean; statusMessage?: string | null; tags: string[] };

const mapMockBus = (bus: Bus): SearchBus => ({ ...bus, isAvailable: true, tags: ['Available', 'Verified bus', 'Matches your budget'] });

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialFeature = searchParams.get('feature') as BusFeature || null;
  const initialPickup = searchParams.get('pickup') || '';
  const initialDrop = searchParams.get('drop') || '';

  const [budget, setBudget] = useState(200000);
  const [selectedFeatures, setSelectedFeatures] = useState<BusFeature[]>(initialFeature ? [initialFeature] : []);
  const [capacity, setCapacity] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [buses, setBuses] = useState<SearchBus[]>(MOCK_BUSES.map(mapMockBus));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBuses() {
      try {
        setLoading(true);
        const list = await fetchBuses();
        const mapped: SearchBus[] = list.map((bus: any) => {
          const isAvailable = bus.active ?? true;
          const mediaItems = Array.isArray(bus.media) ? bus.media : [];
          const resolveMediaSource = (item: any) => {
            if (!item) {
              return null;
            }
            const fallbackMime = item.kind === 'VIDEO' ? 'video/mp4' : 'image/jpeg';
            const mime = item.mimeType || fallbackMime;
            if (item.data) {
              return `data:${mime};base64,${item.data}`;
            }
            if (item.url) {
              return item.url;
            }
            return null;
          };
          const gallerySources = mediaItems
            .filter((item: any) => item.kind === 'IMAGE')
            .map(resolveMediaSource)
            .filter(Boolean) as string[];
          const heroImage = gallerySources[0] || resolveMediaSource(mediaItems[0]) || 'https://images.unsplash.com/photo-1529429617124-aee711907c6c?auto=format&fit=crop&w=1600&q=80';

          return {
            id: bus.id,
            name: bus.title,
            image: heroImage,
            gallery: gallerySources.length > 0 ? gallerySources : bus.gallery ?? [],
            capacity: bus.capacity ?? 0,
            features: (bus.amenities ?? []) as BusFeature[],
            rating: 4.8,
            verified: true,
            ownerContact: 'Contact on request',
            year: 2023,
            condition: 'Excellent',
            description: bus.description ?? 'Premium boutique travel experience by Connection Travels.',
            isAvailable,
            statusMessage: isAvailable ? null : 'Temporarily unavailable',
            tags: [
              isAvailable ? 'Available' : 'Currently reviewing',
              'Matches your budget',
              'Verified bus',
            ],
          };
        });
        setBuses(mapped);
        if (!mapped.some((bus) => bus.isAvailable)) {
          setError('All buses are currently unavailable. Please check back soon.');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load buses', err);
        setError('Unable to fetch live buses. Showing sample data.');
        setBuses(MOCK_BUSES.map(mapMockBus));
      } finally {
        setLoading(false);
      }
    }

    loadBuses();
  }, []);

  const toggleFeature = (f: BusFeature) => {
    setSelectedFeatures(prev => 
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const filteredBuses = useMemo(() => {
    return buses
        .filter(bus => bus.isAvailable)
        .filter(bus => {
      const matchFeatures = selectedFeatures.every(f => bus.features.includes(f));
      const matchCapacity = capacity === 0 || bus.capacity >= capacity;
        return matchFeatures && matchCapacity;
      });
  }, [budget, selectedFeatures, capacity, buses]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden sticky top-[60px] z-30 mb-6 flex gap-3">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 py-3 rounded-2xl font-bold shadow-sm"
        >
          <ICONS.Filter />
          <span>{isFilterOpen ? 'Close Filters' : 'Filter & Sort'}</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`
          ${isFilterOpen ? 'block animate-in slide-in-from-top-4 duration-300' : 'hidden md:block'}
          w-full md:w-72 shrink-0 space-y-8
        `}>
          <div>
            <h2 className="hidden md:flex text-lg font-bold text-slate-900 mb-6 items-center gap-2">
              <ICONS.Filter /> Filters
            </h2>
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-6">Budget Range (₹)</label>
                <input 
                  type="range" 
                  min="30000" 
                  max="200000" 
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-4 font-bold text-slate-700 text-sm">
                  <span>₹30k</span>
                  <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Up to ₹{budget.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Capacity</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-sm focus:ring-2 focus:ring-blue-500 transition"
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  value={capacity}
                >
                  <option value="0">Any Capacity</option>
                  <option value="20">20+ Seats</option>
                  <option value="30">30+ Seats</option>
                  <option value="40">40+ Seats</option>
                  <option value="50">50+ Seats</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Features</label>
                <div className="grid grid-cols-1 gap-3">
                  {[BusFeature.DJ_BUS, BusFeature.LED_LIGHTS, BusFeature.AC, BusFeature.SLEEPER, BusFeature.LUXURY].map((f) => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-xl transition">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedFeatures.includes(f)}
                        onChange={() => toggleFeature(f)}
                      />
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {isFilterOpen && (
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="md:hidden w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4"
                >
                  Apply Filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Results */}
        <div className="flex-1 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900">
                {filteredBuses.length} Boutique Buses
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {initialPickup && `From ${initialPickup}`} {initialDrop && `to ${initialDrop}`}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
              <button className="px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg bg-white shadow-sm text-blue-600">Grid</button>
              <button className="px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/50 transition text-slate-400">List</button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-[2.5rem] py-20 px-8 text-center border shadow-sm max-w-lg mx-auto mt-10">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <ICONS.Search />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Loading boutique fleet…</h3>
              <p className="text-slate-500 mb-2 text-sm leading-relaxed">Please wait while we fetch the latest availability.</p>
            </div>
          ) : filteredBuses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {filteredBuses.map((bus) => (
                <div 
                  key={bus.id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group"
                  onClick={() => navigate(`/bus/${bus.id}`)}
                >
                  <div className="h-56 md:h-60 relative overflow-hidden">
                    <img src={bus.image} alt={bus.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg flex items-center gap-1.5 border border-white">
                       <svg className="w-3.5 h-3.5 text-blue-600 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                       Guaranteed
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg text-white text-[10px] font-bold">
                        {bus.capacity} SEATS
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {bus.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {bus.tags.map((tag) => (
                            <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8 flex-1">
                      {bus.features.slice(0, 4).map((f, i) => (
                        <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                          {f}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-slate-50 text-slate-900 group-hover:bg-blue-600 group-hover:text-white font-black py-4 rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-[10px] shadow-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] py-20 px-8 text-center border shadow-sm max-w-lg mx-auto mt-10">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ICONS.Search />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">No buses matching filters</h3>
              <p className="text-slate-500 mb-10 text-sm leading-relaxed">Try adjusting your budget slider or removing some feature filters to see more results.</p>
              <button 
                onClick={() => {setBudget(200000); setSelectedFeatures([]); setCapacity(0);}}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                Reset All Filters
              </button>
            </div>
          )}
          {error && (
            <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
