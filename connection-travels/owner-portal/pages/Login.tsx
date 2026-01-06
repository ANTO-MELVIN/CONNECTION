
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Smartphone, Mail, Building2, User, MapPin, Loader2, ArrowRight, CheckCircle2, Star, ShieldCheck, HeartHandshake, Lock } from 'lucide-react';
import { ensureOwnerSession } from '../services/session';
import { registerOwner } from '../services/api';

const Login: React.FC<{ setIsLoggedIn: (val: boolean) => void }> = ({ setIsLoggedIn }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [regData, setRegData] = useState({
    name: '',
    mobile: '',
    companyName: '',
    city: ''
  });

  const [loginEmail, setLoginEmail] = useState('owner@connectiontravels.com');
  const [loginPassword, setLoginPassword] = useState('Owner@123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        const trimmedName = regData.name.trim();
        const [firstName, ...rest] = trimmedName.split(/\s+/);
        const payload = {
          email: loginEmail,
          password: loginPassword,
          firstName: firstName || 'Owner',
          lastName: rest.join(' ') || 'Partner',
          phone: regData.mobile,
          companyName: regData.companyName,
          address: regData.city,
        };

        try {
          await registerOwner(payload);
        } catch (registerError) {
          if (
            registerError instanceof Error &&
            /Failed to fetch|NetworkError|Unable to connect/i.test(registerError.message)
          ) {
            console.warn('Owner registration fell back to offline mode');
          } else {
            throw registerError;
          }
        }
      }

      const session = await ensureOwnerSession({
        email: loginEmail,
        password: loginPassword,
        mobile: regData.mobile,
        name: regData.name,
        companyName: regData.companyName,
        city: regData.city,
      });
      localStorage.setItem('isLoggedIn', 'true');
      if (session.user.ownerProfile) {
        localStorage.setItem('ownerProfile', JSON.stringify(session.user.ownerProfile));
      }
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error('Owner login failed', error);
      const message = error instanceof Error ? error.message : 'Unable to connect to backend.';
      alert(message || 'Unable to connect to backend. Please ensure the API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 overflow-x-hidden">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row transition-all duration-500 border border-slate-100">
        
        {/* Left Side: Branding Card */}
        <div className="md:w-[42%] bg-indigo-600 p-10 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 font-black text-2xl mb-12 group cursor-default">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg transition-transform group-hover:rotate-12 duration-300">
                <Bus size={26} />
              </div>
              <span className="tracking-tighter text-3xl">CONNECTIONS</span>
            </div>
            
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.15]">
                {isRegistering ? "Your Fleet, Our Platform." : "Empowering Fleet Owners."}
              </h1>
              <p className="text-indigo-100 leading-relaxed text-sm md:text-lg opacity-85 font-medium max-w-xs">
                {isRegistering 
                  ? "Transform your travel agency into a digital powerhouse with real-time management and premium bookings."
                  : "Access India's most advanced fleet owner dashboard. Manage, track, and grow your travel empire."}
              </p>
            </div>
          </div>
          
          <div className="relative z-10 mt-16 md:mt-0 space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-indigo-400/30 flex items-center justify-center shrink-0">
                <HeartHandshake size={22} />
              </div>
              <div>
                <p className="font-bold text-sm">Direct Partnership</p>
                <p className="text-[10px] text-indigo-200">Zero middlemen, higher margins.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="text-indigo-300 mb-1"><ShieldCheck size={20} /></div>
                <p className="text-[10px] font-bold uppercase tracking-wider">Secure Tech</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="text-indigo-300 mb-1"><Star size={20} /></div>
                <p className="text-[10px] font-bold uppercase tracking-wider">Premium Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-[58%] p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">
              {isRegistering ? 'Owner Registration' : 'Partner Login'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isRegistering ? 'Submit your agency details for verification' : 'Welcome back, enter your email and password to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Owner Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={18} />
                      <input 
                        required 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-300" 
                        placeholder="e.g. Rahul Sharma"
                        value={regData.name}
                        onChange={e => setRegData({...regData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Number</label>
                    <div className="relative group">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={18} />
                      <input 
                        required 
                        type="tel" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-300" 
                        placeholder="+91 00000 00000"
                        value={regData.mobile}
                        onChange={e => setRegData({...regData, mobile: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Registered Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={18} />
                      <input 
                        required 
                        type="email"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-300" 
                        placeholder="owner@connectiontravels.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Create Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={18} />
                      <input 
                        required 
                        type="password"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-300" 
                        placeholder="Strong password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Agency / Travels Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={18} />
                    <input 
                      required 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm font-bold text-slate-700 uppercase placeholder:text-slate-300" 
                      placeholder="e.g. SRS TRAVELS"
                      value={regData.companyName}
                      onChange={e => setRegData({...regData, companyName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Primary Operating City</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={18} />
                    <input 
                      required 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm font-bold text-slate-700 uppercase placeholder:text-slate-300" 
                      placeholder="e.g. COIMBATORE"
                      value={regData.city}
                      onChange={e => setRegData({...regData, city: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 flex gap-3">
                  <ShieldCheck className="text-indigo-600 shrink-0" size={18} />
                  <p className="text-[10px] text-indigo-700 leading-relaxed font-semibold">
                    Account status will be <b>Pending Verification</b> until documents are verified by the admin team.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Registered Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={18} />
                    <input
                      required
                      type="email"
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-base font-semibold text-slate-800"
                      placeholder="owner@connectiontravels.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Account Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" size={18} />
                    <input
                      required
                      type="password"
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-base font-semibold text-slate-800"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Secured credential login</p>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="group w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(79,70,229,0.25)] disabled:opacity-70 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> 
                  <span className="tracking-[0.2em] uppercase text-xs font-black">Connecting...</span>
                </>
              ) : (
                <>
                  <span className="tracking-[0.2em] uppercase text-xs font-black">
                    {isRegistering ? 'Join the Network' : 'Continue to Portal'}
                  </span>
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1.5 duration-300" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm font-semibold text-slate-400">
              {isRegistering ? 'Already a registered partner?' : 'Want to expand your business?'}
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-2 font-black text-indigo-600 hover:text-indigo-800 transition-colors border-b-2 border-indigo-100 hover:border-indigo-600"
              >
                {isRegistering ? 'Sign in' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Support Text */}
      <div className="mt-12 mb-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">
            Partner Support: 1800-FLEET-HELP
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
