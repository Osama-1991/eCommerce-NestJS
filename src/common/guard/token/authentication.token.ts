import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import {
  UserDoc,
  UserRepositoryService,
  IGenerateToken,
  TokenTypes,
  RoleTypes,
} from 'src/DB/z_index';
import { JwtPayload } from 'jsonwebtoken';
import { Token } from './token.signature';

export interface ITokenPayload extends JwtPayload {
  id?: Types.ObjectId;
  email: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly userRepositoryService: UserRepositoryService,
    private token: Token,
  ) {}

  sign({
    role = RoleTypes.user,
    type = TokenTypes.access,
    payload,
    expiresIn = process.env.EXPIRES_IN as string,
  }: IGenerateToken): string {
    const { accessSignature, refreshSignature } =
      this.token.getTokenSignature(role);

    const token = this.jwt.sign(payload, {
      secret: type === TokenTypes.access ? accessSignature : refreshSignature,
      expiresIn:
        type === TokenTypes.access
          ? expiresIn
          : (process.env.EXPIRES_IN_REFRESH as string),
    });

    return token;
  }

  async verify({
    authorization,
    type = TokenTypes.access,
  }: {
    authorization: string;
    type?: TokenTypes;
  }): Promise<UserDoc> {
    const [prefix, token] = authorization.split(' ') || [];

    if (!prefix || !token) {
      throw new BadRequestException('missing token');
    }

    const role = this.token.getTokenBearer(prefix as RoleTypes);

    const { accessSignature, refreshSignature } =
      this.token.getTokenSignature(role);

    const decoded: ITokenPayload = this.jwt.verify(token, {
      secret: type === TokenTypes.access ? accessSignature : refreshSignature,
    });

    if (!decoded?.id) {
      throw new UnauthorizedException('invalid token payload');
    }
    const user = await this.userRepositoryService.findOne({
      filter: { _id: decoded.id },
    });
    if (!user) {
      throw new NotFoundException('Not registered account');
    }

    const changeCredentialTimestamp = Math.floor(
      (user.changeCredentialTime?.getTime() ?? 0) / 1000,
    );
    const issuedAt = typeof decoded.iat === 'number' ? decoded.iat : 0;

    if (changeCredentialTimestamp > issuedAt) {
      throw new UnauthorizedException('Token expired due to credential update');
    }

    return user;
  }
}
