import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';

import { LoginResponseDto } from './auth.dtos';
import { UserAdminService } from '@users-admin/user-admin.service';
import { ErrorCode } from '@core/errors/error-code';
import { UserAdminDto } from '@users-admin/user-admin.dtos';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userAdminService: UserAdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const dbUser = await this.userAdminService.findOneByEmail(email);

    if (!dbUser) {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: 'User with this email does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordsMatch = await compare(password, dbUser.password);

    if (!isPasswordsMatch) {
      throw new HttpException(
        {
          code: ErrorCode.PasswordsNotMatch,
          message: 'Email and password does not match',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const sub = omit(dbUser, '_id', 'password');

    return {
      access_token: this.jwtService.sign({
        sub: dbUser._id,
        ...sub,
      }),
      user: new UserAdminDto(dbUser),
    };
  }

  async isUserActive(token: string): Promise<boolean> {
    let isUserActive = false;

    try {
      const accessToken = token.replace('Bearer ', '');
      const userData: any = this.jwtService.decode(accessToken);

      isUserActive = await this.userAdminService.isUserActive(userData.sub);
    } catch (err) {
      this.logger.error(err);
    }

    return isUserActive;
  }
}
