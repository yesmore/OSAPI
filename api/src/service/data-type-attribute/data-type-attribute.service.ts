import { Injectable } from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {DataTypeAttribute} from '@lib/db/models/data_type_attribute.model';
import {ReturnModelType} from "@typegoose/typegoose";
import {DataTypeAttributeInterface} from "../../interface/data_type_attribute.interface";

@Injectable()
export class DataTypeAttributeService {
  constructor(
    @InjectModel(DataTypeAttribute)
    private readonly dataTypeAttributeModel: ReturnModelType<typeof DataTypeAttribute>,
  ) {}

  async add(createDto: object): Promise<DataTypeAttribute> {
    try{
      const created = new this.dataTypeAttributeModel(createDto);
      return await created.save();
    } catch (e) {
      /*console.log(e)*/
      return null
    }
  }

  async find(obj:DataTypeAttributeInterface={}, fields?:string): Promise<DataTypeAttribute[] | null> {
    try{
      return await this.dataTypeAttributeModel.find(obj, fields).exec();
    } catch (e) {
      return []
    }
  }

  async findDataTypeAttributeWithCateID(obj:DataTypeAttributeInterface={}, fields?:string): Promise<DataTypeAttribute[] | null> {
    try{
      return await  this.dataTypeAttributeModel.aggregate([
        {
          $lookup: {
            from : 'datatypes',
            localField: 'cate_id',
            foreignField: '_id',
            as: 'dataType'
          }
        }
      ])
    } catch (e) {
      return []
    }
  }

  async update(updateDto:DataTypeAttributeInterface, oldDto:DataTypeAttributeInterface,): Promise<DataTypeAttribute> {
    try{
      let dataTypeAttribute = await this.dataTypeAttributeModel.updateOne(oldDto, updateDto)
      return dataTypeAttribute
    } catch (e) {
      return null
    }
  }

  async delete(Dto:DataTypeAttributeInterface): Promise<DataTypeAttribute> {
    try{
      let dataTypeAttribute = await this.dataTypeAttributeModel.deleteOne(Dto)
      return dataTypeAttribute
    } catch (e) {
      return null
    }
  }
}
