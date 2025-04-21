import { UserRepositoryService, OtpTypes } from 'src/DB/z_index';

export class EmailEvent {
  userService: UserRepositoryService;
  email: string;
  subject: string;
  link: string;
  text: string;
  btn: string;
  otpType: OtpTypes;
}
