import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { Access } from '@lib/db/models/access.model';
import {mongoose, ReturnModelType} from "@typegoose/typegoose";
import {AccessInterface} from "../../interface/access.interface";
import { Admin } from "@lib/db/models/admin.model";

@Injectable()
export class AccessService {
  constructor(
    @InjectModel(Access) private readonly accessModel: ReturnModelType<typeof Access>
  ) {}

  async add(createDto:AccessInterface) {
    try{
      const created = new this.accessModel(createDto);
      return await created.save();
    } catch (e) {
      // console.log(e)
      return null
    }
  }

  async find(obj:AccessInterface={}, fields?:string): Promise<Access[] | null> {
    try{
      return await this.accessModel.find(obj, fields).exec();
    } catch (e) {
      return  []
    }
  }

  // 查询 module_id=0 且自关联 id
  async findWithModule(): Promise<Admin[] | null> {
    try{
      return await  this.accessModel.aggregate([
        {
          $lookup: {
            from : 'accesses',
            localField: '_id',
            foreignField: 'module_id',
            as: 'items'
          }
        },
        {
          $match: {
            "module_id": '0'
          }
        }
      ])
    } catch (e) {
      return []
    }
  }

  async update(updateDto:AccessInterface, oldDto:AccessInterface,): Promise<Access> {
    try{
      let access = await this.accessModel.updateOne(oldDto, updateDto)
      return access
    } catch (e) {
      return null
    }
  }

  async delete(Dto:AccessInterface): Promise<Access> {
    try{
      let access = await this.accessModel.deleteOne(Dto)
      return access
    } catch (e) {
      return null
    }
  }
}
