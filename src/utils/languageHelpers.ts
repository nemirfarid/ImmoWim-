import { Language } from '../types';

export function translatePropertyType(type: string, lang: Language): string {
  if (lang === 'AR') {
    switch (type) {
      case 'Appartement': return 'شقة';
      case 'Villa': return 'فيلا ودوبلكس';
      case 'Terrain': return 'قطعة أرض';
      case 'Local Commercial': return 'محل تجاري';
      default: return type;
    }
  }
  if (lang === 'EN') {
    switch (type) {
      case 'Appartement': return 'Apartment';
      case 'Villa': return 'Villa & Duplex';
      case 'Terrain': return 'Land Plot';
      case 'Local Commercial': return 'Commercial Premises';
      default: return type;
    }
  }
  return type;
}

export function translateTransactionType(type: string, lang: Language): string {
  if (lang === 'AR') {
    if (type === 'Achat' || type === 'A Vendre' || type === 'Vente') return 'للبيع';
    if (type === 'Location' || type === 'A Louer') return 'للإيجار';
    return type;
  }
  if (lang === 'EN') {
    if (type === 'Achat' || type === 'A Vendre' || type === 'Vente') return 'For Sale';
    if (type === 'Location' || type === 'A Louer') return 'For Rent';
    return type;
  }
  if (type === 'Achat') return 'À Vendre';
  if (type === 'Location') return 'À Louer';
  return type;
}

export function translateStanding(standing: string, lang: Language): string {
  if (lang === 'AR') {
    if (standing.includes('Luxe')) return 'فاخر مع عقد ودفتر عقاري';
    if (standing.includes('Haut')) return 'عالي الجودة (Haut Standing)';
    if (standing.includes('Moyen')) return 'متوسط الجودة';
    if (standing.includes('Eco')) return 'اقتصادي / عادي';
    return standing;
  }
  if (lang === 'EN') {
    if (standing.includes('Luxe')) return 'Luxury with Title Deed';
    if (standing.includes('Haut')) return 'High Standing';
    if (standing.includes('Moyen')) return 'Medium Standing';
    if (standing.includes('Eco')) return 'Standard / Economy';
    return standing;
  }
  return standing;
}

export function translateWilayaLabel(lang: Language): string {
  if (lang === 'AR') return 'الولاية';
  if (lang === 'EN') return 'Wilaya (Province)';
  return 'Wilaya';
}

export function translateLivretFoncier(lang: Language): string {
  if (lang === 'AR') return 'عقد توثيقي ودفتر عقاري';
  if (lang === 'EN') return 'Title Deed & Land Book';
  return 'Acte & Livret Foncier';
}
