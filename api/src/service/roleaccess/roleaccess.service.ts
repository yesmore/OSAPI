import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { Roleaccess } from "@lib/db/models/roleaccess.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {Role} from "@lib/db/models/role.model";

@Injectable()
export class RoleaccessService {
  constructor(
    @InjectModel(Roleaccess) private readonly roleAccessModel: ReturnModelType<typeof Roleaccess>
  ) {}

  async find(Obj, fields?:string){
    try {
      return await this.roleAccessModel.find(Obj, fields);
    } catch (error) {
      return [];
    }
  }

  async create(Obj): Promise<Roleaccess>{
    try {
      let role = new this.roleAccessModel(Obj)
      let result = await role.save()
      return result
    } catch (e) {
      console.log(e)
      return null;
    }
  }

  async update(Obj1, Obj2){
    try {
      let result = await this.roleAccessModel.updateOne(Obj1, Obj2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(Obj){
    try {
      let result = await this.roleAccessModel.deleteOne(Obj);
      return result;
    } catch (error) {
      return null;
    }
  }

  async deleteMany(Obj){
    try {
      let result = await this.roleAccessModel.deleteMany(Obj);
      return result;
    } catch (error) {
      return null;
    }
  }
}
