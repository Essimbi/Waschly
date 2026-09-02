import { Injectable, inject } from '@angular/core';
import {
  DemandResponseDto, DemandStatus, UserProfile, WasherProfile,
  CreateDemandDto, ReviewDto, UserSnippet, Location, TopWasher, Dispute
} from './demand.dto';
import { IDemandRepository } from './demand.repository';
import { AuthService } from '../auth/auth.service';
import { loadFromStorage, saveToStorage } from './local-store';

// ────────────────────────────────────────────────────────────────────────────
// Mock data — marché allemand. Persistée en localStorage tant qu'il n'y a pas
// de backend réel (voir IDemandRepository). Les profils Client/Laveur ne sont
// PAS dupliqués ici — ils vivent dans AuthService (un seul compte = un seul profil).
// ────────────────────────────────────────────────────────────────────────────

function seedDemands(): DemandResponseDto[] {
  return [
    {
      id: 'req_1',
      status: 'completed',
      vehicleType: 'sedan',
      washType: 'exterior',
      dirtLevel: 'light',
      location: { lat: 52.520008, lng: 13.404954, address: 'Alexanderplatz 1, Berlin' },
      availability: 'asap',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      clientId: 'usr_1',
      washer: { id: 'wsh_1', name: 'Klaus W.', avatarUrl: 'https://i.pravatar.cc/150?img=12', rating: 4.9, isVerified: true },
      reviewSubmitted: true,
      clientRating: 5
    },
    {
      id: 'req_2',
      status: 'in_progress',
      vehicleType: 'compact',
      washType: 'full',
      dirtLevel: 'medium',
      location: { lat: 52.5205, lng: 13.4050, address: 'Münzstraße 12, Berlin' },
      availability: 'scheduled',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      clientId: 'usr_1',
      washer: { id: 'wsh_2', name: 'Lisa M.', avatarUrl: 'https://i.pravatar.cc/150?img=5', rating: 4.9 }
    },
    {
      id: 'req_3',
      status: 'open',
      vehicleType: 'van',
      washType: 'interior',
      dirtLevel: 'heavy',
      location: { lat: 52.5391, lng: 13.4245, address: 'Kastanienallee 30, Prenzlauer Berg' },
      availability: 'asap',
      notes: 'Kindersitze eingebaut, bitte vorsichtig reinigen.',
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      clientId: 'usr_2'
    },
    {
      id: 'req_4',
      status: 'open',
      vehicleType: 'suv',
      washType: 'full',
      dirtLevel: 'medium',
      location: { lat: 52.4996, lng: 13.4032, address: 'Bergmannstraße 5, Kreuzberg' },
      availability: 'scheduled',
      scheduledTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      clientId: 'usr_3'
    },
    {
      id: 'req_5',
      status: 'open',
      vehicleType: 'sedan',
      washType: 'exterior',
      dirtLevel: 'light',
      location: { lat: 52.5170, lng: 13.3050, address: 'Kantstraße 80, Charlottenburg' },
      availability: 'asap',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      clientId: 'usr_3'
    }
  ];
}

function seedDisputes(): Dispute[] {
  return [
    {
      id: 'dsp_1', demandId: 'req_1', clientId: 'usr_1', washerId: 'wsh_1',
      reason: 'Fahrzeug wurde nicht vollständig innen gereinigt.',
      status: 'open',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
    }
  ];
}

