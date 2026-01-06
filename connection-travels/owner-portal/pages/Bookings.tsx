import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ClipboardList, MapPin, Package, ShieldCheck, Users } from 'lucide-react';
import { ensureOwnerSession } from '../services/session';
import { fetchOwnerBookings } from '../services/api';
import { MOCK_BOOKINGS } from '../constants';
import type { OwnerBooking } from '../types';

const STATUS_LABELS: Record<string, string> = {
  QUOTE_REQUESTED: 'Quote Requested',
  ADMIN_REVIEWING: 'Admin Reviewing',
  PRICE_FINALIZED: 'Awaiting Your Confirmation',
  AWAITING_PAYMENT: 'User Payment Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

const STATUS_STYLES: Record<string, string> = {
  QUOTE_REQUESTED: 'bg-slate-100 text-slate-600 border-slate-200',
  ADMIN_REVIEWING: 'bg-amber-50 text-amber-700 border-amber-100',
  PRICE_FINALIZED: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  AWAITING_PAYMENT: 'bg-blue-50 text-blue-600 border-blue-100',
  CONFIRMED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  CANCELLED: 'bg-red-50 text-red-600 border-red-100',
  COMPLETED: 'bg-slate-50 text-slate-500 border-slate-200',
};

const formatDisplayDate = (value?: string | null) => {
  if (!value) {
    return 'TBD';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'TBD';
  }
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatOwnerPayout = (booking: OwnerBooking) => {
  if (!booking.ownerPayoutPrice || !booking.ownerPayoutLockedAt) {
    return 'Pending admin confirmation';
  }
  const numeric = Number(booking.ownerPayoutPrice);
  if (!Number.isFinite(numeric)) {
    return 'Pending admin confirmation';
  }
  return `₹${numeric.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const session = await ensureOwnerSession();
        const ownerId = session.user?.ownerProfile?.id;
        const isDemo = session.token === 'dummy-owner-token';
        if (!ownerId || isDemo) {
          throw new Error('Offline session');
        }
        const live = await fetchOwnerBookings(ownerId, session.token);
        setBookings(live as OwnerBooking[]);
        setError(null);
      } catch (err) {
        console.error('Failed to load owner bookings', err);
        setBookings(MOCK_BOOKINGS);
        setError('Working with sample data because live bookings are unavailable.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const sorted = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [bookings]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Partner Bookings</h1>
          <p className="text-slate-500 text-sm">Monitor requests and track your confirmed payouts.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          Admin controls user communication
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-100 text-amber-700 text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center text-sm text-slate-500 font-semibold">
          Loading bookings…
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2">No bookings yet</h3>
          <p className="text-sm text-slate-500">Stay responsive when the admin team shares quote updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((booking) => {
            const statusLabel = STATUS_LABELS[booking.status] ?? booking.status;
            const statusClass = STATUS_STYLES[booking.status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
            const travel = booking.travelDetails ?? {};
            const pickup = travel.pickupLocation ?? 'To be shared';
            const startDate = formatDisplayDate(travel.startDate);
            const passengers = travel.passengers ? `${travel.passengers} guests` : 'Passengers TBD';
            const packages = Array.isArray(booking.packageSelections) ? booking.packageSelections : [];

            return (
              <article key={booking.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1 p-6 space-y-6">
                    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Booking {booking.id}</p>
                        <h3 className="text-lg font-bold text-slate-800">{booking.bus.title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                          <MapPin size={14} /> Pickup
                        </div>
                        <p className="font-semibold text-slate-800">{pickup}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                          <CalendarDays size={14} /> Travel Date
                        </div>
                        <p className="font-semibold text-slate-800">{startDate}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                          <Users size={14} /> Group Size
                        </div>
                        <p className="font-semibold text-slate-800">{passengers}</p>
                      </div>
                    </div>

                    {packages.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px]">
                          <Package size={12} /> Requested add-ons
                        </span>
                        {packages.map((pkg: any, index: number) => {
                          const label = typeof pkg === 'string' ? pkg : pkg?.label ?? pkg?.name ?? `Package ${index + 1}`;
                          return (
                            <span key={label} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 font-semibold">
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {booking.adminNotes && (
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-xs text-indigo-800 leading-relaxed">
                        <span className="font-semibold uppercase tracking-widest text-[10px] block mb-1">Admin note</span>
                        {booking.adminNotes}
                      </div>
                    )}
                  </div>

                  <aside className="lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50/50 p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Owner payout</div>
                      <p className="text-xl font-black text-slate-900">{formatOwnerPayout(booking)}</p>
                      <p className="text-xs text-slate-500">Admin locks payout before you dispatch the bus.</p>
                    </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 leading-relaxed">
                        <div className="flex items-center gap-2 font-semibold text-slate-700 mb-1">
                          <ClipboardList size={14} /> Next actions
                        </div>
                        <p>
                          Wait for admin confirmation. They will call before any dispatch. Do not quote user prices directly.
                        </p>
                      </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-700 leading-relaxed flex items-center gap-2">
                      <ShieldCheck size={16} /> CONNECTIONS guarantees replacement if payout is locked and trip is confirmed.
                    </div>
                  </aside>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
