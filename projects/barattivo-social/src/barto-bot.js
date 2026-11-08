/**
 * Barto: a local, privacy-first contextual guide.
 * No external LLM, analytics, network calls, or chat transcript storage.
 * It does NOT join peer-to-peer private conversations.
 */
const DEFAULT_ACTIONS = [
  { label: '🔎 Trova uno scambio', id: 'find' },
  { label: '＋ Pubblica gratis', id: 'publish' },
  { label: '↔ Come funziona?', id: 'how' },
  { label: '♡ Scambi sicuri', id: 'safety' },
];

const steps = 'È semplice: 1) pubblichi un oggetto, un servizio o il tuo tempo; 2) cerchi una proposta interessante; 3) parlate in chat e definite cosa offrire e ricevere; 4) concordate consegna e condizioni. Il baratto di base è gratuito.';
const safety = 'La fiducia nasce da accordi chiari. Guarda bene le foto, chiedi dettagli e concorda come e dove scambiare. Per gli incontri scegli luoghi pubblici. Non inviare documenti, password o denaro a sconosciuti. Se qualcosa non torna, usa “Segnala” nell’annuncio.';
const norm = text => text.toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function answerBarto(message) {
  const original = String(message || '').trim().slice(0, 280);
  const msg = norm(original);
  const has = (...words) => words.some(x => msg.includes(x));
  if (!msg) return { text: 'Puoi scrivermi una domanda oppure scegliere una delle opzioni qui sotto.', actions: DEFAULT_ACTIONS };
  if (has('truff', 'sicur', 'fiduc', 'pericol', 'segnal', 'privacy', 'verific', 'document')) {
    return { text: safety, actions: [{label:'Esplora gli annunci',id:'find'},{label:'Come funziona?',id:'how'}] };
  }
  if (has('gratis','pagam','costa','costo','soldi','commission','prezz','abbonam','euro')) {
    return { text: 'Cercare, pubblicare, chattare e proporre uno scambio sono gratuiti. I servizi aggiuntivi per professionisti sono facoltativi. Attenzione: gli scambi professionali possono avere obblighi fiscali.', actions: [{label:'Il progetto sociale',id:'mission'},{label:'Come funziona?',id:'how'}] };
  }
  if (has('pubblic','inserisc','crea annunc','vend','metti annunc','offrire')) {
    return { text: 'Ottima idea! Servono solo un titolo, una descrizione sincera, la località, una foto e ciò che vorresti ricevere. Ti accompagno al modulo gratuito.', actions: [{label:'Apri pubblicazione',id:'publish'}] };
  }
  if (has('accord','contropropost','propost','consegn','spediz','scambiare con')) {
    return { text: 'Per proporre uno scambio apri un annuncio e premi “Scrivi e proponi uno scambio”. Nella chat potrai creare una proposta chiara con ciò che offri, ciò che ricevi, luogo e tempi. Non è una garanzia o una firma digitale qualificata.', actions: [{label:'Trova un annuncio',id:'find'},{label:'Le mie conversazioni',id:'inbox'}] };
  }
  if (has('chat','messagg','parlare','scriver','conversazion')) {
    return { text: 'La chat tra persone è diversa da questa guida: si apre da un annuncio ed è riservata ai partecipanti. Io sono Barto e ti aiuto a orientarti, ma non leggo né invio i tuoi messaggi privati.', actions: [{label:'Le mie conversazioni',id:'inbox'},{label:'Esplora',id:'find'}] };
  }
  if (has('community','grupp','piazza','amic','persone','post')) {
    return { text: 'Nella Piazza di Barattivo puoi condividere idee, consigli e richieste. È il posto giusto per conoscersi e far nascere nuove possibilità.', actions: [{label:'Vai alla Piazza',id:'community'}] };
  }
  if (has('azienda','impresa','professionist','partita iva','business','collabor')) {
    return { text: 'Anche professionisti e aziende possono scambiare tempo, servizi e competenze. La parte dedicata agli strumenti professionali è facoltativa; gli obblighi fiscali vanno verificati caso per caso.', actions: [{label:'Per professionisti',id:'business'},{label:'Pubblica un servizio',id:'publish'}] };
  }
  if (has('sociale','solidar','aiut','inclus','sprechi','mission','progetto')) {
    return { text: 'Barattivo nasce per valorizzare ciò che le persone hanno e sanno fare, favorire il riuso e creare nuove opportunità anche quando il denaro è poco. Il baratto resta gratuito.', actions: [{label:'Leggi il manifesto',id:'mission'}] };
  }
  if (has('come funziona','cosa posso scambia','baratto','scambio','funziona','iniziare')) {
    return { text: steps, actions: [{label:'Esplora gli annunci',id:'find'},{label:'Pubblica gratis',id:'publish'}] };
  }
  if (has('cerco','cerca','trova','trovare','biciclet','divano','computer','lezion','fotografi','scopr','annunci')) {
    const search = original.match(/^(?:sto\s+)?(?:cercando|cerco|cerca|trova|trovare)\s+(.{2,80})$/i);
    const query = search ? search[1].replace(/^(un[oa]?|dei|delle|qualche)\s+/i,'') : '';
    return { text: query ? `Provo a cercare “${query}” negli annunci disponibili. Ti porto al catalogo: se non trovi niente puoi pubblicare ciò che cerchi.` : 'Sfoglia beni, servizi e tempo disponibile nella comunità. Puoi filtrare per categoria, città e parola chiave.', actions: [{label:'Cerca negli annunci',id:'find',query},{label:'Pubblica una richiesta',id:'publish'}] };
  }
  return { text: 'Posso aiutarti a trovare un annuncio, pubblicare gratuitamente, conoscere le regole di uno scambio oppure scoprire la community. Non sono ancora un assistente AI: rispondo alle domande più frequenti, senza inventare annunci o leggere le chat private.', actions: DEFAULT_ACTIONS };
}

