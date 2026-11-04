import leadsHandler from './leads.js';
const ROLES=new Set(['Interior designer','Architetto o progettista tecnico','Fornitore / showroom','Artigiano / impresa esecutrice','3D artist / renderista','Fotografo / content creator','Partner immobiliare / segnalatore','Altro']);
function clean(input,max){return typeof input==='string'?input.trim().slice(0,max):''}
export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Metodo non consentito'})}
 try{
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
  const role=clean(body.partner_role,80);
  const name=clean(body.name,120),email=clean(body.email,254),location=clean(body.location,140);
  const description=clean(body.description,1200);
  if(!ROLES.has(role)||name.length<2||!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)||!location||description.length<15||body.privacy_accepted!==true)
   return res.status(400).json({error:'Controlla i campi obbligatori della candidatura'});
  const url=clean(body.portfolio,400);
  if(url){try{const parsed=new URL(url);if(!['http:','https:'].includes(parsed.protocol))throw Error('bad')}catch{return res.status(400).json({error:'Inserisci un URL valido per il portfolio'})}}
  const info=[
   '[CANDIDATURA NETWORK ABITAURA]',
   'Profilo: '+role,
   'Studio/azienda: '+clean(body.company,120),
   'Portfolio: '+url,
   'Competenze/proposta: '+description
  ].join('\n');
  const lead={
   name,email,phone:clean(body.phone,40),location,service:'Altro',
   property_type:'Collaborazione: '+role,
   area_sqm:null,budget:'',
   message:info.slice(0,3000),website:clean(body.website,100),
   privacy_accepted:true,marketing_consent:false
  };
  return leadsHandler({method:req.method,headers:req.headers || {},body:lead},res);
 }catch{
  return res.status(400).json({error:'Richiesta non valida'});
 }
}