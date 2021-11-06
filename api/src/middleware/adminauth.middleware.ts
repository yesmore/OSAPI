import {Injectable, NestMiddleware, UseGuards} from '@nestjs/common';
import { Config } from '../config/config'
import { AdminService } from '../service/admin/admin.service'
import { AuthGuard } from "@nestjs/passport";
import {JwtAuthGuard} from "../module/auth/jwt-auth.guard";
import * as jwt  from 'jsonwebtoken'

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {

  constructor(private adminService:AdminService){}

  async use(req: any, res: any, next: () => void) {
    // 获取请求头里面保存的token
    let { authorization } = req.headers
    let { pathname } = req._parsedUrl
    authorization = authorization
      ? authorization.slice(7, authorization.length)
      : ''
    let userInfo = jwt.decode(authorization) // 解析token

    if (
      pathname === `/${Config.adminPath}/login` ||
      pathname === `/${Config.adminPath}/login/code` ||
      pathname === `/${Config.adminPath}/login/doLogin` ||
      pathname === `/${Config.adminPath}/login/isLogin` ||
      pathname === `/${Config.adminPath}/login/logout`
    ) {
      // 设置全局变量
      res.locals.userInfo = userInfo
      next()
    } else { // @ts-ignore
      if (userInfo && userInfo.username) {
        res.locals.userInfo = userInfo
        if(await this.adminService.checkAuth(userInfo, pathname)) {
          next()
        } else {
          // next()
          res.send({
            msg: '无权限-中间件',
            status: 404
          })
        }
      } else {
        res.send({
          msg: '未登陆-中间件',
          status: 401
        })
      }
    }
  }
}
