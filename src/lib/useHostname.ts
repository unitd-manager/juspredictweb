import { useEffect, useState } from "react";

/**
 * React hook that returns the current window hostname on the client.
 * Safe to call in SSR — returns empty string on server.
 */
export function useHostname() {
  const [hostname, setHostname] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") setHostname(window.location.hostname);
  }, []);
  return hostname;
}

/**
 * Non-hook helper to read hostname (returns empty string on server).
 */
export function getHostname(): string {
  return typeof window !== "undefined" ? window.location.hostname : "";
}
