import { IsNotEmpty, IsString } from 'class-validator';

export class QueryReqionLangaugeDto {
  @IsNotEmpty()
  @IsString()
  region: string;
}
