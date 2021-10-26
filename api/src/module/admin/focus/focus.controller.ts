/*
* 首页图片上传管理
* */
import { Controller, Get, Post, Body, UseInterceptors,  UploadedFile  } from '@nestjs/common';
import {Config} from '../../../config/config'
import { FocusService } from "../../../service/focus/focus.service";
import { ToolsService } from "../../../service/tools/tools.service";
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(`${Config.adminPath}/focus`)
export class FocusController {
  constructor(
    private toolsService:ToolsService,
    private focusService:FocusService
  ){}

  @Get()
  async index() {
    try {
      let res = await this.focusService.find()
      return this.toolsService.returnObj(200, '查询成功', res)
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  // 更新图片
  @Post('edit')
  @UseInterceptors(FileInterceptor('file'))
  async doEdit(@Body() body, @UploadedFile() file) {
    try {
      let { _id } = body
      let res1 = await this.focusService.find({ _id })
      if (res1.length > 0) {
        if (res1[0].status === body.status && res1[0].title === body.title && res1[0].link === body.link && res1[0].sort === body.sort ) {
          return this.toolsService.returnObj(403, '未修改')
        }
        let res
        if (file) {
          let saveDir = this.toolsService.uploadFile(file);
          res = await this.focusService.update(Object.assign(body, { focus_img: saveDir }),{ _id })
        } else {
          res = await this.focusService.update(body,{ _id })
        }
        return this.toolsService.returnObj(200, '更新成功')
      }
      return this.toolsService.returnObj(405, '不存在')
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  // 上传图片
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() body, @UploadedFile() file) {
    try {
      let saveDir = this.toolsService.uploadFile(file);
      await this.focusService.add(Object.assign(body, {
        focus_img: saveDir
      }))
      return this.toolsService.returnObj(200, '上传成功', saveDir)
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }

  @Post('delete')
  async delete(@Body() body) {
    try {
      let { _id } = body
      let hasImg = await this.focusService.find({ _id })
      if (hasImg.length > 0) {
        await this.focusService.delete({ _id })
        return this.toolsService.returnObj(200, '删除成功')
      } else {
        return this.toolsService.returnObj(405, '图片不存在')
      }
    } catch (e) {
      return this.toolsService.returnObj(501, '出错了')
    }
  }
}
