const FAQ={
prezzo:'Il costo dipende da superficie, complessità ed elaborati richiesti. I pacchetti sono in definizione: possiamo iniziare con un Home Value Check per individuare le priorità.',
vendita:'Per vendere o affittare valutiamo home staging, disposizione degli spazi e preparazione alla presentazione fotografica. Lo staging virtuale viene sempre dichiarato.',
affitto:'Progettiamo anche per locazioni brevi, studenti e immobili a reddito, con attenzione a durabilità, uso reale e praticità.',
design:'Interior Design comprende layout, palette, luce, materiali, arredi e shopping list, calibrati sulle esigenze.',
restyling:'Restyling significa cambiare volto agli spazi esistenti intervenendo su luce, colori, disposizione, finiture e arredi.',
lavori:'ABITAURA si occupa della progettazione residenziale. Le eventuali opere sono gestite da imprese incaricate con accordi separati, eventualmente CEMENTO.',
wellness:'Private Wellness è un concept di benessere residenziale: layout, materiali, privacy, comfort, luce e possibili integrazioni spa.',
tempo:'I tempi dipendono da dimensioni, fasi approvative ed eventuali lavori. Dopo il brief possiamo definire una stima realistica.',
zona:'ABITAURA ha radici a Messina e valuta progetti anche in altre zone. Indica la località nel modulo per una risposta più precisa.',
check:'Home Value Check è il punto d’ingresso: analizziamo necessità, obiettivi, layout, luce, budget e priorità di valorizzazione. Puoi richiederlo dal modulo nella pagina.',
default:'Posso spiegarti i servizi Interior Design, Home Staging, Restyling, immobili a reddito e Private Wellness. Raccontami il tuo progetto oppure compila il modulo per essere ricontattato.'};
export default function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Metodo non consentito'});
 const raw=typeof req.body==='string'?(()=>{try{return JSON.parse(req.body)}catch{return {}}})():req.body||{};
 const s=String(raw.message||'').slice(0,400).toLowerCase();
 const tags=[['prezzo',/prezz|cost|budget|tariff|quanto/],['vendita',/vend|staging|annunc|foto/],['affitto',/affitt|locaz|student|invest|rendita|short stay/],['design',/design|arred|progett|cucin|living/],['restyling',/rinnov|restyl|rimodern/],['lavori',/ristruttur|cantiere|lavori|edil/],['wellness',/wellness|spa|sauna|vasca|benessere/],['tempo',/temp|giorni|settimane/],['zona',/dove|messina|sicilia|italia/],['check',/check|appuntament|consulen|contatt|sopralluog/]];
 const key=tags.find(([key,regex])=>regex.test(s))?.[0]||'default';
 return res.status(200).json({reply:FAQ[key],cta:true,mode:'guided'});
}