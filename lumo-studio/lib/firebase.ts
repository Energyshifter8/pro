import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

// Values come from .env (see .env.example). NEXT_PUBLIC_* vars are inlined at build time,
// so each one has to be referenced literally.
const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// null when the env vars are missing (e.g. not set on the host), so callers can skip Firebase
export const app: FirebaseApp | null = config.apiKey && config.projectId && config.appId
  ? getApps()[0] ?? initializeApp(config)
  : null;

export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  if (!app) { console.warn("Firebase env vars missing; see .env.example"); return null; }
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  return (await isSupported()) ? getAnalytics(app) : null;
}
