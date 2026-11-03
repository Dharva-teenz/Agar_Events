import React,{useEffect,useId,useRef,useState} from 'react';
import {useSite} from '../context/SiteContext.jsx';
import {useRoute} from '../lib/router.jsx';
import {buildWhatsAppUrl} from '../../../shared/whatsapp.js';
import './FloatingSocial.css';

const enquiryMessage='Hi Agar Events! I would like to enquire about your event management services.';
const brandIcons={whatsapp:'/brand/whatsapp.svg',instagram:'/brand/instagram.svg'};

function instagramProfile(value){
  try{
    const url=new URL(value);
    if(url.protocol==='https:' && /^(www\.)?instagram\.com$/i.test(url.hostname) && !url.username && !url.password)return url.href;
  }catch{ /* Unconfigured or invalid destinations must not become public links. */ }
  return null;
}

export default function FloatingSocial(){
  const {data}=useSite();
  const {pathname}=useRoute();
  const group=useRef(null);
  const instagramId=useId();
  const [expanded,setExpanded]=useState(false);
  const [obscured,setObscured]=useState(false);
  const whatsapp=buildWhatsAppUrl(data.settings.whatsapp,enquiryMessage);
  const instagram=instagramProfile(data.settings.instagram);

  useEffect(()=>{setExpanded(false);},[pathname]);

  useEffect(()=>{
    const element=group.current;
    if(!element)return;
    let observers=[];
    let frame;
    function watchControls(){
      observers.forEach(observer=>observer.disconnect());
      if(window.matchMedia('(max-width: 767px)').matches){
        observers=[];
        setObscured(false);
        return;
      }
      const controls=document.querySelectorAll('.form-panel, main a, main button, main input, main select, main textarea, .site-footer a, .site-footer button, [data-floating-social-avoid]');
      const buttons=[...element.querySelectorAll('.floating-social-toggle,.floating-social-whatsapp')];
      if(expanded)buttons.push(element.querySelector('.floating-social-instagram'));
      const overlaps=buttons.map(()=>new Set());
      observers=buttons.map((button,index)=>{
        // Check actual buttons rather than the empty space beside the smaller arrow.
        const bounds=button.getBoundingClientRect();
        const margin=2;
        const top=Math.max(0,bounds.top-margin);
        const right=Math.max(0,document.documentElement.clientWidth-bounds.right-margin);
        const bottom=Math.max(0,document.documentElement.clientHeight-bounds.bottom-margin);
        const left=Math.max(0,bounds.left-margin);
        const observer=new IntersectionObserver(entries=>{
          for(const entry of entries){
            if(entry.isIntersecting)overlaps[index].add(entry.target);
            else overlaps[index].delete(entry.target);
          }
          setObscured(overlaps.some(items=>items.size>0));
        },{rootMargin:`-${top}px -${right}px -${bottom}px -${left}px`});
        controls.forEach(control=>observer.observe(control));
        return observer;
      });
      // Keep the reserved corner clear of forms, actions and any explicit sticky bar.
    }
    function scheduleControls(){
      if(frame!==undefined)return;
      frame=requestAnimationFrame(()=>{frame=undefined;watchControls();});
    }
    watchControls();
    const resize=new ResizeObserver(scheduleControls);
    resize.observe(element);
    // Filtering galleries and asynchronous page content can introduce new controls.
    const content=new MutationObserver(scheduleControls);
    document.querySelectorAll('main,.site-footer').forEach(root=>content.observe(root,{childList:true,subtree:true}));
    window.addEventListener('resize',scheduleControls);
    window.visualViewport?.addEventListener('resize',scheduleControls);
    return()=>{
      observers.forEach(observer=>observer.disconnect());resize.disconnect();content.disconnect();
      if(frame!==undefined)cancelAnimationFrame(frame);
      window.removeEventListener('resize',scheduleControls);
      window.visualViewport?.removeEventListener('resize',scheduleControls);
    };
  },[pathname,whatsapp,instagram,expanded]);

  function socialButton(platform,url,label){
    const icon=<img src={brandIcons[platform]} width="32" height="32" alt="" aria-hidden="true" decoding="async"/>;
    const className=`floating-social-link floating-social-${platform}`;
    return url?<a className={className} href={url} target="_blank" rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`} title={label}>{icon}</a>:
      <button className={className} type="button" disabled aria-label={`${platform==='whatsapp'?'WhatsApp contact':'Instagram profile'} is currently unavailable`}
        title={`${platform==='whatsapp'?'WhatsApp contact':'Instagram profile'} is currently unavailable`}>{icon}</button>;
  }

  return <aside ref={group} className={`floating-social${obscured?' is-obscured':''}`} aria-label="Contact Agar Events on social media">
    <button className="floating-social-toggle" type="button" aria-expanded={expanded} aria-controls={instagramId}
      aria-label={expanded?'Hide Instagram':'Show Instagram'} title={expanded?'Hide Instagram':'Show Instagram'} onClick={()=>setExpanded(value=>!value)}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={expanded?'is-expanded':''}>
        <path d="M4 10l4-4.5L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
    <div id={instagramId} className={`floating-social-extra${expanded?' is-expanded':''}`} aria-hidden={!expanded} inert={expanded?undefined:''}>
      <div className="floating-social-extra-inner">{socialButton('instagram',instagram,'Visit Agar Events on Instagram')}</div>
    </div>
    {socialButton('whatsapp',whatsapp,'Enquire with Agar Events on WhatsApp')}
  </aside>;
}
