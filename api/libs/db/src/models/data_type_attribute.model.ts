/**
 * 数据类型属性
 */

import {modelOptions, prop, Ref} from '@typegoose/typegoose'
import { DataType } from "@lib/db/models/data_type.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true }
  }
})
export class DataTypeAttribute {
  @prop()
  title: string
  @prop({ ref: () => DataType })    // 关联-数据类型
  cate_id: Ref<DataType>
  @prop()
  attr_type: string  // 属性类型 1-input   2-textarea   3-select
  @prop()
  attr_value: string  // 默认值： input/textarea默认值是空   select框有默认值  多个默认值以回车隔开
  @prop({required: true})
  status: { type: number, default: 1 }
}
