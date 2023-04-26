import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { UserRepository } from '@users/user.repository';
import { GetUserResponseDto, UserDto, UserRequestDto } from '@users/user.dtos';
import { UserProfileService } from '@users/user-profile.service';
import { UserDocument } from '@users/user.schema';
import { UserConfigService } from '@core/config/user-config.service';
import { PaginationOptions } from '@core/pagination-options/pagination-options';
import { PAGINATION_DEFAULT_LIMIT } from '@core/utils/constant';
import { ErrorCode } from '@core/errors/error-code';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileService: UserProfileService,
    private readonly userConfigService: UserConfigService,
  ) {}

  async save(
    dto: UserRequestDto,
    profileFile: Express.Multer.File,
  ): Promise<UserDto> {
    let userDto: UserDto = null;
    try {
      this.logger.log(`Starting save user. ${dto.name}`);
      const profileFileName = this.userProfileService.uploadFile(
        profileFile.buffer,
        profileFile.originalname,
      );
      const userDocument = await this.userRepository.save({
        ...dto,
        profileFileName,
      });
      userDto = this.createUserDto(userDocument);
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        {
          code: ErrorCode.UserErrorSaving,
          message: err.message ?? 'Error during user saving process',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return userDto;
  }

  async update(
    id: string,
    dto: UserRequestDto,
    profileFile: Express.Multer.File,
  ): Promise<UserDto> {
    let userDto: UserDto = null;
    try {
      this.logger.log(`Starting update user. ${dto.name}`);
      let profileFileName = null;
      if (profileFile?.originalname) {
        profileFileName = this.userProfileService.uploadFile(
          profileFile.buffer,
          profileFile.originalname,
        );
      }
      const userDocument = await this.userRepository.findAndUpdate(id, {
        ...dto,
        profileFileName,
      });
      userDto = this.createUserDto(userDocument);
    } catch (err) {
      throw new HttpException(
        {
          code: err.code ?? ErrorCode.UserErrorUpdating,
          message: err.message ?? 'Error during user updating process',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return userDto;
  }

  async getById(id: string): Promise<UserDto> {
    return this.createUserDto(await this.userRepository.getById(id));
  }

  async getAll({
    skip,
    limit,
  }: PaginationOptions): Promise<GetUserResponseDto> {
    const resp = await this.userRepository.getAll({
      skip: skip ?? 0,
      limit: limit ?? PAGINATION_DEFAULT_LIMIT,
    });
    const { serverDomain, serveRootImage } = this.userConfigService;
    return {
      users: instanceToPlain(
        resp.users.map(
          (user) =>
            new UserDto(
              user,
              user?.profileFileName
                ? `${serverDomain}${serveRootImage}${user.profileFileName}`
                : null,
            ),
        ),
      ),
      total: resp.total,
    } as GetUserResponseDto;
  }

  private createUserDto(user: UserDocument): UserDto {
    return user
      ? new UserDto(
          user,
          `${this.userConfigService.serverDomain}${this.userConfigService.serveRootImage}${user.profileFileName}`,
        )
      : null;
  }
}
