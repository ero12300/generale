import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();const dist=path.join(root,'dist');
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
for(const file of ['index.html'])fs.copyFileSync(path.join(root,file),path.join(dist,file));
for(const dir of ['assets','src'])fs.cpSync(path.join(root,dir),path.join(dist,dir),{recursive:true});
const pick=(key)=>process.env[key]||'';
const cfg={apiKey:pick('FIREBASE_API_KEY'),authDomain:pick('FIREBASE_AUTH_DOMAIN'),projectId:pick('FIREBASE_PROJECT_ID'),storageBucket:pick('FIREBASE_STORAGE_BUCKET'),messagingSenderId:pick('FIREBASE_MESSAGING_SENDER_ID'),appId:pick('FIREBASE_APP_ID')};
const configured=!!(cfg.apiKey&&cfg.projectId&&cfg.appId);
// Only the PUBLIC Firebase web SDK configuration is emitted into the frontend.
fs.writeFileSync(path.join(dist,'config.js'),'window.BARATTIVO_FIREBASE_CONFIG = '+JSON.stringify(configured?cfg:null)+';\n');
console.log('Barattivo build ready: '+(configured?'Firebase web client configured':'clearly marked DEMO mode (no real backend)'));