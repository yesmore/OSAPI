import { Controller, Get } from '@nestjs/common';

@Controller('pc')
export class IndexController {
  @Get()
  index() {
    return 'pc'
  }
}
