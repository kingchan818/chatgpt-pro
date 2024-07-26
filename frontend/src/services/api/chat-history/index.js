import { omitBy, isUndefined } from 'lodash';
import { ENDPOINTS } from '../../../domain'; // Import your endpoint configurations here
import createAxiosFactory from '../../http-service';

const chatHistoryService = createAxiosFactory(`${ENDPOINTS.BASE_URL}/transaction`, { 'Content-Type': 'application/json' });

export const queryUserUsage = async (filters, unit) => {
  const requestData = omitBy({ filters, unit }, isUndefined);

  const { data } = await chatHistoryService.post('usage', requestData, {
    headers: { 'x-auth-key': localStorage.getItem('apiKey') },
  });

  return data;
};
