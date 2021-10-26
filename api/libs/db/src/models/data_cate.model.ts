/**
 * 数据类型属性
 */

import {modelOptions, prop, Ref} from '@typegoose/typegoose'
import * as mongoose from 'mongoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true }
  }
})
export class DataCate {
  @prop()
  title: string   // 分类名称
  @prop()
  sub_title: string   // SEO
  @prop()
  keywords: string   // SEO
  @prop()
  description: string   // SEO
  @prop()
  template: string    /*指定当前分类的模板*/

  @prop({ ref: () => DataCate })  // 自关联表，混合类型
  pid: mongoose.Schema.Types.Mixed       // 0-一级分类   上级id-下一级分类

  @prop()
  cate_img: string  // 分类图片
  @prop()
  link: string      // 跳转地址
  @prop({required: true})
  status: { type: number, default: 1 }
  @prop()
  sort: { type: number, default: 100 }

}
