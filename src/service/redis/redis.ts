// src/service/redis/redis.service.ts

// Importing necessary decorators, services, and utilities from NestJS and Redis
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { RedisMessage } from '../../common/constant/service/redis-message';

@Injectable()
export class RedisService {
  // Constructor for injecting the CacheManager
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Method for retrieving a value from Redis by key
  async get(key: string): Promise<any> {
    const value: string = await this.cacheManager.get(key);
    return value ? JSON.parse(value) : null;
  }

  // Method for setting a value in Redis with a specified key and optional TTL
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, JSON.stringify(value), ttl);
  }

  // Method for deleting a value from Redis by key
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // Custom method to set OTP with attempt limit
  async setOtp(key: string, otp: string, ttl?: number): Promise<void> {
    await this.set(`otp:${key}`, otp, ttl);
    await this.set(`attempts:${key}`, 0); // Initialize attempt count
  }

  // Custom method to get OTP and check attempt limit
  async getOtp(key: string): Promise<string> {
    const attempts = await this.get(`attempts:${key}`);
    if (attempts >= 5) {
      throw new ForbiddenException(RedisMessage.forbidden);
    }

    const otp = await this.get(`otp:${key}`);
    if (otp) {
      await this.set(`attempts:${key}`, attempts + 1); // Increment attempt count
    }

    return otp;
  }

  // Custom method to delete OTP and attempt count
  async delOtp(key: string): Promise<void> {
    await this.del(`otp:${key}`);
    await this.del(`attempts:${key}`);
  }
}
