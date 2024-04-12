// This file contains the validation schema for environment variables.
// It uses Joi to define the structure and constraints of the environment variables.
// This ensures that the application has the correct configuration values.
import * as Joi from 'joi';
export default () => ({
  NODE_ENV: Joi.string().required().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().port().required().default(6000),
  DATABASE_URL: Joi.string().required().default('mongodb://localhost:27017/Xplore_User'),
  REDIS_HOST: Joi.string().required().default('localhost'),
  REDIS_PORT: Joi.number().port().required().default(6379),
  OTP_TTL: Joi.number().required().default(300),
  JWT_SECRET: Joi.string().required().default('secret'),
  JWT_EXPIRES_IN: Joi.string().required().default('1h'),
  OTP: Joi.string().default('123456'),
  TWILIO_SENDER_PHONE_NUMBER: Joi.string().required().default(''),
  TWILIO_ACCOUNT_SID: Joi.string().required().default(''),
  TWILIO_AUTH_TOKEN: Joi.string().required().default(''),
});
