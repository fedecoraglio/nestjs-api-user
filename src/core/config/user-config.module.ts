import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  UserConfigService,
  userConfigSchemaValidation,
} from './user-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      cache: true,
      validationSchema: userConfigSchemaValidation,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [UserConfigService],
  exports: [UserConfigService],
})
export class UserConfigModule {}
