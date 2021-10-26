import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { Role } from '@lib/db/models/role.model';
import { ReturnModelType } from "@typegoose/typegoose";
import { RoleInterface } from  '../../interface/role.interface'

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) private readonly roleModel: ReturnModelType<typeof Role>
  ) {}

  async add(createDto: object): Promise<Role> {
    try{
      const created = new this.roleModel(createDto)
      return await created.save()
    } catch (e) {
      return null
    }
  }

   async find(obj:RoleInterface={}, fields?:string): Promise<Role[] | null> {
    try{
      return await this.roleModel.find(obj, fields).exec();
    } catch (e) {
      return  []
    }
  }

  async update(updateDto:RoleInterface, oldDto:RoleInterface,): Promise<Role> {
    try{
      let role = await this.roleModel.updateOne(oldDto, updateDto)
      return role
    } catch (e) {
      return null
    }
  }

  async delete(Dto:RoleInterface): Promise<Role> {
    try{
      let role = await this.roleModel.deleteOne(Dto)
      return role
    } catch (e) {
      return null
    }
  }
}
