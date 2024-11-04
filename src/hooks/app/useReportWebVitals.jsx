// src/hooks/useReportWebVitals.js
import { useEffect } from 'react';
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

const useReportWebVitals = onReport => {
  useEffect(() => {
    if (onReport && typeof onReport === 'function') {
      getCLS(onReport);
      getFID(onReport);
      getLCP(onReport);
      getFCP(onReport);
      getTTFB(onReport);
    }
  }, [onReport]);
};

export default useReportWebVitals;
