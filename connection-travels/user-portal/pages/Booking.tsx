import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_BUSES } from '../constants';
import { requestQuote, QuotePayload } from '../src/services/api';
import { ensureUserSession } from '../src/services/session';

type PackageChoice = 'yes' | 'no';

const Booking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bus = useMemo(() => MOCK_BUSES.find((b) => b.id === id), [id]);

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocations: '',
    startDate: '',
    endDate: '',
    numberOfDays: '',
    passengers: '',
    eventType: '',
    specialInstructions: '',
    notes: '',
  });
  const [packagePreference, setPackagePreference] = useState<PackageChoice>('no');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deriveNumberOfDays = useMemo(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (Number.isFinite(diff) && diff > 0) {
        return diff.toString();
      }
    }
    return formData.numberOfDays;
  }, [formData.startDate, formData.endDate, formData.numberOfDays]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!bus) {
      setError('Selected bus unavailable.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { token } = await ensureUserSession();
      const dropLocations = formData.dropLocations
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        busId: bus.id,
        pickupLocation: formData.pickupLocation.trim(),
        dropLocations,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        numberOfDays: deriveNumberOfDays ? Number(deriveNumberOfDays) : undefined,
        passengers: Number(formData.passengers || '0'),
        packages: [
          {
            name: 'Optional packages required',
            included: packagePreference === 'yes',
          },
        ],
        eventType: formData.eventType || undefined,
        specialInstructions: formData.specialInstructions || undefined,
        notes: formData.notes || undefined,
      };

      if (!payload.pickupLocation || !payload.startDate || payload.passengers <= 0) {
        throw new Error('Please complete pickup, start date, and passenger count.');
      }

      const booking = await requestQuote(payload as QuotePayload, token);
      navigate('/bookings', { state: { highlightId: booking.id } });
    } catch (submitError) {
      setError((submitError as Error).message || 'Unable to submit quote request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!bus) {
    return <div className="p-20 text-center font-bold">Bus not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-5xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="mb-12 text-center space-y-3">
          <h1 className="text-3xl font-black text-slate-900">Request Quote</h1>
          <p className="text-slate-500 text-sm">Share your plan and our concierge team will coordinate the perfect journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest text-[11px]">Travel details</h2>
                <p className="text-xs text-slate-500">Tell us where and when. We keep the conversation private end-to-end.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pickup location</label>
                  <input
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Mumbai Airport"
                    value={formData.pickupLocation}
                    onChange={(event) => setFormData({ ...formData, pickupLocation: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Approx passengers</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 40"
                    value={formData.passengers}
                    onChange={(event) => setFormData({ ...formData, passengers: event.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Start date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    value={formData.startDate}
                    onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">End date</label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    value={formData.endDate}
                    onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Number of days</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    value={deriveNumberOfDays}
                    onChange={(event) => setFormData({ ...formData, numberOfDays: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Drop locations</label>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Pune City Center\nLonavala resort"
                    value={formData.dropLocations}
                    onChange={(event) => setFormData({ ...formData, dropLocations: event.target.value })}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest text-[11px]">Optional packages</h2>
                <p className="text-xs text-slate-500">Do you want our team to curate extra packages like decor, fuel, or permits?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['yes', 'no'] as PackageChoice[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPackagePreference(option)}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl border text-sm font-semibold transition ${
                      packagePreference === option
                        ? option === 'yes'
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {option === 'yes' ? 'Yes, add packages' : 'No packages needed'}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest text-[11px]">Event & notes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Event type</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Wedding Sangeet"
                    value={formData.eventType}
                    onChange={(event) => setFormData({ ...formData, eventType: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin notes</label>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500"
                    placeholder="Share anything else the team should know."
                    value={formData.notes}
                    onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Special instructions</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-28 focus:ring-2 focus:ring-blue-500"
                  placeholder="Dietary needs, schedule nuances, artist riders, etc."
                  value={formData.specialInstructions}
                  onChange={(event) => setFormData({ ...formData, specialInstructions: event.target.value })}
                />
              </div>
            </section>

            {error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg transition transform active:scale-95 uppercase tracking-[0.2em] text-[10px] disabled:opacity-70"
            >
              {submitting ? 'Submitting…' : 'Submit & Talk to Admin'}
            </button>
          </form>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400">Summary</p>
              <h3 className="text-lg font-bold mt-2">{bus.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Capacity {bus.capacity} • Dedicated concierge support</p>
            </div>
            <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-700 text-xs leading-relaxed">
              <p className="text-blue-300 font-semibold">Pricing shared directly with you.</p>
              <p className="text-blue-200 mt-1">We coordinate with the owner only after you sign off, keeping details discreet.</p>
            </div>
            <ul className="space-y-3 text-xs text-slate-200">
              <li>• Quote Requested → Concierge Reviewing → Price Finalized → Confirm & Pay</li>
              <li>• Owner confirmation happens only after your go-ahead.</li>
              <li>• You receive invoice and package summary once price is locked.</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-blue-800 text-xs space-y-3">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <div>
                <p className="font-semibold">CONNECTIONS Guarantee</p>
                <p className="mt-1">Inventory is blocked after concierge confirmation. Same or better replacement if rare issues arise.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Booking;
