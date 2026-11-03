import React,{lazy,Suspense,useEffect} from 'react';
import {useRoute} from './lib/router.jsx';
import {SiteProvider,useSite} from './context/SiteContext.jsx';
import {Header,Footer} from './components/Layout.jsx';
import {Spinner,Button} from './components/UI.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import {Services,ServiceDetail} from './pages/Services.jsx';
import {Gallery,EventDetail} from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';
import Reviews from './pages/Reviews.jsx';
import Privacy from './pages/Privacy.jsx';
import NotFound from './pages/NotFound.jsx';
import FloatingSocial from './components/FloatingSocial.jsx';
const AdminApp=lazy(()=>import('./pages/AdminApp.jsx'));
function PublicApp({pathname}){
 const {data,loading,error,refresh}=useSite();
 if(loading&&!data)return <Spinner label="Preparing your celebration..."/>;
 if(error&&!data)return <div className="connection-state"><h1>Agar Events</h1><h2>The website cannot reach its server.</h2><p>{error}</p><p>Start MongoDB and the API, or run <code>npm run preview:offline</code> to view the design without a database.</p><Button onClick={()=>refresh()}>Try Again</Button></div>;
 if(!data)return null;
 let page;
 if(pathname==='/')page=<Home/>;
 else if(pathname==='/about')page=<About/>;
 else if(pathname==='/services')page=<Services/>;
 else if(/^\/services\/[^/]+$/.test(pathname))page=<ServiceDetail slug={decodeURIComponent(pathname.split('/')[2])}/>;
 else if(pathname==='/gallery')page=<Gallery/>;
 else if(/^\/events\/[^/]+$/.test(pathname))page=<EventDetail key={pathname} id={decodeURIComponent(pathname.split('/')[2])}/>;
 else if(pathname==='/contact')page=<Contact/>;
 else if(pathname==='/reviews')page=<Reviews/>;
 else if(pathname==='/privacy')page=<Privacy/>;
 else page=<NotFound/>;
 return <><Header/><main id="main-content" tabIndex={-1}>{page}</main><Footer/><FloatingSocial/></>;
}
export default function App(){
 const {pathname}=useRoute();const admin=pathname==='/admin'||pathname.startsWith('/admin/');
 useEffect(()=>{
  document.title='Agar Events Trichy | Wedding & Event Management';
  document.getElementById('main-content')?.focus({preventScroll:true});
 },[pathname,admin]);
 return admin?<Suspense fallback={<Spinner label="Opening admin studio..."/>}><AdminApp/></Suspense>:<SiteProvider><PublicApp pathname={pathname}/></SiteProvider>;
}
