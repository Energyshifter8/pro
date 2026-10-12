"use client";
import { useSyncExternalStore } from "react";

// Tiny global UI store: which overlay (menu / contact modal) is open.
type State = { menu: boolean; contact: boolean };
let state: State = { menu: false, contact: false };
const subs = new Set<() => void>();

export const ui = {
  get: () => state,
  set(patch: Partial<State>) { state = { ...state, ...patch }; subs.forEach((f) => f()); },
  subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; },
};

const server: State = { menu: false, contact: false };
export function useUI<T>(pick: (s: State) => T): T {
  return useSyncExternalStore(ui.subscribe, () => pick(state), () => pick(server));
}
