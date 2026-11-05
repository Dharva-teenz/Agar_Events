import mongoose from 'mongoose';
import {readFile,access} from 'node:fs/promises';
import {constants as fsConstants} from 'node:fs';
import path from 'node:path';
import {config,uploadDir} from './config.js';
import {Service,Event,Settings,MediaAsset} from './models.js';
import {cloudinaryEnabled,uploadImage} from './media-storage.js';

const apply=process.argv.includes('--apply');
const localPattern=/^\/uploads\/([a-zA-Z0-9-]+\.webp)$/;
const cache=new Map();
const counts={found:0,missing:0,uploaded:0,recordsChanged:0};

function filenameFrom(value){return typeof value==='string'?value.match(localPattern)?.[1]||null:null;}
async function localExists(filename){try{await access(path.join(uploadDir,filename),fsConstants.R_OK);return true;}catch{return false;}}
async function convert(url){
  if(cache.has(url))return cache.get(url);
  const filename=filenameFrom(url);
  if(!filename)return null;
  if(!await localExists(filename)){counts.missing++;console.log(`Missing local media (left unchanged): ${url}`);cache.set(url,null);return null;}
  counts.found++;
  if(!apply){console.log(`Would migrate: ${url}`);const planned={url,assetId:''};cache.set(url,planned);return planned;}
  const result=await uploadImage(await readFile(path.join(uploadDir,filename)));
  await MediaAsset.updateOne({url:result.url},{$setOnInsert:{assetId:result.assetId,resourceType:'image'}},{upsert:true});
  counts.uploaded++;cache.set(url,result);return result;
}
async function migrateServices(){for(const service of await Service.find({coverImage:/^\/uploads\//}).select('_id coverImage').lean()){
  const result=await convert(service.coverImage);if(result&&apply){await Service.updateOne({_id:service._id},{$set:{coverImage:result.url,coverAssetId:result.assetId}});counts.recordsChanged++;}
}}
async function migrateEvents(){for(const event of await Event.find({$or:[{coverImage:/^\/uploads\//},{'images.url':/^\/uploads\//}]}).select('_id coverImage coverAssetId images').lean()){
  const cover=await convert(event.coverImage);const images=[];let changed=Boolean(cover);
  for(const image of event.images||[]){const result=await convert(image.url);images.push(result?{...image,url:result.url,assetId:result.assetId}:image);changed||=Boolean(result);}
  if(changed&&apply){const updates={images};if(cover){updates.coverImage=cover.url;updates.coverAssetId=cover.assetId;}await Event.updateOne({_id:event._id},{$set:updates});counts.recordsChanged++;}
}}
async function replaceSettings(value){
  if(typeof value==='string'){const result=await convert(value);return {value:result?result.url:value,changed:Boolean(result)};}
  if(Array.isArray(value)){let changed=false;const values=[];for(const item of value){const next=await replaceSettings(item);values.push(next.value);changed||=next.changed;}return {value:values,changed};}
  if(value&&typeof value==='object'){let changed=false;const values={};for(const [key,item] of Object.entries(value)){const next=await replaceSettings(item);values[key]=next.value;changed||=next.changed;}return {value:values,changed};}
  return {value,changed:false};
}
async function migrateSettings(){for(const setting of await Settings.find({}).lean()){const result=await replaceSettings(setting.value);if(result.changed&&apply){await Settings.updateOne({_id:setting._id},{$set:{value:result.value}});counts.recordsChanged++;}}}

if(!cloudinaryEnabled)throw new Error('Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET before running this migration.');
try{await mongoose.connect(config.mongoUri,{serverSelectionTimeoutMS:10000});await migrateServices();await migrateEvents();await migrateSettings();console.log(JSON.stringify({mode:apply?'apply':'dry-run',...counts}));if(!apply)console.log('Dry run only. Re-run with --apply after reviewing this list.');}
finally{await mongoose.disconnect();}
