import { Module } from '@nestjs/common';
import { PublicModule } from '../public/public.module'
import {Config} from "../../config/config";
import { DbModule } from "@lib/db";

// 业务逻辑1 - UV统计
import { UvService } from './uv/uv.service';
import { UvController } from './uv/uv.controller';

@Module({
  imports: [
    PublicModule,
    DbModule // 每个模块都要手动依赖数据库模块
  ],
  providers: [UvService],
  controllers: [UvController],
})
export class ApiModule {

}
