import * as CryptoJS from 'crypto-js';

export function hash(text: string, secret: string): string {
  const hash = CryptoJS.HmacSHA256(text, secret);
  return hash.toString(CryptoJS.enc.Hex);
}
