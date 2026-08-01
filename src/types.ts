export type Language = 'FR' | 'EN' | 'AR';

export type PropertyType = 'Appartement' | 'Villa' | 'Terrain' | 'Local Commercial';
export type TransactionType = 'Achat' | 'Location';

export type PropertyStatus = 'A Vendre' | 'A Louer' | 'Sous Offre' | 'Vendu' | 'Loué';

export type StandingQuality = 'Économique' | 'Moyen standing' | 'Haut standing' | 'Luxe avec Acte';

export interface Property {
  id: string;
  title: string;
  titleAr?: string;
  type: PropertyType;
  transactionType: TransactionType;
  wilaya: string;
  commune: string;
  neighborhood: string;
  priceDZD: number;
  surfaceM2: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  totalFloors?: number;
  images: string[];
  videos?: string[];
  isFavorite?: boolean;
  status: PropertyStatus;
  tag?: string; // e.g., 'Nouveau', 'Exclusivité', 'Coup de cœur'
  featured?: boolean;
  standing: StandingQuality;
  description: string;
  descriptionAr?: string;
  hasActAndLivret: boolean;
  hasElevator?: boolean;
  hasGarage?: boolean;
  hasSeaView?: boolean;
  hasPool?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  dateAdded: string;
  viewsCount: number;
}

export interface FilterState {
  wilaya: string;
  commune: string;
  propertyType: string;
  transactionType: TransactionType | 'Tous';
  minPriceDZD: number;
  maxPriceDZD: number;
  minSurface: number;
  rooms: string;
  sortBy: 'recent' | 'priceAsc' | 'priceDesc' | 'surfaceDesc';
}

export interface EstimationInput {
  propertyType: PropertyType;
  wilaya: string;
  commune: string;
  neighborhood: string;
  surfaceM2: number;
  rooms: number;
  bedrooms: number;
  floor: number;
  standing: StandingQuality;
  hasActAndLivret: boolean;
  hasElevator: boolean;
  hasGarage: boolean;
  hasSeaView: boolean;
  hasPool: boolean;
  constructionYear: number;
}

export interface EstimationResult {
  estimatedPriceDZD: number;
  priceRangeMinDZD: number;
  priceRangeMaxDZD: number;
  pricePerM2DZD: number;
  confidenceScore: number;
  comparableListingsCount: number;
  estimatedMonthlyRentDZD: number;
  rentalYieldPercent: number;
  wilayaAverageM2DZD: number;
  summaryReasoning: {
    locationFactor: string;
    standingImpact: string;
    documentsBonus: string;
    amenitiesBonus: string;
  };
}

export type LeadStatus = 'nouveau' | 'contacte' | 'visite' | 'conclu' | 'archive';

export interface Lead {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  type: 'estimation' | 'demande_visite' | 'contact_general';
  propertyId?: string;
  propertyTitle?: string;
  wilaya: string;
  surfaceM2?: number;
  estimatedValueDZD?: number;
  status: LeadStatus;
  date: string;
  message?: string;
}

export interface MarketStat {
  month: string;
  avgPriceM2Alger: number;
  avgPriceM2Oran: number;
  avgPriceM2Constantine: number;
  avgPriceM2Setif: number;
  salesVolumeDZD: number;
}

export type UserRoleCategory = 'acheteurs' | 'vendeurs' | 'promoteurs' | 'agences';

export interface CriteriaSubscription {
  id: string;
  roleCategory: UserRoleCategory;
  userTitle: string; // e.g., "Acheteur particulier", "Agence Immo Al-Badr", "Promoteur Baya"
  contactName: string;
  email: string;
  phone: string;
  wilaya: string;
  commune?: string;
  propertyType?: string;
  transactionType?: TransactionType | 'Tous';
  maxBudgetDZD?: number;
  minSurface?: number;
  receiveWhatsappAlerts: boolean;
  receiveEmailAlerts: boolean;
  receiveSmsAlerts: boolean;
  dateCreated: string;
}

export interface MatchNotification {
  id: string;
  subscriptionId: string;
  roleCategory: UserRoleCategory;
  title: string;
  message: string;
  propertyId?: string;
  leadId?: string;
  date: string;
  read: boolean;
  contactPhone: string;
  contactEmail: string;
  contactName: string;
}

