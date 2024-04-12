// src/common/decorators/extract-token.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator to extract the user ID from the request object.
// Useful for accessing the authenticated user's ID in route handlers.
export const ExtractUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userId = request.user.sub;
  return userId;
});
