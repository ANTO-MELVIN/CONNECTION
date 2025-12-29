
import React from 'react';
import { ICONS } from '../constants';

const Profile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="h-40 gradient-bg"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-3xl p-2 shadow-xl">
              <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <ICONS.User />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-black text-slate-900">John Doe</h1>
              <p className="text-slate-500">Premium Member since Oct 2024</p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">Edit Profile</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2">Contact Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Email Address</p>
                  <p className="font-semibold">john.doe@example.com</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Phone Number</p>
                  <p className="font-semibold">+91 98765 43210</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border text-center">
                  <p className="text-2xl font-black text-blue-600">12</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Bookings</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border text-center">
                  <p className="text-2xl font-black text-blue-600">4</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
