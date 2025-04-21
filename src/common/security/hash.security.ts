import { compareSync, hashSync } from 'bcrypt';

export const generateHash = (
  plainText: string,
  salt = process.env.SALT || '10',
): string => {
  return hashSync(plainText, parseInt(salt));
};

export const compareHash = (plainText: string, hashValue: string): boolean => {
  return compareSync(plainText, hashValue);
};
