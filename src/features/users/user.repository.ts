import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { UserRequestDto } from './user.dtos';
import { PaginationOptions } from '@core/pagination-options/pagination-options';

export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async save(
    userDto: UserRequestDto & { profileFileName?: string },
  ): Promise<UserDocument> {
    this.logger.log(`Starting save user. ${JSON.stringify(userDto)}`);
    return (await new this.userModel(userDto).save())?.toObject();
  }

  async getById(id: string): Promise<UserDocument> {
    return (await this.userModel.findById(id))?.toObject() ?? null;
  }

  async getAll({ skip, limit }: PaginationOptions): Promise<{
    users: UserDocument[];
    total: number;
  }> {
    const users = await this.userModel.find().skip(skip).limit(limit).exec();

    const total = await this.userModel.find().count().exec();

    return {
      users: users.map((user: any) => user.toObject()),
      total,
    };
  }
}
