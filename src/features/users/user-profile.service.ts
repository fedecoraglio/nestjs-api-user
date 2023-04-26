import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);
  private readonly _profileBaseUrl =
    this.configService.get<string>('user_full_dir_path');

  constructor(private readonly configService: ConfigService) {}

  uploadFile(content: Buffer, originalname: string): string {
    let newFileName = null;
    try {
      this.logger.log('Starting uploading file');
      const extension = originalname ? path.extname(originalname) : '.jpeg';
      newFileName = `${uuidv4()}${extension}`;
      this.logger.log(`Profile file name ${newFileName}`);
      fs.writeFileSync(`${this._profileBaseUrl}${newFileName}`, content);
    } catch (err) {
      newFileName = null;
      this.logger.error(err);
    }
    return newFileName;
  }

  getProfileBaseUrl() {
    return this._profileBaseUrl;
  }
}
