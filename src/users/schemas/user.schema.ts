import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserType {
  COMMON = 'COMMON',
  MERCHANT = 'MERCHANT',
}

@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  cpfOrCnpj: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserType })
  type: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);
