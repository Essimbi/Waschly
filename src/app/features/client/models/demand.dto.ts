// TODO: Ces interfaces devront correspondre exactement aux DTOs du backend NestJS.

export type DemandStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type WashType = 'exterior' | 'interior' | 'full';
export type VehicleType = 'sedan' | 'suv' | 'van' | 'compact';
export type DirtLevel = 'light' | 'medium' | 'heavy';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface CreateDemandDto {
  vehicleType: VehicleType;
  washType: WashType;
  dirtLevel: DirtLevel;
  location: Location;
  availability: 'asap' | 'scheduled';
  scheduledTime?: string;
  notes?: string;
  photoUrls?: string[];
}

export interface UserSnippet {
  id: string;
  name: string;
  avatarUrl?: string;
  rating?: number;
  isVerified?: boolean;
}

export interface DemandResponseDto {
  id: string;
  clientId: string;
  washer?: UserSnippet;
  status: DemandStatus;
  vehicleType: VehicleType;
  washType: WashType;
  dirtLevel: DirtLevel;
  location: Location;
  availability: 'asap' | 'scheduled';
  scheduledTime?: string;
  notes?: string;
  photoUrls?: string[];
  createdAt: string;
  updatedAt: string;
  reviewSubmitted?: boolean;
}

export interface ReviewDto {
  demandId: string;
  rating: number; // 1–5
  comment?: string;
}

export interface NotificationPreferences {
  sms: boolean;
  email: boolean;
  pushEnabled: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  memberSince: string; // ISO String
  notifications: NotificationPreferences;
}
