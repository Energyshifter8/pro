"use client";
import { useEffect } from "react";

// Loads Firebase after hydration so it stays out of the first-load bundle.
export default function FirebaseAnalytics() {
  useEffect(() => {
    import("@/lib/firebase").then((f) => f.initAnalytics()).catch((e) => console.warn("Firebase Analytics failed to start", e));
  }, []);
  return null;
}
