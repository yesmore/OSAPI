import { Injectable } from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {DataType} from '@lib/db/models/data_type.model';
import {ReturnModelType} from "@typegoose/typegoose";
import {DataTypeInterface} from "../../interface/data_type.interface";
import {Config} from '../../config/config'
import {DataTypeAttributeInterface} from "../../interface/data_type_attribute.interface";
import {DataTypeAttribute} from "@lib/db/models/data_type_attribute.model";

@Injectable()
export class DataTypeService {

  constructor(
    @InjectModel(DataType)
    private readonly dataTypeModel: ReturnModelType<typeof DataType>,
  ) {}

  async add(createDto: object): Promise<DataType> {
    try{
      const created = new this.dataTypeModel(createDto);
      return await created.save();
    } catch (e) {
      return null
    }
  }

  async find(obj:DataTypeInterface={}, fields?:string): Promise<DataType[] | null> {
    try{
      return await this.dataTypeModel.find(obj, fields).exec();
    } catch (e) {
      return []
    }
  }

  async findDataTypeAttributeWithCateID(obj:DataTypeAttributeInterface={}, fields?:string): Promise<DataTypeAttribute[] | null> {
    try{
      return await  this.dataTypeModel.aggregate([
        {
          $lookup: {
            from : 'datatypeattributes',
            localField: '_id',
            foreignField: 'cate_id',
            as: 'dataTypeAttribute'
          }
        }
      ])
    } catch (e) {
      return []
    }
  }

  async findDataTypeByTitle(obj:DataTypeAttributeInterface={}, fields?:string): Promise<DataTypeAttribute[] | null> {
    try{
      return await  this.dataTypeModel.aggregate([
        {
          $match:{ "title": obj.title}
        },
        {
          $lookup: {
            from : 'datatypeattributes',
            localField: '_id',
            foreignField: 'cate_id',
            as: 'dataTypeAttribute'
          }
        }
      ])
    } catch (e) {
      return []
    }
  }

  async update(updateDto:DataTypeInterface, oldDto:DataTypeInterface,): Promise<DataType> {
    try{
      let dataType = await this.dataTypeModel.updateOne(oldDto, updateDto)
      return dataType
    } catch (e) {
      return null
    }
  }

  async delete(Dto:DataTypeInterface): Promise<DataType> {
    try{
      let dataType = await this.dataTypeModel.deleteOne(Dto)
      return dataType
    } catch (e) {
      return null
    }
  }
}
