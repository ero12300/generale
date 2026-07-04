import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function isAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  );
}

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

export function getAdminDb(): Firestore | null {
  if (!isAdminConfigured()) return null;

  if (!adminApp) {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    );

    adminApp = getApps().length
      ? getApps()[0]!
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
            privateKey: privateKey!,
          }),
        });
  }

  if (!adminDb) {
    adminDb = getFirestore(adminApp);
  }

  return adminDb;
}

export function isAdminConfiguredExport(): boolean {
  return isAdminConfigured();
}
