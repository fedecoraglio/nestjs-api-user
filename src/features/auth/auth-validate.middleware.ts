import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthValidateMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!!token) {
      const isActive = await this.authService.isUserActive(token);

      if (!isActive) {
        throw new UnauthorizedException(`User is not active`);
      }
    }

    next();
  }
}
