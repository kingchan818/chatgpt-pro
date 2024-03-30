const protocol = process.env.REACT_APP_BACKEND_PROTOCOL || 'http';
const host = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const port = process.env.REACT_APP_BACKEND_PORT || '8181';
const BASE_URL = `${protocol}://${host}:${port}`;

const CREATE_CHAT_ENDPOINT = `${BASE_URL}/chat/create`;
const CONTINUE_CHAT_ENDPOINT = `${BASE_URL}/chat/continue`;

console.debug('BASE_URL:', BASE_URL);

export default { CREATE_CHAT_ENDPOINT, CONTINUE_CHAT_ENDPOINT };
