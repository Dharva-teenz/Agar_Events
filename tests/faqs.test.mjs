import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFAQ} from '../shared/validation.js';
import {initialFAQs} from '../shared/faqs.js';

test('all six requested FAQs pass validation in display order',()=>{
  assert.equal(initialFAQs.length,6);
  initialFAQs.forEach((faq,index)=>{
    assert.deepEqual(parseFAQ(faq),faq);
    assert.equal(faq.sortOrder,index+1);
  });
});
test('FAQ input is trimmed and unknown fields cannot reach database writes',()=>{
  assert.deepEqual(parseFAQ({question:'  A valid question?  ',answer:'  A useful answer.  ',active:false,sortOrder:8,$set:{active:true},seedKey:'injected'}),{
    question:'A valid question?',answer:'A useful answer.',active:false,sortOrder:8
  });
});
test('FAQ defaults enable visibility and use order zero',()=>{
  assert.deepEqual(parseFAQ({question:'A valid question?',answer:'A useful answer.'}),{
    question:'A valid question?',answer:'A useful answer.',active:true,sortOrder:0
  });
});
for(const [label,change] of [
  ['blank question',{question:' '}],['oversized question',{question:'x'.repeat(241)}],
  ['blank answer',{answer:''}],['oversized answer',{answer:'x'.repeat(4001)}],
  ['operator object in question',{question:{$ne:null}}],['operator object in answer',{answer:{$set:'bad'}}],
  ['string visibility',{active:'false'}],['negative order',{sortOrder:-1}],
  ['fractional order',{sortOrder:1.5}],['string order',{sortOrder:'2'}],['oversized order',{sortOrder:10000}]
])test(`FAQ rejects ${label}`,()=>assert.throws(()=>parseFAQ({...initialFAQs[0],...change})));
test('FAQ rejects arrays and missing request bodies',()=>{
  for(const value of [null,undefined,[],42])assert.throws(()=>parseFAQ(value));
});
