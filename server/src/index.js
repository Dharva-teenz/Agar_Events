import mongoose from 'mongoose';
import { app } from './app.js';
import { config,validateConfig } from './config.js';
validateConfig();
try {
  await mongoose.connect(config.mongoUri,{serverSelectionTimeoutMS:10000});
  const server=app.listen(config.port,'0.0.0.0',()=>console.log(`Agar Events API ready on port ${config.port}`));
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{
    server.close(async()=>{await mongoose.disconnect();process.exit(0);});
    setTimeout(()=>process.exit(1),10000).unref();
  });
}catch(error){console.error(`Cannot start the API: ${error.name}${error.code?` (${error.code})`:''}. ${error.message.replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi,'[MongoDB connection string hidden]')}`);process.exitCode=1;}
