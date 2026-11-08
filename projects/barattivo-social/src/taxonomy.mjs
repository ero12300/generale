/** Barattivo taxonomy v2: one canonical ID per kind, nested subcategory and context. */
export const KINDS = [
 {id:'all',label:'Tutto',icon:'✳'}, {id:'object',label:'Oggetti',icon:'📦'},
 {id:'service',label:'Servizi',icon:'🛠️'}, {id:'time',label:'Tempo e aiuto',icon:'⏱️'}
];
export const TAXONOMY = [
 {id:'casa',kind:'object',icon:'🛋️',label:'Casa e arredo',sub:['Mobili','Decorazioni','Cucina','Tessili']},
 {id:'moda',kind:'object',icon:'👕',label:'Abbigliamento',sub:['Donna','Uomo','Accessori','Scarpe']},
 {id:'tech',kind:'object',icon:'💻',label:'Elettronica',sub:['Computer','Smartphone','Audio','Accessori']},
 {id:'sport',kind:'object',icon:'🚲',label:'Sport e bici',sub:['Biciclette','Attrezzatura sportiva','Outdoor']},
 {id:'libri',kind:'object',icon:'📚',label:'Libri e scuola',sub:['Libri','Materiale scuola','Manuali']},
 {id:'infanzia',kind:'object',icon:'🧸',label:'Bambini',sub:['Giochi','Abbigliamento','Articoli infanzia']},
 {id:'hobby',kind:'object',icon:'🎸',label:'Hobby e musica',sub:['Strumenti musicali','Collezionismo','Arte']},
 {id:'attrezzi',kind:'object',icon:'🪛',label:'Attrezzi e fai-da-te',sub:['Utensili','Giardinaggio','Laboratorio']},
 {id:'piante',kind:'object',icon:'🌿',label:'Piante e giardino',sub:['Piante','Vasi','Attrezzatura']},
 {id:'benessere',kind:'service',icon:'🧘',label:'Sport e benessere',sub:['Yoga','Personal training','Fitness','Meditazione','Benessere']},
 {id:'formazione',kind:'service',icon:'🎓',label:'Lezioni e formazione',sub:['Ripetizioni','Lingue','Musica','Informatica','Coaching']},
 {id:'digitale',kind:'service',icon:'💻',label:'Digitale e creatività',sub:['Siti web','Grafica','Fotografia','Social media','Video']},
 {id:'manutenzione',kind:'service',icon:'🔧',label:'Casa e riparazioni',sub:['Piccole riparazioni','Falegnameria','Montaggio','Giardinaggio']},
 {id:'consulenze',kind:'service',icon:'🧩',label:'Consulenze',sub:['Carriera e CV','Organizzazione','Marketing','Progettazione']},
 {id:'artigianato',kind:'service',icon:'🧵',label:'Artigianato',sub:['Sartoria','Restauro','Creazioni','Riparazioni']},
 {id:'esperienze',kind:'service',icon:'🎨',label:'Esperienze',sub:['Arte','Cucina','Attività culturali','Workshop']},
 {id:'supporto',kind:'service',icon:'🐾',label:'Supporto quotidiano',sub:['Pet sitting','Aiuto informatico','Orientamento']},
 {id:'aiuto',kind:'time',icon:'🤝',label:'Aiuto tra vicini',sub:['Commissioni','Giardinaggio','Montaggio leggero','Aiuto digitale']},
 {id:'tempo',kind:'time',icon:'⏰',label:'Ore e competenze',sub:['Affiancamento','Conversazione lingue','Consigli pratici']},
 {id:'solidarieta',kind:'time',icon:'💚',label:'Solidarietà',sub:['Dono','Aiuto di comunità','Attività sociali']}
];
export const ID_TO_CATEGORY = Object.fromEntries(TAXONOMY.map(c=>[c.id,c]));
export function categoriesFor(kind='all') {return [{id:'all',label:'Tutte le categorie',icon:'✳',kind:'all',sub:[]}, ...TAXONOMY.filter(c=>kind==='all'||c.kind===kind)];}
export function categoryFor(kind,id){const c=ID_TO_CATEGORY[id];return c && c.kind===kind ? c:null;}
export function validListingCategory(kind,id,subcategory='') { const c=categoryFor(kind,id);return !!c && (!subcategory||c.sub.includes(subcategory));}
export function normalizeCategory(kind,id){
 if(validListingCategory(kind,id)) return id;
 const legacy={object:{servizi:'attrezzi',tempo:'attrezzi',formazione:'libri'},service:{servizi:'consulenze',tempo:'supporto',casa:'manutenzione',tech:'digitale'},time:{tempo:'aiuto',servizi:'aiuto',formazione:'tempo'}};
 return legacy[kind]?.[id]|| (kind==='object'?'casa':kind==='time'?'aiuto':'consulenze');
}
export function getModes(kind){return kind==='object'?[{id:'in_person',label:'Ritiro/scambio concordato tra persone'}]:[
 {id:'in_person',label:'In presenza'}, {id:'remote',label:'Da remoto'}, {id:'either',label:'Entrambe le modalità'}
]}
export const EXCHANGE_FORMS=[
 {id:'object_object',title:'Oggetto ↔ Oggetto',description:'Una bicicletta in cambio di libri o di un altro oggetto.'},
 {id:'object_service',title:'Oggetto ↔ Servizio',description:'Un mobile in cambio di piccole riparazioni.'},
 {id:'service_service',title:'Servizio ↔ Servizio',description:'Una consulenza fitness in cambio di yoga, in presenza o da remoto.'},
 {id:'time_time',title:'Tempo ↔ Tempo',description:'Un’ora di lingua inglese in cambio di un’ora di informatica.'},
 {id:'service_object',title:'Servizio ↔ Oggetto',description:'Una fotografia professionale in cambio di attrezzatura usata.'},
 {id:'gift',title:'Dono solidale',description:'Un oggetto riutilizzabile o un aiuto gratuito, senza contropartita.'},
 {id:'multi',title:'Scambio a più persone',description:'Una rete di scambi circolari coordinati. Fase successiva.'},
 {id:'credits',title:'Banca del tempo e crediti',description:'Valore maturato con scambi verificati e riutilizzabile nel network. Solo dopo revisione giuridica, fiscale e antifrode.'}
];