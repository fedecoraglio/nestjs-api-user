import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserAdmin {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    required: true,
  })
  email: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  password: string;
}

export type UserAdminDocument = UserAdmin & Document;
export const userAdminSchema = SchemaFactory.createForClass(UserAdmin);
