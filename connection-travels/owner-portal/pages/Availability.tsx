
import React, { useEffect, useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Lock, Clock, AlertTriangle, X, Check } from 'lucide-react';
import { ensureOwnerSession } from '../services/session';
import { fetchOwnerBuses, upsertSchedule } from '../services/api';

type DateStatus = 'available' | 'booked' | 'maintenance' | 'blocked';
type ScheduleStatus = 'ACTIVE' | 'SOLD_OUT' | 'CANCELLED' | 'MAINTENANCE' | 'BLOCKED';

interface OwnerSchedule {
  id: string;
  departureDate: string;
  arrivalDate?: string | null;
  origin: string;
  destination: string;
  availableSeats: number;
  price: number | string;
  status: ScheduleStatus;
  statusReason?: string | null;
}

interface OwnerBus {
  id: string;
  title: string;
  registrationNo: string;
  capacity: number;
  schedules: OwnerSchedule[];
}

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

interface CalendarEntry {
  day: number;
  status: DateStatus;
  reason?: string;
  schedule?: OwnerSchedule;
}

const statusClasses: Record<DateStatus, string> = {
  available: 'bg-white border-slate-50 text-slate-700 hover:border-indigo-400',
  booked: 'bg-red-50 border-red-100 text-red-600',
  maintenance: 'bg-amber-50 border-amber-100 text-amber-600',
  blocked: 'bg-slate-100 border-slate-200 text-slate-500',
};

const statusForDate: Record<DateStatus, ScheduleStatus> = {
  available: 'ACTIVE',
  booked: 'SOLD_OUT',
  maintenance: 'MAINTENANCE',
  blocked: 'BLOCKED',
};

const defaultReason: Partial<Record<DateStatus, string>> = {
  booked: 'Customer Booking',
  maintenance: 'Maintenance Block',
  blocked: 'Owner Private Trip',
};

function toDateStatus(status: ScheduleStatus): DateStatus {
  switch (status) {
    case 'ACTIVE':
      return 'available';
    case 'SOLD_OUT':
      return 'booked';
    case 'MAINTENANCE':
      return 'maintenance';
    case 'BLOCKED':
    case 'CANCELLED':
      return 'blocked';
    default:
      return 'available';
  }
}

function createOfflineBus(baseMonth: Date): OwnerBus {
  const buildDate = (day: number) => new Date(baseMonth.getFullYear(), baseMonth.getMonth(), day, 9).toISOString();
  return {
    id: 'offline-bus-1',
    title: 'Royal Voyager',
    registrationNo: 'BUS001',
    capacity: 40,
    schedules: [
      {
        id: 'offline-20',
        departureDate: buildDate(20),
        arrivalDate: buildDate(20),
        origin: 'Bengaluru',
        destination: 'City Tour',
        availableSeats: 0,
        price: '0',
        status: 'SOLD_OUT',
        statusReason: 'Customer Booking',
      },
      {
        id: 'offline-21',
        departureDate: buildDate(21),
        arrivalDate: buildDate(21),
        origin: 'Bengaluru',
        destination: 'City Tour',
        availableSeats: 0,
        price: '0',
        status: 'SOLD_OUT',
        statusReason: 'Customer Booking',
      },
      {
        id: 'offline-22',
        departureDate: buildDate(22),
        arrivalDate: buildDate(22),
        origin: 'Bengaluru',
        destination: 'City Tour',
        availableSeats: 0,
        price: '0',
        status: 'SOLD_OUT',
        statusReason: 'Customer Booking',
      },
      {
        id: 'offline-25',
        departureDate: buildDate(25),
        arrivalDate: buildDate(25),
        origin: 'Garage',
        destination: 'Garage',
        availableSeats: 0,
        price: '0',
        status: 'MAINTENANCE',
        statusReason: 'Oil Change',
      },
      {
        id: 'offline-28',
        departureDate: buildDate(28),
        arrivalDate: buildDate(28),
        origin: 'Bengaluru',
        destination: 'Private Trip',
        availableSeats: 0,
        price: '0',
        status: 'BLOCKED',
        statusReason: 'Owner Private Trip',
      },
    ],
  };
}

