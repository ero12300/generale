export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo non consentito' });
  const firebaseConfigured = Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
  const mode = process.env.LEAD_STORAGE_MODE || 'auto';
  res.status(200).json({
    name: 'ABITAURA',
    status: 'ok',
    version: '1.1.0',
    chat: 'guided',
    leadStorage: mode === 'legacy' || (mode === 'auto' && !firebaseConfigured)
      ? 'legacy-until-firebase-ready'
      : firebaseConfigured ? 'firebase-crm-outbox' : 'firebase-not-configured',
    firebaseConfigured,
    note: 'Status reflects configuration only, not a successful database write.'
  });
}