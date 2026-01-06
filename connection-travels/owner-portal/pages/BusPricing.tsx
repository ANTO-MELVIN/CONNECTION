import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, IndianRupee, RefreshCw, Shield, MapPin } from 'lucide-react';
import { ensureOwnerSession } from '../services/session';
import { fetchOwnerBuses, updateExpectedPrice } from '../services/api';
import { MOCK_BUSES } from '../constants';
import type { OwnerBus } from '../types';

type FeedbackState = {
  type: 'success' | 'error';
  message: string;
};

type DestinationPreset = {
  id: string;
  label: string;
  description: string;
  suggestion: number;
};

type DestinationPricingMap = Record<string, Record<string, number>>;

const DESTINATION_PRESETS: DestinationPreset[] = [
  {
    id: 'CITY',
    label: 'Within City (0-80 km)',
    description: 'Corporate shuttles, local events, airport drops.',
    suggestion: 32000,
  },
  {
    id: 'NEARBY',
    label: 'Nearby City (80-250 km)',
    description: 'Day trips with driver returning the same night.',
    suggestion: 42000,
  },
  {
    id: 'OUTSTATION',
    label: 'Outstation (250-500 km)',
    description: 'Weekend getaways with stay requirements.',
    suggestion: 58000,
  },
  {
    id: 'LONG_HAUL',
    label: 'Long Haul (500+ km)',
    description: 'Multi-day itineraries across states.',
    suggestion: 72000,
  },
];

