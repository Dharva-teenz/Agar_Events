import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true,versionKey:false};
const adminSchema=new Schema({email:{type:String,required:true,unique:true,lowercase:true},passwordHash:{type:String,required:true,select:false},authVersion:{type:Number,default:0}},options);
export const Admin=model('Admin',adminSchema);
export const Service=model('Service',new Schema({
  title:{type:String,required:true},slug:{type:String,required:true,unique:true},subtitle:String,
  description:String,coverImage:String,coverAssetId:String,icon:String,features:[String],active:{type:Boolean,default:true},sortOrder:{type:Number,default:0}
},options));
const eventSchema=new Schema({
  service:{type:Schema.Types.ObjectId,ref:'Service',index:true},serviceName:String,title:{type:String,required:true},
  description:String,location:String,eventDate:String,coverImage:String,coverAssetId:String,
  images:[{_id:false,url:{type:String,required:true},alt:{type:String,required:true},assetId:String}],
  featured:{type:Boolean,default:false},published:{type:Boolean,default:true},isDemo:{type:Boolean,default:false},
  seedKey:{type:String,unique:true,sparse:true}
},options);
eventSchema.index({published:1,createdAt:-1});
export const Event=model('Event',eventSchema);
const reviewSchema=new Schema({
  name:{type:String,required:true},service:{type:Schema.Types.ObjectId,ref:'Service'},serviceName:String,
  rating:{type:Number,required:true,min:1,max:5},comment:{type:String,required:true},
  status:{type:String,enum:['pending','approved','rejected'],default:'pending',index:true},consent:{type:Boolean,required:true}
},options);
export const Review=model('Review',reviewSchema);
const enquirySchema=new Schema({
  name:{type:String,required:true},phone:{type:String,required:true},service:{type:Schema.Types.ObjectId,ref:'Service'},serviceName:String,
  eventDate:String,location:String,guests:Number,budget:String,message:String,consent:{type:Boolean,required:true},
  status:{type:String,enum:['new','contacted','confirmed','closed'],default:'new',index:true}
},options);
export const Enquiry=model('Enquiry',enquirySchema);
export const Settings=model('Settings',new Schema({key:{type:String,unique:true,required:true},value:{type:Schema.Types.Mixed,required:true}},options));
// Tracks the Cloudinary identifier separately from content records. This keeps
// upload metadata available even where an older record only has an image URL.
export const MediaAsset=model('MediaAsset',new Schema({
  url:{type:String,required:true,unique:true},assetId:{type:String,required:true,unique:true},resourceType:{type:String,enum:['image','video'],default:'image'}
},options));
const faqSchema=new Schema({
  question:{type:String,required:true,trim:true,minlength:5,maxlength:240},
  answer:{type:String,required:true,trim:true,minlength:5,maxlength:4000},
  active:{type:Boolean,default:true},
  sortOrder:{type:Number,default:0,min:0,max:9999,validate:Number.isSafeInteger},
  seedKey:{type:String,unique:true,sparse:true}
},options);
faqSchema.index({active:1,sortOrder:1,_id:1});
export const FAQ=model('FAQ',faqSchema);
