/**
 * 数据类型
 */

import { modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true }
  }
})
export class DataType {
  @prop()
  title: string
  @prop()
  description: string
  @prop({required: true})
  status: { type: number, default: 1 }
  @prop({required: true})
  sort: { type: number, default: 0 }
}
