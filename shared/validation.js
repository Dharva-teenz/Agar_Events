import { normalizeWhatsApp } from './whatsapp.js';

export class InputError extends Error {
  constructor(message, status=400) { super(message); this.name='InputError'; this.status=status; }
}
const fail=(message)=>{ throw new InputError(message); };
function object(value) {
  if (!value || Array.isArray(value) || typeof value!=='object') fail('A JSON object is required.');
  return value;
}
function text(value,label,min=0,max=200, fallback='') {
  const raw=value===undefined ? fallback : value;
  if(typeof raw!=='string') fail(`${label} must be text.`);
  const result=raw.trim();
  if(result.length<min || result.length>max) fail(`${label} must contain ${min}-${max} characters.`);
  return result;
}
function boolean(value,label,fallback=false) {
  if(value===undefined) return fallback;
  if(typeof value!=='boolean') fail(`${label} must be true or false.`);
  return value;
}
function integer(value,label,min,max,fallback) {
  if((value===undefined || value==='') && fallback!==undefined) return fallback;
  if(typeof value!=='number' || !Number.isSafeInteger(value) || value<min || value>max) fail(`${label} must be a whole number between ${min} and ${max}.`);
  return value;
}
export function id(value,label='ID') {
  const result=text(value,label,24,24);
  if(!/^[a-f0-9]{24}$/i.test(result)) fail(`Invalid ${label}.`);
  return result;
}
export function imageURL(value,label='Image') {
  const result=text(value,label,0,2000);
  if(!result) return '';
  if(/^\/(media|uploads)\/[a-zA-Z0-9_-]+\.(webp|avif|jpe?g|png)$/i.test(result)) return result;
  try {
    const u=new URL(result);
    if(u.protocol==='https:' && !u.username && !u.password) return u.href;
  } catch { /* reject malformed input below */ }
  fail(`${label} must be an HTTPS image URL or a local /media/ or /uploads/ image.`);
}
function externalURL(value,label,host) {
  const result=text(value,label,0,2000);
  if(!result) return '';
  try {
    const u=new URL(result);
    if(u.protocol==='https:' && !u.username && !u.password && (!host || host.test(u.hostname))) return u.href;
  } catch { /* rejected below */ }
  fail(`${label} must be a valid HTTPS URL${host?' on the expected service':''}.`);
}
function mapsURL(value,label,embed=false){const result=text(value,label,0,2000);if(!result)return '';try{const u=new URL(result);if(u.protocol==='https:'&&!u.username&&!u.password&&(/(^|\.)google\.com$/i.test(u.hostname)||/(^|\.)google\.co\.in$/i.test(u.hostname)||/(^|\.)googleapis\.com$/i.test(u.hostname))&&(!embed||u.pathname.startsWith('/maps')))return u.href;}catch{}fail(`${label} must be a safe Google Maps URL.`);}
function stringArray(value,label,maxItems=8,maxLength=140) {
  if(!Array.isArray(value) || value.length>maxItems) fail(`${label} must be a list of at most ${maxItems} entries.`);
  return value.map(v=>text(v,label,1,maxLength));
}
export function todayInIndia(now=new Date()) {
  return new Date(now.getTime()+330*60*1000).toISOString().slice(0,10);
}
export function dateOnly(value,label='Event date',allowPast=true,now=new Date()) {
  const result=text(value,label,0,10);
  if(!result) return '';
  if(!/^\d{4}-\d{2}-\d{2}$/.test(result)) fail(`${label} must use YYYY-MM-DD.`);
  const date=new Date(`${result}T00:00:00.000Z`);
  if(!Number.isFinite(date.getTime()) || date.toISOString().slice(0,10)!==result) fail(`${label} is not a real date.`);
  if(!allowPast && result<todayInIndia(now)) fail(`${label} cannot be in the past.`);
  return result;
}
function honeypot(data) {
  if(data.website!==undefined && data.website!=='') fail('Submission could not be accepted.');
}
function consent(value) { if(value!==true) fail('Please agree to the privacy notice before continuing.'); }
function phone(value,label='Phone',required=true) {
  const result=text(value,label,required?7:0,25);
  if(!result && !required) return '';
  const digits=result.replace(/\D/g,'');
  if(!/^\+?[0-9 ()-]+$/.test(result) || digits.length<10 || digits.length>15) fail(`${label} must contain 10-15 digits, including country code where needed.`);
  return result;
}
export function parseLogin(raw) {
  const d=object(raw);const email=text(d.email,'Email',3,254).toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Enter a valid email address.');
  return {email,password:text(d.password,'Password',1,128)};
}
export function parseService(raw) {
  const d=object(raw);const slug=text(d.slug,'URL slug',2,80);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail('Use lowercase letters, numbers and single hyphens in the URL slug.');
  const icon=text(d.icon,'Icon',1,20,'rings');
  if(!['rings','heart','gift','users','home','star','diamond','flower'].includes(icon)) fail('Choose a supported service icon.');
  return { title:text(d.title,'Service title',2,100),slug,subtitle:text(d.subtitle,'Subtitle',0,150),
    description:text(d.description,'Description',0,3000),coverImage:imageURL(d.coverImage),icon,
    features:stringArray(d.features||[],'Service features'),active:boolean(d.active,'Active',true),
    sortOrder:integer(d.sortOrder,'Display order',0,999,0) };
}
export function parseEvent(raw) {
  const d=object(raw);
  if(!Array.isArray(d.images) || d.images.length<1 || d.images.length>30) fail('Add between 1 and 30 event photos.');
  const images=d.images.map(v=>{object(v); const url=imageURL(v.url);if(!url)fail('Photo URL is required.');return {url,alt:text(v.alt,'Photo description',1,200)};});
  return { service:id(d.service,'Service'),title:text(d.title,'Event title',2,120),
    description:text(d.description,'Event description',0,3000),location:text(d.location,'Location',0,160),
    eventDate:dateOnly(d.eventDate),coverImage:imageURL(d.coverImage)||images[0].url,images,
    featured:boolean(d.featured,'Featured'),published:boolean(d.published,'Published',true),isDemo:boolean(d.isDemo,'Reference artwork') };
}
export function parseReview(raw) {
  const d=object(raw);honeypot(d);consent(d.consent);
  return {name:text(d.name,'Your name',2,80),service:d.service?id(d.service,'Service'):undefined,
    rating:integer(d.rating,'Rating',1,5),comment:text(d.comment,'Review',10,1200),consent:true};
}
export function parseEnquiry(raw,now=new Date()) {
  const d=object(raw);honeypot(d);consent(d.consent);
  return {name:text(d.name,'Your name',2,100),phone:phone(d.phone),service:id(d.service,'Service'),
    eventDate:dateOnly(d.eventDate,'Event date',false,now),location:text(d.location,'Location',2,160),
    guests:integer(d.guests,'Guest count',0,100000,0),budget:text(d.budget,'Budget',0,100),
    message:text(d.message,'Requirements',0,2000),consent:true};
}
export function parseSettings(raw) {
  const d=object(raw); const whatsapp=normalizeWhatsApp(text(d.whatsapp,'WhatsApp number',0,25));
  if(whatsapp && !/^[1-9][0-9]{9,14}$/.test(whatsapp)) fail('WhatsApp needs a country code and 10-15 digits.');
  const email=text(d.email,'Business email',0,254);
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Enter a valid business email.');
  const heroTitle=stringArray(d.heroTitle,'Hero title lines',3,35);
  if(heroTitle.length!==3)fail('Use exactly three short hero title lines.');
  return {businessName:text(d.businessName,'Business name',2,80),city:text(d.city,'City',2,80),
    address:text(d.address,'Address',2,300),locationDisplay:text(d.locationDisplay,'Location display text',2,200),mapsSearchUrl:mapsURL(d.mapsSearchUrl,'Google Maps search URL'),mapsEmbedUrl:mapsURL(d.mapsEmbedUrl,'Google Maps embed URL',true),directionsDestination:text(d.directionsDestination,'Directions destination',2,300),phone:phone(d.phone,'Business phone',false),whatsapp,email,
    instagram:externalURL(d.instagram,'Instagram',/^(www\.)?instagram\.com$/),
    storyUrl:externalURL(d.storyUrl,'Story video'),heroTitle,
    heroSubtitle:text(d.heroSubtitle,'Hero subtitle',2,250),heroImage:imageURL(d.heroImage),aboutImage:imageURL(d.aboutImage),
    aboutText:text(d.aboutText,'About text',10,3000),aboutNote:text(d.aboutNote,'About note',0,140),
    showReferenceGallery:boolean(d.showReferenceGallery,'Show reference gallery',true)};
}
export function parseStatus(raw,choices) {
  const d=object(raw);if(!choices.includes(d.status))fail('Invalid status.');return d.status;
}
export function parseFAQ(raw) {
  const d=object(raw);
  return {
    question:text(d.question,'Question',5,240),
    answer:text(d.answer,'Answer',5,4000),
    active:boolean(d.active,'Active',true),
    sortOrder:integer(d.sortOrder,'Display order',0,9999,0)
  };
}
export function parsePassword(raw) {
  const d=object(raw);const currentPassword=text(d.currentPassword,'Current password',1,128);
  const newPassword=text(d.newPassword,'New password',12,128);
  if(Buffer.byteLength(newPassword,'utf8')>72) fail('New password must be at most 72 UTF-8 bytes.');
  if(currentPassword===newPassword)fail('Choose a different new password.');
  return {currentPassword,newPassword};
}
