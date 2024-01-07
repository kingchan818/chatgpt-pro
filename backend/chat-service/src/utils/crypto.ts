import * as CryptoJS from 'crypto-js';

export function encrypt(text: string, secret: string): string {
  const ciphertext = CryptoJS.AES.encrypt(text, secret);
  return ciphertext.toString();
}

export function decrypt(ciphertext: string, secret: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
