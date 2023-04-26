import { Injectable, Logger } from '@nestjs/common';

import { UserRepository } from '@users/user.repository';
import { UserDto, UserRequestDto } from '@users/user.dtos';
import { UserProfileService } from '@users/user-profile.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileService: UserProfileService,
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
      userDto = new UserDto(userDocument);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
    return userDto;
  }
}
