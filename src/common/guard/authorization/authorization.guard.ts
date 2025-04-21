import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { rolesKey } from 'src/common/z_index';
import { UserDoc, RoleTypes } from 'src/DB/z_index';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<RoleTypes[]>(
        rolesKey,
        [context.getHandler(), context.getClass()],
      );

      let user: UserDoc | undefined = undefined;

      switch (context['contextType']) {
        case 'ws': {
          const client: { user?: UserDoc } = context.switchToWs().getClient();
          user = client?.user;
          break;
        }

        case 'http': {
          const request = context
            .switchToHttp()
            .getRequest<{ user?: UserDoc }>();
          user = request?.user;
          break;
        }

        case 'graphql': {
          const gqlContext = GqlExecutionContext.create(context).getContext<{
            user: UserDoc;
          }>();
          user = gqlContext.user;
          break;
        }

        default:
          break;
      }

      if (!user || !requiredRoles?.includes(user.role)) {
        throw new ForbiddenException('Unauthorized access ');
        // return false;
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
