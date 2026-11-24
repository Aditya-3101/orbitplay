// useHeaderHeight.js
import { useLayoutEffect, useRef } from "react";

export function useHeaderHeight() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };

    update(); // set it once right away
    const ro = new ResizeObserver(update); // and again whenever size changes
    ro.observe(el);

    return () => ro.disconnect(); // cleanup
  }, []);

  return ref;
}