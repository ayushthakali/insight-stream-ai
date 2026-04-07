import { useCallback, useRef } from "react";

// Throttle = “run at most once every delay milliseconds”, no matter how many times it is triggered.
export function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);

  return useCallback(
    //prevents unnecessary re-creation unless callback or delay changes. Without it, the throttled function is recreated on every render.
    (...args: any[]) => {
      const now = new Date().getTime(); //current time in milliseconds
      if (now - lastCall.current >= delay) {
        // checks if enough time has passed since last execution
        lastCall.current = now;
        callback(...args);
      }
    },
    [callback, delay],
  );
}