const MOCK_TOP_WASHERS: TopWasher[] = [
  { id: 'wsh_1', name: 'Klaus Weber', avatarUrl: 'https://i.pravatar.cc/300?img=12', rating: 4.9, completedWashes: 214, isVerified: true, city: 'Berlin' },
  { id: 'wsh_2', name: 'Lisa Meier', avatarUrl: 'https://i.pravatar.cc/300?img=5', rating: 4.9, completedWashes: 187, isVerified: true, city: 'Hamburg' },
  { id: 'wsh_4', name: 'Sabine Fischer', avatarUrl: 'https://i.pravatar.cc/300?img=47', rating: 5.0, completedWashes: 156, isVerified: true, city: 'München' },
  { id: 'wsh_5', name: 'Ahmed Yilmaz', avatarUrl: 'https://i.pravatar.cc/300?img=13', rating: 4.8, completedWashes: 203, isVerified: true, city: 'Köln' },
  { id: 'wsh_6', name: 'Nina Braun', avatarUrl: 'https://i.pravatar.cc/300?img=9', rating: 4.9, completedWashes: 132, isVerified: true, city: 'Frankfurt' },
  { id: 'wsh_7', name: 'Tom Hoffmann', avatarUrl: 'https://i.pravatar.cc/300?img=14', rating: 4.7, completedWashes: 98, isVerified: true, city: 'Stuttgart' },
];

const DEFAULT_LOCATION: Location = { lat: 52.5200, lng: 13.4050, address: 'Berlin' };

/** Distance à vol d'oiseau approximative (km) — suffisant pour trier des annonces à l'échelle d'une ville. */
function mockDistanceKm(a: Location, b: Location): number {
  const dLat = a.lat - b.lat;
  const dLng = a.lng - b.lng;
  return Math.sqrt(dLat * dLat + dLng * dLng) * 111;
}

@Injectable({
  providedIn: 'root'
})
export class DemandService implements IDemandRepository {
  private auth = inject(AuthService);

  private demands: DemandResponseDto[] = loadFromStorage('demands', seedDemands());
  private disputes: Dispute[] = loadFromStorage('disputes', seedDisputes());

  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  private persistDemands() { saveToStorage('demands', this.demands); }
  private persistDisputes() { saveToStorage('disputes', this.disputes); }

  private requireUser() {
    const user = this.auth.currentUser();
    if (!user) throw new Error('Nicht angemeldet.');
    return user;
  }

  // ──────────────────────────────────────────────────────────────────────
  // Client
  // ──────────────────────────────────────────────────────────────────────

  async getClientProfile(): Promise<UserProfile> {
    await this.delay(300);
    return { ...this.requireUser() };
  }

