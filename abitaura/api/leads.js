import { enqueueAbitauraLead, firebaseConfigured } from './_firebase.js';

const LEGACY_URL = 'https://fppdfqieorixaduolnzn.supabase.co';
const LEGACY_PUBLISHABLE = 'sb_publishable_Xcfrl3uX8anObTbvFNaQoA_-lx_TneJ';
const SERVICES = new Set([
  'Interior design',
  'Home staging',
  'Restyling',
  'Investimento immobiliare',
  'Private wellness',
  'Altro'
]);

function trim(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function parseLead(body) {
  const name = trim(body.name, 120);
  const email = trim(body.email, 254).toLowerCase();
  const service = trim(body.service, 80);
  const area = body.area_sqm == null || body.area_sqm === ''
    ? null : Number(body.area_sqm);

  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !SERVICES.has(service) ||
    body.privacy_accepted !== true
  ) throw new Error('VALIDATION_FAILED');

  if (area !== null && (
    !Number.isInteger(area) || area < 1 || area > 100000
  )) throw new Error('VALIDATION_FAILED');

  return {
    name,
    email,
    phone: trim(body.phone, 40) || null,
    location: trim(body.location, 140) || null,
    service,
    property_type: trim(body.property_type, 80) || null,
    area_sqm: area,
    budget: trim(body.budget, 60) || null,
    message: trim(body.message, 3000) || null,
    privacy_accepted: true,
    marketing_consent: false
  };
}

async function saveLegacy(lead) {
  // Transitional fallback: no change to existing production until the
  // Group Firebase account, worker and secret configuration are verified.
  const response = await fetch(LEGACY_URL + '/rest/v1/abitaura_leads', {
    method: 'POST',
    headers: {
      apikey: LEGACY_PUBLISHABLE,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      ...lead,
      source: 'sito_abitaura',
      status: 'nuovo'
    }),
    signal: AbortSignal.timeout(9500)
  });
  if (!response.ok) {
    console.error('Abitaura legacy provider unavailable', response.status);
    throw new Error('LEGACY_FAILED');
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metodo non consentito' });
  }
  // Very large payloads are rejected; an upstream rate-limit / CAPTCHA
  // should be enabled before significant marketing campaigns.
  if (Number(req.headers['content-length'] || 0) > 20000) {
    return res.status(413).json({ error: 'Richiesta troppo grande' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (body.website) return res.status(200).json({ ok: true });
    const lead = parseLead(body);
    const selected = process.env.LEAD_STORAGE_MODE || 'auto';
    const firebaseEnabled = firebaseConfigured();
    if (selected === 'firebase' && !firebaseEnabled) {
      return res.status(503).json({
        error: 'Servizio contatti in configurazione. Riprova più tardi.'
      });
    }
    if (selected !== 'legacy' && firebaseEnabled) {
      // Never silently fall back to legacy if Firebase is configured but
      // the write fails. Otherwise records can diverge between stores.
      const result = await enqueueAbitauraLead(lead);
      return res.status(201).json({
        ok: true,
        duplicate: result.duplicate,
        message: 'Richiesta registrata'
      });
    }
    await saveLegacy(lead);
    return res.status(201).json({ ok: true, message: 'Richiesta registrata' });
  } catch (error) {
    if (error?.message === 'VALIDATION_FAILED') {
      return res.status(400).json({ error: 'Controlla i campi obbligatori' });
    }
    console.error('ABITAURA lead storage failed', error?.code || error?.message || 'unknown');
    return res.status(503).json({
      error: 'Impossibile inviare ora la richiesta. Riprova tra poco.'
    });
  }
}