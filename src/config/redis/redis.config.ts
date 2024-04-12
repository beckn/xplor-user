// This file configures the Redis cache module for the application.
// It uses the ConfigService to fetch Redis host and port from the environment variables.
// The configuration also includes the Time-To-Live (TTL) for cache entries, which is fetched from the environment variables.
// This setup ensures that the application can efficiently cache data and manage its lifecycle.
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    store: await redisStore({
      socket: {
        host: configService.get<string>('redisHost'),
        port: parseInt(configService.get<string>('redisPort')),
      },
      ttl: configService.get<number>('otpTtl'),
    }),
  }),
  inject: [ConfigService],
};
