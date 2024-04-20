// Enum to define standard HTTP response messages.
// Used throughout the application to standardize response messages.
export enum HttpResponseMessage {
  OK = 'OK',
  CREATED = 'Created',
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Not Found',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  LOGGED_IN = 'Logged In Successfully',
  VERIFICATION_FAILED = 'Verification Failed',
  VERIFICATION_PASSED = 'Verification Successful',
}
