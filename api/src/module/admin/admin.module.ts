import { Module } from '@nestjs/common';
import { PublicModule } from '../public/public.module'

import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { RoleController } from './role/role.controller';
import { AccessController } from './access/access.controller';
import { FocusController } from './focus/focus.controller';
import { DataTypeController } from './data-type/data-type.controller';
import { DataTypeAttributeController } from './data-type-attribute/data-type-attribute.controller';
import { DataCateController } from './data-cate/data-cate.controller';
import { DataController } from './data/data.controller';

import { RedisModule } from 'nestjs-redis'
import { Config } from '../../config/config'
import { CacheService } from '../../service/cache/cache.service';

@Module({
  imports: [
    PublicModule,
    RedisModule.register(Config.redisOptions) // Redis
  ],
  providers: [CacheService],
  controllers: [
    MainController,
    LoginController,
    ManagerController,
    RoleController,
    AccessController,
    FocusController,
    DataTypeController,
    DataTypeAttributeController,
    DataCateController,
    DataController
  ],
})
export class AdminModule {}
