"use client";
import { useEffect, useState } from "react";

export function useMedia(query: string, fallback = true) {
  const [match, setMatch] = useState(fallback);
  useEffect(() => {
    const m = window.matchMedia(query);
    const f = () => setMatch(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, [query]);
  return match;
}

export const useDesktop = () => useMedia("(min-width: 992px)");
