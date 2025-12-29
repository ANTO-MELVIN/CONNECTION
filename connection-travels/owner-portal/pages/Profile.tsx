
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Mail, 
  Phone, 
  FileText, 
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { OwnerProfile } from '../types';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ownerProfile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile & Verification</h1>
        <p className="text-slate-500">Manage your identity and business documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-black uppercase">
                {profile?.name?.charAt(0) || 'S'}
              </div>
              <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white ${profile?.isVerified ? 'bg-green-500' : 'bg-amber-500'}`}>
                {profile?.isVerified ? <ShieldCheck size={16} /> : <Clock size={16} />}
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{profile?.companyName || 'SRS Travels'}</h3>
            <p className="text-sm text-slate-500">Operating in {profile?.city || 'Bangalore'}</p>
            
            <div className="w-full mt-6 space-y-3 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <User size={16} className="text-slate-400" /> {profile?.name || 'Santosh R. Sharma'}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" /> {profile?.mobile || '+91 98765 43210'}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" /> {profile?.email || 'contact@srstravels.com'}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400" /> {profile?.city || 'Bangalore'}, India
              </div>
            </div>
            
            <button className="w-full mt-8 py-3 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
              Edit Public Profile
            </button>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
            <div className="flex gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Verification Required</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Please upload your <b>GST Certificate</b> and <b>Bus RC</b> to activate your profile for public listings.
                </p>
                <button className="mt-3 text-xs font-black text-amber-900 underline decoration-2 underline-offset-4 uppercase tracking-wider">
                  Upload Documents
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Compliance Documents</h2>
            <p className="text-xs text-slate-400 mt-1">Verified documents allow you to list more buses and receive faster payouts</p>
          </div>
          
          <div className="p-6 space-y-6">
            {[
              { label: 'Aadhar Card / PAN', status: profile?.isVerified ? 'Verified' : 'Pending', date: profile?.isVerified ? 'Jan 20, 2024' : 'Just now', icon: <User size={20} /> },
              { label: 'Business Registration (GST)', status: 'Not Uploaded', date: '-', icon: <Building2 size={20} /> },
              { label: 'Insurance Policy', status: 'Not Uploaded', date: '-', icon: <ShieldCheck size={20} /> },
              { label: 'Bus RC Documents', status: 'Not Uploaded', date: '-', icon: <FileText size={20} /> },
            ].map((doc) => (
              <div key={doc.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400">
                    {doc.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{doc.label}</h4>
                    <p className="text-xs text-slate-400">Uploaded on: {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {doc.status === 'Verified' ? (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 size={12} /> {doc.status}
                    </span>
                  ) : doc.status === 'Not Uploaded' ? (
                    <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100">
                      <Upload size={12} /> Upload
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
                      <Clock size={12} className="w-3 h-3" /> {doc.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider text-[10px]">Bank Details for Payouts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Account Holder</p>
                <p className="text-sm font-semibold text-slate-700">{profile?.name || 'SANTOSH SHARMA'}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Status</p>
                <p className="text-sm font-semibold text-amber-600">Verification Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
