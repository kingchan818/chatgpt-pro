import { cloneDeep, isEmpty, isUndefined } from 'lodash';
import { ClientSession, Connection } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export function generateUniqueKey() {
  return uuidV4().replace(/-/g, '');
}

export function maskString(str: string, maskChar = '*') {
  return str.replace(/./g, maskChar);
}

export function maskSensitiveRequestBody(body: any, sensitiveFields: string[]) {
  const maskedBody = cloneDeep(body);
  sensitiveFields.reduce((acc, field) => {
    if (maskedBody[field]) {
      maskedBody[field] = maskString(maskedBody[field]);
    }
    return acc;
  }, maskedBody);
  return maskedBody;
}

export function inspectData(data: any, sensitiveFields: string[] = []) {
  const maskField = ['password', 'apiKey', 'openAIAPIKey', ...sensitiveFields];
  return JSON.stringify(maskSensitiveRequestBody(data, maskField), null, 2);
}

export function cleanConfig(config) {
  return Object.entries(config).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // Recursively clean nested objects
      value = cleanConfig(value);
    }
    if (!isUndefined(value) && !isEmpty(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export const sessionTransaction = async <T>(connection: Connection, cb: (session: ClientSession) => Promise<T>): Promise<T> => {
  const session = await connection.startSession();
  try {
    session.startTransaction();
    const result = await cb(session);
    return result;
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    await session.commitTransaction();
    await session.endSession();
  }
};
