import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

// Firebase web config isn't secret (it ships in every page bundle; firestore.rules guard the data), so it lives
// here and any host (Firebase Hosting, Vercel) works without setup. NEXT_PUBLIC_* in .env override it; they're
// inlined at build time, so each one has to be referenced literally.
const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAy3XFY94pRQwRjz3YrjCw_o5bvOoWlxq4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "olympiad-d0849.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "olympiad-d0849",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "olympiad-d0849.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "991096524103",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:991096524103:web:0ff542c429b0c3bb625062",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-W5FSQBZFWQ",
};

export const app: FirebaseApp = getApps()[0] ?? initializeApp(config);

export type Registration = Record<"lastName" | "firstName" | "email" | "studentCode" | "phone" | "course" | "major", string>;

// Firestore Lite (plain REST, a fraction of the full SDK) is enough for one write; it's loaded on first submit.
// Shape must match isRegistration() in firestore.rules.
let lite: Promise<{ db: import("firebase/firestore/lite").Firestore; fs: typeof import("firebase/firestore/lite") }> | null = null;
export async function saveRegistration(data: Registration) {
  lite ??= import("firebase/firestore/lite").then((fs) => {
    const db = fs.getFirestore(app);
    const emulator = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
    if (emulator) { const [host, port] = emulator.split(":"); fs.connectFirestoreEmulator(db, host, Number(port)); }
    return { db, fs };
  });
  const { db, fs } = await lite;
  const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.trim()]));
  await fs.addDoc(fs.collection(db, "registrations"), { ...clean, createdAt: fs.serverTimestamp() });
}

export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  return (await isSupported()) ? getAnalytics(app) : null;
}
