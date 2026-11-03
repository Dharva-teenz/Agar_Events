import { spawn } from 'node:child_process';
const children=[];let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;for(const child of children)child.kill('SIGTERM');setTimeout(()=>process.exit(code),400);}
for(const workspace of ['server','client']){
 const child=spawn('npm',['run','dev','--workspace',workspace],{stdio:'inherit',shell:process.platform==='win32'});
 children.push(child);child.on('error',error=>{console.error(error.message);stop(1);});child.on('exit',code=>{if(!stopping)stop(code||0);});
}
process.once('SIGINT',()=>stop());process.once('SIGTERM',()=>stop());
