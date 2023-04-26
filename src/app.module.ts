import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { UserAdminModule } from './features/users-admin/user-admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from '@auth/auth.service';
import { JwtStrategy } from '@auth/jwt-strategy';
import { JwtAuthGuard } from '@auth/jwt-auth-guard';
import { AuthValidateMiddleware } from '@auth/auth-validate.middleware';
import { UserModule } from '@users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => require(`./env/${process.env.NODE_ENV}.env.json`)],
      cache: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('db_uri'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        signOptions: { expiresIn: configService.get<string>('jwt_expires') },
      }),
      inject: [ConfigService],
    }),
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
