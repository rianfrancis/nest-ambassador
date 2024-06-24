import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dtos/product-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventemitter: EventEmitter2,
  ) {}
  @UseGuards(AuthGuard)
  @Get('admin/products')
  async all() {
    return this.productService.find();
  }
  @UseGuards(AuthGuard)
  @Post('admin/products')
  async create(@Body() body: ProductCreateDto) {
    const product = await this.productService.save(body);
    this.eventemitter.emit('product_updated');
    return product;
  }

  @UseGuards(AuthGuard)
  @Get('admin/products/:id')
  async get(@Param('id') id: number) {
    return this.productService.findOne({ where: { id } });
  }
  @UseGuards(AuthGuard)
  @Put('admin/products/:id')
  async update(@Param('id') id: number, @Body() body: ProductCreateDto) {
    await this.productService.update(id, body);
    this.eventemitter.emit('product_updated');

    return this.productService.findOne({ where: { id } });
  }
  @UseGuards(AuthGuard)
  @Delete('admin/products/:id')
  async delete(@Param('id') id: number) {
    const response = await this.productService.delete(id);
    this.eventemitter.emit('product_updated');

    return response;
  }

  @CacheKey('products_frontend')
  @CacheTTL(30 * 60)
  @UseInterceptors(CacheInterceptor)
  @Get('ambassador/products/frontend')
  async frontend() {
    return this.productService.find();
  }

  @Get('ambassador/products/backend')
  async backend() {
    let products = await this.cacheManager.get('products_backend');
    if (!products) {
      products = await this.productService.find();

      await this.cacheManager.set('products_backend', products, 1800);
    }
    return products;
  }
}
