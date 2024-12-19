import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwipeService } from './swipes.service';
import { Swipe } from './swipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Swipe])],
  providers: [SwipeService],
  exports: [SwipeService],
})
export class SwipeModule {}
