import React,{useEffect,useState} from 'react';
import {api,setCSRF,DESIGN_MODE} from '../lib/api.js';
import {Link,navigate,useRoute} from '../lib/router.jsx';
import {Logo} from '../components/Layout.jsx';
import {Icon} from '../components/Icon.jsx';
import {Button,Field,Alert,Spinner} from '../components/UI.jsx';
import Overview from '../admin/Overview.jsx';
import ServicesManager from '../admin/ServicesManager.jsx';
import EventsManager from '../admin/EventsManager.jsx';
import ReviewsManager from '../admin/ReviewsManager.jsx';
import EnquiriesManager from '../admin/EnquiriesManager.jsx';
import SettingsManager from '../admin/SettingsManager.jsx';
import FAQsManager from '../admin/FAQsManager.jsx';
import '../admin.css';
const nav=[['Overview','/admin','grid'],['Services','/admin/services','rings'],['Event Albums','/admin/events','image'],['Customer Reviews','/admin/reviews','star'],['Enquiries','/admin/enquiries','mail'],['FAQ Management','/admin/faqs','quote'],['Website Settings','/admin/settings','settings']];
function Login({onLogin,notice}){
 const [form,setForm]=useState({email:'',password:''});const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();if(DESIGN_MODE){setError('The offline preview does not provide a fake admin login. Start MongoDB and the API, then sign in with the credentials from npm run setup.');return;}setBusy(true);setError('');try{const result=await api('/auth/login',{method:'POST',body:form});setCSRF(result.csrf);onLogin(result.admin);}catch(err){setError(err.message);}finally{setBusy(false);}}
 return <div className="admin-login"><Link to="/" className="login-back"><Icon name="arrow" size={17} className="rotate-arrow"/>Back to website</Link><div className="login-brand"><Logo/><h1>Beautiful moments.<br/><span>Thoughtfully managed.</span></h1><p>Your Agar Events admin studio.</p></div><div className="login-panel"><span className="login-lock"><Icon name="lock" size={27}/></span><p className="eyebrow">AGAR EVENTS - ADMIN STUDIO</p><h2>Welcome back.</h2><p>Sign in to manage your celebrations.</p><Alert type="success">{notice}</Alert><Alert>{error}</Alert>{DESIGN_MODE?<Alert type="info">Visual preview only. The real admin area needs the MongoDB / Express backend. No shared demo password is included.</Alert>:null}<form onSubmit={submit}><Field label="Email address"><input type="email" required autoComplete="username" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Your admin email"/></Field><Field label="Password"><input type="password" required autoComplete="current-password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Your password"/></Field><Button type="submit" disabled={busy} arrow>{busy?'Signing in...':'Sign In to Admin'}</Button></form><small>Use the credentials generated during setup. Passwords are not stored in the browser.</small></div></div>;
}
export default function AdminApp(){
 const {pathname}=useRoute();const [admin,setAdmin]=useState(null);const [loading,setLoading]=useState(!DESIGN_MODE);const [notice,setNotice]=useState('');const [menu,setMenu]=useState(false);const [error,setError]=useState('');const [loggingOut,setLoggingOut]=useState(false);
 useEffect(()=>{if(DESIGN_MODE)return;const controller=new AbortController();api('/auth/session',{signal:controller.signal}).then(result=>{setCSRF(result.csrf);setAdmin(result.admin);}).catch(e=>{if(e.name!=='AbortError'&&e.status!==401)setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[]);
 useEffect(()=>{const expired=()=>{setAdmin(null);setCSRF('');setNotice('Your session expired. Please sign in again.');};window.addEventListener('agar:unauthorized',expired);return()=>window.removeEventListener('agar:unauthorized',expired);},[]);
 useEffect(()=>{setMenu(false);},[pathname]);
 async function logout(){setLoggingOut(true);try{await api('/auth/logout',{method:'POST'});setCSRF('');setAdmin(null);navigate('/admin');}catch(e){if(e.status===401){setCSRF('');setAdmin(null);}else setError(e.message);}finally{setLoggingOut(false);}}
 if(loading)return <Spinner label="Checking your secure session..."/>;
 if(!admin)return <Login notice={notice||error} onLogin={value=>{setAdmin(value);setError('');setNotice('');}}/>;
 const current=nav.find(v=>v[1]===pathname)||nav[0];
 let page=<Overview/>;
 if(pathname==='/admin/services')page=<ServicesManager/>;
 else if(pathname==='/admin/events')page=<EventsManager/>;
 else if(pathname==='/admin/reviews')page=<ReviewsManager/>;
 else if(pathname==='/admin/enquiries')page=<EnquiriesManager/>;
 else if(pathname==='/admin/faqs')page=<FAQsManager/>;
 else if(pathname==='/admin/settings')page=<SettingsManager onPasswordChanged={()=>{setAdmin(null);setCSRF('');setNotice('Password updated. Please sign in with your new password.');navigate('/admin');}}/>;
 else if(pathname!=='/admin')page=<div className="admin-panel"><h1>Page not found</h1><Button to="/admin">Admin overview</Button></div>;
 return <div className="admin-shell"><aside className={`admin-sidebar ${menu?'open':''}`}><Link to="/admin" aria-label="Admin overview"><Logo/></Link><p className="sidebar-label">ADMIN STUDIO</p><nav aria-label="Admin navigation">{nav.map(([name,to,icon])=><Link key={to} to={to} className={pathname===to?'active':''}><Icon name={icon} size={20}/>{name}</Link>)}</nav><Link to="/" className="view-site" target="_blank"><Icon name="eye" size={19}/>View Website<Icon name="arrow" size={16}/></Link><button className="logout-button" onClick={logout} disabled={loggingOut}><Icon name="logout" size={19}/>{loggingOut?'Signing out...':'Sign Out'}</button></aside>{menu?<button className="sidebar-backdrop" onClick={()=>setMenu(false)} aria-label="Close admin navigation"/>:null}<div className="admin-body"><header className="admin-topbar"><div><button className="icon-button admin-menu-toggle" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="Toggle admin navigation"><Icon name={menu?'x':'menu'}/></button><span>{current[0]}</span></div><div className="admin-user"><span><strong>Administrator</strong><small>{admin.email}</small></span><i>{admin.email[0].toUpperCase()}</i></div></header><main className="admin-main"><Alert>{error}</Alert>{page}</main><footer className="admin-footer">Agar Events, Trichy - Your moments. Our creations.</footer></div></div>;
}
