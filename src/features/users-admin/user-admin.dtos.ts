import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { ExposeObjectId } from '@core/decorators/expose-object-id';
import { UserAdminDocument } from './user-admin.schema';

export class UserAdminDto {
  @ExposeObjectId() _id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  @Exclude()
  password?: string;

  constructor(user: UserAdminDocument) {
    Object.assign(
      this,
      {
        email: '',
      },
      user,
    );
  }
}
