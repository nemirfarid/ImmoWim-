export function formatPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '213' + cleaned.substring(1);
  } else if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  } else if (!cleaned.startsWith('213')) {
    cleaned = '213' + cleaned;
  }
  return cleaned;
}

export function getWhatsAppLink(phone: string, textMessage: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(textMessage);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

export function getTelLink(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  return `tel:${cleaned}`;
}

export function getSmsLink(phone: string, textMessage: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  const encodedText = encodeURIComponent(textMessage);
  return `sms:${cleaned}?body=${encodedText}`;
}
