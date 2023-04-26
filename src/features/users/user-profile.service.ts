import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  DEFAULT_EXTENSION_IMAGE,
  VALID_EXTENSION_LIST,
} from '@core/utils/constant';
import { ErrorCode } from '@core/errors/error-code';
import { UserConfigService } from '@core/config/user-config.service';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);
  private readonly _profileBaseUrl = this.userConfigService.fullPathProfileImg;

  constructor(private readonly userConfigService: UserConfigService) {}

  uploadFile(content: Buffer, originalname: string): string {
    let newFileName = null;
    try {
      this.logger.log('Starting uploading file');
      const extension = originalname
        ? path.extname(originalname)
        : DEFAULT_EXTENSION_IMAGE;

      if (!VALID_EXTENSION_LIST.includes(extension)) {
        throw new HttpException(
          {
            code: ErrorCode.UserNotFound,
            message: `The extension must be one of this: ${JSON.stringify(
              VALID_EXTENSION_LIST,
            )}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      newFileName = `${uuidv4()}${extension}`;
      this.logger.log(`Profile file name ${newFileName}`);
      fs.writeFileSync(`${this._profileBaseUrl}${newFileName}`, content);
    } catch (err) {
      newFileName = null;
      this.logger.error(err);
      throw err;
    }
    return newFileName;
  }

  getProfileBaseUrl() {
    return this._profileBaseUrl;
  }
}
