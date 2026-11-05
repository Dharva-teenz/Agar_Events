import test from 'node:test';
import assert from 'node:assert/strict';
import {appendAlbumPhoto,setAlbumCover} from '../client/src/admin/eventMedia.js';
import {parseEvent} from '../shared/validation.js';
import {publicEvent} from '../server/src/routes/public.js';

const serviceId='abcdef0123456789abcdef01';
const legacy='/uploads/b6d6a60a-b6be-47d3-ac76-8e396657b538.webp';
const cloud='https://res.cloudinary.com/example/image/upload/v1/agar-events/replacement.webp';

test('adding an album photo preserves an explicit legacy cover until an admin selects a replacement',()=>{
 const draft={title:'Catering',coverImage:legacy,coverAssetId:'',images:[]};
 const updated=appendAlbumPhoto(draft,{url:cloud,assetId:'agar-events/replacement'});
 assert.equal(updated.coverImage,legacy);
 assert.deepEqual(updated.images,[{url:cloud,assetId:'agar-events/replacement',alt:'Catering'}]);
});

test('selecting a Cloudinary cover persists it through event validation and public mapping',()=>{
 const draft=setAlbumCover({title:'Catering',service:serviceId,coverImage:legacy,images:[{url:cloud,assetId:'agar-events/replacement',alt:'Catering'}]},{url:cloud,assetId:'agar-events/replacement'});
 const saved=parseEvent({...draft,published:true,featured:false,isDemo:false});
 assert.equal(saved.coverImage,cloud);
 assert.equal(saved.coverAssetId,'agar-events/replacement');
 const publicRecord=publicEvent({...saved,_id:'event-1'},new Map([[serviceId,{slug:'catering',title:'Catering'}]]));
 assert.equal(publicRecord.coverImage,cloud);
 assert.equal(publicRecord.images[0].url,cloud);
});
