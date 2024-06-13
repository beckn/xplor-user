// src/common/decorators/extract-token.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
// Decorator to extract the user ID from the request object.
// Useful for accessing the authenticated user's ID in route handlers.
export const ExtractUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userId = request.user.sub;
  return userId;
});

export const ExtractUserIdFromToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userId = (jwt.decode(request.headers.authorization.split(' ')[1]) as any)?.sub || '';
  return userId;
});
