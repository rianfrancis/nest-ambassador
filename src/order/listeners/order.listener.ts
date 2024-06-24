import { Injectable } from '@nestjs/common';
import { Order } from '../order';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisService } from 'src/shared/redis.service';

@Injectable()
export class OrderListener {
  constructor(private redisService: RedisService) {}

  @OnEvent('order.completed')
  async handlerOrderCompletedEvent(order: Order) {
    const client = this.redisService.getClient();
    // client.zincrby('rankings', order.ambassador_revenue, order.user.name);
  }
}
