import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from "../../service/admin/admin.service";
import { ToolsService } from "../../service/tools/tools.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private toolsService:ToolsService,
    private adminService:AdminService,
  ) {}

  async createToken(user) {
    const payload = {
      username: user.username,
      password: user.password
    };
    return this.jwtService.sign(payload) // 根据用户信息生成 tok

    /*let _db_user = await this.adminService.find({username:user.username})
    if(!_db_user[0]) {
      return this.toolsService.returnObj(405, '用户不存在')
    } else {
      // console.log(_db_user[0].password)
      user.password = this.toolsService.makeMd5(user.password)
      if(user.password === _db_user[0].password) {
        delete user.password;
        return this.toolsService.returnObj(200, '登陆成功', {
          user: user,
          token: this.jwtService.sign(payload) // 根据用户信息生成 token
        })
      } else {
        return this.toolsService.returnObj(202, '密码错误')
      }
    }*/
  }
}
