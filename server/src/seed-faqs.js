import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { config } from './config.js';
import { FAQ } from './models.js';
import { initialFAQs } from '../../shared/faqs.js';

export async function seedFAQs(){
  for(const [index,faq] of initialFAQs.entries()){
    const seedKey=`initial-faq-${index+1}`;
    await FAQ.updateOne({seedKey},{$setOnInsert:{...faq,seedKey}},{upsert:true,runValidators:true});
  }
}

// Can also initialize an existing site without changing its admin or other content.
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    await mongoose.connect(config.mongoUri,{serverSelectionTimeoutMS:10000});
    await seedFAQs();
    console.log('Initial FAQs are ready. Existing FAQ edits were preserved.');
  }finally{await mongoose.disconnect();}
}
