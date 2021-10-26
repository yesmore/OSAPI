import { Injectable } from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {Data} from '@lib/db/models/data.model';
import {ReturnModelType} from "@typegoose/typegoose";
import {DataInterface} from "../../interface/data.interface";

@Injectable()
export class DataService {
  constructor(
    @InjectModel(Data)
    private readonly dataModel: ReturnModelType<typeof Data>,
  ) {}

  async add(createDto: object): Promise<Data> {
    try{
      const created = new this.dataModel(createDto);
      return await created.save();
    } catch (e) {
      // console.log(e)
      return null
    }
  }

  async find(obj:DataInterface={}, fields?:string): Promise<Data[] | null> {
    try{
      return await this.dataModel.find(obj, fields).exec();
    } catch (e) {
      return []
    }
  }

  async findDataByCateID(obj:DataInterface={}, fields?:string): Promise<Data[] | null> {
    try{
      return await this.dataModel.aggregate([
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
        {
          $lookup: {
            from : 'dataattrs',
            localField: '_id',
            foreignField: 'data_id',
            as: 'dataAttrs'
          }
        },
        {
          $lookup: {
            from : 'datas',
            localField: 'relation_data',
            foreignField: '_id',
            as: 'relationDataList'
          }
        },
      ])
    } catch (e) {
      return []
    }
  }

  async findDataByTitle(obj:DataInterface={}, fields?:string): Promise<Data[] | null> {
    try{
      return await this.dataModel.aggregate([
        {
          $match:{ "title": obj.title}
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
        {
          $lookup: {
            from : 'dataattrs',
            localField: '_id',
            foreignField: 'data_id',
            as: 'dataAttrs'
          }
        },
        {
          $lookup: {
            from : 'datas',
            localField: 'relation_data',
            foreignField: '_id',
            as: 'relationDataList'
          }
        },
      ])
    } catch (e) {
      return []
    }
  }

  async update(updateDto:DataInterface, oldDto:DataInterface,): Promise<Data> {
    try{
      let data = await this.dataModel.updateOne(oldDto, updateDto)
      return data
    } catch (e) {
      return null
    }
  }

  async delete(Dto:DataInterface): Promise<Data> {
    try{
      let data = await this.dataModel.deleteOne(Dto)
      return data
    } catch (e) {
      return null
    }
  }
}
