import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import {Config} from '../../../config/config'
import {DataTypeAttributeService} from "../../../service/data-type-attribute/data-type-attribute.service";
import {DataTypeService} from "../../../service/data-type/data-type.service";
import {ToolsService} from "../../../service/tools/tools.service";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@Controller(`${Config.adminPath}/dataTypeAttribute`)
@UseGuards(JwtAuthGuard)
export class DataTypeAttributeController {
  constructor(
    private dataTypeService:DataTypeService,
    private dataTypeAttributeService:DataTypeAttributeService,
    private toolsService:ToolsService,
  ) {}

  @Get()
  async index() {
    try {
      let res = await this.dataTypeAttributeService.findDataTypeAttributeWithCateID()
      return this.toolsService.returnObj(200, '查询成功', res)
    } catch (e) {
      return this.toolsService.returnObj(405, '不存在')
    }
  }

  @Post('create')
  async create(@Body() body) {
    try {
      if (body.title && body.title!=='' && body.attr_type && body.attr_type!==''&& body.status && body.status!==''&& body.cate_id && body.cate_id!=='') {
        let { title, cate_id } = body
        let hasDataTypeAttribute = await this.dataTypeAttributeService.find({ title,cate_id })
        if (hasDataTypeAttribute.length>0) { // 如果数据类型存在
          return this.toolsService.returnObj(403, '数据类型已存在')
        } else {
          let res = await this.dataTypeAttributeService.add(body)

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
      let { title, attr_type, _id, status, attr_value, cate_id } = body
      let hasDataTypeAttribute = await this.dataTypeAttributeService.find({ _id })
      if (hasDataTypeAttribute.length>0) { // 如果数据类型存在
        if(hasDataTypeAttribute[0].title === title && hasDataTypeAttribute[0].attr_type === attr_type && hasDataTypeAttribute[0].status === status && hasDataTypeAttribute[0].attr_value === attr_value) {
          return this.toolsService.returnObj(403, '数据类型未修改')
        } else {
          await this.dataTypeAttributeService.update({title, attr_value, status, attr_type},{ _id } )
          return this.toolsService.returnObj(200, '修改成功')
        }
      } else {
        return this.toolsService.returnObj(405, '数据类型不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  @Post('delete')
  async delete(@Body() body) {
    try {
      let { _id } = body
      let hasDataTypeAttribute = await this.dataTypeAttributeService.find({ _id })
      if (hasDataTypeAttribute.length > 0) {
        await this.dataTypeAttributeService.delete({ _id })
        return this.toolsService.returnObj(200, '删除成功')
      } else {
        return this.toolsService.returnObj(405, '数据类型不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }
}
