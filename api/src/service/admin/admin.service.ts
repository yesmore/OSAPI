import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {Admin} from '@lib/db/models/admin.model';
import {ReturnModelType} from "@typegoose/typegoose";
import {AdminInterface} from "../../interface/admin.interface";
import {RoleaccessService} from '../roleaccess/roleaccess.service';
import {AccessService} from '../access/access.service';
import {Config} from '../../config/config'

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: ReturnModelType<typeof Admin>,
    private roleAccessService: RoleaccessService,
    private accessService: AccessService
  ) {}

  async add(createDto: object): Promise<Admin> {
    try{
      const created = new this.adminModel(createDto);
      return await created.save();
    } catch (e) {
      return null
    }
  }

  async find(obj:AdminInterface={}, fields?:string): Promise<Admin[] | null> {
    try{
      return await this.adminModel.find(obj, fields).exec();
    } catch (e) {
      return []
    }
  }

  async findAdminWithRole(obj:AdminInterface={}, fields?:string): Promise<Admin[] | null> {
    try{
      return await  this.adminModel.aggregate([
        {
          $lookup: {
            from : 'roles',
            localField: 'role_id',
            foreignField: '_id',
            as: 'role'
          }
        }
      ])
    } catch (e) {
      return []
    }
  }

  async update(updateDto:AdminInterface, oldDto:AdminInterface,): Promise<Admin> {
    try{
      let admin = await this.adminModel.updateOne(oldDto, updateDto)
      return admin
    } catch (e) {
      return null
    }
  }

  async delete(Dto:AdminInterface): Promise<Admin> {
    try{
      let admin = await this.adminModel.deleteOne(Dto)
      return admin
    } catch (e) {
      return null
    }
  }

  getModel() {
    return this.adminModel
  }

  // 用户权限判断
  async checkAuth(req) {
    /*
       1、获取当前用户的角色    （如果超级管理员跳过权限判断 is_super=1）
       2、根据角色获取当前角色的权限列表
       3、获取当前访问的url 对应的权限id
       4、判断当前访问的url对应的权限id 是否在权限列表中的id中
     */

    //  1、获取当前用户的角色
    let pathname: string = req.baseUrl
    pathname = pathname.replace(`/${Config.adminPath}/`, '')
    // console.log('当前路径：',pathname)
    let userInfo = req.session.userInfo
    let role_id = userInfo.role_id

    if (userInfo.is_super == 1 || pathname === 'login/isLogin' || pathname === 'login/logout') {
      return true;
    }

    // 2、根据角色获取当前角色的权限列表
    let accessRes = await this.roleAccessService.find({ role_id });
    let roleAccessArray = [];
    accessRes.map(access => {
      roleAccessArray.push(access.access_id.toString())
    })
    // console.log('当前角色权限有：',roleAccessArray);

    //   3、获取当前访问的url 对应的权限id
    let authResult = await this.accessService.find({ "url": pathname });
    // console.log('有权限存在：',authResult[0])
    if (authResult.length > 0) {

      // 4、判断当前访问的url对应的权限id 是否在权限列表中的id中
      // @ts-ignore
      if (roleAccessArray.indexOf(authResult[0]._id.toString()) !== -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    // return true
  }
}
