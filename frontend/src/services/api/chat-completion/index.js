import { omitBy, isEmpty, get } from 'lodash';
import { ENDPOINTS } from '../../../domain'; // Import your endpoint configurations here
import createAxiosFactory from '../../http-service'; 

const chatCompletionService = createAxiosFactory(`${ENDPOINTS.BASE_URL}/chat`, { 'Content-Type': 'application/json' });

export const createChat = async (message, chatOptions) => {
  const requestData = omitBy({ message, chatOptions }, isEmpty);
  const { data } = await chatCompletionService.post('create', requestData, { headers: { 'x-auth-key': localStorage.getItem('apiKey') }});
  return get(data, '1', {});
};

export const continueChat = async (message, collectionId, chatOptions) => {
  const requestData = { message, collectionId, chatOptions };
  const { data } = await chatCompletionService.post('continue', requestData, { headers: { 'x-auth-key': localStorage.getItem('apiKey') }});
  return get(data, '0', {});
};

export const loadModels = async () => {
  const { data } = await chatCompletionService.get('model', { headers: { 'x-auth-key': localStorage.getItem('apiKey') }});
  return data
}
