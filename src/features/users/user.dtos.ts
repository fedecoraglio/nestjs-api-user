import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

import { ExposeObjectId } from '@core/decorators/expose-object-id';
import { UserDocument } from './user.schema';

export class UserRequestDto {
  @ApiProperty()
  @IsDefined()
  name: string;
  @ApiProperty()
  @IsDefined()
  lastName: string;
}

export class UserDto {
  @ExposeObjectId() _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastName: string;

  constructor(user: UserDocument) {
    Object.assign(this, user);
  }
}
