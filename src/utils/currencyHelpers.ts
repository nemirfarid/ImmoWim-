export type Currency = 'DZD' | 'EUR' | 'CAD' | 'USD';

// Parallel Market / Marché Noir (Square Port Saïd) Exchange Rates
// 1 EUR = 270 DZD (Taux du marché parallèle actuel)
// 1 CAD = 180 DZD
// 1 USD = 250 DZD

export const EXCHANGE_RATES: Record<Currency, number> = {
  DZD: 1,
  EUR: 270,
  CAD: 180,
  USD: 250,
};

export function roundToNearestThousand(val: number): number {
  if (val >= 1000) {
    return Math.round(val / 1000) * 1000;
  }
  return Math.round(val);
}

export function convertDZDToCurrency(priceDZD: number, currency: Currency): number {
  if (currency === 'DZD') return priceDZD;
  const rate = EXCHANGE_RATES[currency] || 270;
  const raw = priceDZD / rate;
  return roundToNearestThousand(raw);
}

export function formatPriceWithCurrency(
  priceDZD: number,
  currency: Currency,
  lang: 'FR' | 'AR' | 'EN' = 'FR'
): string {
  if (currency === 'DZD') {
    const formattedDZD = priceDZD.toLocaleString('fr-FR');
    if (lang === 'AR') return `${formattedDZD} د.ج`;
    if (lang === 'EN') return `${formattedDZD} DZD`;
    return `${formattedDZD} DA`;
  }

  const converted = convertDZDToCurrency(priceDZD, currency);
  const formattedConverted = converted.toLocaleString('fr-FR');

  if (currency === 'EUR') {
    return `${formattedConverted} €`;
  }
  if (currency === 'CAD') {
    return `${formattedConverted} $ CAD`;
  }
  if (currency === 'USD') {
    return `${formattedConverted} $ USD`;
  }

  return `${formattedConverted} ${currency}`;
}

export function getDiasporaPriceSummary(priceDZD: number): { eur: string; cad: string; usd: string } {
  const rawEur = priceDZD / EXCHANGE_RATES.EUR;
  const rawCad = priceDZD / EXCHANGE_RATES.CAD;
  const rawUsd = priceDZD / EXCHANGE_RATES.USD;

  const eur = roundToNearestThousand(rawEur).toLocaleString('fr-FR');
  const cad = roundToNearestThousand(rawCad).toLocaleString('fr-FR');
  const usd = roundToNearestThousand(rawUsd).toLocaleString('fr-FR');

  return {
    eur: `${eur} €`,
    cad: `${cad} $ CAD`,
    usd: `${usd} $ USD`
  };
}
