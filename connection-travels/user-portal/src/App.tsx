
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import Home from '../pages/Home';
import SearchResults from '../pages/SearchResults';
import BusDetails from '../pages/BusDetails';
import Booking from '../pages/Booking';
import Payment from '../pages/Payment';
import MyBookings from '../pages/MyBookings';
import Profile from '../pages/Profile';
import Support from '../pages/Support';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 glass shadow-sm px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
      <Link to="/" className="text-xl md:text-2xl font-bold text-blue-900 tracking-tight flex items-center gap-2">
        <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg">C</div>
        CONNECTIONS
      </Link>
      
      <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
        <Link to="/search" className="hover:text-blue-600 transition">Discover</Link>
        <Link to="/bookings" className="hover:text-blue-600 transition">My Bookings</Link>
        <Link to="/support" className="hover:text-blue-600 transition">Support</Link>
        <Link to="/profile" className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition">
          <ICONS.User />
          <span>Account</span>
        </Link>
      </div>

      <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t p-6 flex flex-col gap-6 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <Link to="/search" className="text-lg font-semibold text-slate-900" onClick={() => setIsMenuOpen(false)}>Discover</Link>
          <Link to="/bookings" className="text-lg font-semibold text-slate-900" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
          <Link to="/support" className="text-lg font-semibold text-slate-900" onClick={() => setIsMenuOpen(false)}>Support</Link>
          <hr className="border-slate-100" />
          <Link to="/profile" className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-white p-2 rounded-full shadow-sm"><ICONS.User /></div>
            <span className="font-bold text-slate-900">My Account</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-16 px-6 md:px-8 mt-20">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 text-left">
      <div className="col-span-2 md:col-span-1">
        <h3 className="text-xl font-bold text-white mb-6">CONNECTIONS</h3>
        <p className="text-sm leading-relaxed max-w-xs opacity-70">Premium boutique bus services with state-of-the-art lighting and sound system. From corporate events to neon parties, we've got you covered.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-6 uppercase text-[10px] tracking-[0.2em] opacity-50">Explore</h4>
        <ul className="space-y-4 text-sm font-medium">
          <li><Link to="/" className="hover:text-white transition">Home</Link></li>
          <li><Link to="/search" className="hover:text-white transition">Search Buses</Link></li>
          <li><Link to="/support" className="hover:text-white transition">FAQs</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-6 uppercase text-[10px] tracking-[0.2em] opacity-50">Support</h4>
        <ul className="space-y-4 text-sm font-medium">
          <li><Link to="/support" className="hover:text-white transition">Help Center</Link></li>
          <li><Link to="/support" className="hover:text-white transition">Terms of Service</Link></li>
          <li><Link to="/support" className="hover:text-white transition">Privacy Policy</Link></li>
        </ul>
      </div>
      <div className="col-span-2 md:col-span-1">
        <h4 className="text-white font-semibold mb-6 uppercase text-[10px] tracking-[0.2em] opacity-50">Newsletter</h4>
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
            <input type="email" placeholder="Your email address" className="bg-slate-800 border-none rounded-xl px-4 py-4 text-sm w-full focus:ring-2 focus:ring-blue-500 placeholder-slate-600" />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg shadow-blue-500/10">Subscribe</button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-slate-800 mt-16 pt-10 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] text-center">
      &copy; {new Date().getFullYear()} CONNECTIONS BOUTIQUE. All rights reserved.
    </div>
  </footer>
);

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/bus/:id" element={<BusDetails />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
