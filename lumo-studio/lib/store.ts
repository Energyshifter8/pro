"use client";
import { useSyncExternalStore } from "react";

// Tiny global UI store: which overlay (menu / register modal) is open.
type State = { menu: boolean; register: boolean };
let state: State = { menu: false, register: false };
const subs = new Set<() => void>();

export const ui = {
  get: () => state,
  set(patch: Partial<State>) { state = { ...state, ...patch }; subs.forEach((f) => f()); },
  subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; },
};

const server: State = { menu: false, register: false };
export function useUI<T>(pick: (s: State) => T): T {
  return useSyncExternalStore(ui.subscribe, () => pick(state), () => pick(server));
}

// The olympiad register modal opens on this window event, so any script can trigger it.
export const REGISTER_EVENT = "open-register";
export const openRegister = () => window.dispatchEvent(new Event(REGISTER_EVENT));
