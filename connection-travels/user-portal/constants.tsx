
import { Bus, BusFeature } from './types';

export const MOCK_BUSES: Bus[] = [
  {
    id: '1',
    name: 'Neon Party Express',
    image: 'https://picsum.photos/seed/bus1/800/600',
    gallery: [
      'https://picsum.photos/seed/bus1g1/800/600',
      'https://picsum.photos/seed/bus1g2/800/600',
      'https://picsum.photos/seed/bus1g3/800/600'
    ],
    capacity: 45,
    features: [BusFeature.DJ_BUS, BusFeature.LED_LIGHTS, BusFeature.AC, BusFeature.SEATER, BusFeature.LUXURY],
    pricePerDay: 85000,
    rating: 4.8,
    verified: true,
    ownerContact: '98765-43210',
    year: 2023,
    condition: 'Excellent',
    description: 'The ultimate mobile party destination. Equipped with a professional DJ deck and full laser light show.'
  },
  {
    id: '2',
    name: 'Executive Sleeper XL',
    image: 'https://picsum.photos/seed/bus2/800/600',
    gallery: [
      'https://picsum.photos/seed/bus2g1/800/600',
      'https://picsum.photos/seed/bus2g2/800/600'
    ],
    capacity: 32,
    features: [BusFeature.SLEEPER, BusFeature.AC, BusFeature.LUXURY, BusFeature.WIFI, BusFeature.CHARGING],
    pricePerDay: 72000,
    rating: 4.9,
    verified: true,
    ownerContact: '99999-11111',
    year: 2022,
    condition: 'Excellent',
    description: 'Premium long-distance comfort with full-size berths and high-speed internet connectivity.'
  },
  {
    id: '3',
    name: 'Urban Glide 3000',
    image: 'https://picsum.photos/seed/bus3/800/600',
    gallery: [],
    capacity: 50,
    features: [BusFeature.SEATER, BusFeature.AC, BusFeature.NORMAL, BusFeature.CHARGING],
    pricePerDay: 45000,
    rating: 4.2,
    verified: true,
    ownerContact: '88888-22222',
    year: 2021,
    condition: 'Good',
    description: 'Reliable and spacious transport for corporate events and large group commutes.'
  },
  {
    id: '4',
    name: 'Midnight Disco Rider',
    image: 'https://picsum.photos/seed/bus4/800/600',
    gallery: [],
    capacity: 40,
    features: [BusFeature.DJ_BUS, BusFeature.LED_LIGHTS, BusFeature.LUXURY],
    pricePerDay: 92000,
    rating: 4.7,
    verified: true,
    ownerContact: '77777-33333',
    year: 2024,
    condition: 'Excellent',
    description: 'A nightclub on wheels. Perfect for weddings and high-energy celebrations.'
  }
];

export const ICONS = {
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Star: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  Verified: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>,
};
