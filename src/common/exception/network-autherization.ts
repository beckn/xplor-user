import { HttpException } from '@nestjs/common';

/**
 * Defines an HTTP exception for *Network Authentication Required* type errors.
 *
 * @see [Built-in HTTP exceptions](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)
 *
 * @publicApi
 */
export class NetworkAuthorizationException extends HttpException {
  /**
   * Instantiate an `Http511Exception` Exception.
   *
   * @example
   * `throw new Http511Exception()`
   *
   * @usageNotes
   * The HTTP response status code will be 511.
   * - The `message` argument defines the JSON response body or the message string.
   *
   * By default, the JSON response body contains two properties:
   * - `statusCode`: this will be the value 511.
   * - `message`: the string `'Network Authentication Required'` by default; override this by supplying
   * a string in the `message` parameter.
   *
   * If the parameter `message` is a string, the response body will contain an
   * additional property, `error`, with a short description of the HTTP error. To override the
   * entire JSON response body, pass an object instead. Nest will serialize the object
   * and return it as the JSON response body.
   *
   * @param message string describing the error condition.
   */
  constructor(message?: string) {
    super(message || 'Network Authentication Required', 511);
  }
}
