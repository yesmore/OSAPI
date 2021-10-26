import { Module } from '@nestjs/common';
import { IndexController } from './index/index.controller';

@Module({
  controllers: [IndexController]
})
export class PcModule {}
