const protocol = process.env.BACKEND_PROTOCOL || 'http';
const host = process.env.BACKEND_HOST || 'localhost';
const port = process.env.BACKEND_PORT || '8181';
const BASE_URL = `${protocol}://${host}:${port}`;

const CREATE_CHAT_ENDPOINT = `${BASE_URL}/chat/create`;
const CONTINUE_CHAT_ENDPOINT = `${BASE_URL}/chat/continue`;

export default { CREATE_CHAT_ENDPOINT, CONTINUE_CHAT_ENDPOINT };
