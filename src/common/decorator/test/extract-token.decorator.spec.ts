import { Test, TestingModule } from '@nestjs/testing';
import { Injectable, Controller, Get } from '@nestjs/common';

import { ExtractToken } from '../extract-token.decorator'; // Adjust the path as needed

// Mock Service
@Injectable()
class MockAuthService {
  getAccessToken(token: string) {
    return `Access granted for token: ${token}`;
  }
}

// Mock Controller
@Controller('test')
class MockController {
  constructor(private authService: MockAuthService) {}

  @Get('token')
  getAccessToken(@ExtractToken() token: string) {
    return this.authService.getAccessToken(token);
  }
}

// Test Suite
describe('MockController', () => {
  let controller: MockController;
  let authService: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockController],
      providers: [MockAuthService],
    }).compile();

    controller = module.get<MockController>(MockController);
    authService = module.get<MockAuthService>(MockAuthService);
  });

  it('should extract and pass the authorization token to the AuthService', () => {
    const token = 'Bearer some_valid_token';
    jest.spyOn(authService, 'getAccessToken').mockImplementation(() => 'Access granted for token: ' + token);

    const result = controller.getAccessToken(token);
    expect(authService.getAccessToken).toHaveBeenCalledWith(token);
    expect(result).toBe('Access granted for token: ' + token);
  });
});
