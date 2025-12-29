
import { Bus, BusStatus, Booking, BookingStatus } from './types';

export const MOCK_BUSES: Bus[] = [
  {
    id: 'BUS001',
    name: 'Royal Voyager',
    regNumber: 'KA 01 AB 1234',
    capacity: 45,
    type: 'Luxury',
    basePrice: 15000,
    city: 'Bangalore',
    routes: ['Bangalore - Coorg', 'Bangalore - Mysore'],
    features: ['AC', 'LED lights', 'Sound system', 'Sleeper'],
    status: BusStatus.APPROVED,
    imageUrl: 'https://picsum.photos/seed/bus1/400/250'
  },
  {
    id: 'BUS002',
    name: 'Neon Party King',
    regNumber: 'KA 01 CD 5678',
    capacity: 35,
    type: 'DJ',
    basePrice: 18000,
    city: 'Bangalore',
    routes: ['City Tour', 'Night Out'],
    features: ['DJ system', 'LED lights', 'Sound system'],
    status: BusStatus.PENDING,
    imageUrl: 'https://picsum.photos/seed/bus2/400/250'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK1001',
    busId: 'BUS001',
    customerName: 'Rahul Sharma',
    pickup: 'Majestic, Bangalore',
    drop: 'Madikeri, Coorg',
    dates: ['2024-05-20', '2024-05-22'],
    status: BookingStatus.UPCOMING,
    totalAmount: 30000,
    advance: 10000,
    balance: 20000
  },
  {
    id: 'BK1002',
    busId: 'BUS001',
    customerName: 'Anita Desai',
    pickup: 'Indiranagar',
    drop: 'Mysore Palace',
    dates: ['2024-05-15'],
    status: BookingStatus.COMPLETED,
    totalAmount: 15000,
    advance: 5000,
    balance: 10000
  }
];
