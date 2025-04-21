/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserDoc } from 'src/DB/z_index';
import { Request } from 'express';
import { TokenService } from '../z_index';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface IAuthReq extends Request {
  user: UserDoc;
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      let authorization = undefined;
      switch (context['contextType']) {
        case 'ws':
          authorization =
            context.switchToWs().getClient().handshake?.auth?.authorization ||
            context.switchToWs().getClient().handshake?.headers?.authorization;
          if (!authorization) {
            throw new NotFoundException(
              'Authentication is required you have send authorization field ',
            );
          }
          context.switchToWs().getClient().user =
            await this.tokenService.verify({
              authorization,
            });
          break;

        //--------------------------------------------------------------------------------------

        case 'http':
          authorization = context.switchToHttp().getRequest()
            .headers.authorization;

          if (!authorization) {
            throw new NotFoundException(
              'Authentication is required you have send authorization field ',
            );
          }

          context.switchToHttp().getRequest().user =
            await this.tokenService.verify({
              authorization,
            });
          break;

        //--------------------------------------------------------------------------------------
        case 'graphql':
          authorization =
            GqlExecutionContext.create(context).getContext().req.headers
              ?.authorization;
          if (!authorization) {
            throw new NotFoundException(
              'Authentication is required you have send authorization field ',
            );
          }
          GqlExecutionContext.create(context).getContext().user =
            await this.tokenService.verify({
              authorization,
            });

          break;
        default:
          break;
      }

      if (!authorization) {
        return false;
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
