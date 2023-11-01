import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class AuthGuardToken implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            console.log("AuthGuardToken");
                    const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        const { res } = ctx.getContext();
        console.log("res : " + res)
        console.log("request.headers.cookie : " + request.headers.cookie)
                    // const request = context.switchToHttp().getRequest();
            // const res = context.switchToHttp().getResponse(); // Récupérer l'objet res
            const cookies = cookie.parse(request.headers.cookie || '');
            const token = cookies?.token;
            const refreshToken = cookies?.refreshToken;
            const secret = token ? process.env.JWT_SECRET_KEY : process.env.JWT_REFRESH_SECRET;

            if (!token || !refreshToken) {
                // Utiliser la méthode `status()` pour définir le code de statut de la réponse
                res.status(401).send('Please provide a valid token'); // 401 pour non autorisé
                return false; // Return false pour indiquer que la validation a échoué
            }
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, secret, (err, decoded) => {
                    if (err) {
                        jwt.verify(refreshToken, secret, (err, decoded) => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log("jtw 2");
                                console.log("Create new token...")
                                console.log(decoded);
                                let email: string = null;
                                let userId: number = null;
                                if (typeof decoded !== "string"){
                                    email = decoded.email;
                                    userId = decoded.userId;
                                }
         
                                const newToken = this.authService.createToken({ userId: userId, email: email}, 'newToken');
                                console.log("newToken : " + newToken);
                                
                                res.cookie('token', newToken, {
                                    httpOnly: true,
                                    // secure: true, // Vous pouvez définir ceci sur true si vous utilisez HTTPS
                                    // sameSite: 'strict', // Vous pouvez ajuster cela selon vos besoins
                                });
                                console.log("dkk")
                                resolve(decoded);
                            }
                        });
                    } else {
                        console.log("jtw 1");
                        resolve(decoded);
                    }
                });
            });

            // const resp = await this.authService.validateToken(token);
            return true;
        } catch (error) {
            console.log('auth error - ', error.message);
            throw new UnauthorizedException(error.message || 'Session expired! Please sign in');
        }
    }
}