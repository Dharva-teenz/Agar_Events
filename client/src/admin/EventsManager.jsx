import React,{useEffect,useRef,useState} from 'react';
import {api} from '../lib/api.js';
import {useRoute,Link,navigate} from '../lib/router.jsx';
import {Button,Field,Dialog,Alert} from '../components/UI.jsx';
import {Icon} from '../components/Icon.jsx';
import {AdminHeading,useCollection,TableState,ImageField,Status} from './Common.jsx';
import {appendAlbumPhoto,clearAlbumCoverIfRemoved,coverWasPersisted,setAlbumCover} from './eventMedia.js';

const blank=()=>({title:'',service:'',description:'',location:'Trichy',eventDate:'',coverImage:'',coverAssetId:'',images:[],published:true,featured:false,isDemo:false});

function Editor({initial,services,onClose,onSaved}){
 const [draft,setDraft]=useState({...initial,service:initial.service?._id||initial.service||'',coverAssetId:initial.coverAssetId||'',images:(initial.images||[]).map(image=>({...image}))});
 const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [uploading,setUploading]=useState(false);const [newURL,setNewURL]=useState('');const fileRef=useRef(null);
 const change=e=>setDraft(d=>({...d,[e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value}));
 const chooseCover=image=>setDraft(d=>setAlbumCover(d,image));
 async function upload(e){
  const files=Array.from(e.target.files||[]);if(!files.length)return;setError('');
  if(files.length+draft.images.length>30){setError('An album can contain at most 30 photos.');return;}
  setUploading(true);
  try{for(const file of files){
   if(file.size>8*1024*1024)throw new Error(`${file.name} is larger than 8 MB.`);
   const body=new FormData();body.append('image',file);
   const result=await api('/admin/uploads',{method:'POST',body});
   setDraft(d=>appendAlbumPhoto(d,result));
  }}catch(err){setError(err.message);}finally{setUploading(false);e.target.value='';}
 }
 async function submit(e){
  e.preventDefault();setError('');if(!draft.images.length){setError('Add at least one event photo.');return;}
  setBusy(true);
  try{
   const saved=await api(`/admin/events${initial._id?'/'+initial._id:''}`,{method:initial._id?'PUT':'POST',body:draft});
   const persisted=await api(`/admin/events/${saved._id}`);
   if(!coverWasPersisted(draft,persisted))throw new Error('The album was saved, but its cover could not be verified. Keep this editor open and try saving again.');
   onSaved(persisted);
  }catch(err){setError(err.message);}finally{setBusy(false);}
 }
 return <Dialog title={initial._id?'Edit event album':'Add an event album'} onClose={onClose} wide><Alert>{error}</Alert><form onSubmit={submit} className="form-grid">
  <Field label="Event title *"><input name="title" value={draft.title} onChange={change} required minLength={2} maxLength={120}/></Field>
  <Field label="Related service *"><select name="service" value={draft.service} onChange={change} required><option value="">Select a service</option>{services.map(service=><option key={service._id} value={service._id}>{service.title}{service.active?'':' (hidden)'}</option>)}</select></Field>
  <Field label="Location"><input name="location" value={draft.location} onChange={change} maxLength={160}/></Field>
  <Field label="Event date"><input name="eventDate" type="date" value={draft.eventDate} onChange={change}/></Field>
  <Field label="Album description" wide><textarea name="description" rows="3" value={draft.description} onChange={change} maxLength={3000}/></Field>
  <div className="field-wide"><ImageField label="Album cover" value={draft.coverImage} onChange={(coverImage,coverAssetId)=>setDraft(d=>setAlbumCover(d,{url:coverImage,assetId:coverAssetId}))}/><p className="small-note">Upload a replacement cover here, or select an album photo below. Adding photos does not change the cover.</p></div>
  <div className="field-wide"><div className="panel-title"><h3>Album photos ({draft.images.length}/30)</h3><input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" tabIndex={-1} onChange={upload}/><Button type="button" variant="outline" onClick={()=>fileRef.current.click()} disabled={uploading||draft.images.length>=30}><Icon name="upload" size={17}/>{uploading?'Uploading photos...':'Upload Photos'}</Button></div>
   <div className="album-editor">{draft.images.map((image,index)=>{const isCover=image.url===draft.coverImage;return <div key={image.url+index}><img src={image.url} alt={image.alt}/><label><span className="sr-only">Description for photo {index+1}</span><input value={image.alt} required maxLength={200} onChange={e=>setDraft(d=>({...d,images:d.images.map((value,i)=>i===index?{...value,alt:e.target.value}:value)}))}/></label><Button type="button" variant={isCover?'':'outline'} onClick={()=>chooseCover(image)} disabled={isCover}>{isCover?'Current cover':'Set as cover'}</Button><button type="button" className="icon-button danger" aria-label={`Remove photo ${index+1}`} onClick={()=>setDraft(d=>clearAlbumCoverIfRemoved(d,image))}><Icon name="trash" size={17}/></button></div>;})}</div>
   <div className="add-url"><input value={newURL} onChange={e=>setNewURL(e.target.value)} placeholder="Or add an HTTPS photo URL" aria-label="New photo URL"/><Button type="button" variant="outline" disabled={!newURL||draft.images.length>=30} onClick={()=>{setDraft(d=>appendAlbumPhoto(d,{url:newURL}));setNewURL('');}}>Add URL</Button></div>
  </div>
  <div className="field-wide checkbox-row"><label className="checkbox-label"><input type="checkbox" name="published" checked={draft.published} onChange={change}/>Published</label><label className="checkbox-label"><input type="checkbox" name="featured" checked={draft.featured} onChange={change}/>Featured first</label><label className="checkbox-label"><input type="checkbox" name="isDemo" checked={draft.isDemo} onChange={change}/>Reference artwork, not real client work</label></div>
  <p className="small-note field-wide">Only upload photos you own or have permission to publish. Obtain client permission before publishing identifiable people.</p><div className="dialog-actions field-wide"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy||uploading}>{busy?'Saving and verifying...':'Save Album'}</Button></div>
 </form></Dialog>;
}

