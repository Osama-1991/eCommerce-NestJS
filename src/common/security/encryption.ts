import * as CryptoJS from 'crypto-js';

export const Encrypt = (
  plainText: string,
  secret: string = process.env.ENCRYPT_SECRET as string,
): string => {
  return CryptoJS.AES.encrypt(plainText, secret).toString();
};

export const Decrypt = (
  encryptedText: string,
  secret: string = process.env.ENCRYPT_SECRET as string,
): string => {
  return CryptoJS.AES.decrypt(encryptedText, secret).toString(
    CryptoJS.enc.Utf8,
  );
};
