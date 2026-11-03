import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { rateLimit } from 'express-rate-limit';
import { Admin } from '../models.js';
import { config } from '../config.js';
import { parseLogin,parsePassword } from '../../../shared/validation.js';
import { cookieName,cookieOptions,requireAdmin,requireCSRF } from '../middleware/auth.js';
export const authRouter=Router();
const loginLimit=rateLimit({windowMs:15*60*1000,limit:8,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many login attempts. Try again in 15 minutes.'}});
// Equal-cost password comparison also runs when the account is unknown.
const dummyHash=await bcrypt.hash(randomBytes(24).toString('hex'),12);
authRouter.post('/login',loginLimit,async(req,res)=>{
  const {email,password}=parseLogin(req.body);
  const admin=await Admin.findOne({email}).select('+passwordHash');
  const matched=await bcrypt.compare(password,admin?.passwordHash||dummyHash);
  if(!admin || !matched)return res.status(401).json({error:'Incorrect email or password.'});
  const csrf=randomBytes(32).toString('hex');
  const token=jwt.sign({csrf,version:admin.authVersion},config.jwtSecret,{algorithm:'HS256',subject:admin.id,issuer:'agar-events',audience:'agar-admin',expiresIn:'8h'});
  res.cookie(cookieName,token,cookieOptions()).json({admin:{email:admin.email},csrf});
});
authRouter.get('/session',requireAdmin,(req,res)=>res.json({admin:{email:req.admin.email},csrf:req.session.csrf}));
authRouter.post('/logout',requireAdmin,requireCSRF,async(req,res)=>{
  // Invalidates any copied token as well as clearing this browser's cookie.
  await Admin.updateOne({_id:req.admin._id},{$inc:{authVersion:1}});
  const {maxAge,...options}=cookieOptions();res.clearCookie(cookieName,options).json({ok:true});
});
authRouter.post('/password',requireAdmin,requireCSRF,loginLimit,async(req,res)=>{
  const data=parsePassword(req.body);const admin=await Admin.findById(req.admin._id).select('+passwordHash');
  if(!await bcrypt.compare(data.currentPassword,admin.passwordHash))return res.status(400).json({error:'Current password is incorrect.'});
  admin.passwordHash=await bcrypt.hash(data.newPassword,12);admin.authVersion+=1;await admin.save();
  const {maxAge,...options}=cookieOptions();res.clearCookie(cookieName,options).json({ok:true,message:'Password changed. Please sign in again.'});
});
