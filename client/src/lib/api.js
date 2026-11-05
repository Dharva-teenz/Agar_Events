export const DESIGN_MODE=import.meta.env.VITE_DEMO_MODE==='true';
const configuredRoot=(import.meta.env.VITE_API_URL||'/api').trim().replace(/\/$/,'');
// A bare API origin is a common deployment mistake. Public API endpoints live
// below /api, while production normally uses the same-origin /api proxy.
const ROOT=/^https?:\/\/[^/]+$/i.test(configuredRoot)?`${configuredRoot}/api`:configuredRoot||'/api';
const API_ORIGIN=/^https?:\/\//i.test(ROOT)?new URL(ROOT).origin:'';
export function mediaURL(value){return value?.startsWith('/uploads/')&&API_ORIGIN?API_ORIGIN+value:value;}
let csrf='';
export function setCSRF(value){csrf=value||'';}
export class APIError extends Error{constructor(message,status){super(message);this.name='APIError';this.status=status;}}
export async function api(path,{method='GET',body,signal}={}){
  const controller=new AbortController();
  const relay=()=>controller.abort();
  signal?.addEventListener('abort',relay,{once:true});
  if(signal?.aborted)controller.abort();
  const timer=setTimeout(()=>controller.abort(),25000);
  const multipart=body instanceof FormData;
  const headers={Accept:'application/json'};
  if(body && !multipart)headers['Content-Type']='application/json';
  if(csrf && !['GET','HEAD'].includes(method))headers['X-CSRF-Token']=csrf;
  try{
    const response=await fetch(ROOT+path,{method,headers,credentials:'include',body:body?(multipart?body:JSON.stringify(body)):undefined,signal:controller.signal});
    const data=await response.json().catch(()=>({error:'Unexpected server response. Check that the API is running.'}));
    if(!response.ok){
      if(response.status===401 && path.startsWith('/admin'))window.dispatchEvent(new Event('agar:unauthorized'));
      throw new APIError(data.error||'Request failed. Please try again.',response.status);
    }
    return data;
  }catch(error){
    if(error.name==='AbortError' && !signal?.aborted)throw new APIError('The request took too long. Check your connection and try again.',0);
    if(error instanceof TypeError)throw new APIError('Cannot reach the server. Check that the API is running.',0);
    throw error;
  }finally{clearTimeout(timer);signal?.removeEventListener('abort',relay);}
}
