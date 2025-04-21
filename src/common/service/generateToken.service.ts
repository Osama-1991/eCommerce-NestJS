import jwt from 'jsonwebtoken';

interface IGenerateToken {
  payload?: object;
  signature: string | Buffer;
  options?: jwt.SignOptions;
}

export const generateToken = async ({
  payload = {},
  signature,
  options = {},
}: IGenerateToken): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, signature, options, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
};
