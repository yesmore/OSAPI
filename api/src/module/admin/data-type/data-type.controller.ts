import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {Config} from '../../../config/config'
import {DataTypeService} from "../../../service/data-type/data-type.service";
import {ToolsService} from "../../../service/tools/tools.service";

@Controller(`${Config.adminPath}/dataType`)
export class DataTypeController {
  constructor(
    private dataTypeService:DataTypeService,
    private toolsService:ToolsService,
  ) {}

  @Get()
  async index() {
    try {
      let res = await this.dataTypeService.findDataTypeAttributeWithCateID()
      return this.toolsService.returnObj(200, '查询成功', res)
    } catch (e) {
      return this.toolsService.returnObj(405, '不存在')
    }
  }

  @Get('/attributes')
  async findByTitle(@Query() query) {
    try {
      let { title } = query
      let res = await this.dataTypeService.findDataTypeByTitle({title})
      return this.toolsService.returnObj(200, '查询成功', res)
    } catch (e) {
      return this.toolsService.returnObj(405, '不存在')
    }
  }

  @Post('create')
  async create(@Body() body) {
    try {
      if (body.title && body.title!=='' && body.status && body.status!=='') {
        let { title } = body
        let hasDataType = await this.dataTypeService.find({ title })
        if (hasDataType.length>0) { // 如果数据类型存在
          return this.toolsService.returnObj(403, '数据类型已存在')
        } else {
          let res = await this.dataTypeService.add(body)
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
      let { title, description, _id, status, sort } = body
      let hasDataType = await this.dataTypeService.find({ _id })
      if (hasDataType.length>0) { // 如果数据类型存在
        if(hasDataType[0].title === title && hasDataType[0].description === description && hasDataType[0].status === status && hasDataType[0].sort === sort) {
          return this.toolsService.returnObj(403, '数据类型未修改')
        } else {
          if(description === '') { // 不修改描述
            await this.dataTypeService.update({title, status},{ _id } )
          } else {
            await this.dataTypeService.update({title, description, status, sort},{ _id } )
          }
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
      let hasDataType = await this.dataTypeService.find({ _id })
      if (hasDataType.length > 0) {
        await this.dataTypeService.delete({ _id })
        return this.toolsService.returnObj(200, '删除成功')
      } else {
        return this.toolsService.returnObj(405, '数据类型不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }
}
