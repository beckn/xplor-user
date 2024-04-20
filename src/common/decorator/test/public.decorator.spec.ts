import { Reflector } from '@nestjs/core';

import { Public, IS_PUBLIC_KEY } from '../public.decorator';

describe('Public Decorator', () => {
  it('should set IS_PUBLIC_KEY metadata to true', () => {
    class TestClass {
      @Public()
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      publicMethod() {}
    }

    const reflector = new Reflector();
    const metadata = reflector.get(IS_PUBLIC_KEY, TestClass.prototype.publicMethod);

    expect(metadata).toBe(true);
  });
});
