// import { Injectable, Res } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { UserService } from 'src/user/user.service';
// import { HttpException, HttpStatus } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtService } from '@nestjs/jwt';
// import { Response } from 'express';
// import * as jwt from 'jsonwebtoken';

// export type UserDetails = {
//   email: string;
//   lastName: string;
//   firstName: string;
//   intraId?: number;
// };

// @Injectable()
// export class AuthService {
//   constructor(private readonly users_svc: UserService, private prisma : PrismaService, private readonly jwtServ: JwtService  ) {}
  
//   validateToken(token: string) {
//     return this.jwtServ.verify(token, {
//         secret : process.env.JWT_SECRET_KEY
//     });
// }
// async validateUser(details: UserDetails, @Res() res: Response) {
//   console.log('AuthService');
//   console.log(details);

//   try {
//     const user = await this.prisma.user.findUnique({ where: { email: details.email } });
//     console.log(user);

//     if (user) {
//       // L'utilisateur existe, générez un token JWT
//       const accessToken = jwt.sign({ userId: user.id, email: user.email }, 'votreSecretJWT');
//       console.log("token : " + accessToken);
//       // Ajoutez le JWT dans un cookie HTTP-only
//       res.cookie('access_token', accessToken, {
//         httpOnly: true,
//         // secure: true, // Vous pouvez définir ceci sur true si vous utilisez HTTPS
//         // sameSite: 'strict', // Vous pouvez ajuster cela selon vos besoins
//       });
      
//       return user;
//     } else {
//       console.log('User not found. Creating...');
//       const send = {
//         email: details.email,
//         lastName: details.lastName,
//         firstName: details.firstName,
//       };
//       const newUser = await this.prisma.user.create({
//         data: send,
//       });

//       // L'utilisateur est créé, générez un token JWT
//       const accessToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
//       console.log("token : " + accessToken);
//       // Ajoutez le JWT dans un cookie HTTP-only
//       res.cookie('token', accessToken, {
//         httpOnly: true,
//         // secure: true, // Vous pouvez définir ceci sur true si vous utilisez HTTPS
//         // sameSite: 'strict', // Vous pouvez ajuster cela selon vos besoins
//       });

//       return newUser;
//     }
//   } catch (error) {
//     // Gérez les erreurs ici, par exemple, renvoyez une réponse d'erreur appropriée.
//     throw new Error('Error in validateUser');
//   }
// }

// async authenticate(req, @Res() res: Response) {
//   console.log(req.user);
//   if (!req.user) {
//     return 'No user from google';
//   }

//   try {
//     const user = await this.validateUser(req.user, res); // Fournissez l'objet de réponse (res) ici
//     console.log(user);
//     console.log('User Info from Google');
//     return {
//       message: 'User Info from Google',
//       user: req.user,
//     };
//   } catch (error) {
//     // Gérez les erreurs ici, par exemple, renvoyez une réponse d'erreur appropriée.
//     console.log(error);
//     throw new Error('Error in authenticate');
//   }
// }

//   hello() {
//     return "Hello"
//   }

//   create(createAuthDto: CreateAuthDto) {
//     return 'This action adds a new auth';
//   }

//   findAll() {
//     return `This action returns all auth`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} auth2`;
//   }

//   update(id: number, updateAuthDto: UpdateAuthDto) {
//     return `This action updates a #${id} auth`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} auth`;
//   }
// }


// import { Controller, Get, Post, Body, Patch, Param, Delete, Req,UseGuards, Res } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { AuthGuard } from '@nestjs/passport'

// @Controller()
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post()
//   create(@Body() createAuthDto: CreateAuthDto) {
//     return this.authService.create(createAuthDto);
//   }


//   @Get('users')
//   findAll() {
//     return this.authService.findAll();
//   }

//   @Get('auth')
//   @UseGuards(AuthGuard('42'))
//   async FortyTwoAuth(@Req() req) { }

//   @Get('api/42auth/redirect')
//   @UseGuards(AuthGuard('42'))
//  async  FortyTwoRedirect(@Req() req, @Res() res) {
//   try {
//     const user = await this.authService.authenticate(req, res);
//     console.log(user);
//     console.log('redirect');
//     console.log(res.status)
//     return 2;
//   } catch (error) {
//     // Gérez les erreurs ici, par exemple, renvoyez une réponse d'erreur appropriée.
//     console.log(error);
//     res.status(500).send('Une erreur s\'est produite.');
//   }
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.authService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
//     return this.authService.update(+id, updateAuthDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.authService.remove(+id);
//   }
// }
