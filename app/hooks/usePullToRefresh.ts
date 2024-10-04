import { useState, useEffect } from 'react';

export function usePullToRefresh(onRefresh: () => void) {
  const [startY, setStartY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleTouchStart = (e: TouchEvent) => {
      setStartY(e.touches[0].pageY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].pageY;
      const pullDistance = y - startY;

      if (pullDistance > 100 && window.scrollY === 0 && !refreshing) {
        setRefreshing(true);
        onRefresh();
      }
    };

    const handleTouchEnd = () => {
      if (refreshing && isMounted) {
        setRefreshing(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      isMounted = false;
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, refreshing, startY]);

  return refreshing;
}