// Browser-only Firebase adapter. The app uses a demo adapter when config.js is not configured.
// Firebase SDK public client configuration is not a secret; service-account credentials ARE secrets.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile,signOut} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,collection,doc,getDoc,getDocs,setDoc,addDoc,updateDoc,deleteDoc,query,where,orderBy,limit,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
import {getStorage,ref,uploadBytes,getDownloadURL} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js';
const id=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`;
const stamp=x=>x?.toMillis?.()||0;
export async function createFirebaseService(config){
 const app=initializeApp(config);const auth=getAuth(app);const db=getFirestore(app);const storage=getStorage(app);
 const requireAuth=()=>{if(!auth.currentUser)throw new Error('Accedi per continuare.');return auth.currentUser};
 const getProfile=async uid=>{const s=await getDoc(doc(db,'profiles',uid));return s.exists()?s.data():{displayName:'Utente'};};
 const inChat=async chatId=>{const u=requireAuth();const d=await getDoc(doc(db,'chats',chatId));if(!d.exists()||!d.data().participants.includes(u.uid))throw new Error('Conversazione non disponibile.');return d.data()};
 return {
  mode:'firebase',onAuth(fn){return onAuthStateChanged(auth,fn)},
  async login(email,password){await signInWithEmailAndPassword(auth,email,password);return auth.currentUser},
  async register(name,email,password){const c=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(c.user,{displayName:name});await setDoc(doc(db,'profiles',c.user.uid),{displayName:name,type:'person',city:'',avatarUrl:'',verified:false,createdAt:serverTimestamp()});return c.user},
  async logout(){await signOut(auth)},
  async getListings(){const s=await getDocs(query(collection(db,'listings'),where('status','==','published'),limit(80)));return s.docs.map(d=>({id:d.id,...d.data(),createdAt:stamp(d.data().createdAt)})).sort((a,b)=>b.createdAt-a.createdAt)},
  async createListing(data){const user=requireAuth();const profile=await getProfile(user.uid);const out={title:data.title.slice(0,120),description:data.description.slice(0,2000),category:data.category,type:data.type,want:data.want.slice(0,500),city:data.city.slice(0,100),image:data.image||'',ownerId:user.uid,ownerName:profile.displayName||user.displayName||'Utente',ownerAvatar:'🙂',status:'published',createdAt:serverTimestamp()};const d=await addDoc(collection(db,'listings'),out);return{id:d.id,...out}},
  async uploadImage(file){const user=requireAuth();if(!file.type.startsWith('image/')||file.size>4*1024*1024)throw new Error('Carica una foto JPG, PNG o WEBP inferiore a 4 MB.');const safeExt=file.name.split('.').pop()?.replace(/[^a-z0-9]/ig,'')||'jpg';const r=ref(storage,`users/${user.uid}/listings/${id()}.${safeExt}`);await uploadBytes(r,file,{contentType:file.type});return await getDownloadURL(r)},
  async getPosts(){const s=await getDocs(query(collection(db,'posts'),orderBy('createdAt','desc'),limit(30)));return s.docs.map(d=>({id:d.id,...d.data(),createdAt:stamp(d.data().createdAt)}))},
  async createPost(text){const user=requireAuth();const profile=await getProfile(user.uid);const post={authorId:user.uid,authorName:profile.displayName||'Utente',avatar:'🙂',text:text.slice(0,700),tag:'Community',createdAt:serverTimestamp()};const d=await addDoc(collection(db,'posts'),post);return {id:d.id,...post}},
  async getFavorites(){const user=auth.currentUser;if(!user)return[];const s=await getDocs(collection(db,'profiles',user.uid,'favorites'));return s.docs.map(x=>x.id)},
  async toggleFavorite(listingId){const user=requireAuth();const ref=doc(db,'profiles',user.uid,'favorites',listingId);const d=await getDoc(ref);if(d.exists()){await deleteDoc(ref);return false}await setDoc(ref,{createdAt:serverTimestamp()});return true},
  async startChat(listing){const user=requireAuth();if(user.uid===listing.ownerId)throw new Error('Questo è il tuo annuncio.');const participants=[user.uid,listing.ownerId].sort();const chatId=participants.join('__')+'__'+listing.id;const r=doc(db,'chats',chatId);let d=await getDoc(r);if(!d.exists()){try{await setDoc(r,{participants,listingId:listing.id,listingTitle:listing.title,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),lastMessage:''})}catch(e){d=await getDoc(r);if(!d.exists())throw e}}return{id:chatId,participants,listingId:listing.id,listingTitle:listing.title}},
  async getChats(){const user=requireAuth();const s=await getDocs(query(collection(db,'chats'),where('participants','array-contains',user.uid),limit(40)));return s.docs.map(d=>({id:d.id,...d.data()}))},
  async getMessages(chatId){await inChat(chatId);const s=await getDocs(query(collection(db,'chats',chatId,'messages'),orderBy('createdAt','asc'),limit(100)));return s.docs.map(d=>({id:d.id,...d.data(),createdAt:stamp(d.data().createdAt)}))},
  async sendMessage(chatId,text){await inChat(chatId);await addDoc(collection(db,'chats',chatId,'messages'),{senderId:requireAuth().uid,text:text.slice(0,2000),createdAt:serverTimestamp()});await updateDoc(doc(db,'chats',chatId),{lastMessage:text.slice(0,180),updatedAt:serverTimestamp()})},
  async createProposal(chatId,terms){const chat=await inChat(chatId);const user=requireAuth();await addDoc(collection(db,'chats',chatId,'proposals'),{senderId:user.uid,receiverId:chat.participants.find(x=>x!==user.uid),terms:terms.slice(0,1500),status:'pending',createdAt:serverTimestamp(),updatedAt:serverTimestamp()})},
  async getProposals(chatId){await inChat(chatId);const s=await getDocs(collection(db,'chats',chatId,'proposals'));return s.docs.map(d=>({id:d.id,...d.data(),createdAt:stamp(d.data().createdAt)}))},
  async updateProposal(chatId,proposalId,status){await inChat(chatId);await updateDoc(doc(db,'chats',chatId,'proposals',proposalId),{status,updatedAt:serverTimestamp()})},
  async reportListing(listingId,reason){const user=requireAuth();await addDoc(collection(db,'reports'),{listingId,reason,reporterId:user.uid,status:'new',createdAt:serverTimestamp()})}
 };
}