(() => {
  const wizard = document.getElementById('projectWizard');
  const partner = document.getElementById('partnerForm');
  if (wizard) {
    const steps = [...wizard.querySelectorAll('.wizardStep')];
    const back = document.getElementById('wizardBack');
    const next = document.getElementById('wizardNext');
    const send = document.getElementById('wizardSubmit');
    const progress = document.getElementById('wizardProgressFill');
    const counter = document.getElementById('stepCounter');
    const state = document.getElementById('wizardState');
    const summary = document.getElementById('liveSummary');
    let index = 0;
    function currentValue(name) {
      const selected = wizard.querySelector('[name="' + name + '"]:checked');
      return selected?.value || wizard.elements.namedItem(name)?.value || '';
    }
    function updateSummary() {
      const choices = [...wizard.querySelectorAll('input[name="deliverables"]:checked')].map(i => i.value);
      const finding = currentValue('entry') === 'Cerco un immobile';
      const service = currentValue('service');
      summary.replaceChildren();
      [
        finding ? 'Origine: ricerca immobile con STRETTO' : 'Origine: immobile già disponibile',
        service ? 'Obiettivo: ' + service : 'Obiettivo: da selezionare',
        currentValue('location') ? 'Zona: ' + currentValue('location') : '',
        choices.length ? 'Elaborati: ' + choices.join(' · ') : '',
        currentValue('budget') ? 'Budget indicativo: ' + currentValue('budget') : '',
        'Prezzo definitivo: solo dopo analisi e offerta approvata'
      ].filter(Boolean).forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        summary.appendChild(p);
      });
    }
    function show(i) {
      index = Math.min(Math.max(i, 0), steps.length - 1);
      steps.forEach((s, n) => {
        s.classList.toggle('active', n === index);
        s.disabled = false;
      });
      back.disabled = index === 0;
      next.hidden = index === steps.length - 1;
      send.hidden = index !== steps.length - 1;
      counter.textContent = String(index + 1).padStart(2, '0') + ' / 04';
      progress.style.width = (((index + 1) / steps.length) * 100) + '%';
      state.textContent = '';
      updateSummary();
    }
    function validStep() {
      const required = [...steps[index].querySelectorAll('[required]')];
      for (const field of required) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      return true;
    }
    back.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => {
      if (!validStep()) return;
      show(index + 1);
      document.getElementById('stepCounter').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    wizard.addEventListener('change', updateSummary);
    wizard.addEventListener('input', updateSummary);
    wizard.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (!validStep()) return;
      const body = Object.fromEntries(new FormData(wizard).entries());
      const deliverables = [...wizard.querySelectorAll('input[name="deliverables"]:checked')].map(x => x.value);
      const message = [
        'ABITAURA — Brief guidato progetto',
        'Partenza: ' + (body.entry || 'Da definire'),
        'Tempistiche: ' + (body.timeline || 'Da definire'),
        'Elaborati desiderati: ' + (deliverables.join(', ') || 'Da definire'),
        'Modalità incontro: ' + (body.meeting || 'Da definire'),
        'Descrizione: ' + (body.message || 'Nessuna nota aggiuntiva')
      ].join('\n');
      const payload = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        location: body.location,
        service: body.service,
        property_type: body.property_type,
        area_sqm: body.area_sqm ? Number(body.area_sqm) : null,
        budget: body.budget,
        message,
        privacy_accepted: document.getElementById('wizardPrivacy').checked,
        website: body.website || ''
      };
      state.textContent = '';
      send.disabled = true;
      send.textContent = 'Invio in corso…';
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || 'Invio non disponibile');
        wizard.hidden = true;
        document.getElementById('wizardDone').hidden = false;
        document.getElementById('wizardDone').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {
        state.textContent = err?.message || 'Invio non riuscito, riprova.';
        state.style.color = '#a5384b';
      } finally {
        send.disabled = false;
        send.textContent = 'Invia la richiesta ↗';
      }
    });
    show(0);
  }
  if (partner) {
    const submit = document.getElementById('partnerSubmit');
    const state = document.getElementById('partnerState');
    partner.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!partner.reportValidity()) return;
      const data = Object.fromEntries(new FormData(partner).entries());
      data.privacy_accepted = document.getElementById('partnerPrivacy').checked;
      submit.disabled = true;
      submit.textContent = 'INVIO IN CORSO…';
      state.textContent = '';
      try {
        const res = await fetch('/api/partner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || 'Candidatura non inviata');
        partner.reset();
        state.style.color = '#24714f';
        state.textContent = 'Candidatura registrata. Grazie: valuteremo il tuo profilo.';
      } catch (err) {
        state.style.color = '#ae374c';
        state.textContent = err?.message || 'Errore temporaneo. Riprova.';
      } finally {
        submit.disabled = false;
        submit.textContent = 'INVIA LA CANDIDATURA ↗';
      }
    });
  }
})();