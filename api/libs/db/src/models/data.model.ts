/**
 * 数据类型属性
 */

import {modelOptions, prop, Ref} from '@typegoose/typegoose'
import * as mongoose from 'mongoose'
import {DataType} from './data_type.model'
import {DataCate} from './data_cate.model'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true }
  }
})
export class Data {
  @prop()
  title: string   // 数据名称
  @prop()
  sub_title: string
  @prop()
  data_sn: string

  @prop({ ref: () => DataCate })
  cate_id: Ref<DataCate>        // 数据分类
  @prop({ ref: () => DataType })
  data_type_id: Ref<DataType>   // 数据类型

  @prop()
  click_count: {
    type: number,
    default: 100
  }
  @prop()
  data_number: {
    type: number,
    default: 1000
  }
  @prop()
  price: number

  @prop()
  relation_data: string  //
  @prop()
  data_attrs: string      // 数据其他属性
  @prop()
  data_version: string      //
  @prop()
  data_keywords: string      //
  @prop()
  data_desc: string      //
  @prop()
  data_content: string      //
  @prop()
  data_img: string      //

  @prop()
  is_delete: string      //
  @prop()
  is_hot: string      //
  @prop()
  is_new: string      //

  @prop({required: true})
  status: { type: number, default: 1 }
  @prop()
  sort: { type: number, default: 100 }
}
