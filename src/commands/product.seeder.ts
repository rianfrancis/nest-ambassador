import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { randomInt } from 'crypto';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productService = app.get(ProductService);
  const password = await bcrypt.hash('1234', 10);

  for (let i = 0; i < 30; i++) {
    await productService.save({
      title: faker.lorem.words(2),
      description: faker.lorem.words(10),
      email: faker.image.imageUrl(200, 200, '', true),
      price: randomInt(10, 1000),
    });
  }
  process.exit();
})();
