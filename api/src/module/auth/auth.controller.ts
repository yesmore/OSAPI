import {Controller, UseGuards, Get, Post, Req, Body, Request, Response} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ToolsService } from '../../service/tools/tools.service';
import { AdminService } from '../../service/admin/admin.service';
// import { AuthService } from '../../auth/auth.service';
import { Config } from '../../config/config'
import { IpAddress } from '../../decorator/ip.decorator'

@Controller(`${Config.adminPath}/login`)
export class AuthController {
  AuthService: any;
  constructor(
    private toolsService:ToolsService,
    private adminService:AdminService,
    private readonly authService: AuthService
  ){}

  @Post('doLogin')
  async doLogin(@IpAddress() clientIp: string,@Body() body, @Request() req, @Response() res) {
    // 接收数据
    let { username, password, code, currentCode } = body
    let userForToken = {
      username, password
    }
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
          let token = await this.authService.createToken(userForToken);
          // console.log(token)
          this.toolsService.resSend(res, 200, '登陆成功', {
            username: user[0].username,
            token: token,
            ip: clientIp,
          })
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

  // 是否登录
  @Get('isLogin')
  @UseGuards(JwtAuthGuard)
  isLogin(@Req() req, @Response() res) {
    console.log('isLogin',req.user)
    if(req.user.response?.status === 401) {
      this.toolsService.resSend(res, 401, '未登陆')
    } else {
      this.toolsService.resSend(res, 200, '已登陆', req.user.username)
    }
  }

  // 退出登陆
  @Get('logout')
  logout( @Response() res) {
    this.toolsService.resSend(res, 200, '已退出')
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
