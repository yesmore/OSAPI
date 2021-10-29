import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {Config} from '../../../config/config'
import {AdminService} from "../../../service/admin/admin.service";
import {ToolsService} from "../../../service/tools/tools.service";
import {RoleService} from "../../../service/role/role.service";
import * as mongoose from "mongoose";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@Controller(`${Config.adminPath}/manager`)
@UseGuards(JwtAuthGuard)
export class ManagerController {
  constructor(
    private roleService:RoleService,
    private toolsService:ToolsService,
    private adminService:AdminService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index() {
    try {
      // 获取 admin & role 表关联数据
      return await this.adminService.findAdminWithRole()
    } catch (e) {
      return []
    }
  }

  @Post('create')
  async create(@Body() body) {
    try {
      if (body.username && body.password && body.role_id && body.username!=='' && body.password!=='') {
        let { username } = body
        let hasAdmin = await this.adminService.find({ username })
        if (hasAdmin.length>0) { // 如果用户存在
          return this.toolsService.returnObj(403, '用户已存在')
        } else {
          body.role_id = mongoose.Types.ObjectId(body.role_id)
          body.password = this.toolsService.makeMd5(body.password)
          let res = await this.adminService.add(body)
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
      let { username, password, _id, mobile, email,status } = body
      password = await this.toolsService.makeMd5(password)
      let hasAdmin = await this.adminService.find({ _id })
      if (hasAdmin.length>0) { // 如果用户存在
        if(hasAdmin[0].status === status && hasAdmin[0].username === username && hasAdmin[0].password === password) {
          return this.toolsService.returnObj(403, '用户未修改')
        } else {
          if(password === '') { // 不修改密码
            await this.adminService.update({username, mobile, email},{ _id } )
            return this.toolsService.returnObj(200, '修改成功')
          } else {
            await this.adminService.update({username, password, mobile, email},{ _id } )
            return this.toolsService.returnObj(200, '修改成功')
          }
        }
      } else {
        return this.toolsService.returnObj(405, '用户不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  @Post('delete')
  async delete(@Body() body) {
    try {
      let { _id } = body
      let hasAdmin = await this.adminService.find({ _id })
      if (hasAdmin.length > 0) {
        await this.adminService.delete({ _id })
        return this.toolsService.returnObj(200, '删除成功')
      } else {
        return this.toolsService.returnObj(405, '用户不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  @Get('roles')
  async roles() {
    try {
      let roles = await this.roleService.find()
      return  this.toolsService.returnObj(200, '获取成功', roles)
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }
}
