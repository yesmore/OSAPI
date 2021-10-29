import {Controller, Get, Post, Body, Query, Response, UseGuards} from '@nestjs/common';
import {RoleService} from "../../../service/role/role.service";
import {ToolsService} from "../../../service/tools/tools.service";
import {Config} from '../../../config/config'
import {AccessService} from "../../../service/access/access.service";
import { RoleaccessService } from "../../../service/roleaccess/roleaccess.service";
import * as mongoose from "mongoose";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@Controller(`${Config.adminPath}/role`)
@UseGuards(JwtAuthGuard)
export class RoleController {
  // 注入 - 获取实例
  constructor(
    private roleService:RoleService,
    private toolsService:ToolsService,
    private accessService:AccessService,
    private roleAccessService:RoleaccessService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index() {
    try {
      return await this.roleService.find()
    } catch (e) {
      return []
    }
  }

  @Get()
  async findById(_id) {
    try {
      return await this.roleService.find({ _id })
    } catch (e) {
      return []
    }
  }

  @Post('create')
  async create(@Body() body) {
    try {
      if (body.title && body.title!=='') {
        let { title } = body
        let hasRole = await this.roleService.find({ title })
        if (hasRole.length>0) { // 如果角色存在
          return this.toolsService.returnObj(403, '角色已存在')
        } else {
          let res = await this.roleService.add(body)
          if (res) {
            return this.toolsService.returnObj(200, '创建成功', res)
          } else {
            return this.toolsService.returnObj(402, '创建失败')
          }
        }
      } else {
        return this.toolsService.returnObj(203, '参数错误')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  @Post('edit')
  async edit(@Body() body, ) {
    try {
      let { title, description, _id } = body
      let hasRole = await this.roleService.find({ _id })
      if (hasRole.length>0) { // 如果角色存在
        if(hasRole[0].title === title &&   hasRole[0].description === description) {
          return this.toolsService.returnObj(403, '角色未修改')
        } else {
          let res = await this.roleService.update({title, description},{ _id } )
          return this.toolsService.returnObj(200, '修改成功')
        }
      } else {
        return this.toolsService.returnObj(405, '角色不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  @Post('delete')
  async delete(@Body() body) {
    try {
      let { _id } = body
      let hasRole = await this.roleService.find({ _id })
      if (hasRole.length > 0) {
        await this.roleService.delete({ _id })
        return this.toolsService.returnObj(200, '删除成功')
      } else {
        return this.toolsService.returnObj(405, '角色不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  // 角色授权操作
  @Post('beforeAuth')
  async auth(@Body() body) {
    //1、在access表中找出  module_id=0的数据
    //2、让access表和access表关联    条件：找出access表中module_id等于_id的数据
    let role_id = body.role_id;
    // 获取权限列表
    // let result = await this.accessService.find()
    // 查询角色对应的权限
    let accessRes = await this.roleAccessService.find({ role_id })
    let roleAccessArray = []
    accessRes.map(access => {
      roleAccessArray.push(access.access_id)
    })
    return this.toolsService.returnObj(200, '查询成功', {
      // accesslist: result,    // 权限模块集合
      role_access: roleAccessArray
    })
  }

  // 更新 role-access 表
  @Post('doAuth')
  async doAuth(@Body() body, @Response() res) {
    try {
      let role_id = body.role_id;
      let access_node = body.access_node;
      role_id = mongoose.Types.ObjectId(role_id);   //注意
      //1、删除当前角色下面的所有权限
      await this.roleAccessService.deleteMany({ role_id })
      //2、把当前角色对应的所有权限增加到role_access表里面
      for(let i = 0; i < access_node.length; i++){
        await this.roleAccessService.create({
          role_id,
          access_id: mongoose.Types.ObjectId(access_node[i])
        })
      }
      this.toolsService.resSend(res, 200, '操作成功')
    } catch (e) {
      this.toolsService.resSend(res, 501, '出错了')
    }

  }
}
