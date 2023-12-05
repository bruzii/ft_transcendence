import { Injectable, Get, Response } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { toDataURL } from "qrcode";

@Injectable()
export class AuthTwoFAService {
  constructor(private usersService: UserService,private config: ConfigService,) {}

  async generateTwoFactorAuthenticationSecret(id: number, email: string) {
    const secret: string = authenticator.generateSecret();
    const otpauthUrl: string = authenticator.keyuri(
      email,
      this.config.get('ft_transcendence'),
      secret
    );

    console.log('otpauthUrl : ' + otpauthUrl);

    const qrCodeDataURL = await toDataURL(otpauthUrl); // Generate QR code data URL
    console.log('secret : ' + secret);

    await this.usersService.addSecretTwoFA(id, secret);

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