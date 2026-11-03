import React from 'react';
import {useSite} from '../context/SiteContext.jsx';
import {Link} from '../lib/router.jsx';
import {Button,SectionTitle,EmptyState,ReferenceNote} from '../components/UI.jsx';
import {ServiceCard,EventCard,ReviewCard} from '../components/Cards.jsx';
import {Icon,Botanical} from '../components/Icon.jsx';
import FAQSection from '../components/FAQSection.jsx';
import GoogleLocationMap from '../components/GoogleLocationMap.jsx';
export function AboutSection({expanded=false}){
 const {data}=useSite();const s=data.settings;
 return <section className="section about-section"><div className="container about-grid"><div className="about-copy"><p className="eyebrow">ABOUT AGAR EVENTS</p><h2>Turning Moments<br/>Into <span className="text-bronze">Memories</span></h2><p>{s.aboutText}</p>{expanded?<p>Tell us what you have in mind: the occasion, the people, the mood, the place. Together, we can explore the details that will make it feel personal.</p>:null}<Button to={expanded?'/contact':'/about'} arrow>{expanded?'Plan Your Celebration':'Know More About Us'}</Button></div><div className="about-visual"><img src={s.aboutImage||'/media/about.webp'} alt="Golden floral walkway from the approved design reference" loading="lazy" width="663" height="609"/><div className="about-badge"><Icon name="flower" size={36}/><span>Creative<br/>Planning</span><i/><span>Exceptional<br/>Experiences</span></div></div></div></section>;
}
export function WhySection(){
 const reasons=[['diamond','Creative Concepts','Unique & thoughtful ideas'],['users','Personal Attention','Your celebration, considered'],['badge','End-to-End Planning','From your first idea to the day'],['heart','Personalized Service','Your vision, our priority']];
 return <section className="why-section"><div className="container"><h2>Why Choose Agar Events?</h2><div className="why-grid">{reasons.map(([icon,title,caption])=><div key={title}><Icon name={icon} size={43}/><h3>{title}</h3><p>{caption}</p></div>)}</div></div></section>;
}
export default function Home(){
 const {data,designMode}=useSite();const {settings:s,services,events,reviews}=data;
 const featured=[...events].sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)).slice(0,6);
 return <>
 <section className="hero" style={{'--hero-image':`url("${s.heroImage||'/media/hero.webp'}")`}}><div className="hero-photo"/><div className="hero-vignette"/><div className="container hero-content"><p className="hero-eyebrow">YOUR MOMENTS<br/>OUR CREATIONS</p><h1>{s.heroTitle.map((line,i)=><span key={i} className={i===2?'text-gold':''}>{line}</span>)}</h1><p className="hero-description">{s.heroSubtitle}</p><Button to="/contact" arrow>Plan Your Event</Button><div className="hero-bottom"><div className="hero-values"><div><strong>Your vision</strong><span>Our starting point</span></div><div><strong>Every detail</strong><span>Thoughtfully planned</span></div><div><strong>Beautiful moments</strong><span>Made personal</span></div><div><strong>{s.city}</strong><span>Our home</span></div></div>{s.storyUrl?<a className="story-link" href={s.storyUrl} target="_blank" rel="noopener noreferrer"><span><Icon name="play" size={20}/></span>Watch Our Story</a>:<Link className="story-link" to="/gallery"><span><Icon name="arrow" size={23}/></span>Explore Our Work</Link>}</div></div></section>
 <AboutSection/>
 <section className="section gallery-section"><Botanical/><div className="container"><SectionTitle eyebrow="OUR GALLERY" title="Moments We Created"/>{featured.length?<><div className="home-gallery">{featured.map(event=><EventCard key={event._id} event={event}/>)}</div><div className="homepage-section-action"><Button to="/gallery" arrow>View More Gallery</Button></div></>:<EmptyState title="New moments are on their way">The team will add event photos here soon.</EmptyState>}{featured.some(e=>e.isDemo)?<ReferenceNote/>:null}</div></section>
 <section className="section services-section"><div className="container"><SectionTitle eyebrow="WHAT WE DO" title="Our Services" description="Complete event solutions for all your special moments."/><div className="service-grid">{services.slice(0,10).map(service=><ServiceCard key={service._id} service={service}/>)}</div>{services.length?<div className="homepage-section-action"><Button to="/services" arrow>View All Services</Button></div>:null}</div></section>
 <WhySection/>
 <FAQSection/>
 <GoogleLocationMap settings={s}/>
 <section className="section testimonials-section"><div className="container"><SectionTitle eyebrow="TESTIMONIALS" title="What Our Clients Say" to="/reviews" action="View All Reviews"/>{reviews.length?<div className="review-grid">{reviews.slice(0,3).map(review=><ReviewCard key={review._id} review={review}/>)}</div>:<EmptyState title="Your story belongs here" to="/reviews?write=1" action="Write a Review">Celebrated with us? Share your experience. Genuine reviews appear here after approval.</EmptyState>}{designMode?<p className="reference-note">The review cards above are layout examples, not verified customer testimonials.</p>:null}</div></section>
 </>;
}
