import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config,validateConfig } from './config.js';
import { Admin,Service,Event,Settings } from './models.js';
import { defaultSettings,serviceTemplates,exampleEvents } from '../../shared/catalog.js';
import { seedFAQs } from './seed-faqs.js';
validateConfig();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.adminEmail))throw new Error('ADMIN_EMAIL must be a valid email address in server/.env.');
if(config.adminPassword.length<12 || Buffer.byteLength(config.adminPassword)>72)throw new Error('ADMIN_PASSWORD in server/.env must be 12-72 UTF-8 bytes. It is never printed or stored in plaintext.');
try{
  await mongoose.connect(config.mongoUri,{serverSelectionTimeoutMS:10000});
  const email=config.adminEmail.toLowerCase();
  if(!await Admin.exists({email})){await Admin.create({email,passwordHash:await bcrypt.hash(config.adminPassword,12)});console.log('Initial admin created.');}
  else console.log('Admin already exists; password was not overwritten.');
  await Settings.updateOne({key:'public'},{$setOnInsert:{value:defaultSettings}},{upsert:true});
  for(const [index,template] of serviceTemplates.entries()){
    const {_id,...data}=template;
    const service=await Service.findOneAndUpdate({slug:template.slug},{$setOnInsert:data},{upsert:true,new:true});
    const {_id:eventId,service:demoService,serviceSlug,serviceTitle,...event}=exampleEvents[index];
    await Event.updateOne({seedKey:`reference-${template.slug}`},{$setOnInsert:{...event,service:service._id,seedKey:`reference-${template.slug}`}},{upsert:true});
  }
  await seedFAQs();
  console.log('Six services, labelled reference galleries and initial FAQs are ready. No customer reviews, phone number or business metrics were invented.');
}finally{await mongoose.disconnect();}
