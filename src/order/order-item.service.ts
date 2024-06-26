import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { Order } from './order';
import { OrderItem } from './order-item';

@Injectable()
export class OrderItemService extends AbstractService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<Order>,
  ) {
    super(orderItemRepository);
  }
}
