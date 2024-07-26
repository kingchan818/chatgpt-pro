import { ENDPOINTS } from '../../../domain'; // Import your endpoint configurations here
import createAxiosFactory from '../../http-service';

const apiKeyService = createAxiosFactory(`${ENDPOINTS.BASE_URL}/api-key`, { 'Content-Type': 'application/json' });

export const getTotalUsage = async () => {
  const { data } = await apiKeyService.get('total-usage', {
    headers: { 'x-auth-key': localStorage.getItem('apiKey') },
  });

  return data;
};
