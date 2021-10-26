/**
 * 用户模型
 */

import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import * as mongoose from 'mongoose';
import { Role } from "@lib/db/models/role.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {virtuals: true}
  }
})
export class Admin {
  @prop()
  username: string
  @prop()
  password: string
  @prop()
  mobile: string
  @prop()
  email: string
  @prop()
  status: { type:number, default: 1 }
  @prop()
  is_super: number

  @prop({ ref: () => Role })    // 关联角色模型
  role_id: Ref<Role>

}
