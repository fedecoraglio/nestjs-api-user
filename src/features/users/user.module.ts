import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, userSchema } from './user.schema';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserProfileService } from './user-profile.service';
import { UserConfigModule } from '@core/config/user-config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    UserConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProfileService, UserRepository],
  exports: [UserService, UserProfileService, UserRepository],
})
export class UserModule {}
