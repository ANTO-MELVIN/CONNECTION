
import type { OwnerBus, OwnerBooking } from './types';

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
    imageUrl: 'https://picsum.photos/seed/bus1/400/250',
    pricing: {
      expectedPrice: '45000.00',
      lastUpdatedAt: new Date().toISOString(),
    },
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
    imageUrl: 'https://picsum.photos/seed/bus2/400/250',
    pricing: {
      expectedPrice: '52000.00',
      lastUpdatedAt: new Date().toISOString(),
    },
  }
];

export const MOCK_BOOKINGS: OwnerBooking[] = [
  {
    id: 'BK1001',
    status: 'PRICE_FINALIZED',
    ownerPayoutPrice: '36000.00',
    ownerPayoutLockedAt: new Date().toISOString(),
    travelDetails: {
      pickupLocation: 'Majestic, Bengaluru',
      startDate: new Date().toISOString(),
      passengers: 35,
    },
    packageSelections: ['DJ setup'],
    adminNotes: 'Please prepare LED wall.',
    ownerConfirmationAt: null,
    createdAt: new Date().toISOString(),
    bus: {
      id: 'BUS001',
      title: 'Royal Voyager',
      capacity: 45,
      amenities: ['AC', 'LED lights', 'Sound system', 'Sleeper'],
      pricing: {
        expectedPrice: '45000.00',
      },
    },
  },
  {
    id: 'BK1002',
    status: 'QUOTE_REQUESTED',
    ownerPayoutPrice: null,
    ownerPayoutLockedAt: null,
    travelDetails: {
      pickupLocation: 'Indiranagar',
      startDate: new Date().toISOString(),
    },
    packageSelections: [],
    adminNotes: null,
    ownerConfirmationAt: null,
    createdAt: new Date().toISOString(),
    bus: {
      id: 'BUS002',
      title: 'Neon Party King',
      capacity: 35,
      amenities: ['DJ system', 'LED lights', 'Sound system'],
      pricing: {
        expectedPrice: '52000.00',
      },
    },
  }
];
