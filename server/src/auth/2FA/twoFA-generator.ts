import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as speakeasy from 'speakeasy';
import * as qr from 'qr-image';
import { toDataURL } from 'qrcode';
import * as base32 from 'hi-base32';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthTwoFAService {
  constructor(private usersService: UserService,private config: ConfigService,) {}

  async generateTwoFactorAuthenticationSecret() {
    const secret : string = authenticator.generateSecret();
    const otpauthUrl : string = authenticator.keyuri("test@gmail.com", this.config.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);

    const qrCodeDataURL = `data:image/png;base64,${otpauthUrl.toString}`;
    console.log("secret : " + secret);
    await this.usersService.addSecretTwoFA(5, secret);

    return {
      secret: secret,
      otpauthUrl,
      qrCodeDataURL,
    };
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: any,
  ) {
    return authenticator.verify({
        token: twoFactorAuthenticationCode,
        secret: user.twoFactorAuthenticationSecret,
      });
  }
}