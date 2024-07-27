import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService) {}

  public apiKey: string = this.config.get('MAIL_API_KEY');
  public logger = new Logger(MailService.name);

  public sendEmail(data: SendMailDto) {
    axios
      .post(
        'https://api.brevo.com/v3/smtp/email',
        {
          to: data.recipients,
          subject: data.subject,
          templateId: data.templateId,
          params: data.params,
        },
        {
          headers: {
            'api-key': this.apiKey,
          },
        },
      )
      .then(() => {
        this.logger.debug('Email send successfully');
      })
      .catch((err) => {
        this.logger.error('Error sending email', err);
      });
  }
}
