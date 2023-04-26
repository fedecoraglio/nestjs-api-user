import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { UserConfigService } from '../../core/config/user-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly userConfigService: UserConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userConfigService.jwtSecret,
    });
  }

  validate(payload: any): any {
    const { sub, ...rest } = payload;

    return { id: sub, ...rest };
  }
}
