/**
 * RBAC模型 - 角色模型
 */

import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import {Admin} from "./admin.model";

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Role {
  @prop()
  title: string
  @prop()
  description: string
  @prop()
  status: {
    type: number,
    default: 1
  }

}
