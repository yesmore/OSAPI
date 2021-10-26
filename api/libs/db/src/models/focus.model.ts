/**
 * 首页轮播图
 */

import { modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {virtuals: true}
  }
})
export class Focus {
  @prop()
  title: string
  @prop()
  type: number
  @prop()
  focus_img: string
  @prop()
  link: string
  @prop()
  sort: number
  @prop({ required: true })
  status: { type: number, default: 1 }

}
