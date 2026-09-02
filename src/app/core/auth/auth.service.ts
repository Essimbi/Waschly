import { Injectable, signal, computed, effect } from '@angular/core';
import { AppUser, Role, RegisterDraft, VerificationStatus } from './user.model';
import { AuditLogEntry } from '../data/demand.dto';
import { loadFromStorage, saveToStorage } from '../data/local-store';

export type { Role } from './user.model';

// TODO: replace this whole mocked auth store with real Supabase Auth once the backend exists.
// The public API (currentUser/userRole/login/register/verifyOtp/logout) is designed to stay
// stable across that swap — only the internals change.
const MOCK_OTP_CODE = '123456';
const DEMO_PASSWORD = 'demo1234';

type OtpPurpose = 'register' | 'reset';

interface PendingOtp {
  purpose: OtpPurpose;
  email: string;
  draft?: RegisterDraft;
  /** Set once the code has been confirmed for a 'reset' flow — gates setNewPassword(). */
  verified?: boolean;
}

function seedUsers(): AppUser[] {
  return [
    {
      id: 'usr_1', role: 'client', isActive: true, password: DEMO_PASSWORD,
      firstName: 'Julian', lastName: 'Wagner', email: 'julian.wagner@example.com', phone: '+49 170 1234567',
      avatarUrl: 'https://i.pravatar.cc/150?img=11', memberSince: new Date('2025-01-15T08:00:00Z').toISOString(),
      notifications: { sms: true, email: true, pushEnabled: true }
    },
    {
      id: 'wsh_1', role: 'washer', isActive: true, password: DEMO_PASSWORD,
      firstName: 'Klaus', lastName: 'Weber', email: 'klaus.weber@example.com', phone: '+49 176 9876543',
      avatarUrl: 'https://i.pravatar.cc/150?img=12', memberSince: new Date('2024-06-01T08:00:00Z').toISOString(),
      notifications: { sms: true, email: true, pushEnabled: true },
      verificationStatus: 'approved', documentNames: ['personalausweis.pdf'],
      rating: 4.9, completedWashes: 214, isAvailable: true,
      baseLocation: { lat: 52.5200, lng: 13.4050, address: 'Mitte, Berlin' }
    },
    {
      id: 'adm_1', role: 'admin', isActive: true, password: DEMO_PASSWORD,
      firstName: 'Admin', lastName: 'Team', email: 'admin@waschly.de', phone: '+49 30 0000000',
      avatarUrl: 'https://i.pravatar.cc/150?img=68', memberSince: new Date('2024-01-01T08:00:00Z').toISOString(),
      notifications: { sms: false, email: true, pushEnabled: false }
    }
  ];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Dev-mode fixed OTP — no SMS/email provider yet. */
  readonly otpCode = MOCK_OTP_CODE;

  private users = signal<AppUser[]>(loadFromStorage<AppUser[]>('users', seedUsers()));
  private currentUserId = signal<string | null>(loadFromStorage<string | null>('session', null));
  private auditLogSignal = signal<AuditLogEntry[]>(loadFromStorage<AuditLogEntry[]>('audit_log', []));

  /** Set while a registration or password reset is awaiting OTP confirmation. */
  pendingOtp = signal<PendingOtp | null>(null);

  currentUser = computed(() => this.users().find(u => u.id === this.currentUserId()) ?? null);
  userRole = computed<Role | null>(() => this.currentUser()?.role ?? null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  pendingWashers = computed(() => this.users().filter(u => u.role === 'washer' && u.verificationStatus === 'pending'));
  allUsers = computed(() => this.users());
  auditLog = computed(() => [...this.auditLogSignal()].reverse());

  constructor() {
    effect(() => saveToStorage('users', this.users()));
    effect(() => saveToStorage('session', this.currentUserId()));
    effect(() => saveToStorage('audit_log', this.auditLogSignal()));
  }

  private logAction(action: string, targetLabel: string) {
    const actor = this.currentUser();
    const entry: AuditLogEntry = {
      id: 'log_' + Math.random().toString(36).slice(2, 9),
      actorId: actor?.id ?? 'system',
      actorName: actor ? `${actor.firstName} ${actor.lastName}` : 'System',
      action,
      targetLabel,
      createdAt: new Date().toISOString()
    };
    this.auditLogSignal.update(list => [...list, entry]);
  }

  findByEmail(email: string): AppUser | undefined {
    return this.users().find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  // ─── Login (email + password, no OTP) ─────────────────
  login(email: string, password: string): { ok: boolean; user?: AppUser; error?: string } {
    const user = this.findByEmail(email);
    if (!user) return { ok: false, error: 'auth.errors.noAccountFound' };
    if (!user.isActive) return { ok: false, error: 'auth.errors.accountDisabled' };
    if (user.password !== password) return { ok: false, error: 'auth.errors.wrongPassword' };
    this.currentUserId.set(user.id);
    return { ok: true, user };
  }

  // ─── Registration (OTP-verified) ──────────────────────
  /** Step 1 of registration: stash the draft, "send" the OTP (mocked — fixed code). */
  requestRegisterOtp(draft: RegisterDraft): { ok: boolean; error?: string } {
    if (this.findByEmail(draft.email)) {
      return { ok: false, error: 'auth.errors.emailTaken' };
    }
    this.pendingOtp.set({ purpose: 'register', email: draft.email, draft });
    return { ok: true };
  }

  // ─── Forgot password (OTP-verified) ───────────────────
  /** Step 1: verify the account exists, "send" the OTP. */
  requestPasswordReset(email: string): { ok: boolean; error?: string } {
    const user = this.findByEmail(email);
    if (!user) return { ok: false, error: 'auth.errors.noAccountFound' };
    this.pendingOtp.set({ purpose: 'reset', email: user.email });
    return { ok: true };
  }

  /** Step 3: set the new password once the reset OTP has been confirmed. Logs the user in. */
  setNewPassword(newPassword: string): { ok: boolean; user?: AppUser; error?: string } {
    const pending = this.pendingOtp();
    if (!pending || pending.purpose !== 'reset' || !pending.verified) {
      return { ok: false, error: 'auth.errors.confirmCodeFirst' };
    }
    const user = this.findByEmail(pending.email);
    if (!user) return { ok: false, error: 'auth.errors.accountNotFound' };
    this.users.update(list => list.map(u => u.id === user.id ? { ...u, password: newPassword } : u));
    this.currentUserId.set(user.id);
    this.pendingOtp.set(null);
    return { ok: true, user };
  }

  /** Step 2 (shared by register + reset): confirm the code. */
  verifyOtp(code: string): { ok: boolean; user?: AppUser; error?: string } {
    const pending = this.pendingOtp();
    if (!pending) return { ok: false, error: 'auth.errors.noActiveRequest' };
    if (code.trim() !== this.otpCode) return { ok: false, error: 'auth.errors.wrongCode' };

    if (pending.purpose === 'reset') {
      this.pendingOtp.set({ ...pending, verified: true });
      return { ok: true };
    }

    const draft = pending.draft!;
    const isWasher = draft.role === 'washer';
    const newUser: AppUser = {
      id: (isWasher ? 'wsh_' : 'usr_') + Math.random().toString(36).slice(2, 9),
      role: draft.role,
      isActive: true,
      password: draft.password,
      firstName: draft.firstName,
      lastName: draft.lastName,
      email: draft.email,
      phone: draft.phone,
      memberSince: new Date().toISOString(),
      notifications: { sms: true, email: true, pushEnabled: true },
      ...(isWasher ? {
        verificationStatus: 'pending' as VerificationStatus,
        documentNames: draft.documentNames ?? [],
        rating: 0,
        completedWashes: 0,
        isAvailable: false,
        baseLocation: { lat: 52.5200, lng: 13.4050, address: 'Berlin' }
      } : {})
    };
    this.users.update(list => [...list, newUser]);
    this.currentUserId.set(newUser.id);
    this.pendingOtp.set(null);
    return { ok: true, user: newUser };
  }

  cancelOtp() {
    this.pendingOtp.set(null);
  }

  logout() {
    this.currentUserId.set(null);
  }

  updateCurrentUser(updates: Partial<AppUser>): AppUser | null {
    const id = this.currentUserId();
    if (!id) return null;
    this.users.update(list => list.map(u => u.id === id ? { ...u, ...updates } : u));
    return this.currentUser();
  }

  // ─── Admin actions ─────────────────────────────────────
  setVerificationStatus(userId: string, status: VerificationStatus) {
    const target = this.users().find(u => u.id === userId);
    this.users.update(list => list.map(u =>
      u.id === userId ? { ...u, verificationStatus: status, isAvailable: status === 'approved' ? u.isAvailable ?? true : false } : u
    ));
    if (target) {
      const label = `${target.firstName} ${target.lastName}`;
      this.logAction(status === 'approved' ? 'Wäscher verifiziert' : 'Wäscher abgelehnt', label);
    }
  }

  setUserActive(userId: string, isActive: boolean) {
    const target = this.users().find(u => u.id === userId);
    this.users.update(list => list.map(u => u.id === userId ? { ...u, isActive } : u));
    if (target) {
      const label = `${target.firstName} ${target.lastName}`;
      this.logAction(isActive ? 'Konto reaktiviert' : 'Konto gesperrt', label);
    }
  }
}
