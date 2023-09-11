import { Callback, Redis } from 'ioredis'

// Создается 2 экземпляра редиса, один для subscribe
// и второй для всего остального

process.env.REDIS_PORT ||= '6379'
process.env.REDIS_HOST ||= '127.0.0.1'

export class RedisConnect {
  public readonly pub: Redis
  public readonly sub: Redis

  constructor (conn: { port: number; host: string }) {
    this.pub = this.createConnect(conn)
    this.sub = this.createConnect(conn)
  }
  private createConnect ({ port, host }: { port: number; host: string }) {
    return new Redis(port, host)
  }
  hgetall<TRes> (field: string) {
    return this.pub.hgetall(field) as Promise<TRes>
  }
  hset<TRes> (field: string, data: string) {
    return this.pub.hset(field, data) as Promise<TRes>
  }
  async get<TRes> (field: string, isParse = true) {
    const res = (await this.pub.get(field)) as string
    return (isParse ? JSON.parse(res) : res) as TRes
  }
  set (field: string, data: any, isStringify = true) {
    return this.pub.set(field, isStringify ? JSON.stringify(data) : data)
  }
  del (field: string) {
    return this.pub.del(field)
  }

  publish (
    channel: string | Buffer,
    message: string | Buffer,
    callback?: Callback<number>,
  ): Promise<number> {
    return this.pub.publish(channel, message, callback)
  }
  subscribe (event: string) {
    return this.sub.subscribe(event)
  }
}

// Синглтон
export default new RedisConnect({
  port: +process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
})