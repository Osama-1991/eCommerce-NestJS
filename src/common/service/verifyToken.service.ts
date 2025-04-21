import { InternalServerErrorException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

interface IVerifyToken {
  token: string;
  signature: string;
  options?: jwt.VerifyOptions; // optional additional parameters
}

export const verifyToken = ({
  token,
  signature,
  options = {},
}: IVerifyToken) => {
  try {
    return jwt.verify(token, signature, options);
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
};
