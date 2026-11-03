import React,{useState} from 'react';
import {useSite} from '../context/SiteContext.jsx';
import './faq.css';

export default function FAQSection(){
  const {data}=useSite();
  const [expanded,setExpanded]=useState(null);
  const faqs=data.faqs||[];
  if(!faqs.length)return null;
  return <section className="section faq-section" aria-labelledby="faq-heading">
    <div className="container">
      <div className="faq-heading">
        <p className="eyebrow">PLAN WITH CONFIDENCE</p>
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        <p className="section-description">Everything you need to know about planning your special event with us.</p>
      </div>
      <div className="faq-list">
        {faqs.map(faq=>{
          const open=expanded===faq._id;
          const questionId=`faq-question-${faq._id}`;
          const answerId=`faq-answer-${faq._id}`;
          return <article key={faq._id} className={`faq-item${open?' is-expanded':''}`}>
            <h3><button type="button" id={questionId} aria-expanded={open} aria-controls={answerId}
              onClick={()=>setExpanded(current=>current===faq._id?null:faq._id)}>
              <span>{faq.question}</span><span className="faq-toggle" aria-hidden="true">{open?'−':'+'}</span>
            </button></h3>
            <div className="faq-answer" id={answerId} role="region" aria-labelledby={questionId} aria-hidden={!open}>
              <div className="faq-answer-inner"><p>{faq.answer}</p></div>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
