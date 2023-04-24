import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserAdmin, userAdminSchema } from './user-admin.schema';
import { UserAdminService } from './user-admin.service';
import { UserAdminRepository } from './user-admin.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserAdmin.name,
        schema: userAdminSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [UserAdminService, UserAdminRepository],
  exports: [UserAdminService, UserAdminRepository],
})
export class UserAdminModule {}
