"use client";

import { useEffect } from "react";

/**
 * Offline, Next's client-side navigation waits forever for the server. Turns internal link
 * clicks into full page loads instead, which the service worker serves from its cache.
 */
export function OfflineLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navigator.onLine || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target || link.origin !== location.origin) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      location.assign(link.href);
    };
    // Capture phase runs before the click reaches Next's <Link> handler.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
