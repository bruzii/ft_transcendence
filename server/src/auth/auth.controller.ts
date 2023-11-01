import { Controller, Get, Post, Body, Patch, Param, Delete, Req,UseGuards, Res, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport'
import { AuthGuardToken } from './guards/auth.guard';
import { AuthTwoFAService } from './2FA/twoFA-generator';
import { UserService } from 'src/user/user.service';

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
  async FortyTwoAuth(@Req() req) { }

  @Get('api/42auth/redirect')
  @UseGuards(AuthGuard('42'))
  async  FortyTwoRedirect(@Req() req, @Res() res) {
      try {
        const users = await this.authService.authenticate(req, res);
        console.log(users);
        const {token , user, sucess } = users;
        console.log('redirect');
        console.log(res.status)
        const test = await this.userService.setOnline(user.id);
        console.log("user apres connected : " + test.connected);
        // res.status(200).send(user);
        const frontendRedirectUrl = `${process.env.URL}:3001/`; 
        res.redirect(frontendRedirectUrl);
        return {
          user: user,
          token: token,
        }
      } catch (error) {
        // Gérez les erreurs ici, par exemple, renvoyez une réponse d'erreur appropriée.
        console.log(error);
        res.status(500).send('Une erreur s\'est produite.');
      }
    }

  @Get('qr-code')
  async generateQRCode(@Response() res) {
    try {
      // const user = await this.auth2FAService.getUserById(userId);
      // if (!user) {
      //   return res.status(404).send('User not found');
      // }
      const user =  await this.userService.findOne(5);
      console.log("user", user);
      if (user && !user.twoFactorAuthenticationSecret) {
        const result = await this.auth2FAService.generateTwoFactorAuthenticationSecret();

        // Ici, 'result.qrCodeDataURL' contient le lien du QR code en format 'data:image/png;base64,...'
        const qrCode = result.qrCodeDataURL.replace('data:image/png;base64,', '');
        const img = Buffer.from(qrCode, 'base64');
        console.log(img);
        res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
      }

      const res2 = await this.auth2FAService.isTwoFactorAuthenticationCodeValid("212622", user)
      console.log("isTwoFactorAuthenticationCodeValid", res2)

      res.status(200).send('QR code generated');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error while generating QR code');
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
