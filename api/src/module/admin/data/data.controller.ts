import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import {Config} from '../../../config/config'
import {DataService} from "../../../service/data/data.service";
import {DataAttrService} from "../../../service/data-attr/data-attr.service";
import {ToolsService} from "../../../service/tools/tools.service";
import { CacheService } from '../../../service/cache/cache.service';
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";


@Controller(`${Config.adminPath}/data`)
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(
    private dataService:DataService,
    private dataAttrService:DataAttrService,
    private toolsService:ToolsService,
    private cacheService:CacheService,
  ) {}

  @Get()
  async index() {
    try {
      let cacheData = await this.cacheService.get('cacheData')
      // let cacheData = await this.dataService.findDataByCateID()

      if (!cacheData) {
        // 关联查询出数据分类、类型分类
        cacheData = await this.dataService.findDataByCateID()
        this.cacheService.set('cacheData', cacheData)
      }
      return this.toolsService.returnObj(200, '查询成功', cacheData)
    } catch (e) {
      // console.log(e)
      return this.toolsService.returnObj(405, '不存在')
    }
  }

  @Get('detail')
  async findByTitle(@Query() query, @Body() body) {
    try {
      let { title } = query
      // body.relation_data = mongoose.Types.ObjectId(body.relation_data)
      // 关联查询出数据分类、类型分类
      let res = await this.dataService.findDataByTitle({title})
      return this.toolsService.returnObj(200, '查询成功', res)
    } catch (e) {
      return this.toolsService.returnObj(405, '不存在')
    }
  }

  @Post('create')
  async create(@Body() body) {
    try {
      if (body.title && body.title!=='' && body.status && body.status!=='') {
        let { title, _id, attr_id_list, attr_value_list, attr_title_list } = body
        let hasData = await this.dataService.find({ title })
        if (hasData.length>0) { // 如果数据类型存在
          return this.toolsService.returnObj(403, '数据类型已存在')
        } else {
          let res = await this.dataService.add(body)
          if (res) {
            attr_id_list.map(async (item, index) => {
              let attrsDTO = {
                // @ts-ignore
                data_id: res._id,
                attribute_title: attr_title_list[index],
                attribute_value: attr_value_list[index],
                status: '1',
                sort: '0'
              }
              await this.dataAttrService.add(attrsDTO)
            })
            await this.cacheService.del('cacheData')
            return this.toolsService.returnObj(200, '创建成功', res)
          } else {
            return this.toolsService.returnObj(402, '创建失败')
          }
        }
      } else {
        return this.toolsService.returnObj(203, '参数错误')
      }
    } catch (e) {
      // console.log(e)
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  @Post('edit')
  async edit(@Body() body) {
    try {
      let { _id } = body
      let hasData = await this.dataService.find({ _id })
      if (hasData.length>0) { // 如果数据类型存在
        if(hasData[0].title === body.title && hasData[0].data_content === body.data_content && hasData[0].is_delete === body.is_delete && hasData[0].is_hot === body.is_hot&& hasData[0].is_new === body.is_new && hasData[0].status === body.status && hasData[0].sort === body.sort&& hasData[0].sub_title === body.sub_title&& hasData[0].price === body.price && hasData[0].relation_data === body.relation_data && hasData[0].data_version === body.data_version&& hasData[0].data_type_id === body.data_type_id) {
          return this.toolsService.returnObj(403, '数据类型未修改')
        } else {
          body.dataAttrs.map(item => {
            this.dataAttrService.update({attribute_value: item.attribute_value}, { _id:item._id })
          })
          await this.dataService.update(body,{ _id } )
          await this.cacheService.clear();
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
      let hasData = await this.dataService.find({ _id })
      if (hasData.length > 0) {
        await this.dataService.delete({ _id })
        return this.toolsService.returnObj(200, '删除成功')
      } else {
        return this.toolsService.returnObj(405, '数据类型不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }
}
