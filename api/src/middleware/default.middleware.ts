import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class DefaultMiddleware implements NestMiddleware {
  // 首页数据渲染中间件
  use(req: any, res: any, next: () => void) {

    next();
  }
}
