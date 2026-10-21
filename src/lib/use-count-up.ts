import { useEffect, useRef, useState } from "react";

/**
 * Smoothly counts a numeric value up from its previous value (and from 0 on
 * first mount). Respects prefers-reduced-motion by jumping straight to the
 * target. Non-numeric KPI values simply bypass this hook in StatCard.
 */
export function useCountUp(target: number | null, duration = 450): number | null {
  const [value, setValue] = useState(target);
  const prev = useRef<number>(0);
  const reduced = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  useEffect(() => {
    if (target === null) {
      setValue(null);
      return;
    }
    if (reduced.current || prev.current === target) {
      prev.current = target;
      setValue(target);
      return;
    }
    const from = prev.current;
    prev.current = target;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
