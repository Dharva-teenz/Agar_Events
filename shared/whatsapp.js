/** wa.me only drafts a message. It does not send or confirm delivery. */
export function normalizeWhatsApp(value) {
  return String(value || '').replace(/[^0-9]/g, '');
}
export function buildEnquiryMessage(input, serviceTitle, reference='') {
  return [
    'Hello Agar Events! I would like to plan an event.', '',
    `Service: ${serviceTitle || 'To be discussed'}`,
    `Name: ${input.name}`, `Phone: ${input.phone}`,
    `Event date: ${input.eventDate || 'To be confirmed'}`,
    `Location: ${input.location}`,
    `Guests: ${input.guests || 'To be discussed'}`,
    `Budget: ${input.budget || 'To be discussed'}`,
    `Requirements: ${input.message || 'To be discussed'}`,
    ...(reference ? ['', `Website enquiry: ${reference}`] : [])
  ].join('\n');
}
export function buildWhatsAppUrl(number, message) {
  const digits=normalizeWhatsApp(number);
  if (!/^[1-9][0-9]{9,14}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
export function localISODate(now=new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
