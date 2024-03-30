import { env } from '../env'

const protocol = env.REACT_APP_BACKEND_PROTOCOL || 'http';
const host = env.REACT_APP_BACKEND_HOST || 'localhost';
const port = env.REACT_APP_BACKEND_PORT || '8181';
const BASE_URL = `${protocol}://${host}:${port}`;

const CREATE_CHAT_ENDPOINT = `${BASE_URL}/chat/create`;
const CONTINUE_CHAT_ENDPOINT = `${BASE_URL}/chat/continue`;
const CHAT_SSE_ENDPOINT = `${BASE_URL}/chat/sse`;

const ACCOUNT_REGISTER_ENDPOINT = `${BASE_URL}/auth/register`;

console.debug('BASE_URL:', BASE_URL);
export default { CREATE_CHAT_ENDPOINT, CONTINUE_CHAT_ENDPOINT, ACCOUNT_REGISTER_ENDPOINT, CHAT_SSE_ENDPOINT };
