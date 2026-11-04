const DB='https://fppdfqieorixaduolnzn.supabase.co';
const PUBLISHABLE='sb_publishable_Xcfrl3uX8anObTbvFNaQoA_-lx_TneJ';
const SERVICES=new Set(['Interior design','Home staging','Restyling','Investimento immobiliare','Private wellness','Altro']);
function clean(value,limit){return typeof value==='string'?value.trim().slice(0,limit):''}
export default async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Metodo non consentito'});
 try{
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
  if(body.website)return res.status(200).json({ok:true});
  const name=clean(body.name,120),email=clean(body.email,254).toLowerCase(),service=clean(body.service,80);
  if(name.length<2||!(/^[^@\s]+@[^@\s]+\.[^@\s]+$/).test(email)||!SERVICES.has(service)||body.privacy_accepted!==true) return res.status(400).json({error:'Controlla i campi obbligatori'});
  const sqm=body.area_sqm===null||body.area_sqm===undefined||body.area_sqm===''?null:Number(body.area_sqm);
  if(sqm!==null&&(!Number.isInteger(sqm)||sqm<1||sqm>100000))return res.status(400).json({error:'Superficie non valida'});
  const record={name,email,phone:clean(body.phone,40)||null,location:clean(body.location,140)||null,service,property_type:clean(body.property_type,80)||null,area_sqm:sqm,budget:clean(body.budget,60)||null,message:clean(body.message,3000)||null,status:'nuovo',source:'sito_abitaura',privacy_accepted:true,marketing_consent:false};
  const saved=await fetch(DB+'/rest/v1/abitaura_leads',{method:'POST',headers:{'apikey':PUBLISHABLE,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(record),signal:AbortSignal.timeout(10000)});
  if(!saved.ok){console.error('DB failed',saved.status,(await saved.text()).slice(0,250));return res.status(503).json({error:'Servizio momentaneamente non disponibile. Riprova.'})}
  return res.status(201).json({ok:true,message:'Richiesta registrata'});
 }catch(err){console.error('ABITAURA lead error',String(err).slice(0,150));return res.status(500).json({error:'Errore temporaneo. Riprova più tardi.'})}
}