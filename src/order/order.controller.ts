import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDto } from './dtos/create-order.dto';
import { LinkService } from 'src/link/link.service';
import { Link } from 'src/link/link';
import { Order } from './order';
import { ProductService } from 'src/product/product.service';
import { OrderItem } from './order-item';
import { Product } from 'src/product/product';
import { OrderItemService } from './order-item.service';

@Controller()
export class OrderController {
  constructor(
    private orderService: OrderService,
    private linkService: LinkService,
    private productService: ProductService,
    private orderItemService: OrderItemService,
  ) {}
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('admin/orders')
  all() {
    return this.orderService.find({ relations: ['order_items'] });
  }
  @Post('checkout/orders')
  async create(@Body() body: CreateOrderDto) {
    const link: Link = await this.linkService.findOne({
      where: { code: body.code },
      relation: ['user'],
    });
    if (!link) {
      throw new BadRequestException('Invalid link!');
    }
    const o = new Order();
    o.user_id = link.user.id;
    o.ambassador_email = link.user.email;
    o.first_name = body.first_name;
    o.last_name = body.last_name;
    o.email = body.email;
    o.address = body.address;
    o.country = body.country;
    o.city = body.city;
    o.zip = body.zip;
    o.code = body.code;

    const order = await this.orderService.save(o);

    for (let p of body.products) {
      const product: Product = await this.productService.findOne({
        id: p.id,
      });
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.product_title = product.title;
      orderItem.price = product.price;
      orderItem.quantity = p.quantity;
      orderItem.ambassador_revenue = 0.1 * product.price * p.quantity;
      orderItem.admin_revenue = 0.9 * product.price * p.quantity;

      await this.orderItemService.save(orderItem);
    }

    return order;
  }
}
