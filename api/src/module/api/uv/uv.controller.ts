import { Controller, Get, Query } from '@nestjs/common';
import { IpAddress } from '../../../decorator/ip.decorator'
import { UvService } from "./uv.service";
import { ToolsService } from "../../../service/tools/tools.service";
import {Config} from '../../../config/config'

@Controller(`${Config.apiPath}/uv`)
export class UvController {

  constructor(
    private uvService:UvService,
    private toolsService:ToolsService,
  ) {}

  @Get()
  async index(@IpAddress() clientIp: string, @Query() query) {
    try {
      // 获取客户数据
      let { site_name } = query
      let uip = clientIp
      let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/

      if (site_name.length <= 0 || !reg.test(site_name)) {
        return this.toolsService.returnObj(203, '[OSAPI] 参数不正确')
      } else {
        // 根据 [域名] 与 [当前ip] 查询数据
        //  即依据 域名、ip 判断是否为新访客
        let res = await this.uvService.find({ site_name, uip })
        // 数据存在
        if (res.length > 0) {
          // 增加
          // @ts-ignore
          let { uv_count, updatedAt } = res[0]
          let overdue = new Date().getTime() - new Date(updatedAt).getTime()
          // 限制 1分钟
          if ( overdue >= 60000) {
            let addUv = await this.uvService.update({
              uv_count: ++uv_count
            }, { site_name, uip })
          }
          // 获取当前域名所有数据
          let after = await this.uvService.findCount({ site_name })
          // 遍历获取当前域名总uv
          let totalUv = 0, allUv = 0
          after.map(v => {
            allUv += v.uv_count
            // @ts-ignore
            totalUv += v._id===site_name
              ? v.uv_count
              : 0
          })
          return this.toolsService.returnObj(200, '[OSAPI] 已统计', {
            site_name,
            uip,
            uv_count: totalUv,
            allCall: allUv
          })
        } else {
          // 新建
          let newUv = await this.uvService.add({
            site_name,
            uip,
            uv_count: 1
          })
          if (newUv) {
            return this.toolsService.returnObj(200, '[OSAPI] 初始化成功', {
              site_name,
              uip,
              uv_count: newUv.uv_count
            })
          } else {
            return this.toolsService.returnObj(402, '[OSAPI] 初始化失败')
          }
        }
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '[OSAPI] 出错了')
    }
  }
}
