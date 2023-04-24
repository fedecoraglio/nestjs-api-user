import { Injectable } from '@nestjs/common';
import { UserAdminRepository } from './user-admin.repository';
import { UserAdminDto } from './user-admin.dtos';

@Injectable()
export class UserAdminService {
  constructor(private readonly userAdminRepository: UserAdminRepository) {}

  async createDefaultUser(): Promise<UserAdminDto> {
    return this.userAdminRepository.createDefaultUserAdmin();
  }
}
