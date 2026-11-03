import React,{useState} from 'react';
import {api} from '../lib/api.js';
import {Button,Field,Dialog,Alert} from '../components/UI.jsx';
import {Icon} from '../components/Icon.jsx';
import {AdminHeading,useCollection,TableState,Status} from './Common.jsx';

function Editor({initial,onClose,onSaved}){
  const [draft,setDraft]=useState(initial);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const change=e=>setDraft(d=>({...d,[e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value}));
  async function submit(e){
    e.preventDefault();setBusy(true);setError('');
    try{
      await api(`/admin/faqs${initial._id?'/'+initial._id:''}`,{method:initial._id?'PUT':'POST',body:{...draft,sortOrder:Number(draft.sortOrder)}});
      onSaved();
    }catch(err){setError(err.message);}finally{setBusy(false);}
  }
  return <Dialog title={initial._id?'Edit FAQ':'Add an FAQ'} onClose={onClose} wide>
    <Alert>{error}</Alert>
    <form onSubmit={submit} className="form-grid">
      <Field label="Question *" wide><input name="question" value={draft.question} onChange={change} required minLength={5} maxLength={240}/></Field>
      <Field label="Answer *" wide><textarea name="answer" value={draft.answer} onChange={change} required minLength={5} maxLength={4000} rows={6}/></Field>
      <Field label="Display order" hint="Lower numbers appear first. Equal numbers use creation order."><input name="sortOrder" type="number" value={draft.sortOrder} onChange={change} min={0} max={9999} step={1} required/></Field>
      <label className="checkbox-label field-wide"><input name="active" type="checkbox" checked={draft.active} onChange={change}/>Enabled and visible on the homepage</label>
      <div className="dialog-actions field-wide"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}>{busy?'Saving...':'Save FAQ'}</Button></div>
    </form>
  </Dialog>;
}

export default function FAQsManager(){
  const collection=useCollection('faqs');
  const [editing,setEditing]=useState(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState('');
  async function remove(faq){
    if(!window.confirm(`Permanently delete the FAQ "${faq.question}"?`))return;
    setBusy(faq._id);setError('');
    try{await api(`/admin/faqs/${faq._id}`,{method:'DELETE'});collection.reload();}
    catch(err){setError(err.message);}finally{setBusy('');}
  }
  async function toggle(faq){
    setBusy(faq._id);setError('');
    try{await api(`/admin/faqs/${faq._id}`,{method:'PUT',body:{...faq,active:!faq.active}});collection.reload();}
    catch(err){setError(err.message);}finally{setBusy('');}
  }
  return <>
    <AdminHeading title="Frequently asked questions." description="Manage the questions below Why Choose Agar Events on the homepage. Lower display orders appear first.">
      <Button onClick={()=>setEditing({question:'',answer:'',active:true,sortOrder:0})}><Icon name="plus" size={18}/>Add FAQ</Button>
    </AdminHeading>
    <Alert>{error}</Alert>
    <div className="admin-panel"><TableState collection={collection} empty="Add your first frequently asked question.">
      <div className="table-scroll"><table><thead><tr><th>Question</th><th>Order</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>
        {collection.items.map(faq=><tr key={faq._id}>
          <td><strong>{faq.question}</strong><small>{faq.answer.length>150?faq.answer.slice(0,150)+'…':faq.answer}</small></td>
          <td>{faq.sortOrder}</td><td><Status value={faq.active?'active':'hidden'}/></td>
          <td><div className="table-actions">
            <button className="icon-button" disabled={busy===faq._id} aria-label={`Edit ${faq.question}`} onClick={()=>setEditing(faq)}><Icon name="edit" size={18}/></button>
            <button className="icon-button" disabled={busy===faq._id} aria-label={`${faq.active?'Disable':'Enable'} ${faq.question}`} onClick={()=>toggle(faq)}><Icon name={faq.active?'eye':'plus'} size={18}/></button>
            <button className="icon-button danger" disabled={busy===faq._id} aria-label={`Delete ${faq.question}`} onClick={()=>remove(faq)}><Icon name="trash" size={18}/></button>
          </div></td>
        </tr>)}
      </tbody></table></div>
    </TableState></div>
    {editing?<Editor initial={editing} onClose={()=>setEditing(null)} onSaved={()=>{setEditing(null);collection.reload();}}/>:null}
  </>;
}
