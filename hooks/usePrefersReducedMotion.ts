"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function getSnapshot(): boolean {
  return window.matchMedia(query).matches;
}

function getServerSnapshot(): boolean {
  // Default to false on server (animations enabled)
  return false;
}

function subscribe(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
