
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { total, advance, busName } = (location.state as any) || { total: 0, advance: 0, busName: 'Boutique Bus' };
  
  const [step, setStep] = useState<'pay' | 'success'>('pay');

  const handlePayment = () => {
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Reservation Locked!</h1>
        <p className="text-lg text-slate-500 mb-10">Your boutique experience with <span className="font-bold text-slate-900">{busName}</span> is guaranteed. Booking ID: <span className="font-mono bg-slate-100 px-2">CX-774921</span></p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/bookings')}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg"
          >
            My Bookings
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-white border text-slate-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-black text-slate-900">Secure Advance</h1>
        <p className="text-slate-500">Locking inventory for {busName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-4 p-5 border-2 border-blue-600 bg-blue-50 rounded-2xl cursor-pointer">
              <input type="radio" name="pay" defaultChecked className="w-5 h-5 accent-blue-600" />
              <div className="flex-1">
                <p className="font-bold">UPI (GPay, PhonePe, Paytm)</p>
                <p className="text-xs text-slate-500">Instant verification</p>
              </div>
              <div className="flex gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4" />
              </div>
            </label>
            <label className="flex items-center gap-4 p-5 border-2 border-slate-100 hover:border-blue-200 transition rounded-2xl cursor-pointer">
              <input type="radio" name="pay" className="w-5 h-5 accent-blue-600" />
              <div className="flex-1">
                <p className="font-bold">Credit / Debit Card</p>
                <p className="text-xs text-slate-500">Global cards accepted</p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <div className="bg-white border p-8 rounded-3xl shadow-sm">
            <h3 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Payment Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xl font-black text-slate-900">
                <span>Advance Amount</span>
                <span>₹{advance.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-500">Includes all taxes and transaction fees.</p>
            </div>

            <button 
              onClick={handlePayment}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-lg shadow-lg hover:bg-blue-700 transition transform active:scale-95"
            >
              Confirm ₹{advance.toLocaleString()}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              Encrypted SSL Transaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
