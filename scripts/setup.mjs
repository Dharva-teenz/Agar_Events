import { randomBytes } from 'node:crypto';
import { readFile,writeFile,access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
async function exists(p){try{await access(p);return true;}catch{return false;}}
const serverPath=root+'server/.env';
if(!await exists(serverPath)){
 const secret=randomBytes(64).toString('hex');
 const example=await readFile(root+'server/.env.example','utf8');
 await writeFile(serverPath,example.replace(/^JWT_SECRET=.*$/m,`JWT_SECRET=${secret}`),{mode:0o600,flag:'wx'});
 console.log('\nLocal configuration created. Edit server/.env and set ADMIN_EMAIL and a private ADMIN_PASSWORD (12-72 bytes) before running the seed command.\n');
}else console.log('server/.env already exists; it was not overwritten.');
if(!await exists(root+'client/.env'))await writeFile(root+'client/.env',await readFile(root+'client/.env.example','utf8'),{flag:'wx'});
console.log('Next: set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env, start MongoDB, run npm run seed, then npm run dev.');
console.log('For an immediate no-install visual preview: npm run preview:offline');
