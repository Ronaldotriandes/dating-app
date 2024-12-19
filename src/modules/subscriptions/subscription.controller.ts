import { Body, Controller, Get, Post } from '@nestjs/common';
import * as Joi from 'joi';

import { JoiSchema } from 'nestjs-joi';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';

class SubsValidate {
  @JoiSchema(
    Joi.string().valid('unlimited_swipes', 'verified_badge').required(),
  )
  package!: string;
}

@Controller('api/subscriptions')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}
  @Get()
  findAll(): Promise<Subscription[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  async store(@Body() body: SubsValidate): Promise<any> {
    return await this.service.store(body);
  }
}
