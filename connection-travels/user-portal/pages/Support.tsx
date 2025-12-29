
import React, { useState } from 'react';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'ticket'>('faq');

  const faqs = [
    { q: "How do I confirm my booking?", a: "You can confirm your booking by paying a 20% advance of the total fare. Once paid, your booking ID is generated and the bus is reserved." },
    { q: "What is the cancellation policy?", a: "Full refund if cancelled 48 hours before the trip. 50% refund of advance if cancelled between 24-48 hours. No refund if cancelled less than 24 hours before." },
    { q: "Are the drivers verified?", a: "Yes, all drivers associated with CONNECTIONS go through a background check and driving test verification." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Help Center</h1>
        <p className="text-slate-500 text-sm md:text-base">Find answers or get in touch with our team.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
        <button 
          onClick={() => setActiveTab('faq')}
          className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition shadow-sm ${activeTab === 'faq' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
        >
          Common FAQs
        </button>
        <button 
          onClick={() => setActiveTab('ticket')}
          className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition shadow-sm ${activeTab === 'ticket' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
        >
          Raise a Ticket
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm mb-16">
        {activeTab === 'faq' ? (
          <div className="space-y-10">
            {faqs.map((faq, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-lg md:text-xl font-bold text-slate-900">{faq.q}</h4>
                <p className="text-slate-500 leading-relaxed text-sm md:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        ) : (
          <form className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Type</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option>Booking Issue</option>
                <option>Payment Issue</option>
                <option>Refund Status</option>
                <option>Owner Complaint</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 h-48 font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Please provide details about your issue..."></textarea>
            </div>
            <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition shadow-lg uppercase tracking-widest text-xs">Submit Ticket</button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Emergency Contact</h4>
            <p className="text-blue-700 font-black text-xl">+91 1800-CONNECTIONS</p>
          </div>
        </div>
        <div className="p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white shrink-0">
             <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <div>
            <h4 className="font-bold mb-1">Live Chat Support</h4>
            <p className="text-slate-400 text-sm">Average response time: 2 mins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
