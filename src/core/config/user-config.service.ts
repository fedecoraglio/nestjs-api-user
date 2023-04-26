import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export const userConfigSchemaValidation = Joi.object({
  db_uri: Joi.string().required(),
  port: Joi.string().required().default(3000),
  jwt_secret: Joi.string().required(),
  jwt_expires: Joi.string().required().default('7 days'),
});

@Injectable()
export class UserConfigService {
  readonly dbUri: string = this.configService.get<string>('db_uri');
  readonly port: number = this.configService.get<number>('port');
  readonly jwtSecret: string = this.configService.get<string>('jwt_secret');
  readonly jwtExpires: string = this.configService.get<string>('jwt_expires');
  readonly fullPathProfileImg: string =
    this.configService.get<string>('full_user_path_profile_img') ?? '';
  readonly serveRootImage: string =
    this.configService.get<string>('serve_root_image') ?? '/profile-images/';
  readonly serverDomain: string =
    this.configService.get<string>('serve_domain') ??
    `http://localhost:${this.port}`;

  constructor(private readonly configService: ConfigService) {}
}
