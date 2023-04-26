import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { UserRequestDto } from './user.dtos';

export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async save(
    userDto: UserRequestDto & { profileFileName?: string },
  ): Promise<UserDocument> {
    this.logger.log(`Starting save user. ${JSON.stringify(userDto)}`);
    return (await new this.userModel(userDto).save()).toObject();
  }
}
