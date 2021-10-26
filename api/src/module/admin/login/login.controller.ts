import { Controller, Get, Response, Request, Post, Body } from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { AdminService } from '../../../service/admin/admin.service';
import { Config } from '../../../config/config'

@Controller(`${Config.adminPath}/login`) // http://127.0.0.1:4000/admin/login
export class LoginController {

  // 注入 - 获取实例
  constructor(
    private toolsService:ToolsService,
    private adminService:AdminService
  ) {}

  @Get()
  async index(@Response() res) {
    // console.log(res.locals.config)
    try {
      return await this.adminService.find()
    } catch (e) {
      return this.toolsService.resSend(res, 501, '出错了')
    }
  }

  // @Post('create')
  // async create() {
  //   await this.adminService.create({
  //     username: '西西',
  //     password: this.toolsService.makeMd5('123')
  //   })
  // }

  // 登陆逻辑
  @Post('doLogin')
  async doLogin(@Body() body, @Request() req, @Response() res) {
    // 接收数据
    let { username, password, code, currentCode } = body

    if(username === '' || password.length < 0) {
      this.toolsService.resSend(res, 203, '用户名或密码格式错误')
    } else {
      if(code.toUpperCase() === currentCode.toUpperCase()) {
        password = this.toolsService.makeMd5(password) // 加密
        let user = await this.adminService.find({
          'username': username,
          'password': password
        })
        if(user.length > 0) {
          req.session.userInfo = user[0]
          this.toolsService.resSend(res, 200, '登陆成功', user[0].username)
          // console.log(req.session.userInfo)
        } else {
          this.toolsService.resSend(res, 202, '用户名或密码匹配错误')
        }
      } else {
        this.toolsService.resSend(res, 201, '验证码错误')
      }
    }
    return body
  }

  // 退出登陆
  @Get('logout')
  logout(@Request() req, @Response() res) {
    // console.log('logout',req.session.userInfo)
    if (req.session.userInfo === undefined) {
      this.toolsService.resSend(res, 401, '未登陆')
    } else {
      req.session.userInfo = null
      req.session.code = null
      this.toolsService.resSend(res, 200, '已退出', req.session)
    }
  }

  // 是否登录
  @Get('isLogin')
  isLogin(@Request() req, @Response() res) {
    // console.log('isLogin',req.session.userInfo)
    if ((req.session.userInfo === undefined) || (req.session.userInfo === null)) {

      this.toolsService.resSend(res, 401, '未登陆')
    } else {
      this.toolsService.resSend(res, 200, '已登陆', req.session.userInfo.username)
    }
  }

  // 生成验证码
  @Get('code')
  setCode(@Request() req, @Response() res) {
    const svgCaptcha = this.toolsService.captcha()
    // 设置session
    req.session.code = svgCaptcha.text
    // console.log('保存的code：'+req.session.code)
    // 设置返回类型
    res.type('image/svg+xml')
    this.toolsService.resSend(res, 200, 'code success', {
      codeText: svgCaptcha.text,
      codeUrl: svgCaptcha.data
    })
    // res.send(svgCaptcha.data)
  }
}
