import { Controller, Get, Post, Body, Patch, Param, Delete, Req,UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express';
import { AuthGuardToken } from './guards/auth.guard';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const user = await this.authService.authenticate(req, res);
    console.log(user);
    console.log('redirect');
    console.log(res.status)
          res.status(200).send(user);
  } catch (error) {
    // Gérez les erreurs ici, par exemple, renvoyez une réponse d'erreur appropriée.
    console.log(error);
    res.status(500).send('Une erreur s\'est produite.');
  }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
