
export enum AppStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export interface BusOwner {
  id: string;
  name: string;
  companyName: string;
  email: string;
  status: AppStatus;
  rating: number;
  totalBuses: number;
  joinedAt: string;
}

export interface OwnerProfile {
  id: string;
  companyName: string;
  gstNumber?: string | null;
  address?: string | null;
  verifiedByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: 'ADMIN' | 'OWNER' | 'CUSTOMER';
  createdAt: string;
  updatedAt: string;
}

export interface Bus {
  id: string;
  ownerId: string;
  name: string;
  capacity: number;
  basePrice: number;
  features: string[];
  status: AppStatus;
  images: string[];
  registrationNumber: string;
}

export interface Booking {
  id: string;
  busId: string;
  userId: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'CONFLICT';
}

export interface Conflict {
  id: string;
  bookingId: string;
  originalBusId: string;
  conflictType: 'OWNER_BLOCK' | 'DOUBLE_BOOKING';
  details: string;
  severity: 'HIGH' | 'MEDIUM';
}

export interface MetricData {
  name: string;
  value: number;
}

export interface DashboardSummary {
  owners: number;
  users: number;
  buses: number;
  bookings: number;
}
