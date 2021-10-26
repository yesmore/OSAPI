import {modelOptions, prop, Ref} from '@typegoose/typegoose'
import {Role} from "@lib/db/models/role.model";
import {Access} from "@lib/db/models/access.model";

@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: {virtuals: true}
    }
})
export class Roleaccess {
    @prop({ ref: () => Access })
    access_id: Ref<Access>
    @prop({ ref: () => Role })
    role_id: Ref<Role>
}
/*
* 角色 - 权限模块操作 关联表
* */
