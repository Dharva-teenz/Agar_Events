import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
dotenv.config({path:fileURLToPath(new URL('../.env',import.meta.url))});
export const serverRoot=fileURLToPath(new URL('../',import.meta.url));
export const clientDist=fileURLToPath(new URL('../../client/dist/',import.meta.url));
export const uploadDir=path.join(serverRoot,'uploads');
export const config={
  port:Number(process.env.PORT)||5000,
  production:process.env.NODE_ENV==='production',
  mongoUri:process.env.MONGO_URI||'mongodb://127.0.0.1:27017/agar_events',
  jwtSecret:process.env.JWT_SECRET||'',
  origins:(process.env.CLIENT_ORIGIN||'http://127.0.0.1:5173,http://localhost:5173').split(',').map(s=>s.trim()).filter(Boolean),
  trustProxy:Math.max(0,Number(process.env.TRUST_PROXY)||0),
  adminEmail:process.env.ADMIN_EMAIL||'',adminPassword:process.env.ADMIN_PASSWORD||'',
  cloudinary:{cloudName:process.env.CLOUDINARY_CLOUD_NAME||'',apiKey:process.env.CLOUDINARY_API_KEY||'',apiSecret:process.env.CLOUDINARY_API_SECRET||''}
};
export function validateConfig(){
  if(config.jwtSecret.length<48) throw new Error('JWT_SECRET must contain at least 48 random characters. Run npm run setup.');
  if(config.production && config.origins.some(o=>!o.startsWith('https://'))) throw new Error('Production CLIENT_ORIGIN must use HTTPS.');
  if(config.production && (!config.cloudinary.cloudName||!config.cloudinary.apiKey||!config.cloudinary.apiSecret))throw new Error('Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET for persistent production uploads.');
}
