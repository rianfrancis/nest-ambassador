import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LinkService } from './link.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class LinkController {
  constructor(private linkservice: LinkService) {}
  @UseGuards(AuthGuard)
  @Get('admin/users/:id/links')
  async all(@Param('id') id: number) {
    return this.linkservice.find({
      where: { user: { id } },
      relations: ['orders'],
    });
  }
}
