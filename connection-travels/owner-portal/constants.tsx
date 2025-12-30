
import type { OwnerBus, Booking } from './types';
import { BookingStatus } from './types';

export const MOCK_BUSES: OwnerBus[] = [
  {
    id: 'BUS001',
    title: 'Royal Voyager',
    registrationNo: 'KA 01 AB 1234',
    capacity: 45,
    description: 'Premium luxury bus with lounge seating.',
    amenities: ['AC', 'LED lights', 'Sound system', 'Sleeper'],
    approvalStatus: 'APPROVED',
    approvalNote: null,
    active: true,
    imageUrl: 'https://picsum.photos/seed/bus1/400/250'
  },
  {
    id: 'BUS002',
    title: 'Neon Party King',
    registrationNo: 'KA 01 CD 5678',
    capacity: 35,
    description: 'Party-ready coach built for city tours.',
    amenities: ['DJ system', 'LED lights', 'Sound system'],
    approvalStatus: 'PENDING',
    approvalNote: null,
    active: false,
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
