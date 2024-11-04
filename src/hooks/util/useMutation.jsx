import { useState, useCallback } from 'react';
import { toast } from '@/services/toastService';
import { apiUtils } from '@/lib';

export const useMutation = method => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(
    async (url, requestData = {}, config = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        switch (method) {
          case 'POST':
            response = await apiUtils.post(url, requestData, config);
            break;
          case 'PUT':
            response = await apiUtils.put(url, requestData, config);
            break;
          case 'DELETE':
            response = await apiUtils.delete(url, config);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        setData(response);
        toast.success(`${method} request successful`);
        return response;
      } catch (err) {
        setError(err);
        toast.error(`Error: ${err.message}`);
        throw err; // Re-throw the error so the caller can handle it if needed
      } finally {
        setIsLoading(false);
      }
    },
    [method]
  );

  return { mutate, isLoading, error, data };
};

export default useMutation;
