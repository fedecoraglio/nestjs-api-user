import { Controller, Get } from '@nestjs/common';

import { isProduction } from './core/utils/is-production';
import { UserAdminService } from './features/users-admin/user-admin.service';

@Controller()
export class AppController {
  constructor(private readonly userAdminService: UserAdminService) {
    if (!isProduction()) {
      this.setUpDefaultUser();
    }
  }

  @Get()
  getHello(): string {
    return 'Hello World';
  }

  private setUpDefaultUser() {
    this.userAdminService.createDefaultUser();
  }
}
