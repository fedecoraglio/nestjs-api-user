import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class User {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  name: string;
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  lastName: string;
  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  profileFileName: string;
}

export type UserDocument = User & Document;
export const userSchema = SchemaFactory.createForClass(User);
