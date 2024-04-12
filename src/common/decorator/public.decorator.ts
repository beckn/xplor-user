import { SetMetadata } from '@nestjs/common';
import { PublicDecoratorMessage } from '../constant/public.message';

// Decorator to mark routes as public, allowing unauthenticated access.
export const IS_PUBLIC_KEY = PublicDecoratorMessage.IsPublic;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
