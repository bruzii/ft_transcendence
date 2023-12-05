import { Controller, Get, Post, Body, Patch, Param, Delete, Req,UseGuards, Res, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport'
import { AuthGuardToken } from './guards/auth.guard';
import { AuthTwoFAService } from './2FA/twoFA-generator';
import { UserService } from 'src/user/user.service';
import { Response as ExpressResponse } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly auth2FAService: AuthTwoFAService,
    private userService: UserService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }


  @Get('users')
  @UseGuards(AuthGuardToken)
  findAll() {
    return this.authService.findAll();
  }

  @Get('auth')
  @UseGuards(AuthGuard('42'))
  async FortyTwoAuth(@Req() req) { 
    console.log("auth");
    console.log(req);
  }

  @Get('api/42auth/redirect')
  @UseGuards(AuthGuard('42'))
  async  FortyTwoRedirect(@Req() req, @Res() res) {
      try {
        const users = await this.authService.authenticate(req, res);
        console.log("users, users, users", users);
        const {token , user, sucess } = users;
        console.log('redirect');
        console.log(res.status);
        const test = await this.userService.setOnline(user.id);
        console.log("user apres connected : " + test.connected);
        // res.status(200).send(user);
        console.log("user.TwoFA", users.user.TwoFA);
        if (users.user.TwoFA) {
          console.log("user.TwoFA");
            const frontendRedirectUrl = `${process.env.URL}:3001/login/twofa`;
            return res.redirect(frontendRedirectUrl);
        }
        else {

          const frontendRedirectUrl = `${process.env.URL}:3001/`;
          res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
          return res.redirect(frontendRedirectUrl);
        }
      } catch (error) {
        // Gérez les erreurs ici, par exemple, renvoyez une réponse d'erreur appropriée.
        console.log(error);
        res.status(500).send('Une erreur s\'est produite.');
      }
    }

    @Get('generateQRCode/:id')
    async generateQRCode(@Param('id') id: number, @Response() res) {
      console.log("id", id);
      const user = await this.userService.findOne(parseInt(id.toString()));
      if (user) {
        const result = await this.auth2FAService.generateTwoFactorAuthenticationSecret(
          user.id,
          user.email
        );

        res.setHeader('Content-Type', 'image/png');
  
        res.end(result.qrCodeDataURL);
      }
      else {
        return res.status(400).send('QR code already exists for this user');
      }
    }

    @Get('qr-code')
    async generateQRCode2(@Response() res) {
      try {
        const user = await this.userService.findOne(1);
        console.log('user', user);
        // if (user && !user.twoFactorAuthenticationSecret) {
        //   console.log('avant qr code');
        //   const result = await this.auth2FAService.generateTwoFactorAuthenticationSecret(
        //     user.id,
        //     user.email // Pass the user's email to generate the otpauthUrl
        //   );
        //   console.log('result : ' + JSON.stringify(result));
        //   console.log('result.qrCodeDataURL', result.qrCodeDataURL);
  
        //   const qrCode = result.qrCodeDataURL.replace('data:image/png;base64,', '');
        //   const img = Buffer.from(qrCode, 'base64');
          
        //   res.writeHead(200, {
        //     'Content-Type': 'image/png',
        //     'Content-Length': img.length.toString(), // Set content length
        //   });
  
        //   return res.end(img);
        // }
           const res2 = await this.auth2FAService.isTwoFactorAuthenticationCodeValid("626071", user)
      console.log("isTwoFactorAuthenticationCodeValid", res2)
      res.status(200).send(' generating QR code');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error while generating QR code');
      }
    }

    @Post('verify-2fa')
    async verifyTwoFactorAuthenticationCode(@Body() body, @Res() res: ExpressResponse) {
      try {
        return await this.authService.verifyTwoFactorAuthenticationCode(body, res);
      } catch (error) {
        console.error(error);
        return res.status(500).send('Error while verifying code');
      }
    }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
