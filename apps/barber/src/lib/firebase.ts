/**
 * Configurazione Firebase.
 *
 * L'app funziona in "modalità demo" (store in-memory) finché non vengono
 * impostate le variabili d'ambiente NEXT_PUBLIC_FIREBASE_*. Quando sono
 * presenti, questo modulo inizializza il client Firebase (Auth + Firestore).
 *
 * Il resto dell'app parla con un'interfaccia dati unica (`store`), così il
 * passaggio da demo a Firestore reale non richiede modifiche a UI/API.
 */

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export function getFirebaseConfig(): FirebaseClientConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    appId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  };
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseConfig() !== null;
}

export function dataMode(): "demo" | "firebase" {
  return isFirebaseConfigured() ? "firebase" : "demo";
}
