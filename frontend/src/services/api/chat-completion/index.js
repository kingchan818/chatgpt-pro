import axios from 'axios';
import { omitBy, isUndefined, isEmpty } from 'lodash';
import { ENDPOINTS } from '../../../domain'; // Import your endpoint configurations here

const axiosService = axios.create({
  baseURL: 'http://localhost:8181', // Set your base URL
  headers: {
    'Content-Type': 'application/json',
    'x-auth-key': localStorage.getItem('apiKey'), // Modify this based on your authentication method
  },
});

const handleRequest = (method, url, requestData) => {
  const data = omitBy(requestData, isUndefined);

  return axiosService({
    method,
    url,
    data,
  });
};

export const createChat = (message, chatOptions) => {
  const requestData = omitBy({ message, chatOptions }, isEmpty);
  return handleRequest('post', ENDPOINTS.CREATE_CHAT_ENDPOINT, requestData);
};

export const continueChat = (message, collectionId) => {
  const requestData = { message, collectionId };
  return handleRequest('post', ENDPOINTS.CONTINUE_CHAT_ENDPOINT, requestData);
};
