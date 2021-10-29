import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha'; // 验证码库
import * as md5 from 'md5'
//格式化日期
import { format } from 'silly-datetime';
import { join, extname } from 'path';
import {Config} from '../../config/config';
import { createWriteStream } from 'fs'
import * as mkdirp from 'mkdirp'

@Injectable()
export class ToolsService {

  // 生成验证码
  captcha() {
    const captcha = svgCaptcha.create({
      size: 1,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#aaa'
    })
    return captcha
  }

  // md5
  makeMd5(str: string) {
    return md5(str)
  }

  // res send - status/msg/info
  resSend(res:any, status:number, msg:string, info=null) {
    res.send({
      status,
      msg,
      info
    })
  }
  returnObj(status:number, msg:string, info=null) {
    return {
      msg,
      status,
      info,
    }
  }

  getTime(){
    let d=new Date();
    return d.getTime();
  }

  // 上传单个图片
  uploadFile(file){
    if(file) {
      // 1、获取当前日期   20191013
      let day = format(new Date(), 'YYYYMMDD');  //目录名称
      let d = this.getTime();  //时间戳 - 当前图片的名称

      // 2、根据当天日期创建目录
      let dir = join(__dirname, `../public/${Config.uploadDir}`, day);
      mkdirp.sync(dir); // 生成当天文件夹
      let uploadDir = join(dir, d + extname(file.originalname));

      // 3、实现上传
      const writeImage = createWriteStream(uploadDir);
      writeImage.write(file.buffer);

      // 4、返回图片保存的地址
      let saveDir = join(Config.uploadDir, day, d + extname(file.originalname));
      return saveDir;
    } else {
      return ''
    }

  }
}
