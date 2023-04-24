import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserAdminModule } from './features/users-admin/user-admin.module';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    UserAdminModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
