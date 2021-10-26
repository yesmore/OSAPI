import { Injectable } from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {DataAttr} from '@lib/db/models/data_attr.model';
import {ReturnModelType} from "@typegoose/typegoose";
import {DataAttrInterface} from "../../interface/data_attr.interface";

@Injectable()
export class DataAttrService {
  constructor(
    @InjectModel(DataAttr)
    private readonly dataModel: ReturnModelType<typeof DataAttr>,
  ) {}

  async add(createDto: object): Promise<DataAttr> {
    try{
      const created = new this.dataModel(createDto);
      return await created.save();
    } catch (e) {
      // console.log(e)
      return null
    }
  }

  async find(obj:DataAttrInterface={}, fields?:string): Promise<DataAttr[] | null> {
    try{
      return await this.dataModel.find(obj, fields).exec();
    } catch (e) {
      return []
    }
  }

  async findDataAttrByDataID(obj:DataAttrInterface={}, fields?:string): Promise<DataAttr[] | null> {
    try{
      return await this.dataModel.aggregate([
        {
          $lookup: {
            from : 'data',
            localField: 'data_id',
            foreignField: '_id',
            as: 'data'
          }
        },
      ])
    } catch (e) {
      return []
    }
  }

  async findDataAttrByTitle(obj:DataAttrInterface={}, fields?:string): Promise<DataAttr[] | null> {
    try{
      return await this.dataModel.aggregate([
        {
          $match:{ "attribute_title": obj.attribute_title}
        },
        {
          $lookup: {
            from : 'datacates',
            localField: 'cate_id',
            foreignField: '_id',
            as: 'dataCate'
          }
        },
        {
          $lookup: {
            from : 'datatypes',
            localField: 'data_type_id',
            foreignField: '_id',
            as: 'dataType'
          }
        },
      ])
    } catch (e) {
      return []
    }
  }

  async update(updateDto:DataAttrInterface, oldDto:DataAttrInterface,): Promise<DataAttr> {
    try{
      let data = await this.dataModel.updateOne(oldDto, updateDto)
      return data
    } catch (e) {
      return null
    }
  }

  async delete(Dto:DataAttrInterface): Promise<DataAttr> {
    try{
      let data = await this.dataModel.deleteOne(Dto)
      return data
    } catch (e) {
      return null
    }
  }
}
