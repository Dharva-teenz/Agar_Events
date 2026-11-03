/** Content derived from the user-approved visual, not a verified social account.
 * Reference photos are supplied concept artwork, not evidence of real client work.
 * Real public reviews are never seeded into MongoDB.
 */
import { initialFAQs } from './faqs.js';
export const defaultSettings = {
  businessName: 'Agar Events', city: 'Trichy', address: 'Koothappar, Tiruchirappalli, Tamil Nadu - 620013, India',
  locationDisplay:'Koothappar, Trichy', mapsSearchUrl:'https://www.google.com/maps/search/?api=1&query=Koothappar%2C%20Tiruchirappalli%2C%20Tamil%20Nadu%2C%20India', mapsEmbedUrl:'https://maps.google.com/maps?q=Koothappar%2C%20Tiruchirappalli%2C%20Tamil%20Nadu%2C%20India&t=&z=14&ie=UTF8&iwloc=&output=embed', directionsDestination:'Koothappar, Tiruchirappalli, Tamil Nadu, India',
  phone: '1234567890', whatsapp: '917449189676', email: '', instagram: 'https://www.instagram.com/_agarevents_/', storyUrl: '',
  heroTitle: ['Events', 'Beyond', 'Expectations'],
  heroSubtitle: 'From dreams to unforgettable celebrations. Agar Events - Trichy.',
  heroImage: '/media/hero.webp', aboutImage: '/media/about.webp',
  aboutText: 'Every celebration starts with a story. We bring the details together with thoughtful planning, beautiful settings and a personal touch. From weddings and engagements to birthdays and family gatherings, let\'s create a celebration that feels like you.',
  aboutNote: 'Your moments. Our creations.',
  showReferenceGallery: true
};
export const serviceTemplates = [
  { slug:'weddings', title:'Wedding Events', subtitle:'Traditional & modern weddings', icon:'rings', coverImage:'/media/wedding.webp', description:'A setting for your most meaningful celebration. Bring your wedding ideas together, from the ceremony backdrop to the little details that make the day yours.', features:['Ceremony and stage concepts','Floral and lighting concepts','Guest-flow planning','Personalised event coordination'] },
  { slug:'engagements', title:'Engagement Events', subtitle:'A perfect start to forever', icon:'heart', coverImage:'/media/engagement.webp', description:'Mark a beautiful beginning with an intimate, thoughtfully styled celebration. Share your colours, your story and your favourite details with our team.', features:['Engagement stage concepts','Floral backdrops','Welcome and photo corners','Celebration planning'] },
  { slug:'birthdays', title:'Birthday Parties', subtitle:'Make every birthday special', icon:'gift', coverImage:'/media/birthday.webp', description:'From playful themes to elegant milestone parties, explore a celebration built around the person at its heart.', features:['Personalised theme concepts','Balloon and backdrop styling','Cake-table concepts','Party coordination'] },
  { slug:'corporate', title:'Corporate Events', subtitle:'Thoughtful event management', icon:'users', coverImage:'/media/corporate.webp', description:'Bring people together in a setting that reflects your occasion, from team celebrations to formal gatherings. Discuss the format, venue and requirements with us.', features:['Event format planning','Stage and venue styling','Guest-flow coordination','Brand-aligned concepts'] },
  { slug:'family-functions', title:'Family Functions', subtitle:'Cherished moments together', icon:'home', coverImage:'/media/family.webp', description:'Celebrate the occasions that bring your family closer. Share your traditions and preferences so every detail feels personal.', features:['Traditional decor concepts','Intimate celebration settings','Welcome and seating plans','Personalised coordination'] },
  { slug:'theme-events', title:'Theme Events', subtitle:'Unique ideas, memorable experiences', icon:'star', coverImage:'/media/theme.webp', description:'A colour, a mood, a favourite idea - make it the starting point for a celebration with its own character.', features:['Custom theme exploration','Creative backdrop concepts','Lighting and styling ideas','Coordinated event details'] }
].map((s,i)=>({...s, _id: `demo-service-${i+1}`, active:true, sortOrder:i}));
export const exampleEvents = serviceTemplates.map((s,i)=>({
  _id: `demo-event-${i+1}`, service:s._id, serviceSlug:s.slug, serviceTitle:s.title,
  title: ['A golden evening','The beginning of forever','A little birthday magic','An evening together','Traditions, beautifully celebrated','A night of possibilities'][i],
  description: 'Reference design imagery from the approved website concept. This is not a photograph of a verified Agar Events client event.',
  location:'Trichy', eventDate:'', coverImage:['/media/couple.webp','/media/engagement-detail.webp','/media/birthday-detail.webp','/media/corporate-detail.webp','/media/family.webp','/media/theme-detail.webp'][i],
  images:[{url:s.coverImage,alt:s.title+' reference decor'}, {url:['/media/couple.webp','/media/engagement-detail.webp','/media/birthday-detail.webp','/media/corporate-detail.webp','/media/family.webp','/media/theme-detail.webp'][i],alt:s.title+' reference detail'}],
  featured:i!==4,published:true,isDemo:true
}));
export const exampleReviews = [
  {_id:'example-review-1',name:'Priya & Arjun',rating:5,comment:'Agar Events made our wedding day truly magical. Every detail was perfectly planned and executed.',serviceTitle:'Wedding Event',isDemo:true},
  {_id:'example-review-2',name:'Karthik & Divya',rating:5,comment:'Professional, creative and very supportive. Our engagement event was exactly how we imagined.',serviceTitle:'Engagement Event',isDemo:true},
  {_id:'example-review-3',name:'Suresh Kumar',rating:5,comment:'Excellent coordination and unique ideas. A beautiful setting for a memorable celebration.',serviceTitle:'Corporate Event',isDemo:true}
];
export const designSite = {settings:defaultSettings,services:serviceTemplates,events:exampleEvents,reviews:exampleReviews,faqs:initialFAQs.map((faq,index)=>({...faq,_id:`demo-faq-${index+1}`})),designMode:true};
