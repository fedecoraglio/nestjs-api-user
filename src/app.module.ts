import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { UserAdminModule } from '@users-admin/user-admin.module';
import { AuthService } from '@auth/auth.service';
import { JwtStrategy } from '@auth/jwt-strategy';
import { JwtAuthGuard } from '@auth/jwt-auth-guard';
import { AuthValidateMiddleware } from '@auth/auth-validate.middleware';
import { UserModule } from '@users/user.module';
import { UserConfigModule } from '@core/config/user-config.module';
import { UserConfigService } from '@core/config/user-config.service';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [UserConfigModule],
      useFactory: (userConfigService: UserConfigService) => [
        {
          rootPath: userConfigService.fullPathProfileImg,
          serveRoot: userConfigService.serveRootImage,
        },
      ],
      inject: [UserConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [UserConfigModule],
      useFactory: (userConfigService: UserConfigService) => ({
        uri: userConfigService.dbUri,
      }),
      inject: [UserConfigService],
    }),
    JwtModule.registerAsync({
      imports: [UserConfigModule],
      useFactory: (userConfigService: UserConfigService) => ({
        secret: userConfigService.jwtSecret,
        signOptions: { expiresIn: userConfigService.jwtSecret },
      }),
      inject: [UserConfigService],
    }),
    UserConfigModule,
    UserAdminModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    JwtStrategy,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthValidateMiddleware).forRoutes('*');
  }
}
