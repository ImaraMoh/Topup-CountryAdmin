import { useSyncExternalStore } from "react";

const storageKey = "country-admin-brand-logo";
const updateEvent = "country-admin-brand-logo-updated";

function getSnapshot() {
  try { return window.localStorage.getItem(storageKey); } catch { return null; }
}

function subscribe(listener: () => void) {
  window.addEventListener(updateEvent, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(updateEvent, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useBrandLogo() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function saveBrandLogo(logo: string | null) {
  if (logo) window.localStorage.setItem(storageKey, logo);
  else window.localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event(updateEvent));
}
