import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserDoc } from 'src/DB/z_index';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDoc | null => {
    let user: UserDoc | null = null;

    switch (ctx['contextType']) {
      case 'http': {
        const request = ctx.switchToHttp().getRequest<{ user: UserDoc }>();
        user = request.user;
        break;
      }
      case 'graphql': {
        const gqlContext = GqlExecutionContext.create(ctx).getContext<{
          user: UserDoc;
        }>();
        user = gqlContext.user;
        break;
      }

      default:
        break;
    }

    return user;
  },
);