  async updateClientProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await this.delay(500);
    return { ...this.auth.updateCurrentUser(updates)! };
  }

  async getMyDemands(): Promise<DemandResponseDto[]> {
    await this.delay(500);
    const me = this.requireUser();
    return this.demands.filter(d => d.clientId === me.id).map(d => ({ ...d }));
  }

  async getDemandById(id: string): Promise<DemandResponseDto> {
    await this.delay(300);
    const demand = this.demands.find(d => d.id === id);
    if (!demand) throw new Error('Anfrage nicht gefunden.');
    return { ...demand };
  }

  async createDemand(dto: CreateDemandDto): Promise<DemandResponseDto> {
    await this.delay(800);
    const me = this.requireUser();
    const newDemand: DemandResponseDto = {
      id: 'req_' + Math.random().toString(36).substr(2, 9),
      clientId: me.id,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...dto
    };
    this.demands = [newDemand, ...this.demands];
    this.persistDemands();
    return { ...newDemand };
  }

  async updateDemandStatus(id: string, status: DemandStatus): Promise<DemandResponseDto> {
    await this.delay(500);
    const index = this.demands.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Anfrage nicht gefunden.');
    this.demands[index] = { ...this.demands[index], status, updatedAt: new Date().toISOString() };
    this.persistDemands();
    return { ...this.demands[index] };
  }

  async submitReview(review: ReviewDto): Promise<void> {
    await this.delay(600);
    const index = this.demands.findIndex(d => d.id === review.demandId);
    if (index === -1) throw new Error('Anfrage nicht gefunden.');
    this.demands[index] = { ...this.demands[index], reviewSubmitted: true, clientRating: review.rating };
    this.persistDemands();

    // Roll the new rating into the washer's average — keeps top-washer/profile data honest.
    const washerId = this.demands[index].washer?.id;
    if (washerId) {
      const washer = this.auth.allUsers().find(u => u.id === washerId);
      if (washer) {
        const priorCount = washer.completedWashes ?? 0;
        const priorRating = washer.rating ?? review.rating;
        const nextCount = priorCount + 1;
        const nextRating = Math.round(((priorRating * priorCount + review.rating) / nextCount) * 10) / 10;
        // Note: only updates the CURRENT user if it's this washer; other washers' aggregate
        // ratings are recomputed lazily via getTopWashers() from demand history instead.
        if (this.auth.currentUser()?.id === washerId) {
          this.auth.updateCurrentUser({ completedWashes: nextCount, rating: nextRating });
        }
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  // Laveur
  // ──────────────────────────────────────────────────────────────────────

  async getOpenDemands(): Promise<DemandResponseDto[]> {
    await this.delay(400);
    const base = this.requireUser().baseLocation ?? DEFAULT_LOCATION;
    return this.demands
      .filter(d => d.status === 'open')
      .map(d => ({ ...d }))
      .sort((a, b) => mockDistanceKm(a.location, base) - mockDistanceKm(b.location, base));
  }

  async acceptDemand(demandId: string, washer: UserSnippet): Promise<DemandResponseDto> {
    await this.delay(500);
    const index = this.demands.findIndex(d => d.id === demandId);
    if (index === -1) throw new Error('Anfrage nicht gefunden.');
    if (this.demands[index].status !== 'open') {
      throw new Error('Diese Anfrage wurde bereits von einem anderen Wäscher übernommen.');
    }
    this.demands[index] = {
      ...this.demands[index],
      status: 'assigned',
      washer,
      updatedAt: new Date().toISOString()
    };
    this.persistDemands();
    return { ...this.demands[index] };
  }

  async getMyAssignedJobs(): Promise<DemandResponseDto[]> {
    await this.delay(400);
    const me = this.requireUser();
    return this.demands.filter(d => d.washer?.id === me.id).map(d => ({ ...d }));
  }

  async getWasherProfile(): Promise<WasherProfile> {
    await this.delay(300);
    return this.toWasherProfile(this.requireUser());
  }

  async updateWasherProfile(updates: Partial<WasherProfile>): Promise<WasherProfile> {
    await this.delay(500);
    const updated = this.auth.updateCurrentUser(updates as any)!;
    return this.toWasherProfile(updated);
  }

  private toWasherProfile(user: UserProfile & { verificationStatus?: string; rating?: number; completedWashes?: number; isAvailable?: boolean; baseLocation?: Location }): WasherProfile {
    return {
      ...user,
      isVerified: user.verificationStatus === 'approved',
      rating: user.rating ?? 0,
      completedWashes: user.completedWashes ?? 0,
      isAvailable: user.isAvailable ?? false,
      baseLocation: user.baseLocation ?? DEFAULT_LOCATION
    };
  }

  /** Distance mockée (km) entre une demande et la base du laveur connecté — pour l'affichage des annonces. */
  distanceToWasherKm(location: Location): number {
    const base = this.auth.currentUser()?.baseLocation ?? DEFAULT_LOCATION;
    return mockDistanceKm(location, base);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Vitrine publique
  // ──────────────────────────────────────────────────────────────────────

  async getTopWashers(): Promise<TopWasher[]> {
    await this.delay(300);
    return [...MOCK_TOP_WASHERS].sort((a, b) => b.rating - a.rating);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Admin
  // ──────────────────────────────────────────────────────────────────────

  async getDisputes(): Promise<Dispute[]> {
    await this.delay(300);
    return [...this.disputes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async resolveDispute(id: string, resolutionNote: string): Promise<Dispute> {
    await this.delay(500);
    const index = this.disputes.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Vorgang nicht gefunden.');
    this.disputes[index] = {
      ...this.disputes[index],
      status: 'resolved',
      resolutionNote,
      resolvedAt: new Date().toISOString()
    };
    this.persistDisputes();
    return { ...this.disputes[index] };
  }

  /** All demands, for admin KPIs/dashboards — not part of the public repository contract. */
  async getAllDemands(): Promise<DemandResponseDto[]> {
    await this.delay(300);
    return [...this.demands];
  }
}
