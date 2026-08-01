export function formatDZD(amount: number, isShort: boolean = false): string {
  if (isNaN(amount) || amount === null) return "0 DZD";
  
  if (isShort) {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(2)} Mds DZD`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} M DZD`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)} k DZD`;
    }
  }

  // Format with space separators e.g. 18 500 000 DZD
  const formattedNumber = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${formattedNumber} DZD`;
}

export function formatPricePerM2(pricePerM2: number): string {
  const formatted = Math.round(pricePerM2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} DZD / m²`;
}

export function formatSurface(m2: number): string {
  return `${m2} m²`;
}
