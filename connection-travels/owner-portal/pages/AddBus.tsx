
import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  MapPin, 
  Users, 
  CreditCard, 
  Info,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { generateBusDescription } from '../services/geminiService';

const AddBus: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    regNumber: '',
    capacity: '',
    type: 'Normal',
    price: '',
    city: '',
    description: '',
    features: [] as string[]
  });

  const featuresList = ['DJ System', 'LED Lights', 'AC', 'Sleeper', 'Sound System', 'TV', 'USB Charging'];

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleAIWrite = async () => {
    if (!formData.name || !formData.type) {
      alert("Please enter bus name and type first!");
      return;
    }
    setIsGenerating(true);
    const result = await generateBusDescription({
      name: formData.name,
      type: formData.type,
      features: formData.features
    });
    setFormData(prev => ({ ...prev, description: result || '' }));
    setIsGenerating(false);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Bus submitted for approval!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Add New Bus</h1>
        <p className="text-slate-500">Submit your bus details for admin approval</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'
            }`}
          >
            {step > s ? <Check size={20} /> : s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Bus Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  placeholder="e.g. Royal Express 01" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Registration Number</label>
                <input 
                  type="text" 
                  value={formData.regNumber}
                  onChange={(e) => setFormData({...formData, regNumber: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  placeholder="e.g. KA 01 AB 1234" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Seating Capacity</label>
                <input 
                  type="number" 
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  placeholder="e.g. 45" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Bus Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none bg-white"
                >
                  <option>Normal</option>
                  <option>Luxury</option>
                  <option>DJ</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Features & Pricing</h2>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Select Available Features</label>
              <div className="flex flex-wrap gap-2">
                {featuresList.map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.features.includes(feature)
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Base Price (Per Day)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold z-10">₹</span>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-8 pr-4 py-4 rounded-xl bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 text-white font-bold transition-all placeholder:text-slate-600" 
                    placeholder="15000" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Operating City</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-4 rounded-xl bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 text-white font-bold transition-all placeholder:text-slate-600 uppercase" 
                  placeholder="e.g. COIMBATORE" 
                />
              </div>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Marketing Description</label>
                <button 
                  type="button"
                  onClick={handleAIWrite}
                  disabled={isGenerating}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  AI Auto-Write
                </button>
              </div>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-4 rounded-xl bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 text-white font-medium transition-all resize-none placeholder:text-slate-600"
                placeholder="Describe your bus highlights..."
              ></textarea>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Media & Uploads</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Bus Photos (Min 3)</p>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Click to upload images</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB each</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Bus Video (Optional)</p>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Upload a virtual tour</p>
                  <p className="text-xs text-slate-400 mt-1">MP4, MOV up to 50MB</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
              <div className="text-indigo-600 shrink-0 mt-0.5">
                <Info size={18} />
              </div>
              <p className="text-sm text-indigo-900 leading-relaxed">
                By submitting, you agree that your bus will be visible to users only after admin verification. 
                Approval usually takes 12-24 hours.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={prevStep}
              className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-all"
            >
              <ChevronLeft size={20} /> Back
            </button>
          ) : <div></div>}

          {step < 3 ? (
            <button 
              type="button" 
              onClick={nextStep}
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
            >
              Continue <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              type="submit"
              className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
            >
              Submit for Approval
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddBus;
