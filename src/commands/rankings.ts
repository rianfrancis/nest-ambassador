import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import * as bcrypt from 'bcryptjs';
import { ProductService } from 'src/product/product.service';
import { RedisService } from 'src/shared/redis.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);

  const ambassadors: User[] = await userService.find({
    where: { is_ambassador: true },
    relations: ['orders', 'orders.order_items'],
  });

  const redisService = app.get(RedisService);
  const client = redisService.getClient();

  for (let i = 0; i < ambassadors.length; i++) {
    // client.zadd('rankings', ambassadors[i].revenue, ambassadors[i].name);
    // commented out to prevent errors since the redis client is not connected
  }
  process.exit();
})();
