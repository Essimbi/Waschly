import { Injectable, signal, computed } from '@angular/core';
import {
  CreateDemandDto, DemandResponseDto, ReviewDto, DemandStatus,
  UserProfile, UserSnippet
} from '../../features/client/models/demand.dto';
import { IDemandRepository } from './demand.repository.interface';

// ────────────────────────────────────────────────────────────────────────────
// Données mock réalistes — marché allemand
// ────────────────────────────────────────────────────────────────────────────

const MOCK_WASHERS: UserSnippet[] = [
  { id: 'washer-001', name: 'Klaus Weber',   avatarUrl: 'https://i.pravatar.cc/150?img=11', rating: 4.9, isVerified: true },
  { id: 'washer-002', name: 'Sabine Müller', avatarUrl: 'https://i.pravatar.cc/150?img=47', rating: 4.7, isVerified: true },
  { id: 'washer-003', name: 'Hans Gruber',   avatarUrl: 'https://i.pravatar.cc/150?img=12', rating: 4.5, isVerified: true },
];

const MOCK_CLIENT_PROFILE: UserProfile = {
  id: 'client-dev-001',
  firstName: 'Maximilian',
  lastName: 'Bauer',
  email: 'max.bauer@gmail.com',
  phone: '+49 30 12345678',
  avatarUrl: 'https://i.pravatar.cc/150?img=33',
  memberSince: new Date(Date.now() - 86400000 * 90).toISOString(),
  notifications: { sms: true, email: true, pushEnabled: false }
};

function makeDemand(override: Partial<DemandResponseDto> & { id: string; status: DemandStatus }): DemandResponseDto {
  return {
    clientId: 'client-dev-001',
    vehicleType: 'sedan',
    washType: 'full',
    dirtLevel: 'medium',
    location: { lat: 52.5200, lng: 13.4050, address: 'Alexanderplatz, Berlin' },
    availability: 'asap',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2.5).toISOString(),
    reviewSubmitted: false,
    ...override
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Service
// ────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class MockDemandRepository implements IDemandRepository {

  /** Source of truth — Signal mis à jour de façon immuable */
  private readonly _demands = signal<DemandResponseDto[]>([
    makeDemand({
      id: 'req-001',
      status: 'completed',
      washType: 'full',
      vehicleType: 'sedan',
      location: { lat: 52.5200, lng: 13.4050, address: 'Alexanderplatz, Berlin' },
      washer: MOCK_WASHERS[0],
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 6.5).toISOString(),
      reviewSubmitted: true
    }),
    makeDemand({
      id: 'req-002',
      status: 'completed',
      washType: 'exterior',
      vehicleType: 'suv',
      location: { lat: 52.5031, lng: 13.3322, address: 'Kurfürstendamm 45, Berlin' },
      washer: MOCK_WASHERS[1],
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 13.8).toISOString(),
      reviewSubmitted: true
    }),
    makeDemand({
      id: 'req-003',
      status: 'completed',
      washType: 'interior',
      vehicleType: 'compact',
      location: { lat: 52.5096, lng: 13.3758, address: 'Potsdamer Platz 3, Berlin' },
      washer: MOCK_WASHERS[2],
      createdAt: new Date(Date.now() - 86400000 * 21).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 20.8).toISOString(),
      reviewSubmitted: false
    }),
  ]);

  /** Expose en lecture seule pour les composants qui voudraient subscribre */
  readonly demands = computed(() => this._demands());

  private _profile = signal<UserProfile>({ ...MOCK_CLIENT_PROFILE });

  // ──────────────────────────────────────────────────────────────────────────
  // Latence simulée : 300–700ms aléatoire
  // ──────────────────────────────────────────────────────────────────────────
  private delay(minMs = 300, maxMs = 700): Promise<void> {
    const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Demands
  // ──────────────────────────────────────────────────────────────────────────

  async createDemand(dto: CreateDemandDto): Promise<DemandResponseDto> {
    await this.delay(500, 900);

    // Simuler 15% d'échec réseau
    if (Math.random() < 0.15) {
      throw new Error('Netzwerkfehler – bitte erneut versuchen.');
    }

    const newDemand: DemandResponseDto = {
      id: `req-${Date.now().toString(36)}`,
      clientId: 'client-dev-001',
      status: 'open',
      reviewSubmitted: false,
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this._demands.update(list => [newDemand, ...list]);

    // Auto-progression du statut pour la démo
    this.scheduleAutoProgress(newDemand.id);

    return { ...newDemand };
  }

  async getMyDemands(): Promise<DemandResponseDto[]> {
    await this.delay(300, 600);
    return [...this._demands()];
  }

  async getDemandById(id: string): Promise<DemandResponseDto> {
    await this.delay(200, 400);
    const demand = this._demands().find(d => d.id === id);
    if (!demand) throw new Error(`Anfrage ${id} nicht gefunden.`);
    return { ...demand };
  }

  async updateDemandStatus(id: string, status: DemandStatus): Promise<DemandResponseDto> {
    await this.delay(300, 600);
    let updated: DemandResponseDto | undefined;

    this._demands.update(list => list.map(d => {
      if (d.id !== id) return d;
      updated = {
        ...d,
        status,
        washer: (status === 'assigned' || status === 'in_progress') ? (d.washer ?? MOCK_WASHERS[0]) : d.washer,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    }));

    if (!updated) throw new Error(`Anfrage ${id} nicht gefunden.`);
    return { ...updated };
  }

  async submitReview(review: ReviewDto): Promise<void> {
    await this.delay(500, 800);
    this._demands.update(list => list.map(d =>
      d.id === review.demandId ? { ...d, reviewSubmitted: true } : d
    ));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Profile
  // ──────────────────────────────────────────────────────────────────────────

  async getClientProfile(): Promise<UserProfile> {
    await this.delay(200, 400);
    return { ...this._profile() };
  }

  async updateClientProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    await this.delay(400, 700);
    this._profile.update(p => ({ ...p, ...profile }));
    return { ...this._profile() };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Auto-progression du statut (démo uniquement)
  // open → assigned (4s) → in_progress (8s)
  // ──────────────────────────────────────────────────────────────────────────
  private scheduleAutoProgress(id: string) {
    const washer = MOCK_WASHERS[Math.floor(Math.random() * MOCK_WASHERS.length)];

    setTimeout(() => {
      this._demands.update(list => list.map(d =>
        d.id === id && d.status === 'open'
          ? { ...d, status: 'assigned', washer, updatedAt: new Date().toISOString() }
          : d
      ));
    }, 4000);

    setTimeout(() => {
      this._demands.update(list => list.map(d =>
        d.id === id && d.status === 'assigned'
          ? { ...d, status: 'in_progress', updatedAt: new Date().toISOString() }
          : d
      ));
    }, 8000);
  }
}
