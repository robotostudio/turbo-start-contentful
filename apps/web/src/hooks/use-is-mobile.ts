import { useSyncExternalStore } from "react";

export function useIsMobile(size = 768) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(`(max-width: ${size}px)`);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(`(max-width: ${size}px)`).matches,
    () => false,
  );
}
