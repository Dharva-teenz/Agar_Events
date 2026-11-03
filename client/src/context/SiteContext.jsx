import React,{createContext,useCallback,useContext,useEffect,useState} from 'react';
import {api,DESIGN_MODE} from '../lib/api.js';
import {designSite} from '../../../shared/catalog.js';
const Context=createContext(null);
export function SiteProvider({children}){
  const [data,setData]=useState(DESIGN_MODE?designSite:null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(!DESIGN_MODE);
  const refresh=useCallback(async(signal)=>{
    if(DESIGN_MODE)return;
    setLoading(true);setError('');
    try{setData(await api('/site',{signal}));}catch(e){if(e.name!=='AbortError')setError(e.message);}finally{if(!signal?.aborted)setLoading(false);}
  },[]);
  useEffect(()=>{const controller=new AbortController();refresh(controller.signal);return()=>controller.abort();},[refresh]);
  useEffect(()=>{if(DESIGN_MODE)return;const revalidate=()=>{if(document.visibilityState==='visible')refresh();};window.addEventListener('focus',revalidate);document.addEventListener('visibilitychange',revalidate);return()=>{window.removeEventListener('focus',revalidate);document.removeEventListener('visibilitychange',revalidate);};},[refresh]);
  return <Context.Provider value={{data,loading,error,refresh,designMode:DESIGN_MODE}}>{children}</Context.Provider>;
}
export function useSite(){const context=useContext(Context);if(!context)throw new Error('Site context is missing.');return context;}
