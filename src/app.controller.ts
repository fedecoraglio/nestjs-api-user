import { Body, Controller, Get, Post } from '@nestjs/common';

import { isProduction } from '@core/utils/is-production';
import { Public } from '@core/public';
import { UserAdminService } from '@users-admin/user-admin.service';
import { LoginRequestDto, LoginResponseDto } from '@auth/auth.dtos';
import { AuthService } from '@auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly userAdminService: UserAdminService,
  ) {
    if (!isProduction()) {
      this.setUpDefaultUser();
    }
  }

  @Public()
  @Post('/login')
  login(
    @Body() { email, password }: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(email, password);
  }

  @Public()
  @Get()
  welcome(): string {
    return 'Welcome to API Users';
  }

  private setUpDefaultUser() {
    this.userAdminService.createDefaultUser();
  }
}
