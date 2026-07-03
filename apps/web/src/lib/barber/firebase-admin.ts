import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

function readPrivateKey(value: string | undefined): string | null {
  if (!value) return null;
  return value.replaceAll("\\n", "\n");
}

function buildFirebaseConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = readPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  };
}

let app: App | null = null;

export function getFirebaseAdminApp(): App | null {
  const config = buildFirebaseConfig();
  if (!config) return null;

  if (app) return app;
  app = getApps()[0] ?? initializeApp(config);
  return app;
}

export function getFirestoreDb(): Firestore | null {
  const firebaseApp = getFirebaseAdminApp();
  if (!firebaseApp) return null;
  return getFirestore(firebaseApp);
}
