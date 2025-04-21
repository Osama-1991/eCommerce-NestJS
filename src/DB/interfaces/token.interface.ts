import { ITokenPayload } from 'src/common/guard/token/authentication.token';
import { RoleTypes } from 'src/DB/interfaces/user.interface';

export enum TokenTypes {
  access = 'access',
  refresh = 'refresh',
}

export interface IGenerateToken {
  role?: RoleTypes;
  type?: TokenTypes;
  payload: ITokenPayload;
  expiresIn?: string;
}

export interface tokenSignature {
  accessSignature: string;
  refreshSignature: string;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
}
