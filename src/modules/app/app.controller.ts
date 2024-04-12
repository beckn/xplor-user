import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IHealthCheckResponse } from '../../common/interfaces/server-health-response';
import { Public } from '../../common/decorator/public.decorator';

// This controller handles the root route and the /health route.
// The root route returns a simple greeting message.
// The /health route returns the health status of the application.
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Handles GET requests to the root route.
  // Returns a greeting message.
  @Get()
  getHello(): IHealthCheckResponse {
    return this.appService.getHealth();
  }

  @Get('/health')
  getHealth(): IHealthCheckResponse {
    return this.appService.getHealth();
  }
}
