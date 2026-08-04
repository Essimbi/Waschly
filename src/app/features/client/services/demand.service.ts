import { Injectable } from '@angular/core';
import { DemandResponseDto, DemandStatus, UserProfile, CreateDemandDto, ReviewDto } from '../models/demand.dto';
import { IDemandRepository } from '../models/demand.repository';

// Initial Mock Data
const MOCK_PROFILE: UserProfile = {
  id: 'usr_1',
  firstName: 'Julian',
  lastName: 'Wagner',
  email: 'julian.wagner@example.com',
  phone: '+49 170 1234567',
  avatarUrl: 'https://i.pravatar.cc/150?img=11',
  memberSince: new Date('2025-01-15T08:00:00Z').toISOString(),
  notifications: { sms: true, email: true, pushEnabled: true }
};

let MOCK_DEMANDS: DemandResponseDto[] = [
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
    washer: { id: 'wsh_1', name: 'Max W.', avatarUrl: 'https://i.pravatar.cc/150?img=11', rating: 4.8 },
    reviewSubmitted: true
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
  }
];

@Injectable({
  providedIn: 'root'
})
export class DemandService implements IDemandRepository {
  
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async getClientProfile(): Promise<UserProfile> {
    await this.delay(400);
    return { ...MOCK_PROFILE };
  }

  async updateClientProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await this.delay(600);
    Object.assign(MOCK_PROFILE, updates);
    return { ...MOCK_PROFILE };
  }

  async getMyDemands(): Promise<DemandResponseDto[]> {
    await this.delay(500);
    this.autoProgressDemands();
    return [...MOCK_DEMANDS];
  }

  async getDemandById(id: string): Promise<DemandResponseDto> {
    await this.delay(300);
    this.autoProgressDemands();
    const demand = MOCK_DEMANDS.find(d => d.id === id);
    if (!demand) throw new Error('Demand not found');
    return { ...demand };
  }

  async createDemand(dto: CreateDemandDto): Promise<DemandResponseDto> {
    await this.delay(800);
    const newDemand: DemandResponseDto = {
      id: 'req_' + Math.random().toString(36).substr(2, 9),
      clientId: 'usr_1',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...dto
    };
    MOCK_DEMANDS = [newDemand, ...MOCK_DEMANDS];
    return { ...newDemand };
  }

  async updateDemandStatus(id: string, status: DemandStatus): Promise<DemandResponseDto> {
    await this.delay(500);
    const index = MOCK_DEMANDS.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Demand not found');
    MOCK_DEMANDS[index] = { ...MOCK_DEMANDS[index], status, updatedAt: new Date().toISOString() };
    return { ...MOCK_DEMANDS[index] };
  }

  async submitReview(review: ReviewDto): Promise<void> {
    await this.delay(600);
    const index = MOCK_DEMANDS.findIndex(d => d.id === review.demandId);
    if (index === -1) throw new Error('Demand not found');
    MOCK_DEMANDS[index] = { ...MOCK_DEMANDS[index], reviewSubmitted: true };
  }

  private autoProgressDemands() {
    MOCK_DEMANDS = MOCK_DEMANDS.map(demand => {
      if (demand.status === 'open') {
        const ageInMs = Date.now() - new Date(demand.createdAt).getTime();
        if (ageInMs > 10000) {
          return { ...demand, status: 'assigned', washer: { id: 'wsh_3', name: 'Tom H.', rating: 4.7 } };
        }
      }
      if (demand.status === 'assigned') {
        const ageInMs = Date.now() - new Date(demand.createdAt).getTime();
        if (ageInMs > 20000) {
          return { ...demand, status: 'in_progress' };
        }
      }
      if (demand.status === 'in_progress') {
        const ageInMs = Date.now() - new Date(demand.createdAt).getTime();
        if (ageInMs > 40000) {
          return { ...demand, status: 'completed' };
        }
      }
      return demand;
    });
  }
}
