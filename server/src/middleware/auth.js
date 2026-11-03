import jwt from 'jsonwebtoken';
import { timingSafeEqual } from 'node:crypto';
import { Admin } from '../models.js';
import { config } from '../config.js';
export const cookieName='agar_session';
export const cookieOptions=()=>({httpOnly:true,secure:config.production,sameSite:config.production?'none':'strict',path:'/api',maxAge:8*60*60*1000});
export async function requireAdmin(req,res,next){
  try {
    const token=req.cookies[cookieName];
    if(!token)return res.status(401).json({error:'Please sign in to continue.'});
    const payload=jwt.verify(token,config.jwtSecret,{algorithms:['HS256'],issuer:'agar-events',audience:'agar-admin'});
    const admin=await Admin.findById(payload.sub).lean();
    if(!admin || admin.authVersion!==payload.version)return res.status(401).json({error:'Session expired. Please sign in again.'});
    req.admin=admin;req.session=payload;next();
  }catch(error){
    if(['JsonWebTokenError','TokenExpiredError','CastError'].includes(error.name))return res.status(401).json({error:'Session expired. Please sign in again.'});
    next(error);
  }
}
export function requireCSRF(req,res,next){
  if(['GET','HEAD','OPTIONS'].includes(req.method))return next();
  const expected=Buffer.from(req.session.csrf||'');
  const received=Buffer.from(String(req.get('x-csrf-token')||''));
  if(!expected.length || expected.length!==received.length || !timingSafeEqual(expected,received))return res.status(403).json({error:'Security token expired. Refresh and sign in again.'});
  next();
}
export function checkOrigin(req,res,next){
  if(['GET','HEAD','OPTIONS'].includes(req.method))return next();
  if(!config.origins.includes(req.get('origin')))return res.status(403).json({error:'This origin is not allowed.'});
  next();
}
