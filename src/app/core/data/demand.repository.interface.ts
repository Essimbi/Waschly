import { CreateDemandDto, DemandResponseDto, ReviewDto, DemandStatus, UserProfile } from '../../features/client/models/demand.dto';

/**
 * IDemandRepository
 * @description
 * Contrat que toute implémentation (Mock, HTTP) doit respecter.
 * Les composants n'injectent jamais directement l'implémentation —
 * ils passent par DemandService qui délègue ici.
 *
 * Pour passer au backend réel :
 *   1. Créer HttpDemandRepository qui implémente cette interface
 *   2. Remplacer MockDemandRepository par HttpDemandRepository dans app.config.ts
 *   3. Aucun composant ne change.
 */
export interface IDemandRepository {
  // Demands
  createDemand(dto: CreateDemandDto): Promise<DemandResponseDto>;
  getMyDemands(): Promise<DemandResponseDto[]>;
  getDemandById(id: string): Promise<DemandResponseDto>;
  updateDemandStatus(id: string, status: DemandStatus): Promise<DemandResponseDto>;
  submitReview(review: ReviewDto): Promise<void>;

  // Profile
  getClientProfile(): Promise<UserProfile>;
  updateClientProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
}
