import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';

export const sendEmail = async (data: SendMailOptions) => {
  try {
    if (!data.to && !data.bcc && !data.cc) {
      throw new BadRequestException('In-valid email destination.');
    }
    if (!data.text && !data.html && !data.attachments?.length) {
      throw new BadRequestException('In-valid email content.');
    }
    const transporter: Transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    // send mail with defined transport object
    await transporter.sendMail({
      from: `"${process.env.NAME_EMOJI}" <${process.env.EMAIL}>`,
      ...data,
    });
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
};
