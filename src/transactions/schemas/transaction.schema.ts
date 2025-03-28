import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  payerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  payeeId: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
