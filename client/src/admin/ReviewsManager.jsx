import React,{useState} from 'react';
import {api} from '../lib/api.js';
import {Button,Stars,Alert} from '../components/UI.jsx';
import {Icon} from '../components/Icon.jsx';
import {AdminHeading,useCollection,TableState,Status,formatDate} from './Common.jsx';
export default function ReviewsManager(){
 const collection=useCollection('reviews');const [error,setError]=useState('');const [busy,setBusy]=useState('');
 async function change(review,status){setBusy(review._id);setError('');try{await api(`/admin/reviews/${review._id}`,{method:'PATCH',body:{status}});collection.reload();}catch(e){setError(e.message);}finally{setBusy('');}}
 async function remove(review){if(!window.confirm(`Permanently delete ${review.name}'s review?`))return;setBusy(review._id);setError('');try{await api(`/admin/reviews/${review._id}`,{method:'DELETE'});collection.reload();}catch(e){setError(e.message);}finally{setBusy('');}}
 return <><AdminHeading title="Words from your clients." description="New reviews stay private until you approve them. Rejected reviews are not public."/><Alert>{error}</Alert><div className="admin-panel"><TableState collection={collection} empty="New customer reviews will appear here for approval."><div className="moderation-list">{collection.items.map(r=><article key={r._id}><div className="moderation-top"><div><h3>{r.name}</h3><small>{r.service?.title||'Celebration'} - {formatDate(r.createdAt)}</small></div><Status value={r.status}/></div><Stars value={r.rating}/><p>{r.comment}</p><div className="button-row"><Button disabled={busy===r._id||r.status==='approved'} onClick={()=>change(r,'approved')}><Icon name="check" size={17}/>Approve &amp; Publish</Button><Button variant="outline" disabled={busy===r._id||r.status==='rejected'} onClick={()=>change(r,'rejected')}>Reject / Unpublish</Button>{r.status!=='pending'?<button className="text-button" disabled={busy===r._id} onClick={()=>change(r,'pending')}>Move to pending</button>:null}<button className="icon-button danger" disabled={busy===r._id} onClick={()=>remove(r)} aria-label={`Delete review by ${r.name}`}><Icon name="trash" size={18}/></button></div></article>)}</div></TableState></div></>;
}
