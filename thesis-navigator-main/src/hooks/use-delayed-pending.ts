import { useEffect, useRef, useState } from "react";

type UseDelayedPendingOptions = {
  delayMs?: number;
  minDurationMs?: number;
};

export const useDelayedPending = (
  pending: boolean,
  options: UseDelayedPendingOptions = {},
) => {
  const delayMs = options.delayMs ?? 120;
  const minDurationMs = options.minDurationMs ?? 500;

  const [isVisible, setIsVisible] = useState(false);
  const pendingRef = useRef(pending);
  const visibleSinceRef = useRef<number | null>(null);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    if (showTimeoutRef.current !== null) {
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (pending) {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (!isVisible) {
        showTimeoutRef.current = window.setTimeout(() => {
          if (!pendingRef.current) {
            return;
          }

          visibleSinceRef.current = Date.now();
          setIsVisible(true);
          showTimeoutRef.current = null;
        }, delayMs);
      }

      return;
    }

    if (!isVisible) {
      return;
    }

    const elapsed = visibleSinceRef.current ? Date.now() - visibleSinceRef.current : 0;
    const remainingMs = Math.max(minDurationMs - elapsed, 0);

    hideTimeoutRef.current = window.setTimeout(() => {
      visibleSinceRef.current = null;
      setIsVisible(false);
      hideTimeoutRef.current = null;
    }, remainingMs);
  }, [delayMs, isVisible, minDurationMs, pending]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current !== null) {
        window.clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return isVisible;
};

export type { UseDelayedPendingOptions };
