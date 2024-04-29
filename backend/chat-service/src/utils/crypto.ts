import * as CryptoJS from 'crypto-js';

export function encrypt(plaintext: string, key: string) {
  const hash = CryptoJS.SHA256(key);
  const encrypted = CryptoJS.AES.encrypt(plaintext, hash, {
    mode: CryptoJS.mode.ECB,
  });
  return encrypted.toString();
}

export function decrypt(ciphertext: string, key: string) {
  const hash = CryptoJS.SHA256(key);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, hash, {
    mode: CryptoJS.mode.ECB,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