const formatCurrency = (value: string | number | null | undefined) => {
  if (value == null) {
    return 'Not set';
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return 'Not set';
  }
  return `₹${numeric.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

const PRICING_STORAGE_KEY = 'ownerDestinationPricing';

const BusPricing: React.FC = () => {
  const [session, setSession] = useState<{ token: string; user: any } | null>(null);
  const [buses, setBuses] = useState<OwnerBus[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [destinationPricing, setDestinationPricing] = useState<DestinationPricingMap>({});
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>(DESTINATION_PRESETS[0].id);
  const [expectedPriceInput, setExpectedPriceInput] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const sess = await ensureOwnerSession();
        if (!mounted) {
          return;
        }
        setSession(sess);
        const ownerId = sess.user?.ownerProfile?.id;
        const isDemo = sess.token === 'dummy-owner-token' || sess.token === 'offline-owner-session';
        if (!ownerId || isDemo) {
          throw new Error('Offline session');
        }
        const liveBuses = await fetchOwnerBuses(ownerId, sess.token);
        if (!mounted) {
          return;
        }
        setBuses(liveBuses);
        setSelectedBusId(liveBuses[0]?.id ?? null);
      } catch (error) {
        if (!mounted) {
          return;
        }
        setOffline(true);
        setBuses(MOCK_BUSES);
        setSelectedBusId(MOCK_BUSES[0]?.id ?? null);
        setFeedback({ type: 'error', message: 'Using demo pricing because live sync is offline.' });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRICING_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DestinationPricingMap;
        setDestinationPricing(parsed);
      }
    } catch (error) {
      console.error('Failed to read saved pricing matrix', error);
    }
  }, []);

  const selectedBus = useMemo(
    () => buses.find((bus) => bus.id === selectedBusId) ?? null,
    [buses, selectedBusId]
  );

  const selectedBusPricing = useMemo(() => {
    if (!selectedBusId) {
      return {} as Record<string, number>;
    }
    return destinationPricing[selectedBusId] ?? {};
  }, [destinationPricing, selectedBusId]);

  useEffect(() => {
    if (!selectedBusId) {
      setExpectedPriceInput('');
      return;
    }
    const storedValue = selectedBusPricing[selectedDestinationId];
    if (storedValue) {
      setExpectedPriceInput(storedValue.toString());
      return;
    }
    const preset = DESTINATION_PRESETS.find((item) => item.id === selectedDestinationId);
    setExpectedPriceInput(preset ? preset.suggestion.toString() : '');
  }, [selectedBusId, selectedDestinationId, selectedBusPricing]);

  const persistDestinationPricing = (next: DestinationPricingMap) => {
    localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(next));
  };

  const ownerId: string | undefined = session?.user?.ownerProfile?.id;

  const handleSave = async () => {
    if (!selectedBus || !selectedBusId) {
      return;
    }
    const numericValue = Number(expectedPriceInput);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setFeedback({ type: 'error', message: 'Enter a valid amount above zero.' });
      return;
    }
    const destinationPreset = DESTINATION_PRESETS.find((item) => item.id === selectedDestinationId);
    const destinationLabel = destinationPreset?.label ?? 'Custom route';
    const notePayload = [
      `Route: ${destinationLabel}`,
      note.trim() ? `Note: ${note.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const updateLocalState = () => {
      setDestinationPricing((prev) => {
        const currentBusMatrix = { ...(prev[selectedBusId] ?? {}) };
        currentBusMatrix[selectedDestinationId] = numericValue;
        const nextState: DestinationPricingMap = { ...prev, [selectedBusId]: currentBusMatrix };
        persistDestinationPricing(nextState);
        return nextState;
      });
      setBuses((prev) =>
        prev.map((bus) =>
          bus.id === selectedBusId
            ? {
                ...bus,
                pricing: {
                  expectedPrice: numericValue.toFixed(2),
                  lastUpdatedAt: new Date().toISOString(),
                },
              }
            : bus
        )
      );
    };

    if (offline || !ownerId || !session?.token) {
      updateLocalState();
      setFeedback({ type: 'success', message: `${destinationLabel} pricing updated locally (offline mode).` });
      setNote('');
      return;
    }

    try {
      setSaving(true);
      await updateExpectedPrice(
        ownerId,
        selectedBusId,
        {
          expectedPrice: numericValue,
          note: notePayload || undefined,
        },
        session.token
      );
      updateLocalState();
      setFeedback({ type: 'success', message: `${destinationLabel} pricing shared with admin.` });
      setNote('');
    } catch (error) {
      setFeedback({ type: 'error', message: 'Unable to update price. Please retry in a moment.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-sm text-slate-500 font-semibold">
        Preparing pricing dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bus Pricing</h1>
          <p className="text-slate-500 text-sm">
            Drivers can now pick the destination tier first and then lock your minimum payout.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl">
          <Shield size={14} className="text-indigo-500" /> Admin Controlled Quotes
        </div>
      </div>

      {feedback && (
        <div
          className={`text-sm font-medium px-4 py-3 rounded-xl border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
              : 'bg-amber-50 border-amber-100 text-amber-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-3">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider">Select Bus</p>
            <div className="space-y-2">
              {buses.map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => setSelectedBusId(bus.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    bus.id === selectedBusId
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold text-sm">{bus.title}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-80 flex items-center gap-1">
                    <MapPin size={12} /> {bus.registrationNo}
                  </span>
                </button>
              ))}
              {buses.length === 0 && (
                <p className="text-xs font-semibold text-slate-500">Add a bus to start sharing pricing guidance.</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Saved destination rates</p>
            <ul className="space-y-2 text-sm text-slate-600">
              {DESTINATION_PRESETS.map((preset) => (
                <li key={preset.id} className="flex items-center justify-between">
                  <span>{preset.label}</span>
                  <span className="font-bold text-slate-800">
                    {selectedBusPricing[preset.id]
                      ? formatCurrency(selectedBusPricing[preset.id])
                      : 'Not set'}
                  </span>
                </li>
              ))}
            </ul>
            {offline && (
              <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold p-3">
                Offline mode – share updates with admin once reconnected.
              </div>
            )}
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          {selectedBus ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedBus.title}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedBus.registrationNo}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Destination-specific payouts
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DESTINATION_PRESETS.map((preset) => {
                  const isActive = preset.id === selectedDestinationId;
                  const saved = selectedBusPricing[preset.id];
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedDestinationId(preset.id)}
                      className={`text-left rounded-2xl border px-5 py-4 transition-all ${
                        isActive
                          ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-sm font-black text-slate-800">{preset.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{preset.description}</p>
                      <p className="text-xs font-semibold text-slate-400 mt-3">
                        Suggested: ₹{preset.suggestion.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-sm font-bold text-slate-700 mt-2">
                        {saved ? `Saved: ${formatCurrency(saved)}` : 'Not saved yet'}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Expected payout for {DESTINATION_PRESETS.find((item) => item.id === selectedDestinationId)?.label.toLowerCase()}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <IndianRupee size={18} />
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={expectedPriceInput}
                      onChange={(event) => setExpectedPriceInput(event.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Include tolls, driver stay, diesel, and desired margin.</p>
                </label>

                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Internal note (optional)
                  <textarea
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add pickup/drop cities, vehicle add-ons, or season-specific details."
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <RefreshCw size={14} /> Update every time driver negotiates new route pricing.
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Sharing…' : 'Share With Admin'}
                </button>
            </div>
          </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center text-sm text-slate-500 shadow-sm">
              Select a bus to review pricing guidance.
            </div>
          )}

          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-xs text-slate-500 leading-relaxed shadow-sm">
            <p className="font-semibold text-slate-700 mb-2">Tip for destination-based quotes</p>
            <p>
              Collect pickup, drop, and route extras from drivers, then lock your payout tier. Admin adjusts traveller-facing price separately.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusPricing;
