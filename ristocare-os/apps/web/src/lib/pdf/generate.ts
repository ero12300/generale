import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Organization, Quote, Ticket } from "@ristocare/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function generateQuotePdf(input: {
  quote: Quote;
  ticket: Ticket;
  organization: Organization;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { quote, ticket, organization } = input;
  let y = 780;

  const line = (text: string, size = 11, useBold = false) => {
    page.drawText(text, { x: 50, y, size, font: useBold ? bold : font, color: rgb(0.1, 0.1, 0.1) });
    y -= size + 8;
  };

  line("RistoCare OS — Preventivo intervento tecnico", 16, true);
  line("Emotive S.r.l. · Brand RistoCare OS", 10);
  y -= 10;
  line(`Cliente: ${organization.name}`, 12, true);
  line(`Ticket: ${ticket.title}`);
  line(`Data: ${formatDate(quote.created_at)}`);
  if (quote.valid_until) line(`Valido fino al: ${formatDate(quote.valid_until)}`);
  y -= 10;
  line("Descrizione problema", 12, true);
  const desc = ticket.description.length > 400 ? `${ticket.description.slice(0, 400)}...` : ticket.description;
  line(desc, 10);
  y -= 10;
  line("Importo preventivato", 12, true);
  line(formatCurrency(quote.customer_price), 18, true);
  y -= 10;
  line("Il preventivo include coordinamento RistoCare OS e intervento tecnico.", 9);
  line("Esclusioni: usura, cattivo utilizzo, ricambi non previsti.", 9);
  line("Per accettare, contattare la centrale operativa RistoCare.", 9);

  return pdf.save();
}

export async function generateMonthlyReportPdf(input: {
  organization: Organization;
  equipmentCount: number;
  openTickets: number;
  closedTickets: number;
  expiringWarranties: number;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let y = 780;

  const line = (text: string, size = 11, useBold = false) => {
    page.drawText(text, { x: 50, y, size, font: useBold ? bold : font });
    y -= size + 8;
  };

  const month = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(new Date());
  line("RistoCare OS — Report mensile", 16, true);
  line(`${input.organization.name} · ${month}`, 12);
  y -= 12;
  line(`Attrezzature censite: ${input.equipmentCount}`);
  line(`Ticket aperti: ${input.openTickets}`);
  line(`Ticket chiusi nel mese: ${input.closedTickets}`);
  line(`Garanzie in scadenza: ${input.expiringWarranties}`);
  y -= 12;
  line("Report generato automaticamente da RistoCare OS.", 9);

  return pdf.save();
}
