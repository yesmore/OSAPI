import { Injectable } from '@nestjs/common';
import { RedisService } from "nestjs-redis";

@Injectable()
export class CacheService {

  private client;

  constructor(
    private readonly redisService:RedisService
  ) {
    this.getClient()
  }

  async getClient() {
    this.client = await this.redisService.getClient()
  }

  // 设置数据
  async set(key:string, value:any, seconds?:string) {
    value = JSON.stringify(value)
    if (!this.client) {
      await this.getClient()
    }

    if (seconds) {
      await this.client.set(key, value, 'EX', seconds)
    } else {
      await this.client.set(key, value)
    }
  }

  // 获取
  async get(key:string) {
    if (!this.client) {
      await this.getClient()
    }

    let data = await this.client.get(key)
    if (!data) {
      return null
    }
    return JSON.parse(data)
  }

  // 根据值删除缓存
  async del(key: string): Promise<any> {
    if (!this.client) {
      await this.getClient();
    }

    await this.client.del(key);
  }

  // 清除缓存
  async clear() {
    if (!this.client) {
      await this.getClient();
    }
    await this.client.flushdb();
  }
}
