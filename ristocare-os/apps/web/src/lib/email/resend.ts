interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "RistoCare OS <noreply@ristocare.it>";

  if (!apiKey) {
    console.info("[email:skipped]", input.subject, input.to);
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!res.ok) {
    console.error("[email:error]", await res.text());
    return false;
  }
  return true;
}

export function ticketOpenedEmail(ticketTitle: string, orgName: string) {
  return {
    subject: `Ticket aperto: ${ticketTitle}`,
    html: `<p>Gentile cliente,</p><p>abbiamo registrato il ticket <strong>${ticketTitle}</strong> per <strong>${orgName}</strong>.</p><p>La centrale operativa RistoCare OS gestirà la richiesta e ti aggiornerà.</p><p>RistoCare OS — Emotive S.r.l.</p>`,
  };
}

export function quoteSentEmail(amount: string, ticketTitle: string) {
  return {
    subject: `Preventivo RistoCare: ${ticketTitle}`,
    html: `<p>Gentile cliente,</p><p>il preventivo per <strong>${ticketTitle}</strong> è pronto.</p><p>Importo: <strong>${amount}</strong></p><p>Accedi al portale RistoCare OS per i dettagli.</p>`,
  };
}

export function contactReceivedEmail(name: string, requestType: string) {
  return {
    subject: `Nuova richiesta ${requestType} — ${name}`,
    html: `<p>Nuova richiesta dal sito RistoCare OS.</p><p><strong>${name}</strong> — tipo: ${requestType}</p>`,
  };
}
