import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user';
import { RedisService } from 'src/shared/redis.service';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly: RedisService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('admin/ambassadors')
  async ambassadors() {
    return this.userService.find({ where: { is_ambassador: true } });
  }

  // @Get('ambassadors/rankings')
  // async rankings(@Res() response: Response) {
  //   const client = this.redisService.getClient();

  //   client.zrevrangebyscore(
  //     'rankings',
  //     '+inf',
  //     '-inf',
  //     'withscores',
  //     (error, result) => {},
  //   );
  // }
}
