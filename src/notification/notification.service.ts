import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class NotificationService {
  async sendNotification(notif_id: string, title: string, message: string) {
    const url = process.env.NOTIF_URL;
    const payload = {
      subId: notif_id,
      appId: process.env.NOTIF_ID,
      appToken: process.env.NOTIF_TOKEN,
      title: title,
      message: message,
    };

    try {
      const response = await axios.post(url, payload);
      console.log('Notificación enviada:', response.data);
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  }
}
