/** True when the visitor asked the OS to reduce motion (evaluated in the browser only). */
export const reducedMotion =
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