export function initBartoBot({ onAction, getContext = () => 'home' }) {
  const root = document.querySelector('#bartoAssistant');
  if (!root) return null;
  const launcher = root.querySelector('#bartoLaunch');
  const panel = root.querySelector('#bartoPanel');
  const close = root.querySelector('#bartoClose');
  const form = root.querySelector('#bartoForm');
  const input = root.querySelector('#bartoInput');
  const history = root.querySelector('#bartoHistory');
  const suggestions = root.querySelector('#bartoSuggestions');
  let isOpen = false;
  let seen = false;
  function msg(text, from = 'bot') {
    const item = document.createElement('div');
    item.className = 'barto-message '+from;
    const bubble = document.createElement('p');
    bubble.textContent = text;
    item.append(bubble);
    history.append(item);
    // Keep the memory of this conversation in this browser tab only.
    while (history.children.length > 18) history.firstChild.remove();
    history.scrollTop = history.scrollHeight;
  }
  function actionList(actions) {
    suggestions.replaceChildren();
    actions.forEach(action => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'barto-suggestion';
      button.textContent = action.label;
      button.addEventListener('click', () => choose(action));
      suggestions.append(button);
    });
  }
  function choose(action) {
    const response = answerBarto(({find:'trova annunci',publish:'pubblica',how:'come funziona',safety:'sicurezza',mission:'progetto sociale',community:'community',business:'per aziende',inbox:'chat'})[action.id] || action.label);
    msg(response.text);
    actionList(response.actions);
    if (action.id !== 'how' && action.id !== 'safety') {
      hide();
      onAction?.(action.id, action.query || '');
    }
  }
  function greet() {
    const context = getContext();
    const note = context === 'market' ? 'Se stai cercando qualcosa, ti aiuto a usare filtri e ricerca.' :
      context === 'community' ? 'Qui puoi conoscere altre persone e condividere idee.' :
      context === 'business' ? 'Puoi scambiare competenze anche come professionista.' :
      'Ciao! 👋 Sono Barto, la guida di Barattivo. Da cosa vuoi cominciare?';
    msg(note); actionList(DEFAULT_ACTIONS);
  }
  function show() {
    isOpen = true; panel.hidden = false; launcher.setAttribute('aria-expanded','true');
    root.classList.add('is-open');
    if (!seen) { greet(); seen = true; }
    input.focus();
  }
  function hide() {
    isOpen = false; panel.hidden = true; launcher.setAttribute('aria-expanded','false');
    root.classList.remove('is-open'); launcher.focus();
  }
  launcher.addEventListener('click', () => isOpen ? hide() : show());
  close.addEventListener('click', hide);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = input.value.trim().slice(0,280);
    if (!message) return;
    msg(message,'mine'); input.value = '';
    const answer = answerBarto(message);
    msg(answer.text); actionList(answer.actions);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen) {event.preventDefault(); hide();}
  });
  // Programmatic opener for the small hero mascot, if present.
  return { open: show, close: hide, isOpen: () => isOpen };
}