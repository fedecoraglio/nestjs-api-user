import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from '@users/user.service';
import { UserDto, UserRequestDto } from '@users/user.dtos';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ErrorCode } from '../../core/errors/error-code';

@ApiBearerAuth()
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        lastName: { type: 'integer' },
        profileFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profileFile'))
  async saveUser(
    @Body() userRequestDto: UserRequestDto,
    @UploadedFile() profileFile: Express.Multer.File,
  ): Promise<UserDto> {
    return await this.userService.save(userRequestDto, profileFile);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.getById(id);

    if (!user) {
      throw new HttpException(
        {
          code: ErrorCode.UserNotFound,
          message: "Can't find a user with this ID ",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}
