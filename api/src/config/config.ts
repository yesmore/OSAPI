// 动态路由配置
export class Config {
  static adminPath = 'admin';
  static sessionMaxAge = 30 * 1000 * 60;
  static uploadDir='upload' // 文件上传路径

  static redisOptions = {
    port: 6379,
    host: '127.0.0.1',
    password: '',
    db: 0
  }
}
