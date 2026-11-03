import React,{useCallback,useEffect,useRef,useState} from 'react';
import {api} from '../lib/api.js';
import {Field,Alert,Button,Spinner} from '../components/UI.jsx';
import {Icon} from '../components/Icon.jsx';
export function useCollection(name){
 const [page,setPage]=useState(1);const [revision,setRevision]=useState(0);const [data,setData]=useState({items:[],pages:1,total:0});const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');api(`/admin/${name}?page=${page}&limit=50`,{signal:controller.signal}).then(result=>{if(!controller.signal.aborted)setData(result);}).catch(e=>{if(e.name!=='AbortError')setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[name,page,revision]);
 const reload=useCallback(()=>setRevision(r=>r+1),[]);
 return {...data,page,setPage,reload,loading,error};
}
export function Pagination({page,pages,total,setPage}){return <div className="pagination"><span>{total} records - Page {page} of {pages}</span><div><Button variant="outline" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button><Button variant="outline" disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</Button></div></div>;}
export function Status({value}){return <span className={`status status-${value}`}>{value}</span>;}
export function TableState({collection,children,empty='No records yet.'}){return <><Alert>{collection.error}</Alert>{collection.loading?<Spinner label="Loading records..."/>:collection.items.length?children:<div className="admin-empty"><Icon name="flower" size={35}/><p>{empty}</p></div>}<Pagination {...collection}/></>;}
export function ImageField({label,value,onChange}){
 const fileRef=useRef(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 async function upload(e){const file=e.target.files?.[0];if(!file)return;setError('');if(file.size>8*1024*1024){setError('Choose an image smaller than 8 MB.');e.target.value='';return;}setBusy(true);try{const form=new FormData();form.append('image',file);const result=await api('/admin/uploads',{method:'POST',body:form});onChange(result.url);}catch(err){setError(err.message);}finally{setBusy(false);e.target.value='';}}
 return <div className="image-field"><Field label={label}><input value={value||''} onChange={e=>onChange(e.target.value)} placeholder="Upload a photo or paste an HTTPS image URL" maxLength={2000}/></Field><div className="image-field-controls">{value?<img src={value} alt="Selected image preview"/>:null}<input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} className="sr-only" tabIndex={-1}/><Button type="button" variant="outline" onClick={()=>fileRef.current.click()} disabled={busy}><Icon name="upload" size={17}/>{busy?'Uploading...':'Upload Photo'}</Button><small>JPEG, PNG, WebP or AVIF. Up to 8 MB.</small></div><Alert>{error}</Alert></div>;
}
export function AdminHeading({eyebrow='ADMIN STUDIO',title,description,children}){return <div className="admin-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description?<p>{description}</p>:null}</div>{children}</div>;}
export function formatDate(value){return value?new Date(value).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'Not set';}