const Availability: React.FC = () => {
  const [session, setSession] = useState<{ token: string; user: any } | null>(null);
  const [buses, setBuses] = useState<OwnerBus[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<number | null>(null);
  const [activeMonth, setActiveMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      try {
        const sess = await ensureOwnerSession();
        if (!mounted) return;
        setSession(sess);
        const ownerId = sess.user?.ownerProfile?.id;
        const isDemoToken = sess.token === 'dummy-owner-token';
        if (!ownerId || isDemoToken) {
          throw new Error('Offline session');
        }
        const data = await fetchOwnerBuses(ownerId, sess.token);
        if (!mounted) return;
        setBuses(data);
        setSelectedBusId((data[0]?.id as string) ?? null);
      } catch (error) {
        if (!mounted) return;
        setIsOffline(true);
        const fallbackMonth = new Date();
        const offline = createOfflineBus(new Date(fallbackMonth.getFullYear(), fallbackMonth.getMonth(), 1));
        setBuses([offline]);
        setSelectedBusId(offline.id);
        setFeedback({ type: 'error', message: 'Using demo data because the server is offline.' });
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

  const selectedBus = useMemo(
    () => buses.find((bus) => bus.id === selectedBusId) ?? null,
    [buses, selectedBusId]
  );

  const ownerProfileId: string | undefined = session?.user?.ownerProfile?.id;

  const calendarEntries = useMemo(() => {
    const map = new Map<number, CalendarEntry>();
    if (!selectedBus) {
      return map;
    }

    for (const schedule of selectedBus.schedules ?? []) {
      const departure = new Date(schedule.departureDate);
      if (
        departure.getFullYear() !== activeMonth.getFullYear() ||
        departure.getMonth() !== activeMonth.getMonth()
      ) {
        continue;
      }
      const day = departure.getDate();
      const status = toDateStatus(schedule.status);
      map.set(day, {
        day,
        status,
        reason: schedule.statusReason ?? defaultReason[status],
        schedule,
      });
    }

    return map;
  }, [selectedBus, activeMonth]);

  const daysInMonth = useMemo(() => {
    return new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0).getDate();
  }, [activeMonth]);

  const leadingEmptyCells = useMemo(() => {
    const firstDay = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1);
    const weekIndex = (firstDay.getDay() + 6) % 7;
    return Array.from({ length: weekIndex });
  }, [activeMonth]);

  const monthLabel = useMemo(
    () => activeMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [activeMonth]
  );

  const handlePrevMonth = () => {
    setEditingDate(null);
    setActiveMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setEditingDate(null);
    setActiveMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleUpdateStatus = async (day: number, status: DateStatus, reason?: string) => {
    if (!selectedBus) {
      return;
    }

    const entry = calendarEntries.get(day);
    const schedule = entry?.schedule;
    if (!schedule) {
      setFeedback({
        type: 'error',
        message: 'Create a schedule for this date before updating availability.',
      });
      setEditingDate(null);
      return;
    }

    const payload = {
      id: schedule.id,
      departureDate: schedule.departureDate,
      arrivalDate: schedule.arrivalDate ?? null,
      origin: schedule.origin,
      destination: schedule.destination,
      availableSeats: schedule.availableSeats,
      price: schedule.price,
      status: statusForDate[status],
      statusReason: reason ?? entry?.reason ?? defaultReason[status] ?? null,
    };

    if (isOffline || !ownerProfileId || !session?.token) {
      setBuses((prev) =>
        prev.map((bus) =>
          bus.id === selectedBus.id
            ? {
                ...bus,
                schedules: bus.schedules.map((item) =>
                  item.id === schedule.id
                    ? { ...item, status: payload.status, statusReason: payload.statusReason ?? undefined }
                    : item
                ),
              }
            : bus
        )
      );
      setFeedback({ type: 'success', message: 'Availability updated locally (offline mode).' });
      setEditingDate(null);
      return;
    }

    try {
      setSaving(true);
      const updated = await upsertSchedule(ownerProfileId, selectedBus.id, payload, session.token);
      setBuses((prev) =>
        prev.map((bus) =>
          bus.id === selectedBus.id
            ? {
                ...bus,
                schedules: bus.schedules.map((item) =>
                  item.id === updated.id
                    ? {
                        ...item,
                        status: updated.status as ScheduleStatus,
                        statusReason: updated.statusReason ?? undefined,
                        availableSeats: updated.availableSeats,
                        departureDate: updated.departureDate,
                        arrivalDate: updated.arrivalDate,
                        origin: updated.origin,
                        destination: updated.destination,
                        price: updated.price,
                      }
                    : item
                ),
              }
            : bus
        )
      );
      setFeedback({ type: 'success', message: 'Availability updated.' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to update availability. Please try again.' });
    } finally {
      setSaving(false);
      setEditingDate(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Loading availability…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Availability Manager</h1>
          <p className="text-slate-500 text-sm">Update bus availability in real-time</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 border border-slate-100 rounded-xl shadow-sm self-start">
          <button className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-600 shadow-sm">
            Calendar
          </button>
          <button className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-50">
            List View
          </button>
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
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <label className="text-sm font-bold text-slate-700 block mb-3 uppercase tracking-wider">Select Bus</label>
            <div className="space-y-2">
              {buses.map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => {
                    setSelectedBusId(bus.id);
                    setEditingDate(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    bus.id === selectedBusId
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {bus.title} ({bus.registrationNo})
                </button>
              ))}
              {buses.length === 0 && (
                <p className="text-xs font-semibold text-slate-500">Add a bus to begin managing availability.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hidden sm:block">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Status Colors</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-green-500"></div> Available
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Booked Trip
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div> Maintenance
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div> Blocked / Private
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="text-indigo-600" size={20} /> {monthLabel}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                  aria-label="Next month"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6">
              <div className="grid grid-cols-7 gap-px mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => (
                  <div key={d} className="text-center py-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
                {leadingEmptyCells.map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square bg-slate-50/30 rounded-lg sm:rounded-xl"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const entry = calendarEntries.get(day);
                  const status = entry?.status ?? 'available';
                  const reason = entry?.reason;
                  const hasSchedule = Boolean(entry?.schedule);

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (!hasSchedule) {
                          setFeedback({
                            type: 'error',
                            message: 'Create a schedule for this date before updating availability.',
                          });
                          return;
                        }
                        setEditingDate(day);
                      }}
                      className={`relative aspect-square rounded-lg sm:rounded-xl p-1 sm:p-2 text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all border-2 group ${statusClasses[status]}`}
                    >
                      {day}
                      {status === 'available' && (
                        <div className="absolute bottom-1 sm:bottom-2 w-1 sm:h-1 sm:w-1 h-1 rounded-full bg-green-500"></div>
                      )}
                      {reason && (
                        <span className="hidden sm:block text-[8px] font-medium opacity-60 mt-0.5 truncate max-w-full">
                          {reason}
                        </span>
                      )}

                      {hasSchedule && (
                        <div className="absolute inset-0 bg-indigo-600/90 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold">
                          EDIT
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg hidden sm:block">
                  <AlertTriangle size={18} />
                </div>
                <p className="text-[10px] sm:text-xs text-slate-600 text-center sm:text-left">
                  Blocking dates will remove this bus from customer search results immediately. Use this for maintenance or private offline bookings.
                </p>
              </div>
              <button className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                <Lock size={16} /> Bulk Block
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingDate !== null && selectedBus && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <div>
                <h3 className="text-xl font-bold">Manage Date</h3>
                <p className="text-indigo-100 text-xs">
                  {monthLabel} {editingDate}
                </p>
              </div>
              <button onClick={() => setEditingDate(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">Select Status</p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleUpdateStatus(editingDate, 'available')}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-green-50 hover:border-green-200 transition-all group"
                  disabled={saving}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Check size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Available</span>
                  </div>
                </button>

                <button
                  onClick={() => handleUpdateStatus(editingDate, 'maintenance', 'Maintenance Block')}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-amber-50 hover:border-amber-200 transition-all group"
                  disabled={saving}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Clock size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Maintenance</span>
                  </div>
                </button>

                <button
                  onClick={() => handleUpdateStatus(editingDate, 'booked', 'Customer Booking')}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-red-50 hover:border-red-200 transition-all group"
                  disabled={saving}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <CalendarIcon size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Trip Booked</span>
                  </div>
                </button>

                <button
                  onClick={() => handleUpdateStatus(editingDate, 'blocked', 'Owner Private Trip')}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all group"
                  disabled={saving}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                      <Lock size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Private Block</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex justify-between items-center gap-3">
              {saving && <span className="text-xs font-semibold text-slate-500">Saving…</span>}
              <button
                onClick={() => setEditingDate(null)}
                className="text-sm font-bold text-slate-500 hover:text-slate-700"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;
