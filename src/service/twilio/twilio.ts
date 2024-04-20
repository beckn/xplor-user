// src/service/twilio/twilio.service.ts

// Importing necessary decorators, services, and utilities from NestJS and Twilio
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';

import { SmsMessages } from '../../common/constant/service/twilio-message';

// Defining the TwilioService, which is responsible for sending OTPs via Twilio
@Injectable()
export class TwilioService {
  // Initializing the Twilio client with credentials from the ConfigService
  private twilioClient: Twilio;
  private configService: ConfigService;
  constructor() {
    this.configService = new ConfigService();
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID').replaceAll(' ', '');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN').replaceAll(' ', '');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  // Method for sending an OTP to a mobile number
  async sendOtpMobile(phoneNumber: string, otp: string) {
    try {
      // Retrieving the sender number from the ConfigService
      const senderNumber = await this.configService.get('TWILIO_SENDER_PHONE_NUMBER');
      // Constructing the message to be sent
      const message: string = SmsMessages.OtpMessage(otp);

      // Sending the message using the Twilio client
      const response = await this.twilioClient.messages.create({
        to: phoneNumber,
        from: senderNumber,
        body: message,
      });
      // Returning the response from Twilio
      return { msg: response };
    } catch (error) {
      // Handling specific errors if needed
      if (error.code === 21211) {
        throw new BadRequestException(SmsMessages.OtpSendFailedInvalidPhoneNumber);
      } else {
        throw new InternalServerErrorException(SmsMessages.OtpSendFailedInternalServerError);
      }
    }
  }
}
