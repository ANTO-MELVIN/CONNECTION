
export enum BusStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending Approval',
  REJECTED = 'Rejected'
}

export enum AvailabilityStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  MAINTENANCE = 'Maintenance'
}

export enum BookingStatus {
  UPCOMING = 'Upcoming',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Bus {
  id: string;
  name: string;
  regNumber: string;
  capacity: number;
  type: 'Normal' | 'Luxury' | 'DJ';
  basePrice: number;
  city: string;
  routes: string[];
  features: string[];
  status: BusStatus;
  rejectionReason?: string;
  imageUrl: string;
}

export interface Booking {
  id: string;
  busId: string;
  customerName: string;
  pickup: string;
  drop: string;
  dates: string[];
  status: BookingStatus;
  totalAmount: number;
  advance: number;
  balance: number;
}

export interface OwnerProfile {
  id: string;
  companyName: string;
  gstNumber?: string | null;
  address?: string | null;
  verifiedByAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
  city?: string | null;
  name?: string;
  isVerified?: boolean;
}
