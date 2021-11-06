import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { Uv } from "@lib/db/models/uv.model";
import { ReturnModelType } from "@typegoose/typegoose";
import { UvInterface } from "../../../interface/uv.interface";

@Injectable()
export class UvService {
  constructor(
    @InjectModel(Uv)
    private readonly uvModel: ReturnModelType<typeof Uv>,
  ) {}

  async add(createDto: object): Promise<Uv> {
    try{
      const created = new this.uvModel(createDto);
      return await created.save();
    } catch (e) {
      // console.log(e)
      return null
    }
  }

  async find(obj:UvInterface={}, fields?:string): Promise<Uv[] | null> {
    try{
      return await this.uvModel.find(obj, fields).exec();
    } catch (e) {
      return []
    }
  }

  async findCount(obj:UvInterface={}, fields?:string): Promise<Uv[] | null> {
    try{
      // return await this.uvModel.find(obj, fields).exec();
      return await this.uvModel.aggregate([
        {
          $group: {
            _id: `$site_name`,
            uv_count: { $sum: '$uv_count' }
          }
        }
      ])
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async update(updateDto:UvInterface, oldDto:UvInterface,): Promise<Uv> {
    try{
      let uv = await this.uvModel.updateOne(oldDto, updateDto)
      return uv
    } catch (e) {
      return null
    }
  }

  async delete(Dto:UvInterface): Promise<Uv> {
    try{
      let uv = await this.uvModel.deleteOne(Dto)
      return uv
    } catch (e) {
      return null
    }
  }
}
