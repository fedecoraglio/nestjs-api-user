import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { UserAdmin, UserAdminDocument } from './user-admin.schema';

@Injectable()
export class UserAdminRepository {
  private readonly logger = new Logger(UserAdminRepository.name);

  constructor(
    @InjectModel(UserAdmin.name)
    private readonly userAdminModel: Model<UserAdminDocument>,
  ) {}

  async createDefaultUserAdmin(): Promise<UserAdminDocument> {
    return (
      await new this.userAdminModel({
        name: 'John Admin',
        email: 'admin@test.com',
        password: await hash('12345678', 10),
      }).save()
    ).toObject();
  }
}
