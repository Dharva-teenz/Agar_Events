import React,{useSyncExternalStore} from 'react';
const HASH_ROUTING=import.meta.env.VITE_OFFLINE_PREVIEW==='true';
const subscribe=(listener)=>{window.addEventListener('popstate',listener);window.addEventListener('hashchange',listener);return()=>{window.removeEventListener('popstate',listener);window.removeEventListener('hashchange',listener);};};
const snapshot=()=>HASH_ROUTING?(window.location.hash.startsWith('#/')?window.location.hash.slice(1):'/'):window.location.pathname+window.location.search;
export function useRoute(){
  const route=useSyncExternalStore(subscribe,snapshot,snapshot);
  const [pathname,search='']=route.split('?');return {pathname:pathname.replace(/\/$/,'')||'/',query:new URLSearchParams(search)};
}
export function navigate(to,{replace=false}={}){
  if(!to.startsWith('/'))throw new Error('Internal navigation must use an absolute path.');
  window.history[replace?'replaceState':'pushState']({},'',HASH_ROUTING?'#'+to:to);
  window.dispatchEvent(new PopStateEvent('popstate'));window.scrollTo({top:0,behavior:'instant'});
}
export function Link({to,onClick,children,...props}){
  return <a href={HASH_ROUTING?'#'+to:to} {...props} onClick={event=>{
    onClick?.(event);
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||props.target==='_blank')return;
    event.preventDefault();navigate(to);
  }}>{children}</a>;
}
