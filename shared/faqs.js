export const initialFAQs = [
  {
    question: 'What types of events does Agar Events organize?',
    answer: 'We offer event planning and decoration services for weddings, engagements, birthdays, family celebrations, corporate events, and themed occasions. Contact our team to discuss your specific requirements.'
  },
  {
    question: 'How can I book an event with Agar Events?',
    answer: 'Select your preferred service, complete the enquiry form, and continue to WhatsApp. Our team can then discuss your event requirements and availability.'
  },
  {
    question: 'Can I customize the decorations for my event?',
    answer: 'You can share your preferred theme, colours, decoration ideas, and other requirements with our team. Customization options can be discussed based on your event needs.'
  },
  {
    question: 'How early should I contact Agar Events?',
    answer: 'We recommend contacting us as early as possible, especially for weddings and major celebrations. Availability depends on your event date.'
  },
  {
    question: 'Do you provide event services outside Trichy?',
    answer: 'Please contact our team with your event location to confirm service availability and travel arrangements.'
  },
  {
    question: 'How much does event decoration cost?',
    answer: 'Pricing depends on the event type, venue, decorations, and other requirements. Share your event details through WhatsApp to request a quotation.'
  }
].map((faq, index) => ({ ...faq, active: true, sortOrder: index + 1 }));
