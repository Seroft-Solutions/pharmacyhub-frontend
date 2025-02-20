import {TouchEvent, useState} from "react";

interface SwipeInput {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipe({
                           onSwipeLeft,
                           onSwipeRight,
                           threshold = 50
                         }: SwipeInput) {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    // Swipe left
    if (diff > threshold) {
      onSwipeLeft?.();
      setTouchStart(null);
    }
    // Swipe right
    else if (diff < -threshold) {
      onSwipeRight?.();
      setTouchStart(null);
    }
  };

  const onTouchEnd = () => {
    setTouchStart(null);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}