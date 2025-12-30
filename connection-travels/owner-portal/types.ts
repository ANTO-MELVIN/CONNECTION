export type BusApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OwnerSchedule {
  id: string;
  departureDate: string;
  arrivalDate?: string | null;
  origin: string;
  destination: string;
  availableSeats: number;
  price: number | string;
  status: string;
  statusReason?: string | null;
}

export interface OwnerBus {
  id: string;
  title: string;
  registrationNo: string;
  capacity: number;
  description?: string | null;
  amenities: string[];
  imageUrl?: string | null;
  approvalStatus: BusApprovalStatus;
  approvalNote?: string | null;
  active: boolean;
  schedules?: OwnerSchedule[];
  createdAt?: string;
  updatedAt?: string;
  media?: OwnerBusMedia[];
}

export interface OwnerBusMedia {
  id: string;
  busId: string;
  fileName: string;
  mimeType: string;
  kind: 'IMAGE' | 'VIDEO';
  url?: string | null;
  data?: string | null;
}

export interface OwnerProfile {
  id: string;
  companyName: string;
  gstNumber?: string | null;
  address?: string | null;
  city?: string | null;
  verifiedByAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OwnerUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  ownerProfile?: OwnerProfile | null;
}

export enum BookingStatus {
  UPCOMING = 'Upcoming',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
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
