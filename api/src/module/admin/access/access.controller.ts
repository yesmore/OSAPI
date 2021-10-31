import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import {Config} from '../../../config/config'
import {AdminService} from "../../../service/admin/admin.service";
import {ToolsService} from "../../../service/tools/tools.service";
import {RoleService} from "../../../service/role/role.service";
import {AccessService} from "../../../service/access/access.service";
import * as mongoose from "mongoose";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@Controller(`${Config.adminPath}/access`)
@UseGuards(JwtAuthGuard)
export class AccessController {
  constructor(
    private roleService:RoleService,
    private toolsService:ToolsService,
    private adminService:AdminService,
    private accessService:AccessService,
  ) {}

  @Get()
  async index() {
    try {
      // 1.查询 module_id = 0 的数据
      // 2.自关联查询 access中 module_id = _id 的数据
      let res = await this.accessService.findWithModule()
      return this.toolsService.returnObj(200, '查询成功', res)
    } catch (e) {
      return []
    }
  }

  @Get('/default')
  async find() {
    try {
      let res = await this.accessService.find()
      return this.toolsService.returnObj(200, '查询成功', res)
    } catch (e) {
      return []
    }
  }

  @Post('create')
  async create(@Body() body) {
    try {
      let {
        module_name,
        action_name,
        type,
        url,
        module_id,
        description,
        status
      } = body
      if (status&&module_name&&module_name!==''&&action_name!==''&&action_name&& type&&url!==''&&url&&description!==''&&description) {
        if( module_id != '0') {
          body.module_id = mongoose.Types.ObjectId(module_id)
        }
        let hasAccess = await this.accessService.find({ action_name })
        if (hasAccess.length>0) { // 如果模块存在
          return this.toolsService.returnObj(403, '模块已存在')
        } else {
          let res = await this.accessService.add(body)
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

  @Post('beforeEdit')
  async beforeEdit(@Query() query){
    // 获取模块列表
    let result = await this.accessService.find({"module_id":"0"});
    let accessResult = await this.accessService.find({"_id": query._id});
    return this.toolsService.returnObj(200, '查询成功', {
      list: accessResult[0],
      moduleList: result
    })
  }

  @Post('edit')
  async edit(@Body() body, ) {
    try {
      let {
        action_name,
        module_id,
        url,
        description,
        _id,
        status
      } = body
      if(module_id !== 0){
        body.module_id=mongoose.Types.ObjectId(module_id);   //注意
      }
      let hasAccess = await this.accessService.find({ _id })
      if (hasAccess.length>0) { // 如果模块存在
        if(hasAccess[0].action_name === action_name && hasAccess[0].url === url && hasAccess[0].description === description && hasAccess[0].status === status) {
          return this.toolsService.returnObj(403, '模块未修改')
        } else {
          await this.accessService.update(body,{ _id } )
          return this.toolsService.returnObj(200, '修改成功')
        }
      } else {
        return this.toolsService.returnObj(405, '模块不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  @Post('delete')
  async delete(@Body() body) {
    try {
      let { _id } = body
      let hasAccess = await this.accessService.find({ _id })
      if (hasAccess.length > 0) {
        // await this.accessService.delete({ _id })
        return this.toolsService.returnObj(200, '删除成功')
      } else {
        return this.toolsService.returnObj(405, '模块不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }
}
