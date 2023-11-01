import { Injectable, Res } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_TOKEN_TYPE } from './type/token';
import { stringify } from 'querystring';
import { AuthTwoFAService } from './2FA/twoFA-generator';

export type UserDetails = {
  email: string;
  lastName: string;
  firstName: string;
  intraId?: number;
};

@Injectable()
export class AuthService {
  constructor(private readonly users_svc: UserService,
     private prisma : PrismaService,
      private readonly jwtServ: JwtService,
      private authTwoFAService:AuthTwoFAService  ) {}
  
  validateToken(token: string) {
    return this.jwtServ.verify(token, {
        secret : process.env.JWT_SECRET_KEY
    });
}

  createToken(data: any, type: JWT_TOKEN_TYPE ) {
    const secret =
    type === 'newToken'
      ? process.env.JWT_SECRET_KEY
      : process.env.JWT_REFRESH_SECRET;
    console.log("secret : " + secret);
    const expiresIn = type === 'newToken' ? '30s' : '7d';
      const token = jwt.sign(data, secret, {
        expiresIn: expiresIn,
      });
      return  token;
  }
  async authVerification(details: UserDetails, @Res() res: Response) {
    console.log('AuthService');
    console.log("details : " + stringify(details));

    try {
      const user = await this.prisma.user.findUnique({ where: { email: details.email } });
      console.log(user);

      if (user) {
        // L'utilisateur existe, générez un token JWT
        const token = this.createToken({ userId: user.id, email: user.email }, 'newToken');
        const refreshToken = this.createToken({ userId: user.id, email: user.email }, 'refreshToken');
        console.log("token : " + token);
        // Ajoutez le JWT dans un cookie HTTP-only
        res.cookie('token', token, {
          httpOnly: true,
          // secure: true, // Vous pouvez définir ceci sur true si vous utilisez HTTPS
          // sameSite: 'strict', // Vous pouvez ajuster cela selon vos besoins
        });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          // secure: true, // Vous pouvez définir ceci sur true si vous utilisez HTTPS
          // sameSite: 'strict', // Vous pouvez ajuster cela selon vos besoins
        });
        
        return {
          user: user,
          token : token,
        };
      } else {
        console.log('User not found. Creating...');
        const send = {
          email: details.email,
          lastName: details.lastName,
          firstName: details.firstName,
          intraId: Number(details.intraId),
        };
        // console.log("send : " + JSON.stringify(send));
        const newUser = await this.prisma.user.create({
          data: send,
        });

        const token = this.createToken({ userId: newUser.id, email: newUser.email }, 'newToken');
        const refreshToken = this.createToken({ userId: newUser.id, email: newUser.email }, 'refreshToken');
        console.log("token : " + token);

        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict', 
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true, 
          sameSite: 'strict', 
        });

        return {
          user : newUser,
          token : token,
        };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error in validateUser');
    }
  }

  async authenticate(req, @Res() res: Response) {
    console.log(req.user);
    if (!req.user) {
      return {
        sucess: false,
      };
    }

    try {
      const user = await this.authVerification(req.user, res); 

      return {
        message: 'User Info from 42',
        sucess: true,
        user: user.user,
        token: user.token
      };
    } catch (error) {

      console.log(error);
      throw new Error('Error in authenticate');
    }
  }

  hello() {
    return "Hello"
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

