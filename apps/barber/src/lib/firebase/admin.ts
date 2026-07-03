import * as admin from 'firebase-admin'

function getAdminApp() {
  if (admin.apps.length) return admin.apps[0]!

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey,
    }),
  })
}

export function getAdminDb(): admin.firestore.Firestore {
  getAdminApp()
  return admin.firestore()
}

export function getAdminAuth(): admin.auth.Auth {
  getAdminApp()
  return admin.auth()
}

// Lazy-initialized singletons — safe at module load time (no env vars required)
let _db: admin.firestore.Firestore | null = null
let _auth: admin.auth.Auth | null = null

export const adminDb: admin.firestore.Firestore = new Proxy(
  {} as admin.firestore.Firestore,
  {
    get(_, prop: string | symbol) {
      if (!_db) _db = getAdminDb()
      return (_db as unknown as Record<string | symbol, unknown>)[prop]
    },
  }
)

export const adminAuth: admin.auth.Auth = new Proxy(
  {} as admin.auth.Auth,
  {
    get(_, prop: string | symbol) {
      if (!_auth) _auth = getAdminAuth()
      return (_auth as unknown as Record<string | symbol, unknown>)[prop]
    },
  }
)

export default admin
