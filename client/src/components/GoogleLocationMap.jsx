import React from 'react';
import {Icon} from './Icon.jsx';
const destination='Koothappar, Tiruchirappalli, Tamil Nadu, India';
const fallback=settings=>settings.mapsSearchUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.directionsDestination||destination)}`;
export default function GoogleLocationMap({settings,compact=false}){
 const directions=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.directionsDestination||destination)}`;
 const embed=settings.mapsEmbedUrl||`https://maps.google.com/maps?q=${encodeURIComponent(settings.directionsDestination||destination)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
 return <section className={`google-location-map ${compact?'google-location-map-compact':''}`} aria-labelledby="google-location-heading"><div className="google-location-copy"><p className="eyebrow">FIND US IN TRICHY</p><h2 id="google-location-heading">Find Us in Trichy</h2><p>{settings.locationDisplay||'Koothappar, Trichy'}</p><small>This map shows an approximate locality, not a verified office entrance.</small></div><div className="google-map-embed"><iframe src={embed} width="100%" height="380" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Map of the Koothappar, Tiruchirappalli locality"/><a className="map-fallback" href={fallback(settings)} target="_blank" rel="noopener noreferrer">Open location in Google Maps</a></div><a className="button google-directions" href={directions} target="_blank" rel="noopener noreferrer">Get Directions<Icon name="arrow" size={17}/></a></section>;
}
