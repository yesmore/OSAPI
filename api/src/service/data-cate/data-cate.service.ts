import { Injectable } from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {DataCate} from '@lib/db/models/data_cate.model';
import {ReturnModelType} from "@typegoose/typegoose";
import {DataCateInterface} from "../../interface/data_cate.interface";
import {Config} from '../../config/config'

@Injectable()
export class DataCateService {
  constructor(
    @InjectModel(DataCate)
    private readonly dataCateModel: ReturnModelType<typeof DataCate>,
  ) {}

  async add(createDto: object): Promise<DataCate> {
    try{
      const created = new this.dataCateModel(createDto);
      return await created.save();
    } catch (e) {
      // console.log(e)
      return null
    }
  }

  async find(obj:DataCateInterface={}, fields?:string): Promise<DataCate[] | null> {
    try{
      return await this.dataCateModel.find(obj, fields).exec();
    } catch (e) {
      return []
    }
  }

  async findDataCateAttributeWithCateID(obj:DataCateInterface={}, fields?:string): Promise<DataCate[] | null> {
    try{
      return await this.dataCateModel.aggregate([
        {
          $lookup: {
            from : 'datacates',
            localField: '_id',
            foreignField: 'pid',
            as: 'son'
          }
        },
        {
          $lookup: {
            from : 'datacates',
            localField: 'pid',
            foreignField: '_id',
            as: 'father'
          }
        },
      ])
    } catch (e) {
      return []
    }
  }

  async update(updateDto:DataCateInterface, oldDto:DataCateInterface,): Promise<DataCate> {
    try{
      let dataCate = await this.dataCateModel.updateOne(oldDto, updateDto)
      return dataCate
    } catch (e) {
      return null
    }
  }

  async delete(Dto:DataCateInterface): Promise<DataCate> {
    try{
      let dataCate = await this.dataCateModel.deleteOne(Dto)
      return dataCate
    } catch (e) {
      return null
    }
  }
}
