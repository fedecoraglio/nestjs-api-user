import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from '@users/user.service';
import { GetUserResponseDto, UserDto, UserRequestDto } from '@users/user.dtos';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { ErrorCode } from '@core/errors/error-code';
import {
  Pagination,
  PaginationOptions,
} from '@core/pagination-options/pagination-options';

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

  @Put(':id')
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
  async updateUser(
    @Param('id') id: string,
    @Body() userRequestDto: UserRequestDto,
    @UploadedFile() profileFile: Express.Multer.File,
  ): Promise<UserDto> {
    return await this.userService.update(id, userRequestDto, profileFile);
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

  @ApiQuery({
    name: 'pageSize',
    type: String,
    required: false,
  })
  @ApiQuery({ name: 'page', type: String, required: false })
  @Get()
  async findAll(
    @Pagination() paginationOptions: PaginationOptions,
  ): Promise<GetUserResponseDto> {
    return await this.userService.getAll(paginationOptions);
  }
}
