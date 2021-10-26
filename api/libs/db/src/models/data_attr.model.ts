/**
 * 数据属性
 */

import {modelOptions, prop, Ref} from '@typegoose/typegoose'
import * as mongoose from 'mongoose'
import {DataType} from './data_type.model'
import {DataCate} from './data_cate.model'
import {Data} from './data.model'
import {DataTypeAttribute} from './data_type_attribute.model'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true }
  }
})
export class DataAttr {
  // 备用字段
  @prop({ ref: () => DataCate })
  data_cate_id: Ref<DataCate>  // 数据分类 id
  @prop({ ref: () => DataType })
  attribute_cate_id: Ref<DataType> // 数据类型 id
  @prop({ ref: () => DataTypeAttribute })
  attribute_id: Ref<DataTypeAttribute> // 数据类型属性 id
  @prop()
  attribute_type: string        // 商品类型属性对应 type

  // 固定字段
  @prop({ ref: () => Data })
  data_id: Ref<Data>           // 数据 id
  @prop()
  attribute_title: string
  @prop()
  attribute_value: string      // 数据其他属性
  @prop({required: true})
  status: { type: number, default: 1 }
  @prop()
  sort: { type: number, default: 100 }
}
