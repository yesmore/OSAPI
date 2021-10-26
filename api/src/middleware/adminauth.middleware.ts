import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config } from '../config/config'
import { AdminService } from '../service/admin/admin.service'

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {

  constructor(private adminService:AdminService){}

  async use(req: any, res: any, next: () => void) {

    // 获取session里面保存的用户信息
    let { userInfo } = req.session
    let { pathname } = req._parsedUrl
    if (userInfo && userInfo.username) {
      res.locals.userInfo = userInfo
      if(await this.adminService.checkAuth(req)) {
        next()
      } else {
        // next()
        res.send({
          msg: '无权限',
          status: 404
        })
      }
    } else {
      if (pathname === `/${Config.adminPath}/login` || pathname === `/${Config.adminPath}/login/code` || pathname === `/${Config.adminPath}/login/doLogin` || pathname === `/${Config.adminPath}/login/isLogin`) {
        // 设置全局变量
        res.locals.userInfo = userInfo
        next()
      } else {
        next()
        // res.send({
        //   msg: '请先登录',
        //   status: 401
        // })
      }
    }
  }
}
