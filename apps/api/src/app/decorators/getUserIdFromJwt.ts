import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';

export const GetUserIdFromJwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new ForbiddenException('No user in jwt');
    }
    return request.user?.sub;
  }
);
