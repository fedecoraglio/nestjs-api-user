import { Injectable } from '@nestjs/common';

import { UserAdminRepository } from '@users-admin/user-admin.repository';
import { UserAdminDocument } from '@users-admin/user-admin.schema';
import { UserAdminDto } from './user-admin.dtos';

@Injectable()
export class UserAdminService {
  constructor(private readonly userAdminRepository: UserAdminRepository) {}

  async createDefaultUser(): Promise<UserAdminDto> {
    return new UserAdminDto(
      await this.userAdminRepository.createDefaultUserAdmin(),
    );
  }

  async findOneByEmail(email: string): Promise<UserAdminDocument> {
    try {
      return this.userAdminRepository.findOneByEmail(email);
    } catch {
      return null;
    }
  }

  async isUserActive(id: string): Promise<boolean> {
    return !!(await this.userAdminRepository.findOneById(id));
  }
}
