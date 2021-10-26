import { Controller, Get } from '@nestjs/common';
import { Config } from '../../../config/config'

@Controller(`${Config.adminPath}/main`)
export class MainController {

  @Get()
  index() {
    return '用户首页'
  }
}
