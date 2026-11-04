(() => {
 const menu=document.getElementById('navmenu'),hamburger=document.getElementById('hamburger');
 hamburger.addEventListener('click',()=>{const open=menu.classList.toggle('active');hamburger.textContent=open?'×':'☰';hamburger.setAttribute('aria-expanded',String(open))});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('active');hamburger.textContent='☰';hamburger.setAttribute('aria-expanded','false')}));
 document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>document.getElementById('service').value=a.dataset.service));
 const form=document.getElementById('leadForm'),btn=document.getElementById('sendLead'),status=document.getElementById('leadStatus');
 form.addEventListener('submit',async e=>{
  e.preventDefault();status.textContent='';
  if(!form.reportValidity())return;
  btn.disabled=true;btn.textContent='INVIO IN CORSO...';
  try{
   const data=Object.fromEntries(new FormData(form).entries());
   data.privacy_accepted=document.getElementById('privacy').checked;
   data.marketing_consent=false;
   data.area_sqm=data.area_sqm?Number(data.area_sqm):null;
   const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
   const result=await response.json();
   if(!response.ok)throw Error(result.error||'Invio non riuscito');
   status.style.color='#287252';status.textContent='Richiesta registrata. Grazie! Ti ricontatteremo.';form.reset();
  }catch(err){status.style.color='#a5394e';status.textContent=err.message||'Errore temporaneo. Riprova.'}
  finally{btn.disabled=false;btn.textContent='INVIA LA RICHIESTA ↗'}
 });
 const chat=document.getElementById('chat'),button=document.getElementById('chatButton'),close=document.getElementById('closeChat'),msgs=document.getElementById('chatMsgs'),chatForm=document.getElementById('chatForm'),text=document.getElementById('chatText');
 function show(open){chat.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));if(open)text.focus()}
 button.onclick=()=>show(!chat.classList.contains('open'));close.onclick=()=>show(false);
 function bubble(message,who){const el=document.createElement('div');el.className=who==='user'?'userMsg':'botMsg';el.textContent=message;msgs.appendChild(el);msgs.scrollTop=msgs.scrollHeight;return el}
 async function ask(message){
  if(!message.trim())return;
  bubble(message,'user');text.value='';
  const spinner=bubble('Un attimo...','bot');
  try{
   const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
   const answer=await res.json();spinner.remove();bubble(answer.reply||'Raccontaci il tuo progetto nel modulo contatti.','bot');
   if(answer.cta){const div=document.createElement('div'),link=document.createElement('a');link.href='#contatti';link.textContent='INIZIA IL TUO PROGETTO ↗';link.className='button dark';link.style.marginBottom='10px';link.onclick=()=>show(false);div.appendChild(link);msgs.appendChild(div)}
  }catch(err){spinner.remove();bubble('Non riesco a rispondere ora. Puoi usare il modulo Home Value Check per contattarci.','bot')}
 }
 chatForm.onsubmit=e=>{e.preventDefault();ask(text.value)};
 msgs.addEventListener('click',e=>{const option=e.target.closest('[data-ask]');if(option)ask(option.dataset.ask)});
})();