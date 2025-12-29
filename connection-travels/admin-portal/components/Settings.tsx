
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Shield, Database, Globe, Sliders, ArrowLeft } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('General');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Platform Settings</h2>
          <p className="text-slate-500">Global configurations and system maintenance.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
              {/* Settings Nav */}
              <div className="md:col-span-1 bg-slate-50 border-r border-slate-100 p-4 space-y-1">
                  <SettingTab icon={Sliders} label="General" active={activeTab === 'General'} onClick={() => setActiveTab('General')} />
                  <SettingTab icon={Bell} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
                  <SettingTab icon={Shield} label="Security" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
                  <SettingTab icon={Database} label="System Log" active={activeTab === 'System Log'} onClick={() => setActiveTab('System Log')} />
                  <SettingTab icon={Globe} label="Localization" active={activeTab === 'Localization'} onClick={() => setActiveTab('Localization')} />
              </div>

              {/* Settings Content */}
              <div className="md:col-span-3 p-8 md:p-12 space-y-8">
                  <section className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-800 border-b pb-4">{activeTab} Configuration</h3>
                      
                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="font-bold text-slate-700 text-sm">Platform Mode</p>
                                  <p className="text-xs text-slate-400">Current system environment status.</p>
                              </div>
                              <select className="bg-slate-100 border-none px-4 py-2 rounded-lg text-xs font-bold text-indigo-600 outline-none">
                                  <option>Production (Live)</option>
                                  <option>Maintenance Mode</option>
                                  <option>Staging</option>
                              </select>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <div>
                                  <p className="font-bold text-slate-700 text-sm">Auto-Approval for VIPs</p>
                                  <p className="text-xs text-slate-400">Trust-based bypass for verified high-tier owners.</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                              </label>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <div>
                                  <p className="font-bold text-slate-700 text-sm">Cache Cleanup</p>
                                  <p className="text-xs text-slate-400">Last performed: 2 hours ago.</p>
                              </div>
                              <button className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">Run Clean</button>
                          </div>
                      </div>
                  </section>

                  <section className="pt-8 border-t space-y-6">
                      <h3 className="text-lg font-bold text-slate-800">Support & Contact</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 border rounded-2xl">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Support Email</p>
                              <p className="text-sm font-semibold">help@busflow.com</p>
                          </div>
                          <div className="p-4 border rounded-2xl">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Escalation Mobile</p>
                              <p className="text-sm font-semibold">+91 999 000 1122</p>
                          </div>
                      </div>
                  </section>

                  <div className="pt-8 flex justify-end gap-3">
                      <button className="px-6 py-2.5 font-bold text-slate-400 hover:text-slate-600">Reset</button>
                      <button className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">Save Changes</button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const SettingTab = ({ icon: Icon, label, active = false, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
    >
        <Icon size={18} />
        {label}
    </button>
);

export default Settings;
