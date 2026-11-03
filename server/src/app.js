import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { existsSync } from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { config,clientDist,uploadDir } from './config.js';
import { checkOrigin } from './middleware/auth.js';
import { authRouter } from './routes/auth.js';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';
export const app=express();app.disable('x-powered-by');
if(config.trustProxy)app.set('trust proxy',config.trustProxy);
app.use(helmet({contentSecurityPolicy:{directives:{
  defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'",'https://fonts.googleapis.com'],
  fontSrc:["'self'",'https://fonts.gstatic.com'],imgSrc:["'self'",'https:','data:','blob:'],connectSrc:["'self'"],
  objectSrc:["'none'"],frameSrc:["'self'",'https://www.google.com','https://maps.google.com'],frameAncestors:["'none'"],upgradeInsecureRequests:config.production?[]:null
}},crossOriginResourcePolicy:{policy:'same-site'}}));
app.use(cors({origin(origin,cb){cb(null,!origin||config.origins.includes(origin));},credentials:true}));
app.use(express.json({limit:'150kb'}),cookieParser());
app.use('/api',(req,res,next)=>{res.set('Cache-Control','no-store');next();});
app.use('/api',rateLimit({windowMs:15*60*1000,limit:500,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many requests. Please try again later.'}}));
app.use('/api',checkOrigin);
app.get('/api/health',(req,res)=>res.status(mongoose.connection.readyState===1?200:503).json({ok:mongoose.connection.readyState===1}));
app.use('/api/auth',authRouter);app.use('/api/admin',adminRouter);app.use('/api',publicRouter);
app.use('/api',(req,res)=>res.status(404).json({error:'API route not found.'}));
app.use('/uploads',express.static(uploadDir,{dotfiles:'deny',maxAge:'7d',index:false}));
// Express serves the compiled SPA in production; Vite handles it in development.
if(existsSync(path.join(clientDist,'index.html'))){
  app.use(express.static(clientDist,{index:false,maxAge:'1h'}));
  app.get('/{*path}',(req,res,next)=>{
    if(path.extname(req.path))return next();
    res.set('Cache-Control','no-cache').sendFile(path.join(clientDist,'index.html'));
  });
}
app.use((req,res)=>res.status(404).json({error:'Not found.'}));
app.use((error,req,res,next)=>{
  if(res.headersSent)return next(error);
  if(error.code==='LIMIT_FILE_SIZE')return res.status(400).json({error:'Image must be smaller than 8 MB.'});
  if(error.name==='MulterError')return res.status(400).json({error:'Upload one image using the image field.'});
  if(error.code===11000)return res.status(409).json({error:'That URL slug or unique record already exists.'});
  const status=error.status||(['ValidationError','CastError'].includes(error.name)?400:500);
  if(status>=500)console.error('Request failed:',error.name); // Do not log customer data or credentials.
  res.status(status).json({error:status<500?error.message:'Something went wrong. Please try again.'});
});
