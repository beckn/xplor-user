// This file is responsible for parsing and providing access to environment variables.
// It reads the values from the process environment and provides them in a structured format.
// This abstraction simplifies the access to configuration values throughout the application.
export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  databaseUrl: process.env.DATABASE_URL,
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT, 10),
  otp: process.env.DEFAULT_OTP,
  otpTtl: parseInt(process.env.OTP_TTL, 10),
  defaultTtl: parseInt(process.env.DEFAULT_TTL, 10),
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtAccessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtRefreshTokenSecretExpiresIn: process.env.JWT_REFRESH_TOKEN_SECRET_EXPIRES_IN,
  twilioSenderId: process.env.TWILIO_SENDER_PHONE_NUMBER,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  grafanaServiceUrl: process.env.GRAFANA_SERVICE_URL,
  regionalLanguageAccessCount: parseInt(process.env.REGIONAL_LANGUAGE_ACCESS_COUNT, 10),
});
