import {v2 as cloudinary} from 'cloudinary';
import {config} from './config.js';

export const cloudinaryEnabled=Boolean(config.cloudinary.cloudName&&config.cloudinary.apiKey&&config.cloudinary.apiSecret);
if(cloudinaryEnabled)cloudinary.config({cloud_name:config.cloudinary.cloudName,api_key:config.cloudinary.apiKey,api_secret:config.cloudinary.apiSecret,secure:true});
export function uploadImage(buffer){
 if(!cloudinaryEnabled)throw new Error('Cloudinary is not configured.');
 return new Promise((resolve,reject)=>{const stream=cloudinary.uploader.upload_stream({folder:'agar-events/images',resource_type:'image'},(error,result)=>error?reject(error):resolve({url:result.secure_url,assetId:result.public_id,width:result.width,height:result.height,bytes:result.bytes}));stream.end(buffer);});
}
