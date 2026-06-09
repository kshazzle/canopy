"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/** True after the client has hydrated — use before auth redirects. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
