import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session'
import {Config} from "./config/config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(session({
    secret: Config.sessionKey,
    resave: true, // 强制保存，如果session没有被修改也要重新保存
    saveUninitialized: true, // 如果原先没有session那么久设置，否则不设置
    cookie: { maxAge: 1000000, httpOnly: true, secure: false },
    rolling: true
  }))

  app.enableCors() // 允许跨域
  // 配置静态目录
  app.useStaticAssets(join(__dirname,'..', 'public'))
  // 配置模板引擎
  app.setBaseViewsDir('views')
  app.setViewEngine('ejs')

  await app.listen(Config.serverPort, ()=>{
    console.log('Server is running at http://127.0.0.1:'+Config.serverPort)
  });
}
bootstrap();
