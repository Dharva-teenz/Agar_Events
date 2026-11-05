import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { Service,Event,Review,Enquiry,Settings,FAQ } from '../models.js';
import { defaultSettings } from '../../../shared/catalog.js';
import { id,parseReview,parseEnquiry } from '../../../shared/validation.js';
import { buildEnquiryMessage,buildWhatsAppUrl } from '../../../shared/whatsapp.js';
export const publicRouter=Router();
const submitLimit=rateLimit({windowMs:60*60*1000,limit:12,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many submissions. Please try again later.'}});
export async function getSettings(){return {...defaultSettings,...(await Settings.findOne({key:'public'}).lean())?.value};}
async function activeService(serviceId){
  const service=await Service.findOne({_id:id(serviceId,'Service'),active:true}).lean();
  return service;
}
export function publicEvent(event,serviceMap){
  const service=serviceMap.get(String(event.service));
  return {...event,serviceSlug:service?.slug,serviceTitle:service?.title||event.serviceName};
}
publicRouter.get('/site',async(req,res)=>{
  const [settings,services,reviews,faqs]=await Promise.all([
    getSettings(),Service.find({active:true}).sort({sortOrder:1,title:1}).lean(),
    Review.find({status:'approved'}).select('name rating comment service createdAt').populate('service','title').sort({createdAt:-1}).limit(100).lean(),
    getPublicFAQs()
  ]);
  const eventQuery={published:true,service:{$in:services.map(s=>s._id)}};
  if(!settings.showReferenceGallery)eventQuery.isDemo={$ne:true};
  const events=await Event.find(eventQuery).select('-seedKey').sort({featured:-1,createdAt:-1}).limit(200).lean();
  const serviceMap=new Map(services.map(s=>[String(s._id),s]));
  res.json({settings,services,events:events.map(event=>publicEvent(event,serviceMap)),reviews:reviews.map(r=>({...r,serviceTitle:r.service?.title||r.serviceName||'Celebration',service:r.service?._id})),faqs,designMode:false});
});
export function getPublicFAQs(){
  return FAQ.find({active:true}).select('question answer sortOrder').sort({sortOrder:1,_id:1}).lean();
}
publicRouter.get('/faqs',async(req,res)=>res.json(await getPublicFAQs()));
publicRouter.get('/events/:id',async(req,res)=>{
  const settings=await getSettings();
  const event=await Event.findOne({_id:id(req.params.id),published:true,...(!settings.showReferenceGallery?{isDemo:{$ne:true}}:{})}).select('-seedKey').lean();
  if(!event)return res.status(404).json({error:'Event not found.'});
  const service=await activeService(String(event.service));
  if(!service)return res.status(404).json({error:'Event not found.'});
  res.json({...event,serviceSlug:service.slug,serviceTitle:service.title});
});
publicRouter.post('/reviews',submitLimit,async(req,res)=>{
  const data=parseReview(req.body);
  if(data.service && !await activeService(data.service))return res.status(400).json({error:'Please choose an available service.'});
  const review=await Review.create({...data,status:'pending'});
  res.status(201).json({id:review.id,message:'Thank you. Your review will appear after admin approval.'});
});
publicRouter.post('/enquiries',submitLimit,async(req,res)=>{
  const data=parseEnquiry(req.body);const service=await activeService(data.service);
  if(!service)return res.status(400).json({error:'Please choose an available service.'});
  const enquiry=await Enquiry.create(data);const settings=await getSettings();
  const reference=`AG-${enquiry.id.slice(-8).toUpperCase()}`;
  const message=buildEnquiryMessage(data,service.title,reference);
  res.status(201).json({id:enquiry.id,reference,message,whatsappUrl:buildWhatsAppUrl(settings.whatsapp,message),notice:'Enquiry saved. Sending a WhatsApp message and confirming a booking are separate actions.'});
});
