export type BusApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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
  pricing?: OwnerBusPricing | null;
  createdAt?: string;
  updatedAt?: string;
  media?: OwnerBusMedia[];
}

export interface OwnerBusPricing {
  expectedPrice: string;
  lastUpdatedAt?: string;
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

export interface OwnerBooking {
  id: string;
  status: string;
  ownerPayoutPrice?: string | number | null;
  ownerPayoutLockedAt?: string | null;
  travelDetails?: Record<string, any> | null;
  packageSelections?: any;
  adminNotes?: string | null;
  ownerConfirmationAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  bus: {
    id: string;
    title: string;
    capacity: number;
    amenities: string[];
    media?: OwnerBusMedia[];
    pricing?: OwnerBusPricing | null;
  };
}
