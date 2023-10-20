import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException, Response } from '@nestjs/common';
import { AuthService } from '../auth.service';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuardToken implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse(); // Récupérer l'objet Response

            const cookies = cookie.parse(request.headers.cookie || '');
            const token = cookies?.token;
            const refreshToken = cookies?.refreshToken;
            const secret = token ? process.env.JWT_SECRET_KEY : process.env.JWT_REFRESH_SECRET;

            if (!token || !refreshToken) {
                // Utiliser la méthode `status()` pour définir le code de statut de la réponse
                response.status(401).send('Please provide a valid token'); // 401 pour non autorisé
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
                                const newToken = this.authService.createToken({ userId: decoded.userId, email: decoded.email}, 'newToken');
                                response.cookie('token', newToken, {
                                    httpOnly: true,
                                    secure: true, // Vous pouvez définir ceci sur true si vous utilisez HTTPS
                                    sameSite: 'strict', // Vous pouvez ajuster cela selon vos besoins
                                });
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