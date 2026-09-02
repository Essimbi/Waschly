import {
  DemandResponseDto, DemandStatus, UserProfile, WasherProfile,
  CreateDemandDto, ReviewDto, UserSnippet, TopWasher, Dispute
} from './demand.dto';

/**
 * IDemandRepository
 * @description
 * Contrat partagé Client + Laveur pour tout ce qui touche aux demandes.
 * Les composants n'injectent jamais directement l'implémentation —
 * ils passent par DemandService qui délègue ici.
 *
 * Pour passer au backend réel (Supabase) :
 *   1. Créer HttpDemandRepository qui implémente cette interface
 *   2. Remplacer DemandService par HttpDemandRepository dans app.config.ts
 *   3. Aucun composant ne change.
 */
export interface IDemandRepository {
  // ─── Client ────────────────────────────────────────────────
  getMyDemands(): Promise<DemandResponseDto[]>;
  getDemandById(id: string): Promise<DemandResponseDto>;
  createDemand(dto: CreateDemandDto): Promise<DemandResponseDto>;
  updateDemandStatus(id: string, status: DemandStatus): Promise<DemandResponseDto>;
  submitReview(review: ReviewDto): Promise<void>;
  getClientProfile(): Promise<UserProfile>;
  updateClientProfile(updates: Partial<UserProfile>): Promise<UserProfile>;

  // ─── Laveur ────────────────────────────────────────────────
  /** Demandes ouvertes, pas encore attribuées — les "annonces". */
  getOpenDemands(): Promise<DemandResponseDto[]>;
  /** Attribution "premier arrivé, premier servi". Rejette si la demande n'est plus 'open'. */
  acceptDemand(demandId: string, washer: UserSnippet): Promise<DemandResponseDto>;
  /** Missions du laveur connecté (en cours ou terminées). */
  getMyAssignedJobs(): Promise<DemandResponseDto[]>;
  getWasherProfile(): Promise<WasherProfile>;
  updateWasherProfile(updates: Partial<WasherProfile>): Promise<WasherProfile>;

  // ─── Vitrine publique (site visiteur) ─────────────────────────
  /** Laveurs les mieux notés, pour la landing/marketing — indépendant de toute demande. */
  getTopWashers(): Promise<TopWasher[]>;

  // ─── Admin ─────────────────────────────────────────────
  getDisputes(): Promise<Dispute[]>;
  resolveDispute(id: string, resolutionNote: string): Promise<Dispute>;
}
