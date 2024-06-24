import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProductListener {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @OnEvent('product_updated')
  async handleProductUpdatedEvent() {
    await this.cacheManager.delete('products_frontend');
    await this.cacheManager.delete('products_backend');
  }
}
