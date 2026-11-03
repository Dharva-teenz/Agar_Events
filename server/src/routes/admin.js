import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { Service,Event,Review,Enquiry,Settings,FAQ } from '../models.js';
import { requireAdmin,requireCSRF } from '../middleware/auth.js';
import { uploadDir } from '../config.js';
import { getSettings } from './public.js';
import { id,InputError,parseService,parseEvent,parseSettings,parseStatus,parseFAQ } from '../../../shared/validation.js';
export const adminRouter=Router();adminRouter.use(requireAdmin,requireCSRF);
function pageParams(req){
  const page=Math.max(1,Math.min(10000,Number.parseInt(req.query.page,10)||1));
  const limit=Math.max(1,Math.min(100,Number.parseInt(req.query.limit,10)||50));
  return {page,limit};
}
async function list(Model,req,query={},populate,sort={createdAt:-1}){
  const {page,limit}=pageParams(req);
  let cursor=Model.find(query).sort(sort).skip((page-1)*limit).limit(limit);
  if(populate)cursor=cursor.populate(populate);
  const [items,total]=await Promise.all([cursor.lean(),Model.countDocuments(query)]);
  return {items,total,page,pages:Math.max(1,Math.ceil(total/limit))};
}
async function updated(Model,recordId,data){
  const record=await Model.findByIdAndUpdate(id(recordId),{$set:data},{new:true,runValidators:true});
  if(!record)throw new InputError('Record not found.',404);return record;
}
async function existingService(serviceId){if(!await Service.exists({_id:serviceId}))throw new InputError('Selected service does not exist.');}
adminRouter.get('/overview',async(req,res)=>{
  const [services,events,pendingReviews,enquiries,newEnquiries,recent]=await Promise.all([
    Service.countDocuments(),Event.countDocuments(),Review.countDocuments({status:'pending'}),Enquiry.countDocuments(),
    Enquiry.countDocuments({status:'new'}),Enquiry.find().populate('service','title').sort({createdAt:-1}).limit(6).lean()
  ]);res.json({services,events,pendingReviews,enquiries,newEnquiries,recent});
});
adminRouter.get('/services',async(req,res)=>res.json(await list(Service,req)));
adminRouter.post('/services',async(req,res)=>res.status(201).json(await Service.create(parseService(req.body))));
adminRouter.put('/services/:id',async(req,res)=>res.json(await updated(Service,req.params.id,parseService(req.body))));
adminRouter.delete('/services/:id',async(req,res)=>{
  const serviceId=id(req.params.id);const service=await Service.findById(serviceId).lean();
  if(!service)throw new InputError('Service not found.',404);
  const history={service:null,serviceName:service.title};
  await Promise.all([
    Event.updateMany({service:serviceId},{$set:history}),
    Review.updateMany({service:serviceId},{$set:history}),
    Enquiry.updateMany({service:serviceId},{$set:history})
  ]);
  await Service.findByIdAndDelete(serviceId);
  res.json({ok:true});
});
adminRouter.get('/events',async(req,res)=>res.json(await list(Event,req,{},'service')));
adminRouter.post('/events',async(req,res)=>{const data=parseEvent(req.body);await existingService(data.service);res.status(201).json(await Event.create(data));});
adminRouter.put('/events/:id',async(req,res)=>{const data=parseEvent(req.body);await existingService(data.service);res.json(await updated(Event,req.params.id,data));});
adminRouter.delete('/events/:id',async(req,res)=>{const item=await Event.findByIdAndDelete(id(req.params.id));if(!item)throw new InputError('Event not found.',404);res.json({ok:true});});
adminRouter.get('/reviews',async(req,res)=>res.json(await list(Review,req,{},'service')));
adminRouter.patch('/reviews/:id',async(req,res)=>res.json(await updated(Review,req.params.id,{status:parseStatus(req.body,['pending','approved','rejected'])})));
adminRouter.delete('/reviews/:id',async(req,res)=>{const item=await Review.findByIdAndDelete(id(req.params.id));if(!item)throw new InputError('Review not found.',404);res.json({ok:true});});
adminRouter.get('/enquiries',async(req,res)=>res.json(await list(Enquiry,req,{},'service')));
adminRouter.patch('/enquiries/:id',async(req,res)=>res.json(await updated(Enquiry,req.params.id,{status:parseStatus(req.body,['new','contacted','confirmed','closed'])})));
adminRouter.delete('/enquiries/:id',async(req,res)=>{const item=await Enquiry.findByIdAndDelete(id(req.params.id));if(!item)throw new InputError('Enquiry not found.',404);res.json({ok:true});});
adminRouter.get('/settings',async(req,res)=>res.json(await getSettings()));
adminRouter.get('/faqs',async(req,res)=>res.json(await list(FAQ,req,{},undefined,{sortOrder:1,_id:1})));
adminRouter.post('/faqs',async(req,res)=>res.status(201).json(await FAQ.create(parseFAQ(req.body))));
adminRouter.put('/faqs/:id',async(req,res)=>res.json(await updated(FAQ,req.params.id,parseFAQ(req.body))));
adminRouter.delete('/faqs/:id',async(req,res)=>{
  const item=await FAQ.findByIdAndDelete(id(req.params.id));
  if(!item)throw new InputError('FAQ not found.',404);
  res.json({ok:true});
});
adminRouter.put('/settings',async(req,res)=>{
  const value=parseSettings(req.body);await Settings.findOneAndUpdate({key:'public'},{$set:{value}},{upsert:true,new:true,runValidators:true});res.json(value);
});
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024,files:1},fileFilter:(req,file,cb)=>{
  if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.mimetype))return cb(new InputError('Upload a JPEG, PNG, WebP or AVIF image. SVG and other files are not accepted.'));
  cb(null,true);
}});
adminRouter.post('/uploads',upload.single('image'),async(req,res)=>{
  if(!req.file)throw new InputError('Choose an image to upload.');
  await mkdir(uploadDir,{recursive:true});const filename=`${randomUUID()}.webp`;
  try{
    await sharp(req.file.buffer,{limitInputPixels:40000000,animated:false}).rotate().resize({width:2200,height:2200,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile(path.join(uploadDir,filename));
  }catch{throw new InputError('Image cannot be processed. Choose a valid image below 8 MB and 40 megapixels.');}
  res.status(201).json({url:`/uploads/${filename}`});
});
