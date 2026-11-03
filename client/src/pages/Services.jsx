import React from 'react';
import {useSite} from '../context/SiteContext.jsx';
import {Link} from '../lib/router.jsx';
import {PageIntro} from '../components/Layout.jsx';
import {ServiceCard,EventCard} from '../components/Cards.jsx';
import {Button,SectionTitle,ReferenceNote,EmptyState} from '../components/UI.jsx';
import {Icon} from '../components/Icon.jsx';
import NotFound from './NotFound.jsx';
export function Services(){
 const {data}=useSite();return <><PageIntro eyebrow="WHAT WE DO" title="For every occasion." accent="For every beautiful moment." description="Find your celebration. Explore the details. Make it yours."/><section className="section"><div className="container"><SectionTitle eyebrow="CELEBRATE WITH AGAR" title="Our Services" description="Choose a service to explore its event galleries and plan your celebration."/><div className="service-grid">{data.services.map(s=><ServiceCard key={s._id} service={s}/>)}</div><div className="inline-cta"><div><h3>Something a little different?</h3><p>Tell us what you are imagining. Let's start with your idea.</p></div><Button to="/contact" arrow>Let's Talk</Button></div></div></section></>;
}
export function ServiceDetail({slug}){
 const {data}=useSite();const service=data.services.find(s=>s.slug===slug);if(!service)return <NotFound/>;
 const events=data.events.filter(e=>String(e.service)===String(service._id));
 return <><PageIntro eyebrow="OUR SERVICES" title={service.title} description={service.subtitle} image={service.coverImage}><Button to={`/contact?service=${service.slug}`} arrow>Plan This Event</Button></PageIntro><section className="section"><div className="container"><Link to="/services" className="back-link"><Icon name="arrow" className="rotate-arrow" size={17}/>All services</Link><div className="service-detail-intro"><div><p className="eyebrow">MAKE IT YOURS</p><h2>A celebration<br/>with your signature.</h2></div><div><p>{service.description}</p><ul className="feature-list">{service.features.map(feature=><li key={feature}><Icon name="check" size={18}/>{feature}</li>)}</ul><p className="small-note">Scope, availability and pricing are confirmed with the team after your enquiry.</p></div></div><SectionTitle eyebrow="EXPLORE THIS SERVICE" title={`${service.title} Gallery`}/>{events.length?<div className="event-grid">{events.map(event=><EventCard key={event._id} event={event}/>)}</div>:<EmptyState title="A new chapter is coming">Photos for this service will appear here once the team publishes an album.</EmptyState>}{events.some(e=>e.isDemo)?<ReferenceNote/>:null}<div className="inline-cta"><div><h3>Let's bring your idea to life.</h3><p>Share your date, location and requirements with us.</p></div><Button to={`/contact?service=${service.slug}`} arrow>Enquire for {service.title}</Button></div></div></section></>;
}