export default function EventsManager(){
 const collection=useCollection('events');const [services,setServices]=useState([]);const [editing,setEditing]=useState(null);const [error,setError]=useState('');const [message,setMessage]=useState('');const [busy,setBusy]=useState('');const {query}=useRoute();
 useEffect(()=>{const controller=new AbortController();api('/admin/services?limit=100',{signal:controller.signal}).then(data=>setServices(data.items)).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>controller.abort();},[]);
 useEffect(()=>{if(query.get('new')){setEditing(blank());navigate('/admin/events',{replace:true});}},[query]);
 async function remove(item){if(!window.confirm(`Delete the album "${item.title}"? This removes its website record, not the uploaded image files.`))return;setError('');setMessage('');setBusy(item._id);try{await api(`/admin/events/${item._id}`,{method:'DELETE'});collection.reload();}catch(e){setError(e.message);}finally{setBusy('');}}
 const startEditor=event=>{setError('');setMessage('');setEditing(event);};
 return <><AdminHeading title="Your celebrations." description="Each album belongs to one service. Customers only see that service's published events."><Button onClick={()=>startEditor(blank())}><Icon name="plus" size={18}/>Add Event</Button></AdminHeading><Alert>{error}</Alert><Alert type="success">{message}</Alert><div className="admin-panel"><TableState collection={collection} empty="Upload your first event album."><div className="table-scroll"><table><thead><tr><th>Event album</th><th>Service</th><th>Photos</th><th>Status</th><th>Actions</th></tr></thead><tbody>{collection.items.map(event=><tr key={event._id}><td><div className="record-name"><img src={event.coverImage} alt=""/><div><strong>{event.title}</strong><small>{event.isDemo?'Reference artwork':event.location}</small></div></div></td><td>{event.service?.title||'Missing service'}</td><td>{event.images.length}</td><td><Status value={event.published?'published':'draft'}/></td><td><div className="table-actions"><Link className="icon-button" to={`/events/${event._id}`} target="_blank" aria-label={`View ${event.title}`}><Icon name="eye" size={18}/></Link><button className="icon-button" onClick={()=>startEditor(event)} aria-label={`Edit ${event.title}`}><Icon name="edit" size={18}/></button><button className="icon-button danger" disabled={busy===event._id} onClick={()=>remove(event)} aria-label={`Delete ${event.title}`}><Icon name="trash" size={18}/></button></div></td></tr>)}</tbody></table></div></TableState></div>{editing?<Editor initial={editing} services={services} onClose={()=>setEditing(null)} onSaved={event=>{setEditing(null);setMessage(`Saved ${event.title}. Album cover was verified.`);collection.reload();}}/>:null}</>;
}
