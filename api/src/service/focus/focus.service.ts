import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {Focus} from "@lib/db/models/focus.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {FocusInterface} from "../../interface/focus.interface";

@Injectable()
export class FocusService {
  constructor(
    @InjectModel(Focus) private readonly focusModel: ReturnModelType<typeof Focus>
  ) {}

  async add(createDto:FocusInterface) {
    try{
      const created = new this.focusModel(createDto);
      return await created.save();
    } catch (e) {
      // console.log(e)
      return null
    }
  }

  async find(obj:FocusInterface={}, fields?:string): Promise<Focus[] | null> {
    try{
      return await this.focusModel.find(obj, fields).exec();
    } catch (e) {
      return  []
    }
  }

  async update(updateDto:FocusInterface, oldDto:FocusInterface,): Promise<Focus> {
    try{
      return await this.focusModel.updateOne(oldDto, updateDto)
    } catch (e) {
      return null
    }
  }

  async delete(Dto:FocusInterface): Promise<Focus> {
    try{
      return await this.focusModel.deleteOne(Dto)
    } catch (e) {
      return null
    }
  }
}
