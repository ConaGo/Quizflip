import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

//This decorator adds the current user to the request object
//Usage:
//@Query(returns => User)
//@UseGuards(GqlAuthGuard)
//whoAmI(@CurrentUser() user: User) {
//  return this.usersService.findById(user.id);
//}
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  }
);
