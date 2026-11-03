import React,{useEffect,useState} from 'react';
import {Dialog} from './UI.jsx';
import {Icon} from './Icon.jsx';
export default function Lightbox({images,start=0,onClose}){
 const [index,setIndex]=useState(start);
 const previous=()=>setIndex(i=>(i-1+images.length)%images.length);
 const next=()=>setIndex(i=>(i+1)%images.length);
 useEffect(()=>{const key=e=>{if(e.key==='ArrowRight')setIndex(i=>(i+1)%images.length);if(e.key==='ArrowLeft')setIndex(i=>(i-1+images.length)%images.length);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[images.length]);
 return <Dialog title="Celebration gallery" onClose={onClose} wide><div className="lightbox"><img src={images[index].url} alt={images[index].alt}/><div className="lightbox-controls"><button className="icon-button" onClick={previous} aria-label="Previous photo"><Icon name="arrow" className="rotate-arrow"/></button><p>{images[index].alt}<small>{index+1} of {images.length}</small></p><button className="icon-button" onClick={next} aria-label="Next photo"><Icon name="arrow"/></button></div></div></Dialog>;
}
