import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProfileService, UserRepository],
  exports: [UserService, UserProfileService, UserRepository],
})
export class UserModule {}
