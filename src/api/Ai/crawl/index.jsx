import { apiUtils } from '@/lib/utils/apiUtils';

export const assistantsApi = {
  crawl: async params => {
    const response = await apiUtils.get(
      `${import.meta.env.VITE_API_URL}/crawl`,
      {
        params,
      }
    );
    return response.data;
  },
};

export default assistantsApi;
