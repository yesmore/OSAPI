import {modelOptions, prop} from '@typegoose/typegoose'

@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: { virtuals: true }
    }
})

export class Uv {
    @prop({ required: true })
    site_name: string

    @prop({ required: true, default: 0 })
    uv_count: number

    @prop({ required: true })
    uip: string
}
