/** Barattivo: transparent identity signals. No self-assigned verification badges. */
export const SOCIAL_PROVIDERS = Object.freeze({
 instagram:{label:'Instagram',host:'instagram.com'},
 facebook:{label:'Facebook',host:'facebook.com'},
 linkedin:{label:'LinkedIn',host:'linkedin.com'},
 tiktok:{label:'TikTok',host:'tiktok.com'}
});
export function normalizeSocialLink(provider, raw) {
 if(!SOCIAL_PROVIDERS[provider]) throw new Error('Social non supportato.');
 const value=String(raw||'').trim(); if(!value) return '';
 let url;
 try {url=new URL(value);} catch {throw new Error('Inserisci un link HTTPS completo, ad esempio https://www.instagram.com/profilo.');}
 const host=SOCIAL_PROVIDERS[provider].host;
 if(url.protocol!=='https:' || ![host,`www.${host}`].includes(url.hostname.toLowerCase()) || url.username || url.password || url.port) throw new Error('Il collegamento non appartiene al social selezionato.');
 const path=url.pathname.replace(/\/+$/,'');
 if(path.length<2 || path.length>180 || !/^\/[\w@.\-/]+$/.test(path)) throw new Error('Il link deve indicare un profilo pubblico.');
 const reserved=['/login','/share','/explore','/reels','/watch','/help','/policies','/business'];
 if(reserved.includes(path.toLowerCase())) throw new Error('Inserisci un profilo, non una pagina generale.');
 return `https://www.${host}${path}`;
}
export function normalizeSocialLinks(value) {
 if(value!=null && (typeof value!=='object'||Array.isArray(value)))throw new Error('Collegamenti social non validi.');
 const output={};
 for(const key of Object.keys(SOCIAL_PROVIDERS)) output[key]=normalizeSocialLink(key,value?.[key]);
 return output;
}
export function publicTrustSignals(profile={}) {
 return {
  identityVerified:profile.verified===true,
  // Never interpret a user-supplied link or self-uploaded photo as identity proof.
  socialLinks:normalizeSocialLinks(profile.socialLinks),
  hasAvatar:typeof profile.avatarUrl==='string' && !!profile.avatarUrl.trim(),
  profileComplete:!!(String(profile.displayName||'').trim()&&String(profile.bio||'').trim()&&String(profile.city||'').trim())
 };
}
export const SAFETY_GUIDE=[
 'Leggi il profilo pubblico e verifica che annunci, descrizione e foto siano coerenti.',
 'I link social sono dichiarati dall’utente: non equivalgono a una verifica dell’identità.',
 'Fai domande nella chat di Barattivo e chiarisci cosa viene scambiato e quando.',
 'Per incontri di persona scegli un luogo pubblico e informa una persona di fiducia.',
 'Evita anticipi, pagamenti fuori dalla piattaforma, documenti, password e dati bancari.',
 'Se noti pressioni o comportamenti sospetti, interrompi la trattativa, blocca e segnala.'
];