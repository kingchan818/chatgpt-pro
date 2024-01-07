import { v4 as uuidV4 } from 'uuid';

export function generateUniqueKey() {
  return uuidV4().replace(/-/g, '');
}
