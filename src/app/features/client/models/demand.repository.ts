import { DemandResponseDto, DemandStatus, UserProfile, CreateDemandDto, ReviewDto } from './demand.dto';

export interface IDemandRepository {
  getMyDemands(): Promise<DemandResponseDto[]>;
  getDemandById(id: string): Promise<DemandResponseDto>;
  createDemand(dto: CreateDemandDto): Promise<DemandResponseDto>;
  updateDemandStatus(id: string, status: DemandStatus): Promise<DemandResponseDto>;
  submitReview(review: ReviewDto): Promise<void>;
  getClientProfile(): Promise<UserProfile>;
  updateClientProfile(updates: Partial<UserProfile>): Promise<UserProfile>;
}
