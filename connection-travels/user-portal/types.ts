
export enum BusFeature {
  DJ_BUS = 'DJ Bus',
  LED_LIGHTS = 'LED / Laser Lights',
  SLEEPER = 'Sleeper',
  SEATER = 'Seater',
  LUXURY = 'Luxury',
  NORMAL = 'Normal',
  AC = 'AC',
  NON_AC = 'Non-AC',
  WIFI = 'High-speed WiFi',
  CHARGING = 'Charging Ports',
  WASHROOM = 'Washroom'
}

export interface Bus {
  id: string;
  name: string;
  image: string;
  gallery: string[];
  capacity: number;
  features: BusFeature[];
  pricePerDay: number;
  rating: number;
  verified: boolean;
  ownerContact: string;
  year: number;
  condition: 'Excellent' | 'Good' | 'Fair';
  description: string;
}

export interface Booking {
  id: string;
  busId: string;
  pickup: string;
  drop: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  advancePaid: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  contactNumber: string;
}

export interface SearchParams {
  pickup: string;
  drop: string;
  date: string;
  budget: [number, number];
  features: BusFeature[];
}
