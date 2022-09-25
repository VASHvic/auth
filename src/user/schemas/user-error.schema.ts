import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

export type UserErrorDocument = UserError & Document;

@Schema()
export class UserError {
  @Prop({ required: false, unique: false, type: Object })
  error: any;
}

export const ErrorSchema = SchemaFactory.createForClass(UserError);
