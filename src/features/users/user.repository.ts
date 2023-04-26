import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { UserRequestDto } from './user.dtos';
import { PaginationOptions } from '@core/pagination-options/pagination-options';
import { ErrorCode } from '@core/errors/error-code';

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

  async findAndUpdate(
    id: string,
    userDto: UserRequestDto & { profileFileName?: string },
  ): Promise<UserDocument> {
    this.logger.log(`Starting update user.`);
    const user = (await this.userModel.findById(id))?.toObject();
    if (!user) {
      throw { code: ErrorCode.UserNotFound, message: 'User not found' };
    }
    userDto.name = userDto.name ? userDto.name : user.name;
    userDto.address = userDto.address ? userDto.address : user.address;
    userDto.lastName = userDto.lastName ? userDto.lastName : user.lastName;
    userDto.profileFileName = userDto.profileFileName
      ? userDto.profileFileName
      : user.profileFileName;
    return (
      await this.userModel.findByIdAndUpdate(
        id,
        { ...userDto },
        {
          new: true,
        },
      )
    )?.toObject();
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
