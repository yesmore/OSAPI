import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {Config} from '../../../config/config'
import {DataCateService} from "../../../service/data-cate/data-cate.service";
import {ToolsService} from "../../../service/tools/tools.service";
import * as mongoose from "mongoose";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@Controller(`${Config.adminPath}/dataCate`)
@UseGuards(JwtAuthGuard)
export class DataCateController {
  constructor(
    private dataCateService:DataCateService,
    private toolsService:ToolsService,
  ) {}

  @Get()
  async index(@Req() req) {
    try {
      // 关联查询出下一级分类
      let res = await this.dataCateService.findDataCateAttributeWithCateID()
      return this.toolsService.returnObj(200, '查询成功', res)
    } catch (e) {
      return this.toolsService.returnObj(405, '不存在')
    }
  }

  @Post('create')
  async create(@Body() body) {
    try {
      if (body.title && body.title!=='' && body.status && body.status!=='') {
        if( body.pid != '0') {
          body.pid = mongoose.Types.ObjectId(body.pid)
        }
        let { title } = body
        let hasDataCate = await this.dataCateService.find({ title })
        if (hasDataCate.length>0) { // 如果数据类型存在
          return this.toolsService.returnObj(403, '数据类型已存在')
        } else {
          let res = await this.dataCateService.add(body)
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
  async edit(@Body() body) {
    try {
      let { _id } = body
      if( body.pid != '0') {
        body.pid = mongoose.Types.ObjectId(body.pid)
      }
      let hasDataCate = await this.dataCateService.find({ _id })
      if (hasDataCate.length>0) { // 如果数据类型存在
        if(hasDataCate[0].title === body.title && hasDataCate[0].description === body.description && hasDataCate[0].status === body.status && hasDataCate[0].sort === body.sort&& hasDataCate[0].sub_title === body.sub_title&& hasDataCate[0].keywords === body.keywords&& hasDataCate[0].link === body.link&& hasDataCate[0].template === body.template) {
          return this.toolsService.returnObj(403, '数据类型未修改')
        } else {
          await this.dataCateService.update(body,{ _id } )
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
      let hasDataCate = await this.dataCateService.find({ _id })
      if (hasDataCate.length > 0) {
        await this.dataCateService.delete({ _id })
        return this.toolsService.returnObj(200, '删除成功')
      } else {
        return this.toolsService.returnObj(405, '数据类型不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }
}
