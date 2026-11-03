import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

test('FAQ API lifecycle, permissions, persistence, ordering and seed preservation',{
  skip:process.env.FAQ_INTEGRATION_TESTS!=='1'
},async()=>{
  const [{default:mongoose},{default:bcrypt},{app},{config},{Admin,FAQ},{seedFAQs}]=await Promise.all([
    import('mongoose'),import('bcryptjs'),import('../server/src/app.js'),import('../server/src/config.js'),
    import('../server/src/models.js'),import('../server/src/seed-faqs.js')
  ]);
  const dbName=`agar_faq_test_${randomUUID().replaceAll('-','').slice(0,16)}`;
  let server;
  try{
    await mongoose.connect(config.mongoUri,{dbName,serverSelectionTimeoutMS:10000});
    const password=randomUUID();
    await Admin.create({email:'faq-test@example.test',passwordHash:await bcrypt.hash(password,4)});
    server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
    const root=`http://127.0.0.1:${server.address().port}/api`;
    const origin=config.origins[0];
    let cookie='',csrf='';
    async function request(path,{method='GET',body,authenticated=true,token=true,allowedOrigin=true}={}){
      const headers={'Content-Type':'application/json'};
      if(allowedOrigin)headers.Origin=origin;
      if(authenticated&&cookie)headers.Cookie=cookie;
      if(token&&csrf)headers['X-CSRF-Token']=csrf;
      const response=await fetch(root+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
      return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')};
    }
    assert.equal((await request('/admin/faqs',{authenticated:false})).status,401);
    assert.equal((await request('/admin/faqs',{method:'POST',body:{},authenticated:false})).status,401);
    const login=await request('/auth/login',{method:'POST',body:{email:'faq-test@example.test',password}});
    assert.equal(login.status,200);cookie=login.cookie.split(';')[0];csrf=login.data.csrf;
    const faq={question:'A new test question?',answer:'A new test answer.',active:true,sortOrder:30};
    assert.equal((await request('/admin/faqs',{method:'POST',body:faq,token:false})).status,403);
    assert.equal((await request('/admin/faqs',{method:'POST',body:faq,allowedOrigin:false})).status,403);
    const created=await request('/admin/faqs',{method:'POST',body:{...faq,$set:{active:false},seedKey:'injected'}});
    assert.equal(created.status,201);const faqId=created.data._id;
    assert.equal(created.data.seedKey,undefined);
    const other=await request('/admin/faqs',{method:'POST',body:{...faq,question:'An earlier question?',sortOrder:10}});
    assert.equal(other.status,201);
    assert.deepEqual((await request('/faqs',{authenticated:false})).data.map(f=>f._id),[other.data._id,faqId]);
    let edited=await request(`/admin/faqs/${faqId}`,{method:'PUT',body:{...faq,question:'The edited question?',answer:'The edited answer.',sortOrder:0}});
    assert.equal(edited.status,200);
    assert.equal((await FAQ.findById(faqId).lean()).answer,'The edited answer.');
    assert.equal((await request('/site',{authenticated:false})).data.faqs[0].question,'The edited question?');
    assert.equal((await request('/faqs',{authenticated:false})).data[0]._id,faqId);
    edited=await request(`/admin/faqs/${faqId}`,{method:'PUT',body:{...edited.data,active:false}});
    assert.equal(edited.status,200);
    assert.equal((await request('/faqs',{authenticated:false})).data.some(f=>f._id===faqId),false);
    assert.equal((await request('/site',{authenticated:false})).data.faqs.some(f=>f._id===faqId),false);
    const adminList=await request('/admin/faqs?page=1&limit=1');
    assert.equal(adminList.data.total,2);assert.equal(adminList.data.pages,2);
    assert.equal(adminList.data.items[0]._id,faqId);assert.equal(adminList.data.items[0].active,false);
    assert.equal((await request(`/admin/faqs/${faqId}`,{method:'PUT',body:{...edited.data,active:true}})).status,200);
    assert.equal((await request('/faqs',{authenticated:false})).data.length,2);
    assert.equal((await request('/admin/faqs',{method:'POST',body:{...faq,sortOrder:1.5}})).status,400);
    assert.equal((await request('/admin/faqs/bad-id',{method:'DELETE'})).status,400);
    assert.equal((await request('/admin/faqs/abcdef0123456789abcdef01',{method:'DELETE'})).status,404);
    assert.equal((await request('/admin/faqs/abcdef0123456789abcdef01',{method:'PUT',body:faq})).status,404);
    assert.equal((await request(`/admin/faqs/${faqId}`,{method:'DELETE'})).status,200);
    assert.equal(await FAQ.findById(faqId),null);
    assert.equal((await request('/faqs',{authenticated:false})).data.some(f=>f._id===faqId),false);
    await seedFAQs();
    const seeded=await FAQ.findOne({seedKey:'initial-faq-1'});
    seeded.answer='An admin edited this answer.';seeded.active=false;seeded.sortOrder=99;await seeded.save();
    await seedFAQs();
    assert.equal(await FAQ.countDocuments({seedKey:{$exists:true}}),6);
    const preserved=await FAQ.findById(seeded._id).lean();
    assert.equal(preserved.answer,'An admin edited this answer.');assert.equal(preserved.active,false);assert.equal(preserved.sortOrder,99);
    const publicFAQs=(await request('/faqs',{authenticated:false})).data;
    assert.ok(publicFAQs.every(f=>f.seedKey===undefined&&f.active===undefined));
    assert.ok(publicFAQs.every((f,index)=>index===0||publicFAQs[index-1].sortOrder<=f.sortOrder));
  }finally{
    if(server)await new Promise(resolve=>server.close(resolve));
    try{
      if(mongoose.connection.name===dbName&&dbName.startsWith('agar_faq_test_'))await mongoose.connection.dropDatabase();
    }finally{await mongoose.disconnect();}
  }
});
