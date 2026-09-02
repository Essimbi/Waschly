import { UserProfile, Location } from '../data/demand.dto';

export type Role = 'client' | 'washer' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

/**
 * Single source of truth for an account, regardless of role.
 * Extends UserProfile (shared client/washer profile fields) with role and
 * washer-only verification/marketplace fields.
 */
export interface AppUser extends UserProfile {
  role: Role;
  isActive: boolean;
  /** TODO: mock-only plaintext, front-end has no backend yet — real hashing happens server-side later. */
  password: string;

  // ─── Washer-only ───────────────────────────────────────
  verificationStatus?: VerificationStatus;
  documentNames?: string[];
  rating?: number;
  completedWashes?: number;
  isAvailable?: boolean;
  baseLocation?: Location;
}

export interface RegisterDraft {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  documentNames?: string[];
}
