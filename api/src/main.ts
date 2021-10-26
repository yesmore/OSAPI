import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置cookie中间件
  app.use(cookieParser('mycookies'))
  // 配置session中间件
  app.use(session({
    secret: 'mykey',
    resave: true, // 强制保存，如果session没有被修改也要重新保存
    saveUninitialized: true, // 如果原先没有session那么久设置，否则不设置
    cookie: { maxAge: 1000000, httpOnly: true, secure: false },
    rolling: true
  }))

  app.enableCors() // 允许跨域
  // 配置虚拟目录 http://127.0.0.1:3000/static/logo.png
  app.useStaticAssets(join(__dirname,'..', 'public'))
  // 配置模板引擎
  app.setBaseViewsDir('views')
  app.setViewEngine('ejs')

  await app.listen(3000, ()=>{
    console.log('Server is running at http://127.0.0.1:3000')
  });
}
bootstrap();
