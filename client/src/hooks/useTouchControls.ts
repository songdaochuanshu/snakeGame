import { useCallback, useEffect, useRef } from "react";

interface TouchStartData {
  x: number;
  y: number;
}

/**
 * Custom Hook: useTouchControls
 * Detects touch swipe gestures and converts them to direction commands
 * Minimum swipe distance: 30px
 */
export function useTouchControls(
  onDirection: (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => void,
  containerRef: React.RefObject<HTMLDivElement>
) {
  const touchStartRef = useRef<TouchStartData | null>(null);
  const MIN_SWIPE_DISTANCE = 30;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Determine swipe direction based on larger delta
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY && absDeltaX > MIN_SWIPE_DISTANCE) {
        // Horizontal swipe
        onDirection(deltaX > 0 ? "RIGHT" : "LEFT");
      } else if (absDeltaY > absDeltaX && absDeltaY > MIN_SWIPE_DISTANCE) {
        // Vertical swipe
        onDirection(deltaY > 0 ? "DOWN" : "UP");
      }

      touchStartRef.current = null;
    },
    [onDirection]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, false);
    container.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, handleTouchStart, handleTouchEnd]);
}
