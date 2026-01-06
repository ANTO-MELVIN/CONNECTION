
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ensureUserSession } from '../src/services/session';
import { fetchUserBookings } from '../src/services/api';
import { MOCK_BUSES } from '../constants';

const STATUS_FLOW = ['QUOTE_REQUESTED', 'ADMIN_REVIEWING', 'PRICE_FINALIZED', 'AWAITING_PAYMENT', 'CONFIRMED'];

const STATUS_LABELS: Record<string, string> = {
  QUOTE_REQUESTED: 'Quote Requested',
  ADMIN_REVIEWING: 'Admin Reviewing',
  PRICE_FINALIZED: 'Price Finalized',
  AWAITING_PAYMENT: 'Confirm & Pay',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

interface BookingItem {
  id: string;
  status: string;
  userFinalPrice?: string | number | null;
  userPriceLockedAt?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  travelDetails: any;
  packageSelections: any;
  bus: any;
}

function resolveMediaUrl(bus: any) {
  const fallback = MOCK_BUSES[Math.floor(Math.random() * MOCK_BUSES.length)]?.image;
  const media = Array.isArray(bus?.media) ? bus.media : [];
  const first = media.find((item: any) => item.kind === 'IMAGE');
  if (!first) {
    return fallback;
  }
  if (first.data) {
    const mime = first.mimeType || 'image/jpeg';
    return `data:${mime};base64,${first.data}`;
  }
  return first.url || fallback;
}

const MyBookings: React.FC = () => {
  const location = useLocation();
  const highlightId = (location.state as any)?.highlightId as string | undefined;
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { token } = await ensureUserSession();
        const response = await fetchUserBookings(token);
        setBookings(response as BookingItem[]);
      } catch (err) {
        console.error('Failed to load bookings', err);
        setError('Unable to fetch live bookings. Showing sample data.');
        setBookings([
          {
            id: 'sample-1',
            status: 'QUOTE_REQUESTED',
            userFinalPrice: null,
            userPriceLockedAt: null,
            adminNotes: 'Admin will reach out shortly.',
            createdAt: new Date().toISOString(),
            travelDetails: {
              pickupLocation: 'Sample pickup',
              startDate: new Date().toISOString(),
            },
            packageSelections: [],
            bus: {
              id: MOCK_BUSES[0].id,
              title: MOCK_BUSES[0].name,
              media: [],
            },
          },
        ]);
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-500 text-sm">Track statuses, view invoices, and coordinate with admin.</p>
      </div>

      {loading ? (
        <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">Loading your bookings…</div>
      ) : (
        <div className="space-y-6">
          {sorted.map((booking) => {
            const mediaUrl = resolveMediaUrl(booking.bus);
            const currentStep = STATUS_FLOW.indexOf(booking.status);
            const isLocked = Boolean(booking.userPriceLockedAt && booking.userFinalPrice);
            const finalPrice = booking.userFinalPrice ? Number(booking.userFinalPrice) : null;
            const travelStart = booking.travelDetails?.startDate
              ? new Date(booking.travelDetails.startDate).toLocaleDateString()
              : 'To be decided';
            const isHighlighted = highlightId === booking.id;

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-3xl border shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center transition ${
                  isHighlighted ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                }`}
              >
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img src={mediaUrl} alt={booking.bus?.title ?? 'Bus'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white">
                      {STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">ID: {booking.id}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{booking.bus?.title ?? 'Boutique Bus'}</h3>
                    <p className="text-sm text-slate-500">Trip start: <span className="text-slate-900 font-semibold">{travelStart}</span></p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {STATUS_FLOW.map((status, index) => (
                      <span
                        key={status}
                        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border ${
                          index <= currentStep ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {STATUS_LABELS[status]}
                      </span>
                    ))}
                  </div>
                  {booking.adminNotes && (
                    <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                      <strong className="text-slate-700">Admin note:</strong> {booking.adminNotes}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-64 text-center md:text-right space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Final Price</p>
                    {isLocked && finalPrice ? (
                      <p className="text-2xl font-black text-slate-900">₹{finalPrice.toLocaleString()}</p>
                    ) : (
                      <p className="text-xs text-slate-500">Pending admin confirmation</p>
                    )}
                  </div>
                  {booking.status === 'AWAITING_PAYMENT' && (
                    <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition">
                      Pay advance
                    </button>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <button className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition">
                      Download invoice
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">No bookings yet</h3>
              <p className="text-sm text-slate-500">Begin by exploring our fleet and requesting a quote.</p>
            </div>
          )}
          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="mt-20 border-t pt-10 text-center">
        <h4 className="text-slate-400 uppercase font-bold tracking-widest text-xs mb-6">Need help with a booking?</h4>
        <button className="text-blue-600 font-bold hover:underline">Contact 24/7 Support Team</button>
      </div>
    </div>
  );
};

export default MyBookings;
