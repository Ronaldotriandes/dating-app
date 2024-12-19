import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import * as Joi from 'joi';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { JoiSchema } from 'nestjs-joi';

export class SwipesValidate {
  @JoiSchema(Joi.string().valid('pass', 'like').required())
  swipe_type!: string;
}

@Controller('api/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @Get()
  findAll(): Promise<User[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(id: string) {
    return await this.service.findOne(id);
  }

  @Post(':id/swipes')
  async swipeUser(
    @Request() req: any,
    @Body() body: SwipesValidate,
  ): Promise<any> {
    return await this.service.swipeUser(req.params.id, body.swipe_type);
  }
}
