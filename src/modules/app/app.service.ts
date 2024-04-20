import { Injectable } from '@nestjs/common';

import { IHealthCheckResponse } from '../../common/interfaces/server-health-response';
import { AppServiceMessage } from '../../common/constant/app/service-message';

// The AppService provides a simple health check functionality.
// It returns a response indicating the status of the application.
@Injectable()
export class AppService {
  getHealth(): IHealthCheckResponse {
    return { status: AppServiceMessage.status, message: AppServiceMessage.message };
  }
}
