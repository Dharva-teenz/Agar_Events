import React from 'react';
// Small, consistent 1.65px outline icon family. Interface text remains native HTML.
const paths={
 arrow:<><path d="M4 12h15M13 5l7 7-7 7"/></>,
 chevron:<path d="m9 5 7 7-7 7"/>,
 down:<path d="m5 9 7 7 7-7"/>,
 menu:<path d="M3 6h18M3 12h18M3 18h18"/>,
 x:<path d="m6 6 12 12M6 18 18 6"/>,
 heart:<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
 rings:<><circle cx="8" cy="14" r="6"/><circle cx="16" cy="14" r="6"/><path d="m6 6 2-3 2 3M14 6l2-3 2 3"/></>,
 gift:<><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8H7a3 3 0 1 1 3-3l2 3Zm0 0h5a3 3 0 1 0-3-3l-2 3Z"/></>,
 users:<><circle cx="9" cy="7" r="3.5"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 4 6v1"/></>,
 home:<><path d="m2 11 10-9 10 9M5 9v12h14V9M9 21v-8h6v8"/></>,
 star:<path d="m12 2 3.1 6.3 7 .9-5.1 5 1.2 7-6.2-3.3L5.8 21l1.2-6.8-5-5 6.9-.9Z"/>,
 diamond:<><path d="m3 8 4-5h10l4 5-9 14L3 8Zm0 0h18M7 3l5 19 5-19M7 3l5 5 5-5"/></>,
 badge:<><path d="m12 2 3 2 3.5.5.5 3.5 2 4-2 3-.5 3.5-3.5.5-3 3-3-3-3.5-.5L5 15l-2-3 2-4 .5-3.5L9 4Z"/><path d="m8 12 3 3 5-6"/></>,
 flower:<><path d="M12 22V9M12 16C2 15 2 8 2 8s7-1 10 8Zm0-1c10-1 10-8 10-8s-7-1-10 8ZM12 11C5 4 12 1 12 1s7 3 0 10Z"/></>,
 phone:<path d="m21 16-4-2-2 2a15 15 0 0 1-7-7l2-2-2-4H4C2 4 4 12 9 17s11 7 12 3Z"/>,
 mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
 pin:<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 instagram:<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></>,
 whatsapp:<><path d="M21 11.5a9 9 0 0 1-13.4 7.9L2 21l1.6-5.6A9 9 0 1 1 21 11.5Z"/><path d="m8 7-1 1c0 4 4 8 8 8l1-2-3-1-1 1-3-3 1-1-2-3Z"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18"/></>,
 check:<path d="m5 12 4 4L20 5"/>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
 image:<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/></>,
 upload:<><path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/></>,
 plus:<path d="M12 4v16M4 12h16"/>,
 trash:<><path d="M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/></>,
 edit:<><path d="m15 4 5 5M3 21l5-1L21 7a2 2 0 0 0-4-4L4 16l-1 5Z"/></>,
 grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
 settings:<><path d="m9 3 1-1h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1Z" transform="translate(0 -1) scale(.96)"/><circle cx="12" cy="12" r="3"/></>,
 logout:<><path d="M9 3H4v18h5M10 12h11m-5-5 5 5-5 5"/></>,
 shield:<><path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/></>,
 quote:<><path d="M10 5C4 5 3 10 3 13v6h7v-7H6c0-3 2-4 4-4V5ZM21 5c-6 0-7 5-7 8v6h7v-7h-4c0-3 2-4 4-4V5Z"/></>,
 copy:<><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/></>,
 eye:<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
 play:<path d="m8 4 13 8-13 8Z"/>,
 lock:<><rect x="4" y="10" width="16" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3M12 15v3"/></>
};
export function Icon({name='arrow',size=22,className='',...props}){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`icon ${className}`} {...props}>{paths[name]||paths.star}</svg>;
}
export function Botanical(){return <svg className="botanical" viewBox="0 0 130 280" fill="none" aria-hidden="true"><path d="M12 280C95 190 12 90 92 2M50 215C4 205 12 159 12 159s45 12 38 56Zm3-32c63-22 55-69 55-69s-48 28-55 69ZM50 141C1 120 14 87 14 87s34 15 36 54Zm12-37c55-16 56-49 56-49S77 71 62 104ZM75 58C47 32 61 10 61 10s16 22 14 48Z" stroke="currentColor" strokeWidth=".65"/></svg>;}
