import { useEffect, useRef, RefObject } from 'react';

export const useScrollToBottom = () => {
  console.log('useScrollToBottom');
  const containerRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        end.scrollIntoView({ behavior: 'smooth' });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
};

export default useScrollToBottom;
