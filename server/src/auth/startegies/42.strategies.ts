import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback} from 'passport-42'
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';

config();

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
            clientID: process.env.CLIENT_UID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/42auth/redirect',
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
        console.log("profile : " + stringify(profile));
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);
    }
}