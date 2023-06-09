import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

import { ExposeObjectId } from '@core/decorators/expose-object-id';
import { UserDocument } from './user.schema';

export class GetUserResponseDto {
  @ApiProperty()
  users: UserDto[];
  @ApiProperty()
  total: number;
}
export class UserRequestDto {
  @ApiProperty()
  @IsDefined()
  name: string;
  @ApiProperty()
  @IsDefined()
  lastName: string;
  @ApiProperty()
  @IsOptional()
  address: string;
}

export class UserDto {
  @ExposeObjectId() _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  profileFileName?: string;
  @ApiProperty()
  profileUrl?: string;

  constructor(user: UserDocument, profileUrl = null) {
    Object.assign(this, user);
    this.profileUrl = profileUrl;
  }
}
