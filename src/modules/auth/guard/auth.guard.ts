import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../../common/decorator/public.decorator';
import { AuthMessages } from '../../../common/constant/auth/gaurd-message';

// This guard is responsible for protecting routes by ensuring that only authenticated users can access them.
@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;

  constructor(private jwtService: JwtService, configService: ConfigService, private reflector: Reflector) {
    this.jwtSecret = configService.get('jwtSecret');
  }

  // Determines whether a request can be activated based on the presence of a valid JWT token.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Checks if the route is marked as public, allowing unauthenticated access.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(AuthMessages.TokenMissing);
    }

    try {
      // Verifies the JWT token and extracts the payload.
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      // Attaches the payload to the request object for use in route handlers.
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(AuthMessages.InvalidToken);
    }

    return true;
  }

  // Extracts the JWT token from the Authorization header of the request.
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
