import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class MailRecipient {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class SendMailDto {
  @ApiProperty()
  @Type(() => MailRecipient)
  recipients: MailRecipient[];

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  templateId: number;

  @ApiProperty()
  @IsOptional()
  params: any;
}
