import {modelOptions, prop} from '@typegoose/typegoose'
import { Schema } from "mongoose";
import * as mongoose from 'mongoose'

@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: {virtuals: true}
    }
})
export class Access {

    @prop()
    module_name: string // 模块名称
    @prop()
    action_name: string // 操作名称
    @prop()
    type: number // 节点类型： 1-模块 2-菜单 3-操作
    @prop()
    url: string // 路由跳转地址
    @prop()
    module_id: Schema.Types.Mixed // 混合类型：0-当前模块 、_id-操作/菜单
    @prop()
    sort: {
      type: number,
      default: 100
    }
    @prop()
    description: string
    @prop()
    status: string

    @prop()
    id: string;
}
