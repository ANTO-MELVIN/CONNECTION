import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  Trash2,
  Check,
  X,
  Info,
  AlertCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import type { AdminPendingBus } from '../src/types';
import { fetchPendingBuses, approveBus, rejectBus } from '../src/services/api';
import { ensureAdminSession } from '../src/services/session';

interface RejectDialogState {
  id: string;
  note: string;
}

const fallbackImage = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';

const BusApprovalCenter: React.FC = () => {
  const navigate = useNavigate();
  const [pendingBuses, setPendingBuses] = useState<AdminPendingBus[]>([]);
  const [approvedBuses, setApprovedBuses] = useState<AdminPendingBus[]>([]);
  const [selectedBus, setSelectedBus] = useState<AdminPendingBus | null>(null);
  const [verificationBusId, setVerificationBusId] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<RejectDialogState | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const session = await ensureAdminSession();
        if (!active) return;
        setSessionToken(session.token);
        const data = await fetchPendingBuses(session.token);
        if (!active) return;
        setPendingBuses(data);
        setError(null);
      } catch (err) {
        if (active) {
          console.error('Failed to load pending buses', err);
          setError('Unable to load pending buses. Please retry.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const ownerLabel = useMemo(
    () =>
      (bus: AdminPendingBus) => {
        const first = bus.owner.user?.firstName?.trim() ?? '';
        const last = bus.owner.user?.lastName?.trim() ?? '';
        const combined = `${first} ${last}`.trim();
        return combined || bus.owner.companyName || 'Unassigned Owner';
      },
    []
  );

  const resolveMediaSource = (media?: { mimeType?: string | null; data?: string | null; url?: string | null; kind?: 'IMAGE' | 'VIDEO' }) => {
    if (!media) {
      return null;
    }
    const fallbackMime = media.kind === 'VIDEO' ? 'video/mp4' : 'image/jpeg';
    const mime = media.mimeType || fallbackMime;
    if (media.data) {
      return `data:${mime};base64,${media.data}`;
    }
    if (media.url) {
      return media.url;
    }
    return null;
  };

  const imageForBus = (bus: AdminPendingBus) => {
    const candidates = bus.media ?? [];
    const primary = candidates.find((item) => item.kind === 'IMAGE' && (item.data || item.url)) || candidates[0];
    const resolved = resolveMediaSource(primary);
    return resolved || bus.imageUrl || fallbackImage;
  };

  const dismissDetail = () => setSelectedBus(null);

  const handleApprove = (busId: string) => {
    setVerificationBusId(busId);
  };

  const confirmApprove = async () => {
    if (!sessionToken || !verificationBusId) {
      return;
    }

    try {
      setActionBusy(true);
      const updated = await approveBus(verificationBusId, sessionToken);
      setPendingBuses((prev) => prev.filter((item) => item.id !== updated.id));
      setApprovedBuses((prev) => [updated, ...prev]);
      setVerificationBusId(null);
      setError(null);
    } catch (err) {
      console.error('Failed to approve bus submission', err);
      setError('Approval failed. Please try again.');
    } finally {
      setActionBusy(false);
    }
  };

  const handleReject = (busId: string) => {
    setRejectDialog({ id: busId, note: '' });
  };

  const confirmReject = async () => {
    if (!sessionToken || !rejectDialog) {
      return;
    }

    try {
      setActionBusy(true);
      await rejectBus(rejectDialog.id, sessionToken, rejectDialog.note || undefined);
      setPendingBuses((prev) => prev.filter((item) => item.id !== rejectDialog.id));
      if (selectedBus?.id === rejectDialog.id) {
        dismissDetail();
      }
      setRejectDialog(null);
      setError(null);
    } catch (err) {
      console.error('Failed to reject bus submission', err);
      setError('Rejection failed. Please try again.');
    } finally {
      setActionBusy(false);
    }
  };

  const pendingCount = pendingBuses.length;

  return (
    <div className="space-y-12">
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div
          className={`fixed inset-y-0 right-0 w-full sm:w-[420px] lg:w-[520px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 ${
            selectedBus ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
        </div>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Info size={18} className="text-amber-500" /> Pending Review ({pendingCount})
        </h3>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Loading submissions</p>
          </div>
        ) : pendingCount === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
            <p className="text-slate-400 font-medium italic">No pending submissions right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingBuses.map((bus) => {
              const ownerName = ownerLabel(bus);
              return (
                <div
                  key={bus.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row"
                >
                  <div className="md:w-72 shrink-0 relative">
                    <img src={imageForBus(bus)} alt={bus.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{bus.title}</h3>
                        <p className="text-sm text-slate-500">Owner: {ownerName}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">Reg: {bus.registrationNo}</p>
                      </div>
                      <div className="text-sm text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full self-start">
                        Capacity: {bus.capacity}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {bus.amenities.length ? (
                        bus.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded">
                          No amenities recorded
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-3">
                      {bus.description || 'No description provided by the owner.'}
                    </p>

                    <div className="flex gap-3 mt-5 pt-5 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedBus(bus)}
                        className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                      >
                        <Eye size={16} className="inline mr-2" /> View Details
                      </button>
                      <button
                        onClick={() => handleReject(bus.id)}
                        className="px-6 bg-rose-50 text-rose-600 font-bold py-2 rounded-lg hover:bg-rose-100 transition-colors text-sm"
                        disabled={actionBusy}
                      >
                        <Trash2 size={16} className="inline mr-2" /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(bus.id)}
                        className="px-8 bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm shadow-md disabled:opacity-60"
                        disabled={actionBusy}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-6 pt-12 border-t border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Check size={18} className="text-emerald-500" /> Recently Approved Fleet
        </h3>
        {approvedBuses.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Approved buses will appear here after verification.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedBuses.map((bus) => (
              <div
                key={bus.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4"
              >
                <img src={imageForBus(bus)} className="w-16 h-16 rounded-lg object-cover" alt={bus.title} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{bus.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{ownerLabel(bus)}</p>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase mt-2 inline-block">
                    Approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Detail Slide-Over */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[420px] lg:w-[520px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 ${
          selectedBus ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedBus && (
          <div className="h-full flex flex-col">
            <header className="p-5 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedBus.title}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Reg: {selectedBus.registrationNo}</p>
              </div>
              <button
                onClick={dismissDetail}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              <div className="h-48 sm:h-56 bg-slate-100">
                <img
                  src={imageForBus(selectedBus)}
                  alt={selectedBus.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-6">
                <section className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Owner</h4>
                  <p className="text-base font-semibold text-slate-800">{ownerLabel(selectedBus)}</p>
                  <p className="text-sm text-slate-500">
                    {selectedBus.owner.user?.email || 'Email not provided'}
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedBus.description || 'Owner did not share additional details for this bus.'}
                  </p>
                </section>

                {selectedBus.media && selectedBus.media.length > 0 && (
                  <section className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Media</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedBus.media.map((item) => {
                        const source = resolveMediaSource(item);
                        if (item.kind === 'VIDEO') {
                          return (
                            <video
                              key={item.id}
                              controls
                              className="w-full rounded-lg border border-slate-200"
                              src={source || undefined}
                            >
                              Your browser does not support the video tag.
                            </video>
                          );
                        }
                        return (
                          <img
                            key={item.id}
                            src={source || fallbackImage}
                            alt={item.fileName || 'Bus media'}
                            className="w-full h-28 object-cover rounded-lg border border-slate-200"
                          />
                        );
                      })}
                    </div>
                  </section>
                )}

                <section className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBus.amenities.length ? (
                      selectedBus.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded">
                        No amenities recorded
                      </span>
                    )}
                  </div>
                </section>

                {selectedBus.approvalNote && (
                  <section className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                    <p className="font-semibold">Previous Feedback</p>
                    <p className="mt-1 leading-relaxed">{selectedBus.approvalNote}</p>
                  </section>
                )}
              </div>
            </div>

            <footer className="p-5 border-t bg-slate-50 flex gap-3">
              <button
                onClick={() => {
                  handleReject(selectedBus.id);
                  dismissDetail();
                }}
                className="flex-1 bg-rose-50 text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-100 transition-colors"
                disabled={actionBusy}
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedBus.id);
                  dismissDetail();
                }}
                className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-60"
                disabled={actionBusy}
              >
                Approve
              </button>
            </footer>
          </div>
        )}
      </div>

      {selectedBus && (
        <div
          onClick={dismissDetail}
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        />
      )}

      {verificationBusId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 text-center mb-2">Final Verification</h4>
            <p className="text-slate-500 text-center text-sm mb-6 leading-relaxed">
              Confirm that registration documents and images have been manually verified.
            </p>
            <div className="space-y-3">
              <button
                onClick={confirmApprove}
                className="w-full py-4 font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={actionBusy}
              >
                <ShieldCheck size={20} /> Verify & Approve
              </button>
              <button
                onClick={() => setVerificationBusId(null)}
                className="w-full py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                disabled={actionBusy}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 text-center mb-2">Reject Submission?</h4>
            <p className="text-slate-500 text-center text-sm mb-6 leading-relaxed">
              Add an optional note that will be shared with the owner so they can address the gaps.
            </p>
            <textarea
              value={rejectDialog.note}
              onChange={(event) => setRejectDialog({ ...rejectDialog, note: event.target.value })}
              className="w-full h-24 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
              placeholder="Reason for rejection (optional)"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRejectDialog(null)}
                className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                disabled={actionBusy}
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 py-3 font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/20 transition-all disabled:opacity-60"
                disabled={actionBusy}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusApprovalCenter;
