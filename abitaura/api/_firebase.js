import { createHash } from 'node:crypto';

/**
 * Firestore is the group CRM outbox, not a brand-specific duplicate contacts DB.
 * Credentials are server-only and must be configured in the Vercel project.
 */
export function firebaseConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

let cachedDatabase;
async function getGroupFirestore() {
  if (!firebaseConfigured()) throw new Error('FIREBASE_NOT_CONFIGURED');
  if (cachedDatabase) return cachedDatabase;
  const [{ getApps, initializeApp, cert }, { getFirestore }] = await Promise.all([
    import('firebase-admin/app'),
    import('firebase-admin/firestore')
  ]);
  const existing = getApps().find((item) => item.name === 'abitaura-crm');
  const app = existing ?? initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    projectId: process.env.FIREBASE_PROJECT_ID
  }, 'abitaura-crm');
  cachedDatabase = getFirestore(app);
  return cachedDatabase;
}

export async function enqueueAbitauraLead(lead) {
  const firestore = await getGroupFirestore();
  const { FieldValue } = await import('firebase-admin/firestore');
  // Repeated identical submissions within one ten-minute period share an id.
  const timeBucket = Math.floor(Date.now() / 600000);
  const fingerprint = createHash('sha256')
    .update(JSON.stringify([
      'ABITAURA',
      lead.email,
      lead.service,
      lead.message ?? '',
      timeBucket
    ]))
    .digest('hex');
  const eventId = 'ABITAURA_' + fingerprint.slice(0, 48);
  const event = {
    eventType: 'crm.lead.submitted',
    brand: 'ABITAURA',
    source: 'abitaura-website',
    channel: 'web',
    version: 1,
    status: 'PENDING',
    idempotencyKey: eventId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    attempts: 0,
    lead: {
      ...lead,
      source: 'sito_abitaura',
      status: 'nuovo'
    },
    consent: {
      privacyAccepted: true,
      marketingConsent: false,
      capturedAt: FieldValue.serverTimestamp()
    }
  };
  try {
    await firestore.collection('crmOutbox').doc(eventId).create(event);
    return { id: eventId, duplicate: false };
  } catch (error) {
    // Google Cloud Firestore ALREADY_EXISTS (gRPC code 6).
    if (error?.code === 6 || error?.code === 'already-exists') {
      return { id: eventId, duplicate: true };
    }
    throw error;
  }
}
