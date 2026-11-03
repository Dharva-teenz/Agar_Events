import React,{useEffect,useRef} from 'react';
import {Link} from '../lib/router.jsx';
import {Icon} from './Icon.jsx';
export function Button({to,variant='',children,className='',arrow=false,...props}){
  const classes=`button ${variant?'button-'+variant:''} ${className}`;
  const content=<>{children}{arrow?<Icon name="arrow" size={19}/>:null}</>;
  return to?<Link to={to} className={classes} {...props}>{content}</Link>:<button className={classes} {...props}>{content}</button>;
}
export function SectionTitle({eyebrow,title,description,to,action,children}){
 return <div className="section-heading"><div>{eyebrow?<p className="eyebrow">{eyebrow}</p>:null}<h2>{title}</h2>{description?<p className="section-description">{description}</p>:null}{children}</div>{to?<Button to={to} variant="outline" arrow>{action}</Button>:null}</div>;
}
export function Stars({value=5}){return <span className="stars" aria-label={`${value} out of 5 stars`}>{[1,2,3,4,5].map(i=><Icon key={i} name="star" size={15} fill={i<=value?'currentColor':'none'} className={i<=value?'':'star-empty'}/>)}</span>;}
export function Field({label,children,hint,wide=false}){return <label className={`field ${wide?'field-wide':''}`}><span>{label}</span>{children}{hint?<small>{hint}</small>:null}</label>;}
export function Alert({children,type='error'}){return children?<div className={`alert alert-${type}`} role={type==='error'?'alert':'status'}>{children}</div>:null;}
export function Spinner({label='Loading...'}){return <div className="loading-state" role="status"><span className="spinner"/>{label}</div>;}
export function EmptyState({title='Nothing here yet',children,to,action}){return <div className="empty-state"><Icon name="flower" size={40}/><h3>{title}</h3><p>{children}</p>{to?<Button to={to} arrow>{action}</Button>:null}</div>;}
export function ReferenceNote(){return <p className="reference-note"><Icon name="image" size={16}/> Design reference imagery. Real client albums can be added by the team.</p>;}
export function Dialog({title,children,onClose,wide=false}){
 const ref=useRef(null);
 useEffect(()=>{const dialog=ref.current;const previous=document.activeElement;dialog.showModal();const before=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=before;previous?.focus?.();};},[]);
 return <dialog className={`dialog ${wide?'dialog-wide':''}`} ref={ref} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}} aria-labelledby="dialog-title"><div className="dialog-content"><header className="dialog-header"><h2 id="dialog-title">{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="x"/></button></header>{children}</div></dialog>;
}
