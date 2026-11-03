import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../preview/',import.meta.url)));
const port=Number(process.env.PREVIEW_PORT)||4173;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
http.createServer((req,res)=>{
 let requested;try{requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Bad path');}
 let file=path.resolve(root,'.'+requested);
 if(file!==root && !file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
 if(!path.extname(file))file=path.join(root,'index.html');
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});fs.createReadStream(file).pipe(res);
}).listen(port,'127.0.0.1',()=>{console.log(`Agar Events visual preview: http://127.0.0.1:${port}`);console.log('Read-only design preview. The API, database and admin require the full setup. Press Ctrl+C to stop.');});
