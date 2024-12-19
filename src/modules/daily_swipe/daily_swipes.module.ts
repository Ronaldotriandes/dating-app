import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailySwipeService } from './daily_swipes.service';
import { DailySwipes } from './daily_swipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailySwipes])],
  providers: [DailySwipeService],
  exports: [DailySwipeService],
})
export class DailySwipeModule {}
