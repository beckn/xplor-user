// src/service/redis/redis.service.ts

// Importing necessary decorators, services, and utilities from NestJS and Redis
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import { RedisMessage } from '../../common/constant/service/redis-message';
import { REDIS_CLIENT } from '../../common/constant/redis/redis-client';
import { ErrorMessages } from '../../common/constant/error-message';

@Injectable()
export class RedisService {
  private readonly logger: Logger;
  private readonly otpTtl: number;
  private readonly defaultTtl: number;
  // Constructor for injecting the CacheManager
  constructor(@Inject(REDIS_CLIENT) private cacheManager: Redis, private readonly configService: ConfigService) {
    // Logger for debugging
    this.logger = new Logger(RedisService.name);

    // Listen for 'connect' event
    this.cacheManager.on('connect', () => {
      this.logger.debug(RedisMessage.connectedToRedis);
    });

    // Listen for 'error' event
    this.cacheManager.on('error', (error) => {
      this.logger.error(RedisMessage.errorConnectingToRedis, error.message);
      throw error;
    });

    // Set the default TTL for OTPs
    this.otpTtl = Number(this.configService.get<string>('otpTtl'));

    this.defaultTtl = Number(this.configService.get<string>('defaultTtl'));
  }

  // Method for retrieving a value from Redis by key
  async get(key: string): Promise<any> {
    const value: string = await this.cacheManager.get(key);
    return value ? JSON.parse(value) : null;
  }

  // Method for setting a value in Redis with a specified key and optional TTL
  async set(key: string, value: any, ttl: number = this.defaultTtl): Promise<void> {
    await this.cacheManager.set(key, JSON.stringify(value));
    await this.cacheManager.expire(key, ttl);
  }

  // Method for deleting a value from Redis by key
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // Custom method to set OTP with attempt limit
  async setLoginOtp(key: string, otp: string, ttl?: number): Promise<void> {
    ttl = ttl || this.otpTtl;

    const sendAttempts = await this.get(`sendAttempts:${key}`);
    if (sendAttempts >= 5) throw new ForbiddenException(ErrorMessages.OtpSendLimitExceeded);
    await this.set(`otpLogin:${key}`, otp, ttl);
    await this.set(`attempts:${key}`, 0, ttl); // Initialize attempt count
    await this.set(`sendAttempts:${key}`, sendAttempts + 1); // Initialize attempt count
  }

  async setOtpMpin(key: string, otp: string, ttl?: number): Promise<void> {
    ttl = ttl || this.otpTtl;

    const sendAttempts = await this.get(`sendAttempts:${key}`);
    if (sendAttempts >= 6) throw new ForbiddenException(ErrorMessages.OtpSendLimitExceeded);
    await this.set(`otpMpin:${key}`, otp, ttl);
    await this.set(`attempts:${key}`, 0, ttl); // Initialize attempt count
    await this.set(`sendAttempts:${key}`, sendAttempts + 1); // Initialize attempt count
  }

  async setVerifiedMpinKey(key: string, value: string, ttl?: number): Promise<void> {
    ttl = ttl || this.otpTtl;
    await this.set(`setVerifiedMpinKey:${key}`, value, ttl);
  }

  // Custom method to get OTP and check attempt limit
  async getOtp(key: string): Promise<string> {
    const attempts = await this.get(`attempts:${key}`);
    if (attempts >= 5) {
      throw new ForbiddenException(RedisMessage.forbidden);
    }

    const otp = await this.get(`otpLogin:${key}`);
    if (otp) {
      await this.set(`attempts:${key}`, attempts + 1); // Increment attempt count
    }

    return otp;
  }

  async getVerifiedMpinKey(key: string): Promise<string> {
    const verifiedMpinKey = await this.get(`setVerifiedMpinKey:${key}`);
    return verifiedMpinKey;
  }

  async getMpinOtp(key: string): Promise<string> {
    const attempts = await this.get(`attempts:${key}`);
    if (attempts >= 5) {
      throw new ForbiddenException(RedisMessage.forbidden);
    }

    const otp = await this.get(`otpMpin:${key}`);
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

  async resetSendAttempts(key: string): Promise<void> {
    await this.del(`sendAttempts:${key}`);
  }
}
