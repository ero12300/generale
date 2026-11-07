import {seedListings,seedPosts} from './demo.js';
const DEMO_KEY='barattivo.preview.v4';
function loadLocal(){try{return JSON.parse(sessionStorage.getItem(DEMO_KEY))||{listings:[],posts:[],chats:{},favorites:[],user:null}}catch{return {listings:[],posts:[],chats:{},favorites:[],user:null}}}
let local=loadLocal();
const save=()=>sessionStorage.setItem(DEMO_KEY,JSON.stringify(local));
const generateId=()=>globalThis.crypto?.randomUUID?.()||String(Date.now())+Math.random().toString(36).slice(2);
const demo={
 mode:'demo',
 onAuth(fn){fn(local.user);return ()=>{}},
 async login(){local.user={uid:'demo-visitor',displayName:'Ospite demo',email:'demo@barattivo.example'};save();return local.user},
 async register(name){local.user={uid:'demo-visitor',displayName:name||'Ospite demo',email:'demo@barattivo.example'};save();return local.user},
 async logout(){local.user=null;save()},
 async getListings(){return [...local.listings,...seedListings].sort((a,b)=>b.createdAt-a.createdAt)},
 async createListing(data){if(!local.user)throw new Error('Accedi prima di pubblicare.');const l={...data,id:generateId(),ownerId:local.user.uid,ownerName:local.user.displayName,ownerAvatar:'🙂',city:data.city||'Italia',status:'published',createdAt:Date.now()};local.listings.unshift(l);save();return l},
 async uploadImage(file){if(!file)return null;if(file.size>4*1024*1024)throw new Error('La foto deve essere inferiore a 4 MB.');return new Promise((ok,fail)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>fail(new Error('Foto non leggibile'));r.readAsDataURL(file)})},
 async getPosts(){return [...local.posts,...seedPosts].sort((a,b)=>b.createdAt-a.createdAt)},
 async createPost(text){if(!local.user)throw new Error('Accedi prima di scrivere.');const p={id:generateId(),authorId:local.user.uid,authorName:local.user.displayName,avatar:'🙂',text,tag:'Community',createdAt:Date.now()};local.posts.unshift(p);save();return p},
 async getFavorites(){return local.favorites},
 async toggleFavorite(id){if(!local.user)throw new Error('Accedi per salvare i preferiti.');local.favorites=local.favorites.includes(id)?local.favorites.filter(x=>x!==id):[...local.favorites,id];save();return local.favorites.includes(id)},
 async startChat(listing){if(!local.user)throw new Error('Accedi per scrivere.');if(listing.ownerId===local.user.uid)throw new Error('Questo è un tuo annuncio.');const id=[local.user.uid,listing.ownerId].sort().join('__')+'__'+listing.id;if(!local.chats[id])local.chats[id]={id,participants:[local.user.uid,listing.ownerId],listingId:listing.id,listingTitle:listing.title,otherName:listing.ownerName,messages:[],proposals:[]};save();return local.chats[id]},
 async getChats(){if(!local.user)return [];return Object.values(local.chats).filter(c=>c.participants.includes(local.user.uid))},
 async getMessages(id){return local.chats[id]?.messages||[]},
 async sendMessage(id,text){if(!local.chats[id])throw new Error('Chat non trovata.');local.chats[id].messages.push({id:generateId(),senderId:local.user.uid,text,createdAt:Date.now()});save()},
 async createProposal(id,terms){const c=local.chats[id];if(!c)throw new Error('Chat non trovata.');c.proposals.push({id:generateId(),senderId:local.user.uid,receiverId:c.participants.find(x=>x!==local.user.uid),terms,status:'pending',createdAt:Date.now()});save()},
 async getProposals(id){return local.chats[id]?.proposals||[]},
 async updateProposal(id,pid,status){const p=local.chats[id]?.proposals.find(x=>x.id===pid);if(!p)throw new Error('Proposta non trovata.');if(p.senderId===local.user.uid&&status!=='cancelled')throw new Error('Solo il destinatario può rispondere.');p.status=status;save()},
 async reportListing(id,reason){if(!local.user)throw new Error('Accedi prima di segnalare.');local.reports=[...(local.reports||[]),{id:generateId(),listingId:id,reporterId:local.user.uid,reason}];save()}
};
let current=demo;
export async function initService(){const config=window.BARATTIVO_FIREBASE_CONFIG;
 if(config?.apiKey&&config?.projectId&&config?.appId){const module=await import('./firebase-adapter.js');current=await module.createFirebaseService(config);return current}
 return current;
}
export const api=new Proxy({}, {get(_,prop){const val=current[prop];return typeof val==='function'?val.bind(current):val}});