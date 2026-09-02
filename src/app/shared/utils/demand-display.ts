import { VehicleType, WashType } from '../../core/data/demand.dto';

type Lang = 'de' | 'en';

const VEHICLE_LABELS: Record<Lang, Record<VehicleType, string>> = {
  de: { compact: 'Kompaktwagen', sedan: 'Limousine', suv: 'SUV', van: 'Van' },
  en: { compact: 'Compact car', sedan: 'Sedan', suv: 'SUV', van: 'Van' }
};

const WASH_LABELS: Record<Lang, Record<WashType, string>> = {
  de: { exterior: 'Außenwäsche', interior: 'Innenreinigung', full: 'Komplettwäsche' },
  en: { exterior: 'Exterior wash', interior: 'Interior cleaning', full: 'Full wash' }
};

export function vehicleLabel(type: VehicleType, lang: Lang): string {
  return VEHICLE_LABELS[lang][type];
}

const VEHICLE_IMAGES: Record<VehicleType, string> = {
  compact: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop',
  sedan: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop',
  suv: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop',
  van: 'https://images.unsplash.com/photo-1570733577524-3a047079e80d?q=80&w=1200&auto=format&fit=crop'
};

/** Representative photo for a vehicle type — mock data has no real per-request photos yet. */
export function vehicleImage(type: VehicleType): string {
  return VEHICLE_IMAGES[type];
}

export function washLabel(type: WashType, lang: Lang): string {
  return WASH_LABELS[lang][type];
}

/** Extracts the neighborhood/city from a "Street 5, District" mock address — never the exact street. */
export function neighborhood(address: string | undefined): string {
  if (!address) return '';
  const parts = address.split(',');
  return parts[parts.length - 1].trim();
}

/** Coarse relative time ("vor 5 Minuten" / "5 minutes ago") — good enough for mock data display. */
export function relativeTime(iso: string, lang: Lang): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60_000));

  if (minutes < 60) {
    return lang === 'de' ? `vor ${minutes} Min.` : `${minutes} min ago`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return lang === 'de' ? `vor ${hours} Std.` : `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  return lang === 'de' ? `vor ${days} Tag${days > 1 ? 'en' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
}
