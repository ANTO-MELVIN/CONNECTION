import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { ensureOwnerSession } from '../services/session';
import { fetchOwnerBuses } from '../services/api';
import { MOCK_BUSES } from '../constants';
import type { OwnerBus } from '../types';

type DayStatus = 'AVAILABLE' | 'BLOCKED';

type FeedbackState = {
	type: 'success' | 'error';
	message: string;
};

type AvailabilityMap = Record<string, Record<string, DayStatus>>;

const STORAGE_KEY = 'ownerAvailabilityCalendar';
const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const formatDateKey = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const cycleStatus = (current?: DayStatus): DayStatus | null => {
	if (!current) {
		return 'AVAILABLE';
	}
	if (current === 'AVAILABLE') {
		return 'BLOCKED';
	}
	return null;
};

const buildCalendarGrid = (month: Date) => {
	const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
	const startOffset = firstDay.getDay();
	const startDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() - startOffset);

	return Array.from({ length: 42 }, (_, index) => {
		const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + index);
		return {
			date,
			isCurrentMonth: date.getMonth() === month.getMonth(),
		};
	});
};

const Availability: React.FC = () => {
	const [session, setSession] = useState<{ token: string; user: any } | null>(null);
	const [buses, setBuses] = useState<OwnerBus[]>([]);
	const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
	const [calendarMonth, setCalendarMonth] = useState(() => {
		const today = new Date();
		return new Date(today.getFullYear(), today.getMonth(), 1);
	});
	const [availabilityMap, setAvailabilityMap] = useState<AvailabilityMap>({});
	const [loading, setLoading] = useState(true);
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
				setFeedback({ type: 'error', message: 'Live availability sync unavailable. Editing demo data instead.' });
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
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as AvailabilityMap;
				setAvailabilityMap(parsed);
			}
		} catch (error) {
			console.error('Failed to read saved availability', error);
		}
	}, []);

	const selectedBus = useMemo(
		() => buses.find((bus) => bus.id === selectedBusId) ?? null,
		[buses, selectedBusId]
	);

	const selectedBusAvailability = useMemo(() => {
		if (!selectedBusId) {
			return {};
		}
		return availabilityMap[selectedBusId] ?? {};
	}, [availabilityMap, selectedBusId]);

	const calendarDays = useMemo(() => buildCalendarGrid(calendarMonth), [calendarMonth]);

	const monthLabel = useMemo(
		() => calendarMonth.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
		[calendarMonth]
	);

	const todayKey = formatDateKey(new Date());

	const persistAvailability = (next: AvailabilityMap) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	};

	const handleDayToggle = (dateKey: string) => {
		if (!selectedBusId) {
			return;
		}
		setAvailabilityMap((prev) => {
			const currentBusMap = { ...(prev[selectedBusId] ?? {}) };
			const nextStatus = cycleStatus(currentBusMap[dateKey]);
			if (nextStatus) {
				currentBusMap[dateKey] = nextStatus;
			} else {
				delete currentBusMap[dateKey];
			}
			const nextState: AvailabilityMap = { ...prev, [selectedBusId]: currentBusMap };
			persistAvailability(nextState);
			const displayDate = new Date(dateKey);
			const readable = displayDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
			setFeedback({
				type: 'success',
				message: nextStatus
					? `Marked ${readable} as ${nextStatus === 'AVAILABLE' ? 'Available' : 'Blocked'}.`
					: `Cleared availability lock for ${readable}.`,
			});
			return nextState;
		});
	};

	const changeMonth = (delta: number) => {
		setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
	};

	const availabilitySummary = useMemo(() => {
		const values = Object.values(selectedBusAvailability);
		const available = values.filter((status) => status === 'AVAILABLE').length;
		const blocked = values.filter((status) => status === 'BLOCKED').length;
		return { available, blocked };
	}, [selectedBusAvailability]);

	if (loading) {
		return (
			<div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-sm text-slate-500 font-semibold">
				Loading your fleet calendar…
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Availability Planner</h1>
					<p className="text-slate-500 text-sm">
						Tap the calendar to mark when each bus is free or blocked. Drivers and admins see the same schedule instantly.
					</p>
				</div>
				<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl">
					<CalendarDays size={14} className="text-indigo-500" /> Calendar Based Updates
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
								<p className="text-xs font-semibold text-slate-500">Add a bus to start planning availability.</p>
							)}
						</div>
					</div>
					<div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
						<p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Legend</p>
						<div className="space-y-2 text-sm text-slate-600">
							<div className="flex items-center gap-3">
								<span className="w-3 h-3 rounded-full bg-emerald-500"></span>
								<span>Available for new trips</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="w-3 h-3 rounded-full bg-amber-500"></span>
								<span>Blocked (maintenance or already booked)</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="w-3 h-3 rounded-full border border-slate-300"></span>
								<span>Clear to follow default admin schedule</span>
							</div>
						</div>
						<div className="mt-6 rounded-xl bg-indigo-50 border border-indigo-100 p-4 text-xs text-indigo-700 leading-relaxed">
							<p className="font-semibold mb-1">Auto-sync policy</p>
							<p>
								Updates save to your device instantly and sync with admin once connectivity resumes.
							</p>
						</div>
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
									<Clock size={16} className="text-indigo-500" />
									<span>{availabilitySummary.available} available · {availabilitySummary.blocked} blocked</span>
								</div>
							</header>

							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
									<CheckCircle2 size={16} className="text-emerald-500" /> Tap once for Available, twice for Blocked, thrice to clear.
								</div>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => changeMonth(-1)}
										className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600"
									>
										<ChevronLeft size={18} />
									</button>
									<div className="text-sm font-bold text-slate-700 px-3 py-1 rounded-full bg-slate-100">
										{monthLabel}
									</div>
									<button
										type="button"
										onClick={() => changeMonth(1)}
										className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600"
									>
										<ChevronRight size={18} />
									</button>
								</div>
							</div>

							<div className="grid grid-cols-7 gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
								{DAYS_OF_WEEK.map((label) => (
									<div key={label} className="text-center py-2">
										{label}
									</div>
								))}
							</div>

							<div className="grid grid-cols-7 gap-2">
								{calendarDays.map(({ date, isCurrentMonth }) => {
									const key = formatDateKey(date);
									const status = selectedBusAvailability[key];
									const isToday = key === todayKey;
									const baseClasses = 'aspect-square rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center transition-all';
									let stateClasses = 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50';
									if (!isCurrentMonth) {
										stateClasses = 'bg-slate-50 border-slate-100 text-slate-300 hover:bg-slate-100';
									}
									if (status === 'AVAILABLE') {
										stateClasses = 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100';
									}
									if (status === 'BLOCKED') {
										stateClasses = 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100';
									}
									return (
										<button
											key={key}
											type="button"
											onClick={() => handleDayToggle(key)}
											className={`${baseClasses} ${stateClasses} ${isToday ? 'shadow-inner' : ''}`}
										>
											<span className="text-base font-black">{date.getDate()}</span>
											{status === 'AVAILABLE' && (
												<span className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
													<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
													Open
												</span>
											)}
											{status === 'BLOCKED' && (
												<span className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
													<span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
													Hold
												</span>
											)}
										</button>
									);
								})}
							</div>

							<div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
								<p className="font-semibold text-slate-700 mb-1">Need to share longer maintenance blocks?</p>
								<p>
									Use the Support tab to alert admin for multi-day repairs so bookings stay paused automatically.
								</p>
							</div>
						</div>
					) : (
						<div className="bg-white border border-slate-100 rounded-2xl p-10 text-center text-sm text-slate-500 shadow-sm">
							Select a bus to edit availability.
						</div>
					)}

					{offline && (
						<div className="bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold rounded-2xl p-4">
							<span className="flex items-center gap-2">
								<XCircle size={14} /> Offline mode – syncing disabled until backend reconnects.
							</span>
						</div>
					)}
				</section>
			</div>
		</div>
	);
};

export default Availability;

