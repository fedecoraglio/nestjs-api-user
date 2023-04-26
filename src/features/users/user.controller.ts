import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from '@users/user.service';
import { UserDto, UserRequestDto } from '@users/user.dtos';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profileFile'))
  async saveUser(
    @Body() userRequestDto: UserRequestDto,
    @UploadedFile() profileFile: Express.Multer.File,
  ): Promise<UserDto> {
    return await this.userService.save(userRequestDto, profileFile);
  }
}
