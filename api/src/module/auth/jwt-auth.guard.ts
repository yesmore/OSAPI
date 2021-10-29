import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from '../../service/admin/admin.service'
import {ToolsService} from "../../service/tools/tools.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  url: any;
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.url = request.route.path;

    return super.canActivate(context);
  }

  constructor(
    private adminService:AdminService,
    private toolsService:ToolsService,
  ){
    super()
  }

  // @ts-ignore
  async handleRequest(err, user) {
    // token校验错误
    if (err || !user) {
      throw new UnauthorizedException({
        message: '未登陆',
        status: 401
      });
    }
    /*let hasRole = await this.adminService.checkAuth(user.username, this.url)
    // console.log('是否有权限',hasRole)
    if(hasRole) {
      console.log('角色权限通过（jwt-auth）：',user,this.url)
      return user;
    } else {
      console.log('角色权限未通过：',this.url)
      throw new UnauthorizedException({
        message: '角色权限不够',
        status: 403
      });
    }*/

  }

  async checkRole(err, user) {

  }
}
