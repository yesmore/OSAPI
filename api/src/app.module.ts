// 应用程序的根模块
import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AdminModule} from './module/admin/admin.module';
import {PcModule} from './module/pc/pc.module'
// 配置中间件
import {AdminauthMiddleware} from './middleware/adminauth.middleware';
import {InitMiddleware} from './middleware/init.middleware';
import {DefaultMiddleware} from './middleware/default.middleware';
// 配置数据库
import {DbModule} from '@lib/db';
// 全局配置
import {PublicModule} from './module/public/public.module';
import { AuthModule } from './module/auth/auth.module';
import { Config } from './config/config'
// 站内接口
import { ApiModule } from './module/api/api.module';

@Module({
  imports: [AdminModule, PcModule, DbModule, PublicModule, AuthModule, ApiModule],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .forRoutes(`/${Config.adminPath}`)
      .apply(InitMiddleware)
      .forRoutes('*')
      .apply(DefaultMiddleware)
      .forRoutes(
        {
            path: '/pc/home', // 首页数据渲染
            method: RequestMethod.GET
          }
        )
  }
}
